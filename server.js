require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhooks');
const authRoutes = require('./routes/auth');
const { getDatabaseDiagnostics, initDatabase } = require('./services/database');
const { getEmailDiagnostics } = require('./services/emailService');

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

function logStartupDiagnostics() {
  console.log('[startup] Boot do site-ml iniciado.');
  console.log(`[startup] NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
  console.log(`[startup] PORT=${port}`);
  console.log(`[startup] ROOT_DIR=${__dirname}`);

  const database = getDatabaseDiagnostics();
  console.log(`[startup] DATABASE_URL presente=${database.hasDatabaseUrl}`);
  console.log(`[startup] DATABASE_URL host=${database.databaseUrlHost || 'ausente'}`);
  console.log(`[startup] PGSSL_DISABLE=${database.sslDisabled}`);

  const email = getEmailDiagnostics();
  console.log(`[startup] EMAIL_FROM presente=${email.hasEmailFrom}`);
  console.log(`[startup] EMAIL_SMTP_HOST presente=${email.hasSmtpHost}`);
  console.log(`[startup] EMAIL_SMTP_HOST valor=${email.smtpHost || 'ausente'}`);
  console.log(`[startup] EMAIL_SMTP_PORT=${email.smtpPort}`);
  console.log(`[startup] EMAIL_SMTP_USER presente=${email.hasSmtpUser}`);
  console.log(`[startup] EMAIL_SMTP_PASS presente=${email.hasSmtpPass}`);
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    port,
    uptime: Math.round(process.uptime()),
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

process.on('SIGTERM', () => {
  console.warn('[startup] Processo recebeu SIGTERM do ambiente.');
});

process.on('SIGINT', () => {
  console.warn('[startup] Processo recebeu SIGINT.');
});

process.on('uncaughtException', (error) => {
  console.error('[startup] uncaughtException:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[startup] unhandledRejection:', reason);
});

logStartupDiagnostics();

initDatabase()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`[startup] Servidor rodando em http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error('[startup] Falha ao conectar no PostgreSQL:', error);
    process.exit(1);
  });
