const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { initDatabase, query } = require("./database");
const { sendVerificationCodeEmail } = require("./emailService");

const CODE_EXPIRATION_MINUTES = Number(process.env.EMAIL_VERIFICATION_EXP_MINUTES || 10);
const REGISTER_PURPOSE = "register";

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function buildError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    avatar: user.avatar || "",
    emailVerified: Boolean(user.email_verified),
    createdAt: user.created_at,
  };
}

function hashVerificationCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findUserByEmail(email) {
  await initDatabase();
  const result = await query(
    `SELECT id, name, email, password_hash, provider, avatar, email_verified, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [normalizeEmail(email)]
  );

  return result.rows[0] || null;
}

async function requestRegisterCode({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!name || !normalizedEmail || !password) {
    throw buildError("Nome, e-mail e senha sao obrigatorios", 400);
  }

  if (String(password).length < 6) {
    throw buildError("A senha precisa ter pelo menos 6 caracteres", 400);
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw buildError("Usuario ja cadastrado", 409);
  }

  const code = generateVerificationCode();
  const codeHash = hashVerificationCode(code);
  const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000).toISOString();

  await query(
    `UPDATE email_verification_codes
     SET consumed_at = NOW()
     WHERE email = $1 AND purpose = $2 AND consumed_at IS NULL`,
    [normalizedEmail, REGISTER_PURPOSE]
  );

  await query(
    `INSERT INTO email_verification_codes (email, purpose, code_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [normalizedEmail, REGISTER_PURPOSE, codeHash, expiresAt]
  );

  await sendVerificationCodeEmail({
    email: normalizedEmail,
    name,
    code,
  });

  return {
    email: normalizedEmail,
    expiresInMinutes: CODE_EXPIRATION_MINUTES,
  };
}

async function verifyRegisterCode({ name, email, password, code }) {
  const normalizedEmail = normalizeEmail(email);
  if (!name || !normalizedEmail || !password || !code) {
    throw buildError("Nome, e-mail, senha e codigo sao obrigatorios", 400);
  }

  if (String(password).length < 6) {
    throw buildError("A senha precisa ter pelo menos 6 caracteres", 400);
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw buildError("Usuario ja cadastrado", 409);
  }

  const codeResult = await query(
    `SELECT id, code_hash, expires_at
     FROM email_verification_codes
     WHERE email = $1
       AND purpose = $2
       AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [normalizedEmail, REGISTER_PURPOSE]
  );

  const verification = codeResult.rows[0];
  if (!verification) {
    throw buildError("Solicite um novo codigo de verificacao", 404);
  }

  if (new Date(verification.expires_at).getTime() < Date.now()) {
    throw buildError("O codigo expirou. Solicite um novo codigo", 410);
  }

  if (verification.code_hash !== hashVerificationCode(code)) {
    throw buildError("Codigo de verificacao invalido", 401);
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const userId = `usr-${crypto.randomUUID()}`;

  const insertResult = await query(
    `INSERT INTO users (id, name, email, password_hash, provider, avatar, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, provider, avatar, email_verified, created_at`,
    [userId, name.trim(), normalizedEmail, passwordHash, "email", "", true]
  );

  await query(
    `UPDATE email_verification_codes
     SET consumed_at = NOW()
     WHERE id = $1`,
    [verification.id]
  );

  return sanitizeUser(insertResult.rows[0]);
}

async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw buildError("E-mail e senha sao obrigatorios", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw buildError("Usuario nao encontrado", 404);
  }

  if (user.provider === "email") {
    const passwordMatches = await bcrypt.compare(String(password), user.password_hash || "");
    if (!passwordMatches) {
      throw buildError("Senha invalida", 401);
    }
  }

  return sanitizeUser(user);
}

async function loginWithGoogle({ name, email, avatar = "" }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw buildError("E-mail e obrigatorio", 400);
  }

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return sanitizeUser(existing);
  }

  const userId = `usr-${crypto.randomUUID()}`;
  const insertResult = await query(
    `INSERT INTO users (id, name, email, password_hash, provider, avatar, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, provider, avatar, email_verified, created_at`,
    [userId, (name || "Usuario Google").trim(), normalizedEmail, "", "google", avatar || "", true]
  );

  return sanitizeUser(insertResult.rows[0]);
}

module.exports = {
  login,
  loginWithGoogle,
  requestRegisterCode,
  verifyRegisterCode,
};
