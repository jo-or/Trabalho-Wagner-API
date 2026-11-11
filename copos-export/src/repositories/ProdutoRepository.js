// Acesso a dados (SQL isolado do resto da aplicação).
const db = require('../database/db');
const Produto = require('../domain/Produto');

class ProdutoRepository {
  listar() {
    return db.prepare('SELECT * FROM produtos ORDER BY id DESC').all().map((r) => new Produto({ ...r }));
  }
  buscarPorId(id) {
    const row = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
    return row ? new Produto({ ...row }) : null;
  }
  inserir(produto) {
    const info = db
      .prepare('INSERT INTO produtos (nome_modelo, capacidade_ml, custo_producao_base) VALUES (?, ?, ?)')
      .run(produto.nomeModelo, produto.capacidadeMl, produto.custoProducaoBase);
    return this.buscarPorId(Number(info.lastInsertRowid));
  }
}

module.exports = ProdutoRepository;
