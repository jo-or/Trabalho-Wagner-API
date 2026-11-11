const express = require('express');
const Produto = require('../domain/Produto');
const CalculadoraExportacao = require('../domain/CalculadoraExportacao');
const CambioService = require('../services/CambioService');
const ProdutoRepository = require('../repositories/ProdutoRepository');

const router = express.Router();
const repo = new ProdutoRepository();
const calculadora = new CalculadoraExportacao();
const cambio = new CambioService();

// Lista todos os copos.
router.get('/produtos', (req, res) => {
  res.json(repo.listar());
});

// Cadastra um novo copo.
router.post('/produtos', (req, res) => {
  try {
    const produto = new Produto(req.body);          // validação acontece no domínio
    res.status(201).json(repo.inserir(produto));
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Simula o preço de exportação.
router.post('/exportacao/simular', async (req, res) => {
  try {
    const { id, moeda_destino } = req.body;
    const produto = repo.buscarPorId(Number(id));
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    const { taxa, fonte } = await cambio.obterTaxa(moeda_destino);
    const resultado = calculadora.calcular(produto, String(moeda_destino).toUpperCase(), taxa);
    res.json({ ...resultado, fonte_cambio: fonte });
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.message });
  }
});

module.exports = router;
