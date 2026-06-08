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

function enviarSolicitacao() {
  const tipo = document.getElementById('tipoAssistencia').value;
  const data = document.getElementById('dataSolicitacao').value;
  const num  = document.getElementById('numBeneficiarios').value;

  if (!tipo || !data || !num) {
    mostrarToast('⚠️ Preencha todos os campos obrigatórios.');
    return;
  }

  const [y, m, d] = data.split('-');
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const dataFormatada = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <span class="card-title">${tipo}</span>
      <span class="badge badge-analise">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Em análise
      </span>
    </div>
    <div class="card-meta">
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        ${dataFormatada}
      </span>
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        ${num} ${parseInt(num) === 1 ? 'pessoa' : 'pessoas'}
      </span>
    </div>
    <hr class="card-divider">
    <div class="panel-analise">
      <strong>Status:</strong> Sua solicitação está sendo analisada pela equipe. Você será notificado em 3–5 dias úteis.
    </div>
  `;

  document.getElementById('cardsList').prepend(card);

  // Reseta filtro para "todos" para o novo card aparecer
  filtrar('todos');

  document.getElementById('tipoAssistencia').value = '';
  document.getElementById('numBeneficiarios').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('dataSolicitacao').valueAsDate = new Date();

  fecharModal();
  mostrarToast('✅ Solicitação enviada com sucesso!');
}