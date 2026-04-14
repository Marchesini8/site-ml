const nodemailer = require("nodemailer");

let transporter;

function createTransporter() {
  const host = process.env.EMAIL_SMTP_HOST;
  const port = Number(process.env.EMAIL_SMTP_PORT || 587);
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;

  if (!host || !user || !pass) {
    const error = new Error("Configure EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER e EMAIL_SMTP_PASS para enviar o codigo de verificacao.");
    error.statusCode = 500;
    throw error;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
}

async function sendVerificationCodeEmail({ email, name, code }) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    const error = new Error("Configure EMAIL_FROM com o remetente usado no envio dos e-mails.");
    error.statusCode = 500;
    throw error;
  }

  const appName = process.env.EMAIL_APP_NAME || "Site ML";
  const safeName = name || "cliente";

  await getTransporter().sendMail({
    from,
    to: email,
    subject: `${appName}: codigo de verificacao`,
    text: [
      `Oi, ${safeName}.`,
      "",
      `Seu codigo de verificacao e: ${code}`,
      "",
      "Esse codigo expira em 10 minutos.",
      "Se voce nao solicitou esse cadastro, ignore este e-mail.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <h2 style="margin-bottom: 16px;">Codigo de verificacao</h2>
        <p>Oi, ${safeName}.</p>
        <p>Use o codigo abaixo para concluir seu cadastro:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 18px 24px; background: #f3f4f6; border-radius: 12px; text-align: center; margin: 24px 0;">
          ${code}
        </div>
        <p>Esse codigo expira em 10 minutos.</p>
        <p style="color: #6b7280;">Se voce nao solicitou esse cadastro, ignore este e-mail.</p>
      </div>
    `,
  });
}

function getEmailDiagnostics() {
  return {
    hasEmailFrom: Boolean(process.env.EMAIL_FROM),
    hasSmtpHost: Boolean(process.env.EMAIL_SMTP_HOST),
    smtpHost: process.env.EMAIL_SMTP_HOST || null,
    smtpPort: Number(process.env.EMAIL_SMTP_PORT || 587),
    hasSmtpUser: Boolean(process.env.EMAIL_SMTP_USER),
    hasSmtpPass: Boolean(process.env.EMAIL_SMTP_PASS),
  };
}

module.exports = {
  getEmailDiagnostics,
  sendVerificationCodeEmail,
};
