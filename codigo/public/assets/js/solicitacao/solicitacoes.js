const estadoSolicitacoes = {
    itens: [],
    filtroStatus: 'todos'
};

function obterUsuarioSessao() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function formatarTipoSolicitacao(tipo) {
    const mapa = {
        projeto_social: 'Projeto Social',
        chamado_ajuda: 'Chamado de Ajuda'
    };

    return mapa[tipo] || 'Solicitacao';
}

function formatarStatusSolicitacao(status) {
    const mapa = {
        em_analise: 'Em Analise',
        disponivel: 'Disponivel',
        em_desenvolvimento: 'Em Desenvolvimento',
        concluida: 'Concluida',
        reprovada: 'Reprovada'
    };

    return mapa[status] || 'Em Analise';
}

function formatarData(dataIso) {
    if (!dataIso) return 'Data nao informada';
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso;
    return data.toLocaleDateString('pt-BR');
}

function criarCardSolicitacao(solicitacao) {
    const card = document.createElement('article');
    card.className = 'card-solicitacao-item';
    card.dataset.status = solicitacao.status || 'em_analise';

    card.innerHTML = `
        <div class="linha-titulo-solicitacao">
            <h3>${solicitacao.titulo || 'Solicitacao'}</h3>
            <div class="badges-solicitacao">
                <span class="badge-tipo">${formatarTipoSolicitacao(solicitacao.tipoSolicitacao)}</span>
                <span class="badge-status">${formatarStatusSolicitacao(solicitacao.status)}</span>
            </div>
        </div>
        <p class="resumo-solicitacao">${solicitacao.descricaoResumo || 'Sem resumo informado.'}</p>
        <div class="meta-solicitacao">
            <span><i class="bi bi-geo-alt me-1"></i>${solicitacao.local || 'Local nao informado'}</span>
            <span><i class="bi bi-person me-1"></i>${solicitacao.criadorNome || 'Usuario da plataforma'}</span>
            <span><i class="bi bi-calendar3 me-1"></i>${formatarData(solicitacao.criadoEm)}</span>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `./detalhe-solicitacao.html?id=${solicitacao.id}`;
    });

    return card;
}

function aplicarFiltro() {
    const lista = document.getElementById('listaSolicitacoes');
    const vazio = document.getElementById('estadoVazioSolicitacoes');

    lista.innerHTML = '';

    const filtradas = estadoSolicitacoes.itens.filter((item) => {
        if (estadoSolicitacoes.filtroStatus === 'todos') return true;
        return item.status === estadoSolicitacoes.filtroStatus;
    });

    filtradas
        .sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0))
        .forEach((item) => {
            lista.appendChild(criarCardSolicitacao(item));
        });

    vazio.classList.toggle('d-none', filtradas.length !== 0);
}

function configurarFiltros() {
    const botoes = document.querySelectorAll('[data-filtro-status]');

    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoes.forEach((btn) => btn.classList.remove('ativo'));
            botao.classList.add('ativo');

            estadoSolicitacoes.filtroStatus = botao.getAttribute('data-filtro-status');
            aplicarFiltro();
        });
    });
}

async function carregarSolicitacoes() {
    const alerta = document.getElementById('alertaSolicitacoes');

    try {
        const [solicitacoes, campanhas] = await Promise.all([
            SolicitacaoService.listar(),
            typeof CampanhaService !== 'undefined' ? CampanhaService.listar() : Promise.resolve([])
        ]);

        const campanhasPorId = new Map(
            campanhas.map((campanha) => [Number(campanha.id), campanha])
        );

        const solicitacoesAtualizadas = await Promise.all(
            solicitacoes.map(async (solicitacao) => {
                if (solicitacao.status === 'concluida' || !solicitacao.campanhaId) {
                    return solicitacao;
                }

                const campanhaVinculada = campanhasPorId.get(Number(solicitacao.campanhaId));

                if (!campanhaVinculada) {
                    return solicitacao;
                }

                const arrecadado = Number(campanhaVinculada.arrecadado) || 0;
                const meta = Number(campanhaVinculada.meta) || 0;
                const metaAtingida = meta > 0 && arrecadado >= meta;

                if (!metaAtingida) {
                    return solicitacao;
                }

                const solicitacaoConcluida = {
                    ...solicitacao,
                    status: 'concluida',
                    atualizadoEm: new Date().toISOString()
                };

                try {
                    await SolicitacaoService.atualizar(solicitacao.id, solicitacaoConcluida);
                    return solicitacaoConcluida;
                } catch (erroAtualizacao) {
                    console.error('Erro ao sincronizar status da solicitacao:', erroAtualizacao);
                    return solicitacao;
                }
            })
        );

        estadoSolicitacoes.itens = solicitacoesAtualizadas;
        alerta.classList.add('d-none');
        aplicarFiltro();
    } catch (erro) {
        console.error(erro);
        alerta.textContent = 'Nao foi possivel carregar as solicitacoes.';
        alerta.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const btnNovaSolicitacao = document.querySelector('.botao-nova-solicitacao');

    if (btnNovaSolicitacao) {
        btnNovaSolicitacao.addEventListener('click', (evento) => {
            const usuario = obterUsuarioSessao();

            if (usuario) {
                return;
            }

            evento.preventDefault();
            window.location.href = '../cadastro/cadastro.html';
        });
    }

    configurarFiltros();
    await carregarSolicitacoes();
});
