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

function buildNameFromEmail(email = "") {
  const localPart = normalizeEmail(email).split("@")[0] || "usuario";
  const cleaned = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Novo usuario";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function createEmailUser({ name, email, password, emailVerified = false }) {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await bcrypt.hash(String(password), 10);
  const userId = `usr-${crypto.randomUUID()}`;

  const insertResult = await query(
    `INSERT INTO users (id, name, email, password_hash, provider, avatar, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, provider, avatar, email_verified, created_at`,
    [userId, (name || buildNameFromEmail(normalizedEmail)).trim(), normalizedEmail, passwordHash, "email", "", emailVerified]
  );

  return sanitizeUser(insertResult.rows[0]);
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
    throw buildError("Usuário já cadastrado", 409);
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
    throw buildError("Nome, e-mail, senha e código são obrigatórios", 400);
  }

  if (String(password).length < 6) {
    throw buildError("A senha precisa ter pelo menos 6 caracteres", 400);
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw buildError("Usuário já cadastrado", 409);
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
    throw buildError("Solicite um novo código de verificação", 404);
  }

  if (new Date(verification.expires_at).getTime() < Date.now()) {
    throw buildError("O código expirou. Solicite um novo código", 410);
  }

  if (verification.code_hash !== hashVerificationCode(code)) {
    throw buildError("Código de verificação inválido", 401);
  }

  const createdUser = await createEmailUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
    emailVerified: true,
  });

  await query(
    `UPDATE email_verification_codes
     SET consumed_at = NOW()
     WHERE id = $1`,
    [verification.id]
  );

  return createdUser;
}

async function loginLegacy({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw buildError("E-mail e senha sao obrigatorios", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw buildError("Usuário não encontrado", 404);
  }

  if (user.provider === "email") {
    const passwordMatches = await bcrypt.compare(String(password), user.password_hash || "");
    if (!passwordMatches) {
      throw buildError("Senha invalida", 401);
    }
  }

  return sanitizeUser(user);
}

async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw buildError("E-mail e senha sao obrigatorios", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    const createdUser = await createEmailUser({
      email: normalizedEmail,
      password,
      emailVerified: false,
    });

    return {
      user: createdUser,
      autoCreated: true,
    };
  }

  if (user.provider === "email") {
    const passwordMatches = await bcrypt.compare(String(password), user.password_hash || "");
    if (!passwordMatches) {
      throw buildError("Senha invalida", 401);
    }
  }

  return {
    user: sanitizeUser(user),
    autoCreated: false,
  };
}

async function loginWithGoogle({ name, email, avatar = "" }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw buildError("E-mail e obrigatorio", 400);
  }

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    const nextName = (name || existing.name || "Usuário Google").trim();
    const nextAvatar = avatar || existing.avatar || "";
    const nextProvider = existing.provider === "email" ? existing.provider : "google";

    const updateResult = await query(
      `UPDATE users
       SET name = $2,
           avatar = $3,
           provider = $4,
           email_verified = TRUE
       WHERE id = $1
       RETURNING id, name, email, provider, avatar, email_verified, created_at`,
      [existing.id, nextName, nextAvatar, nextProvider]
    );

    return sanitizeUser(updateResult.rows[0]);
  }

  const userId = `usr-${crypto.randomUUID()}`;
  const insertResult = await query(
    `INSERT INTO users (id, name, email, password_hash, provider, avatar, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, provider, avatar, email_verified, created_at`,
    [userId, (name || "Usuário Google").trim(), normalizedEmail, "", "google", avatar || "", true]
  );

  return sanitizeUser(insertResult.rows[0]);
}

module.exports = {
  login,
  loginWithGoogle,
  requestRegisterCode,
  verifyRegisterCode,
};
