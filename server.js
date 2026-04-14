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
const indexFilePath = path.join(__dirname, 'index.html');

function escapeForInlineScript(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

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
  console.log(`[startup] EMAIL_PROVIDER=${email.emailProvider}`);
  console.log(`[startup] SENDGRID_API_KEY presente=${email.hasSendGridApiKey}`);
  console.log(`[startup] GOOGLE_CLIENT_ID presente=${Boolean(process.env.GOOGLE_CLIENT_ID)}`);
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname, { index: false }));

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
  try {
    const html = require('fs')
      .readFileSync(indexFilePath, 'utf8')
      .replace('__GOOGLE_CLIENT_ID__', escapeForInlineScript(process.env.GOOGLE_CLIENT_ID || ''));

    res.type('html').send(html);
  } catch (error) {
    console.error('[startup] Falha ao carregar index.html:', error);
    res.status(500).send('Erro ao carregar a aplicacao.');
  }
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
