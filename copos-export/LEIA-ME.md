# Vidraria Export – Sistema de exportação de copos de vidro

Sistema para cadastrar copos e calcular o preço de venda no exterior
(custo × 2 de lucro, convertido para USD, EUR, GBP, JPY ou ARS).

## Como abrir (jeito mais fácil)

**Passo único: instalar o Node.js (só uma vez)**
Baixe a versão **LTS** (22 ou superior) em https://nodejs.org e instale clicando em "Avançar".

**Windows:** dê **dois cliques** em `iniciar_sistema.bat`.
**Mac / Linux:** abra o terminal na pasta e rode `./iniciar_sistema.sh`
(se não abrir, rode antes `chmod +x iniciar_sistema.sh`).

Na primeira vez, o sistema baixa o que precisa (leva poucos minutos e exige internet).
Depois, o navegador abre sozinho em **http://localhost:3000**.
Para fechar, feche a janela preta (ou Ctrl+C).

Seus dados ficam no arquivo `data/copos.db`, criado automaticamente.
Para fazer backup, basta copiar esse arquivo.

## Alternativa: Docker

Com o Docker instalado, na pasta do projeto:
```
docker compose up --build
```
Acesse http://localhost:3000. Os dados ficam guardados num volume do Docker.
Para parar: `docker compose down` (os dados são mantidos).

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| "Node.js não encontrado" | Instale o Node.js LTS e execute de novo. |
| Erro no `npm install` | Verifique a internet e tente outra vez. |
| Página não abre | Acesse manualmente http://localhost:3000 |
| "Porta 3000 em uso" | Feche o outro programa ou rode com `PORT=3001` (Mac/Linux) / `set PORT=3001` (Windows). |
| Câmbio indisponível | O sistema precisa de internet para buscar a cotação. Tente novamente. |

## Para desenvolvedores

- `npm install && npm start` – servidor em http://localhost:3000
- API: `GET/POST /api/produtos`, `POST /api/exportacao/simular` (`{ id, moeda_destino }`)
- Estrutura: `src/domain` (Produto, CalculadoraExportacao), `src/services` (câmbio),
  `src/repositories` (SQL), `src/routes` (API), `public/` (front-end).
