// Entidade de domínio: encapsula e valida os dados de um copo de vidro.
class Produto {
  #id; #nomeModelo; #capacidadeMl; #custoProducaoBase;

  constructor({ id = null, nome_modelo, capacidade_ml, custo_producao_base }) {
    this.#id = id;
    this.nomeModelo = nome_modelo;
    this.capacidadeMl = capacidade_ml;
    this.custoProducaoBase = custo_producao_base;
  }

  get id() { return this.#id; }
  get nomeModelo() { return this.#nomeModelo; }
  get capacidadeMl() { return this.#capacidadeMl; }
  get custoProducaoBase() { return this.#custoProducaoBase; }

  set nomeModelo(v) {
    const nome = String(v ?? '').trim();
    if (nome.length < 2) throw new Error('Nome do modelo deve ter ao menos 2 caracteres.');
    this.#nomeModelo = nome;
  }
  set capacidadeMl(v) {
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) throw new Error('Capacidade (ml) deve ser um inteiro positivo.');
    this.#capacidadeMl = n;
  }
  set custoProducaoBase(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error('Custo de produção deve ser um número válido (>= 0).');
    this.#custoProducaoBase = n;
  }

  // Formato usado nas respostas JSON e na persistência.
  toJSON() {
    return {
      id: this.#id,
      nome_modelo: this.#nomeModelo,
      capacidade_ml: this.#capacidadeMl,
      custo_producao_base: this.#custoProducaoBase,
    };
  }
}

module.exports = Produto;
