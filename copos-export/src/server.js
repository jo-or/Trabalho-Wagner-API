const path = require('path');
const express = require('express');
const cors = require('cors');
require('./database/db'); // cria o arquivo .sqlite e a tabela na 1ª execução
require('./database/init'); // insere exemplos só se a tabela estiver vazia
const api = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve o front-end

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Back-office rodando em http://localhost:${PORT}`));
