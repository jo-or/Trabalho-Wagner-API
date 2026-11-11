# Node 22 já traz o SQLite embutido (node:sqlite), sem compilar nada.
FROM node:22-slim
WORKDIR /app

# Copia só os manifestos primeiro para aproveitar o cache de camadas
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY src ./src
COPY public ./public

# O banco fica em /app/data (montado como volume para não perder dados)
ENV NODE_ENV=production PORT=3000 DB_DIR=/app/data
EXPOSE 3000
CMD ["npm", "start"]
