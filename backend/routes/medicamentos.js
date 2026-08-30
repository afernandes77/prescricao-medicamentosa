const express = require('express');
const db = require('../services/database');

const router = express.Router();

// GET - Listar todos os medicamentos
router.get('/', (req, res) => {
  try {
    const medicamentos = db.listarMedicamentos();
    res.json({
      total: medicamentos.length,
      medicamentos: medicamentos
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar medicamentos' });
  }
});

// GET - Buscar medicamento por nome ou código
router.get('/buscar', (req, res) => {
  try {
    const { termo } = req.query;
    if (!termo) {
      return res.status(400).json({ erro: 'Termo de busca é obrigatório' });
    }

    const resultados = db.buscarMedicamento(termo);
    res.json({
      total: resultados.length,
      resultados: resultados
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar medicamento' });
  }
});

module.exports = router;
