// Front-end em JavaScript puro: consome a API REST do próprio servidor Node.
const API = '/api';
const $ = (sel) => document.querySelector(sel);
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Formata na moeda estrangeira (JPY não tem centavos; o Intl cuida disso).
const moeda = (valor, code) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: code }).format(valor);

// Cliente HTTP genérico com tratamento de erro padronizado.
async function request(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || `Erro ${res.status}`);
  return data;
}

function toast(msg, erro = false) {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast' + (erro ? ' erro' : '');
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (el.hidden = true), 3500);
}

// Monta uma linha da tabela usando textContent (evita injeção de HTML).
function linha(p) {
  const tr = document.createElement('tr');
  const cel = (txt, cls) => {
    const td = document.createElement('td');
    td.textContent = txt;
    if (cls) td.className = cls;
    tr.appendChild(td);
  };
  cel('#' + p.id);
  cel(p.nome_modelo);
  cel(p.capacidade_ml + ' ml', 'num');
  cel(brl.format(p.custo_producao_base), 'num');
  cel(brl.format(p.custo_producao_base * 2), 'num');
  return tr;
}

// GET /api/produtos -> atualiza tabela, <select> e cartões de resumo.
async function carregarProdutos() {
  try {
    const produtos = await request('/produtos');
    const tbody = $('#tabelaProdutos');
    tbody.replaceChildren();
    if (!produtos.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum copo cadastrado. Use o formulário acima para começar.</td></tr>';
    } else {
      produtos.forEach((p) => tbody.appendChild(linha(p)));
    }

    const select = $('#selectProduto');
    const atual = select.value;
    select.replaceChildren(new Option('Selecione…', ''));
    produtos.forEach((p) => select.appendChild(new Option(`${p.nome_modelo} (${p.capacidade_ml} ml)`, p.id)));
    select.value = atual;

    $('#statTotal').textContent = produtos.length;
    const media = produtos.length ? produtos.reduce((s, p) => s + p.custo_producao_base, 0) / produtos.length : 0;
    $('#statMedio').textContent = produtos.length ? brl.format(media) : '–';
  } catch (err) {
    toast(err.message, true);
  }
}

// POST /api/produtos
$('#formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const dados = Object.fromEntries(new FormData(form));
  const btn = form.querySelector('button');
  btn.disabled = true; btn.textContent = 'Salvando…';
  try {
    await request('/produtos', { method: 'POST', body: JSON.stringify(dados) });
    form.reset();
    toast('Copo salvo.');
    await carregarProdutos();
  } catch (err) {
    toast(err.message, true);
  } finally {
    btn.disabled = false; btn.textContent = 'Salvar copo';
  }
});

// POST /api/exportacao/simular
$('#formSimulador').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(e.currentTarget));
  const painel = $('#resultado');
  const btn = $('#btnSimular');

  btn.disabled = true;
  painel.hidden = false;
  painel.className = 'resultado';
  painel.innerHTML = '<div class="loading"><div class="spinner"></div>Consultando câmbio e calculando…</div>';

  try {
    const r = await request('/exportacao/simular', {
      method: 'POST',
      body: JSON.stringify({ id: Number(dados.id), moeda_destino: dados.moeda_destino }),
    });
    painel.innerHTML = `
      <div>Preço de exportação de <strong></strong></div>
      <div class="final"></div>
      <dl>
        <div><dt>Custo base</dt><dd data-k="custo"></dd></div>
        <div><dt>Preço de venda (+100%)</dt><dd data-k="venda"></dd></div>
        <div><dt>Taxa de câmbio (1 BRL)</dt><dd data-k="taxa"></dd></div>
      </dl>
      <p class="fonte"></p>`;
    // Valores inseridos via textContent por segurança.
    painel.querySelector('strong').textContent = r.produto;
    painel.querySelector('.final').textContent = moeda(r.valor_convertido, r.moeda_destino);
    painel.querySelector('[data-k=custo]').textContent = brl.format(r.custo_base_brl);
    painel.querySelector('[data-k=venda]').textContent = brl.format(r.preco_venda_brl);
    painel.querySelector('[data-k=taxa]').textContent = `${r.taxa_cambio.toFixed(6)} ${r.moeda_destino}`;
    painel.querySelector('.fonte').textContent = `Câmbio obtido via ${r.fonte_cambio}.`;
  } catch (err) {
    painel.className = 'resultado erro';
    painel.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});

// Destaca o item ativo do menu lateral conforme o clique.
document.querySelectorAll('.sidebar nav a').forEach((a) =>
  a.addEventListener('click', () => {
    document.querySelectorAll('.sidebar nav a').forEach((x) => x.classList.remove('active'));
    a.classList.add('active');
  })
);

carregarProdutos();
