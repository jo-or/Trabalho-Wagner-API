// Integração com APIs públicas de câmbio (Node 18+ tem fetch nativo).
// Principal: AwesomeAPI  |  Reserva: open.er-api.com
class CambioService {
  static MOEDAS_SUPORTADAS = ['USD', 'EUR', 'GBP', 'JPY', 'ARS'];
  #cache = new Map();            // moeda -> { taxa, fonte, expira }
  #ttlMs = 5 * 60 * 1000;        // cache de 5 min para poupar a API externa

  async #getJSON(url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    return res.json();
  }

  // AwesomeAPI devolve "quanto vale 1 <moeda> em BRL" (bid). Invertemos para BRL -> moeda.
  async #awesomeApi(moeda) {
    const data = await this.#getJSON(`https://economia.awesomeapi.com.br/json/last/${moeda}-BRL`);
    const bid = parseFloat(data[`${moeda}BRL`]?.bid);
    if (!(bid > 0)) throw new Error('Resposta inesperada da AwesomeAPI.');
    return 1 / bid;
  }

  async #exchangeRateApi(moeda) {
    const data = await this.#getJSON('https://open.er-api.com/v6/latest/BRL');
    const taxa = data?.rates?.[moeda];
    if (!(taxa > 0)) throw new Error('Resposta inesperada da ExchangeRate-API.');
    return taxa;
  }

  // Retorna a taxa BRL -> moeda e a fonte usada.
  async obterTaxa(moeda) {
    moeda = String(moeda || '').toUpperCase();
    if (!CambioService.MOEDAS_SUPORTADAS.includes(moeda)) {
      throw Object.assign(new Error(`Moeda não suportada: ${moeda}`), { status: 400 });
    }
    const hit = this.#cache.get(moeda);
    if (hit && hit.expira > Date.now()) return { taxa: hit.taxa, fonte: hit.fonte };

    const fontes = [['AwesomeAPI', () => this.#awesomeApi(moeda)],
                    ['ExchangeRate-API', () => this.#exchangeRateApi(moeda)]];
    for (const [fonte, buscar] of fontes) {
      try {
        const taxa = await buscar();
        this.#cache.set(moeda, { taxa, fonte, expira: Date.now() + this.#ttlMs });
        return { taxa, fonte };
      } catch (err) {
        console.warn(`[câmbio] ${fonte} falhou: ${err.message}`);
      }
    }
    throw Object.assign(new Error('Serviço de câmbio indisponível. Tente novamente.'), { status: 502 });
  }
}

module.exports = CambioService;
