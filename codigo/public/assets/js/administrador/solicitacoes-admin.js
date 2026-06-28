let solicitacoesCache = [];
let solicitacaoSelecionada = null;
let modalSolicitacao = null;

function badgeStatus(status) {
    return `<span class="badge-status-admin ${status}">${status || 'em_analise'}</span>`;
}

function renderTabelaSolicitacoes(lista, permitirJulgamento) {
    if (!lista.length) return '<p class="mb-0 text-muted">Nenhum registro encontrado.</p>';

    return `
        <table class="table admin-table table-hover align-middle">
            <thead><tr><th>Titulo</th><th>Tipo</th><th>Status</th><th>Criador</th><th></th></tr></thead>
            <tbody>
                ${lista.map((s) => `
                    <tr>
                        <td>${s.titulo || '-'}</td>
                        <td>${s.tipoSolicitacao || '-'}</td>
                        <td>${badgeStatus(s.status)}</td>
                        <td>${s.criadorNome || '-'}</td>
                        <td><button class="btn btn-sm btn-outline-success" data-detalhe-solicitacao="${s.id}">${permitirJulgamento ? 'Analisar' : 'Detalhar'}</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderListas() {
    const emAnalise = solicitacoesCache.filter((s) => s.status === 'em_analise');
    const filtro = document.getElementById('filtroStatusSupervisao').value;
    const supervisaoBase = solicitacoesCache.filter((s) => s.status !== 'em_analise');
    const supervisao = filtro === 'todos' ? supervisaoBase : supervisaoBase.filter((s) => s.status === filtro);

    document.getElementById('listaEmAnalise').innerHTML = renderTabelaSolicitacoes(emAnalise, true);
    document.getElementById('listaSupervisao').innerHTML = renderTabelaSolicitacoes(supervisao, false);

    document.querySelectorAll('[data-detalhe-solicitacao]').forEach((btn) => {
        btn.addEventListener('click', () => abrirDetalheSolicitacao(Number(btn.getAttribute('data-detalhe-solicitacao'))));
    });
}

function montarDetalheSolicitacao(s) {
    const motivo = s.motivoReprovacao ? `<p><strong>Motivo da reprovacao:</strong> ${s.motivoReprovacao}</p>` : '';
    return `
        <p><strong>Titulo:</strong> ${s.titulo || '-'}</p>
        <p><strong>Resumo:</strong> ${s.descricaoResumo || '-'}</p>
        <p><strong>Descricao:</strong> ${s.descricaoCompleta || '-'}</p>
        <p><strong>Categoria:</strong> ${s.categoriaAjuda || '-'}</p>
        <p><strong>Urgencia:</strong> ${s.urgencia || '-'}</p>
        <p><strong>Status:</strong> ${s.status}</p>
        <p><strong>Criador:</strong> ${s.criadorNome || '-'}</p>
        ${motivo}
    `;
}

function abrirDetalheSolicitacao(id) {
    solicitacaoSelecionada = solicitacoesCache.find((s) => Number(s.id) === Number(id));
    if (!solicitacaoSelecionada) return;

    document.getElementById('detalheSolicitacaoAdmin').innerHTML = montarDetalheSolicitacao(solicitacaoSelecionada);
    const emAnalise = solicitacaoSelecionada.status === 'em_analise';

    document.getElementById('btnAprovarSolicitacao').style.display = emAnalise ? 'inline-block' : 'none';
    document.getElementById('btnReprovarSolicitacao').style.display = emAnalise ? 'inline-block' : 'none';
    document.getElementById('blocoReprovacao').style.display = 'none';
    document.getElementById('motivoReprovacao').value = '';

    modalSolicitacao.show();
}

async function salvarJulgamento(status) {
    if (!solicitacaoSelecionada || solicitacaoSelecionada.status !== 'em_analise') return;

    const motivoInput = document.getElementById('motivoReprovacao');
    const motivo = motivoInput.value.trim();

    if (status === 'reprovada' && !motivo) {
        alert('Informe o motivo da reprovacao.');
        return;
    }

    const payload = {
        ...solicitacaoSelecionada,
        status,
        motivoReprovacao: status === 'reprovada' ? motivo : null,
        atualizadoEm: new Date().toISOString()
    };

    await SolicitacaoService.atualizar(solicitacaoSelecionada.id, payload);

    if (typeof AvisoService !== 'undefined') {
        await AvisoService.criar({
            tipo: 'julgamento_solicitacao',
            titulo: `Solicitacao ${status === 'disponivel' ? 'aprovada' : 'reprovada'}`,
            descricao: `${payload.titulo} (${payload.id})`,
            referenciaTipo: 'solicitacao',
            referenciaId: payload.id,
            criadoEm: new Date().toISOString()
        });
    }

    solicitacoesCache = solicitacoesCache.map((s) => Number(s.id) === Number(payload.id) ? payload : s);
    modalSolicitacao.hide();
    renderListas();
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('solicitacoes');

    modalSolicitacao = new bootstrap.Modal(document.getElementById('modalSolicitacaoAdmin'));

    solicitacoesCache = await SolicitacaoService.listar();
    renderListas();

    document.getElementById('filtroStatusSupervisao').addEventListener('change', renderListas);

    document.getElementById('btnAprovarSolicitacao').addEventListener('click', () => salvarJulgamento('disponivel'));

    document.getElementById('btnReprovarSolicitacao').addEventListener('click', () => {
        const bloco = document.getElementById('blocoReprovacao');
        if (bloco.style.display === 'none') {
            bloco.style.display = 'block';
            return;
        }
        salvarJulgamento('reprovada');
    });
});
