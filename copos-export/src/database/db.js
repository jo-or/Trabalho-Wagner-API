// Conexão única com o SQLite usando o módulo EMBUTIDO do Node (node:sqlite, Node 22.13+).
// Não precisa de npm install nem de compilação: o arquivo .sqlite é criado sozinho.
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

// DB_DIR pode ser sobrescrito (ex.: volume do Docker).
const DB_DIR = process.env.DB_DIR || path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DB_DIR, 'copos.db'));
db.exec('PRAGMA journal_mode = WAL;');

// Cria a tabela na primeira execução (idempotente).
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_modelo         TEXT    NOT NULL,
    capacidade_ml       INTEGER NOT NULL CHECK (capacidade_ml > 0),
    custo_producao_base REAL    NOT NULL CHECK (custo_producao_base >= 0)
  );
`);

module.exports = db;
