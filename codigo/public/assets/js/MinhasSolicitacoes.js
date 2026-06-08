// Define data padrão como hoje
document.getElementById('dataSolicitacao').valueAsDate = new Date();

function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function fecharModalFora(e) {
  if (e.target === document.getElementById('modalOverlay')) fecharModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function filtrar(status) {
  // Atualiza botões ativos
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.filter-btn[data-status="${status}"]`).classList.add('active');

  // Mostra/oculta cards
  document.querySelectorAll('.card').forEach(card => {
    if (status === 'todos') {
      card.style.display = '';
    } else {
      const badge = card.querySelector('.badge');
      const temStatus = badge && badge.classList.contains('badge-' + status);
      card.style.display = temStatus ? '' : 'none';
    }
  });

  // Mensagem de vazio
  const visiveis = [...document.querySelectorAll('.card')].filter(c => c.style.display !== 'none');
  const empty = document.getElementById('emptyState');
  empty.style.display = visiveis.length === 0 ? 'block' : 'none';
}

const API_URL = 'http://localhost:3000/solicitacoes';

function formatarData(data) {
  const [y, m, d] = data.split('-');
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

function criarBadge(status) {
  switch (status) {
    case 'aprovado':
      return `<span class="badge badge-aprovado">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Aprovado
      </span>`;
    case 'negado':
      return `<span class="badge badge-negado">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        Negado
      </span>`;
    default:
      return `<span class="badge badge-analise">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Em análise
      </span>`;
  }
}

function criarPainel(status) {
  switch (status) {
    case 'aprovado':
      return `<div class="panel-aprovado">
        <div class="panel-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Próximos Passos
        </div>
        Sua solicitação foi aprovada! Aguarde o contato da equipe para orientação sobre retirada e entrega.
      </div>`;
    case 'negado':
      return `<div class="panel-negado">
        Infelizmente, sua solicitação não pôde ser aprovada neste momento. Entre em contato conosco para mais informações.
      </div>`;
    default:
      return `<div class="panel-analise">
        <strong>Status:</strong> Sua solicitação está sendo analisada pela equipe. Você será notificado em 3–5 dias úteis.
      </div>`;
  }
}

function renderizarSolicitacao(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <span class="card-title">${item.titulo}</span>
      ${criarBadge(item.status)}
    </div>
    <div class="card-meta">
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        ${formatarData(item.data)}
      </span>
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        ${item.pessoas} ${parseInt(item.pessoas, 10) === 1 ? 'pessoa' : 'pessoas'}
      </span>
    </div>
    <hr class="card-divider">
    ${criarPainel(item.status)}
  `;
  return card;
}

async function carregarSolicitacoes() {
  const cardsList = document.getElementById('cardsList');
  cardsList.innerHTML = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Falha ao buscar solicitações');

    const solicitacoes = await response.json();
    if (!Array.isArray(solicitacoes)) throw new Error('Formato inválido de resposta');

    const ordenadas = solicitacoes.slice().reverse();
    ordenadas.forEach(item => cardsList.appendChild(renderizarSolicitacao(item)));

    const filtroAtual = document.querySelector('.filter-btn.active')?.dataset.status || 'todos';
    filtrar(filtroAtual);
  } catch (error) {
    console.error(error);
    mostrarToast('Erro ao carregar solicitações.');
  }
}

async function enviarSolicitacao() {
  const tipo = document.getElementById('tipoAssistencia').value;
  const data = document.getElementById('dataSolicitacao').value;
  const num  = document.getElementById('numBeneficiarios').value;

  if (!tipo || !data || !num) {
    mostrarToast('⚠️ Preencha todos os campos obrigatórios.');
    return;
  }

  try {
    const payload = {
      titulo: tipo,
      data,
      pessoas: Number(num),
      status: 'analise'
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Erro no envio');

    await carregarSolicitacoes();

    document.getElementById('tipoAssistencia').value = '';
    document.getElementById('numBeneficiarios').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('dataSolicitacao').valueAsDate = new Date();

    fecharModal();
    mostrarToast('✅ Solicitação enviada com sucesso!');
  } catch (error) {
    console.error(error);
    mostrarToast('Falha ao enviar solicitação.');
  }
}

carregarSolicitacoes();