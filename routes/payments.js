const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

router.post('/checkout', async (req, res) => {
  try {
    const { items, customer, delivery, total } = req.body;

    if (!items || !customer) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    const payment = await paymentService.createPixPayment({
      items,
      customer,
      delivery,
      total,
    });

    return res.json(payment);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao criar pagamento',
    });
  }
});

module.exports = router;
