const { Pool } = require("pg");

let pool;
let initPromise;

function createConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const error = new Error("DATABASE_URL nao configurada. Conecte um PostgreSQL online no Railway.");
    error.statusCode = 500;
    throw error;
  }

  const isRailway = connectionString.includes("railway.app") || connectionString.includes("rlwy.net");
  const sslDisabled = String(process.env.PGSSL_DISABLE || "").toLowerCase() === "true";

  return {
    connectionString,
    ssl: sslDisabled ? false : { rejectUnauthorized: false },
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS || 10000),
    application_name: process.env.PG_APP_NAME || (isRailway ? "site-ml-railway" : "site-ml"),
  };
}

function getPool() {
  if (!pool) {
    pool = new Pool(createConfig());
  }

  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function initDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      console.log("[startup] Iniciando conexao com PostgreSQL...");
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL DEFAULT '',
          provider TEXT NOT NULL DEFAULT 'email',
          avatar TEXT NOT NULL DEFAULT '',
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS email_verification_codes (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          purpose TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          consumed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_email_verification_codes_lookup
        ON email_verification_codes (email, purpose, consumed_at, expires_at DESC);
      `);

      console.log("[startup] PostgreSQL conectado e tabelas garantidas.");
    })();
  }

  return initPromise;
}

function getDatabaseDiagnostics() {
  return {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlHost: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/^postgres(ql)?:\/\/[^@]+@/i, "postgresql://***@").split("/")[0]
      : null,
    sslDisabled: String(process.env.PGSSL_DISABLE || "").toLowerCase() === "true",
  };
}

module.exports = {
  getDatabaseDiagnostics,
  getPool,
  initDatabase,
  query,
};
