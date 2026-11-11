#!/usr/bin/env bash
# Inicia o sistema em Linux/Mac: verifica Node.js, instala dependências e abre o navegador.
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-3000}"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERRO] Node.js não encontrado."
  echo "Instale a versão LTS em https://nodejs.org e execute este script novamente."
  exit 1
fi

# Exige Node 22+ (SQLite embutido)
if [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  echo "[ERRO] Node.js $(node -v) é antigo. Instale a versão LTS mais recente (22 ou superior)."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Instalando dependências (apenas na primeira vez)..."
  npm install --no-audit --no-fund || { echo "[ERRO] Falha no npm install."; exit 1; }
fi

# Abre o navegador após 3 segundos, em segundo plano
( sleep 3
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "http://localhost:$PORT"
  elif command -v open >/dev/null 2>&1; then open "http://localhost:$PORT"
  fi ) >/dev/null 2>&1 &

echo "Sistema em http://localhost:$PORT  (Ctrl+C para encerrar)"
npm start
