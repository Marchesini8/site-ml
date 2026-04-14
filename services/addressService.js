const crypto = require("crypto");

const { initDatabase, query } = require("./database");

function buildError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function sanitizeAddress(row) {
  return {
    id: row.id,
    label: row.label,
    recipientName: row.recipient_name,
    phone: row.phone || "",
    cep: row.cep,
    street: row.street,
    number: row.number,
    complement: row.complement || "",
    neighborhood: row.neighborhood || "",
    city: row.city || "",
    state: row.state || "",
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
  };
}

async function findUserByEmail(email) {
  await initDatabase();
  const result = await query(
    `SELECT id, email, name
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [normalizeEmail(email)]
  );

  return result.rows[0] || null;
}

async function listAddresses({ email }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw buildError("E-mail do usuario e obrigatorio", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw buildError("Usuario nao encontrado", 404);
  }

  const result = await query(
    `SELECT id, label, recipient_name, phone, cep, street, number, complement, neighborhood, city, state, is_default, created_at
     FROM user_addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, created_at DESC`,
    [user.id]
  );

  return result.rows.map(sanitizeAddress);
}

async function createAddress({ email, label, recipientName, phone, cep, street, number, complement, neighborhood, city, state, isDefault }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw buildError("E-mail do usuario e obrigatorio", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw buildError("Usuario nao encontrado", 404);
  }

  const payload = {
    label: String(label || "Casa").trim() || "Casa",
    recipientName: String(recipientName || "").trim(),
    phone: String(phone || "").trim(),
    cep: String(cep || "").trim(),
    street: String(street || "").trim(),
    number: String(number || "").trim(),
    complement: String(complement || "").trim(),
    neighborhood: String(neighborhood || "").trim(),
    city: String(city || "").trim(),
    state: String(state || "").trim(),
    isDefault: Boolean(isDefault),
  };

  if (!payload.recipientName || !payload.cep || !payload.street || !payload.number) {
    throw buildError("Preencha destinatario, CEP, rua e numero", 400);
  }

  if (payload.isDefault) {
    await query(
      `UPDATE user_addresses
       SET is_default = FALSE
       WHERE user_id = $1`,
      [user.id]
    );
  }

  const addressId = `addr-${crypto.randomUUID()}`;
  const insertResult = await query(
    `INSERT INTO user_addresses (
      id, user_id, label, recipient_name, phone, cep, street, number, complement, neighborhood, city, state, is_default
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id, label, recipient_name, phone, cep, street, number, complement, neighborhood, city, state, is_default, created_at`,
    [
      addressId,
      user.id,
      payload.label,
      payload.recipientName,
      payload.phone,
      payload.cep,
      payload.street,
      payload.number,
      payload.complement,
      payload.neighborhood,
      payload.city,
      payload.state,
      payload.isDefault,
    ]
  );

  return sanitizeAddress(insertResult.rows[0]);
}

async function removeAddress({ email, addressId }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !addressId) {
    throw buildError("Usuario e endereco sao obrigatorios", 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw buildError("Usuario nao encontrado", 404);
  }

  const result = await query(
    `DELETE FROM user_addresses
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [addressId, user.id]
  );

  if (!result.rows[0]) {
    throw buildError("Endereco nao encontrado", 404);
  }

  return { success: true };
}

module.exports = {
  createAddress,
  listAddresses,
  removeAddress,
};
