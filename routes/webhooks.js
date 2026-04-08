const express = require('express');
const router = express.Router();

const webhookService = require('../services/ironpayWebhookService');

router.post('/ironpay', (req, res) => {
  try {
    const receivedKey =
      req.headers['x-webhook-secret'] ||
      req.headers['x-api-key'] ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    webhookService.validateWebhookKey(receivedKey);

    const result = webhookService.processWebhook(req.body);

    return res.status(200).json({
      received: true,
      message: 'Webhook processado com sucesso',
      data: result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      error: error.message || 'Erro ao processar webhook',
    });
  }
});

module.exports = router;
