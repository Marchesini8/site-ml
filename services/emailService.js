const sgMail = require("@sendgrid/mail");

let isConfigured = false;

function ensureSendGridConfigured() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
  const error = new Error("Configure SENDGRID_API_KEY para enviar o código de verificação.");
    error.statusCode = 500;
    throw error;
  }

  if (!isConfigured) {
    sgMail.setApiKey(apiKey);
    isConfigured = true;
  }
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

  ensureSendGridConfigured();

  await sgMail.send({
    from,
    to: email,
    subject: `${appName}: código de verificação`,
    text: [
      `Oi, ${safeName}.`,
      "",
      `Seu código de verificação é: ${code}`,
      "",
      "Esse código expira em 10 minutos.",
      "Se você não solicitou esse cadastro, ignore este e-mail.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <h2 style="margin-bottom: 16px;">Código de verificação</h2>
        <p>Oi, ${safeName}.</p>
          <p>Use o código abaixo para concluir seu cadastro:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 18px 24px; background: #f3f4f6; border-radius: 12px; text-align: center; margin: 24px 0;">
          ${code}
        </div>
          <p>Esse código expira em 10 minutos.</p>
          <p style="color: #6b7280;">Se você não solicitou esse cadastro, ignore este e-mail.</p>
      </div>
    `,
  });
}

function getEmailDiagnostics() {
  return {
    hasEmailFrom: Boolean(process.env.EMAIL_FROM),
    hasSendGridApiKey: Boolean(process.env.SENDGRID_API_KEY),
    emailProvider: "sendgrid",
  };
}

module.exports = {
  getEmailDiagnostics,
  sendVerificationCodeEmail,
};
