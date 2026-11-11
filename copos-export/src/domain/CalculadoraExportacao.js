// Regras de preço de exportação. Sem I/O: fácil de testar.
class CalculadoraExportacao {
  static MARGEM_LUCRO = 1.0; // 100% sobre o custo => preço = custo * 2

  static arredondar(valor, casas = 2) {
    const f = 10 ** casas;
    return Math.round((valor + Number.EPSILON) * f) / f;
  }

  // 1) Aplica a margem de 100%.
  aplicarMargem(custoBase) {
    return CalculadoraExportacao.arredondar(
      custoBase * (1 + CalculadoraExportacao.MARGEM_LUCRO)
    );
  }

  // 2) Converte o preço com lucro (BRL) usando a taxa BRL -> moeda destino.
  aplicarCambio(precoBRL, taxa) {
    if (!(taxa > 0)) throw new Error('Taxa de câmbio inválida.');
    return CalculadoraExportacao.arredondar(precoBRL * taxa);
  }

  // Fluxo completo usado pela rota de simulação.
  calcular(produto, moedaDestino, taxa) {
    const precoVendaBRL = this.aplicarMargem(produto.custoProducaoBase);
    return {
      produto: produto.nomeModelo,
      custo_base_brl: produto.custoProducaoBase,
      preco_venda_brl: precoVendaBRL,
      moeda_destino: moedaDestino,
      taxa_cambio: taxa,
      valor_convertido: this.aplicarCambio(precoVendaBRL, taxa),
    };
  }
}

module.exports = CalculadoraExportacao;
