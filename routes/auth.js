const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/register/send-code', async (req, res) => {
  try {
    const result = await authService.requestRegisterCode(req.body || {});
    return res.status(202).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao enviar codigo de verificacao',
    });
  }
});

router.post('/register/verify', async (req, res) => {
  try {
    const user = await authService.verifyRegisterCode(req.body || {});
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao confirmar cadastro',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await authService.login(req.body || {});
    return res.json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao fazer login',
    });
  }
});

router.post('/google', async (req, res) => {
  try {
    const user = await authService.loginWithGoogle(req.body || {});
    return res.json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao fazer login com Google',
    });
  }
});

module.exports = router;
