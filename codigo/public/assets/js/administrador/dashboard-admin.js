let graficoStatusRef = null;
let graficoContribuicoesRef = null;
let cache = { campanhas: [], solicitacoes: [], contribuicoes: [], usuarios: [], avisos: [] };

function formatarMoedaAdmin(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

function dentroDoPeriodo(dataIso, periodo) {
    if (!dataIso || periodo === 'todos') return true;
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return false;

    const hoje = new Date();
    if (periodo === 'dia') {
        return data.toDateString() === hoje.toDateString();
    }

    if (periodo === 'mes') {
        return data.getFullYear() === hoje.getFullYear() && data.getMonth() === hoje.getMonth();
    }

    if (periodo === 'ano') {
        return data.getFullYear() === hoje.getFullYear();
    }

    return true;
}

async function carregarDados() {
    const [campanhas, solicitacoes, contribuicoes, usuarios, avisos] = await Promise.all([
        CampanhaService.listar(),
        SolicitacaoService.listar(),
        fetch(`${API_URL}/contribuicoes`).then(r => r.ok ? r.json() : []),
        buscarUsuarios(),
        typeof AvisoService !== 'undefined' ? AvisoService.listar() : Promise.resolve([])
    ]);

    cache = { campanhas, solicitacoes, contribuicoes, usuarios, avisos };
}

function atualizarKPIs(periodo) {
    const campanhasAtivas = cache.campanhas.filter((c) => Number(c.arrecadado || 0) < Number(c.meta || 0)).length;
    const solicitacoesAnalise = cache.solicitacoes.filter((s) => s.status === 'em_analise').length;
    const campanhasConcluidas = cache.campanhas.filter((c) => Number(c.arrecadado || 0) >= Number(c.meta || 0) && Number(c.meta || 0) > 0).length;
    const taxaSucesso = cache.campanhas.length ? Math.round((campanhasConcluidas / cache.campanhas.length) * 100) : 0;

    const contribuicoesPeriodo = cache.contribuicoes.filter((c) => dentroDoPeriodo(c.criadoEm, periodo));
    const totalContribuicoes = contribuicoesPeriodo.reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const idsCampanhasPeriodo = new Set(contribuicoesPeriodo.map((c) => Number(c.campanhaId)));
    const beneficiariosPeriodo = cache.campanhas
        .filter((c) => idsCampanhasPeriodo.has(Number(c.id)))
        .reduce((acc, c) => acc + Number(c.beneficiarios || 0), 0);

    document.getElementById('kpiCampanhasAtivas').textContent = campanhasAtivas;
    document.getElementById('kpiSolicitacoesAnalise').textContent = solicitacoesAnalise;
    document.getElementById('kpiTaxaSucesso').textContent = `${taxaSucesso}%`;
    document.getElementById('kpiUsuarios').textContent = cache.usuarios.length;
    document.getElementById('kpiContribuicoesPeriodo').textContent = formatarMoedaAdmin(totalContribuicoes);
    document.getElementById('kpiBeneficiariosPeriodo').textContent = beneficiariosPeriodo;
}

function renderizarGraficoStatusSolicitacoes() {
    const canvas = document.getElementById('graficoSolicitacoesStatus');
    const statusLabels = ['Em Analise', 'Disponivel', 'Em Desenvolvimento', 'Concluida', 'Reprovada'];
    const statusValores = [
        cache.solicitacoes.filter((s) => s.status === 'em_analise').length,
        cache.solicitacoes.filter((s) => s.status === 'disponivel').length,
        cache.solicitacoes.filter((s) => s.status === 'em_desenvolvimento').length,
        cache.solicitacoes.filter((s) => s.status === 'concluida').length,
        cache.solicitacoes.filter((s) => s.status === 'reprovada').length
    ];

    if (graficoStatusRef) graficoStatusRef.destroy();

    graficoStatusRef = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{ data: statusValores, backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#6b7280', '#ef4444'] }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });
}

function renderizarGraficoContribuicoes() {
    const canvas = document.getElementById('graficoContribuicoes');
    const dias = [];
    const valores = [];

    for (let i = 6; i >= 0; i -= 1) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        const chave = data.toISOString().slice(0, 10);
        dias.push(data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));

        const totalDia = cache.contribuicoes
            .filter((c) => String(c.criadoEm || '').slice(0, 10) === chave)
            .reduce((acc, c) => acc + Number(c.valor || 0), 0);

        valores.push(totalDia);
    }

    if (graficoContribuicoesRef) graficoContribuicoesRef.destroy();

    graficoContribuicoesRef = new Chart(canvas, {
        type: 'line',
        data: { labels: dias, datasets: [{ label: 'Contribuicoes', data: valores, borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.2)', fill: true, tension: 0.3 }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
}

function renderizarAvisosRecentes() {
    const painel = document.getElementById('painelAvisosRecentes');
    painel.innerHTML = '';

    const recentes = [...cache.avisos]
        .sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0))
        .slice(0, 5);

    if (!recentes.length) {
        painel.innerHTML = '<div class="list-group-item">Sem avisos registrados.</div>';
        return;
    }

    recentes.forEach((aviso) => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `<strong>${aviso.titulo || aviso.tipo}</strong><br><small>${aviso.descricao || ''}</small>`;
        painel.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('dashboard');

    await carregarDados();

    const atualizar = () => {
        const periodo = document.querySelector('input[name="periodo"]:checked')?.value || 'dia';
        atualizarKPIs(periodo);
        renderizarGraficoStatusSolicitacoes();
        renderizarGraficoContribuicoes();
        renderizarAvisosRecentes();
    };

    document.querySelectorAll('input[name="periodo"]').forEach((radio) => {
        radio.addEventListener('change', atualizar);
    });

    atualizar();
});
