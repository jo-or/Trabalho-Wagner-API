// Script de inicialização: `npm run init-db`
// Cria a tabela e insere dados de exemplo se estiver vazia.
const db = require('./db');

const { total } = db.prepare('SELECT COUNT(*) AS total FROM produtos').get();
if (total === 0) {
  const insert = db.prepare(
    'INSERT INTO produtos (nome_modelo, capacidade_ml, custo_producao_base) VALUES (?, ?, ?)'
  );
  [
    ['Copo Long Drink Cristal', 350, 4.8],
    ['Taça de Vinho Borossilicato', 450, 9.5],
    ['Copo Americano Temperado', 190, 2.3],
  ].forEach((p) => insert.run(...p));
  console.log('Banco criado com 3 produtos de exemplo.');
} else {
  console.log(`Banco já inicializado (${total} produtos).`);
}
