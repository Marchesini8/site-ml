const express = require("express");

const addressService = require("../services/addressService");

const router = express.Router();

router.post("/addresses/list", async (req, res) => {
  try {
    const addresses = await addressService.listAddresses(req.body || {});
    return res.json({ addresses });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao listar endereços",
    });
  }
});

router.post("/addresses/create", async (req, res) => {
  try {
    const address = await addressService.createAddress(req.body || {});
    return res.status(201).json({ address });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao salvar endereço",
    });
  }
});

router.post("/addresses/delete", async (req, res) => {
  try {
    const result = await addressService.removeAddress(req.body || {});
    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao excluir endereço",
    });
  }
});

module.exports = router;
