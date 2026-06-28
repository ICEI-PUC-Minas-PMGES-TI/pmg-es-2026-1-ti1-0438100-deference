function obterUsuarioSessaoAdmin() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function campanhaEhDoUsuarioAdmin(campanha, usuario) {
    if (!campanha || !usuario) return false;

    if (Number(campanha.criadorId) === Number(usuario.id)) return true;
    if (campanha.email && usuario.email && String(campanha.email).toLowerCase() === String(usuario.email).toLowerCase()) return true;

    return false;
}

function formatarMoedaAdmin(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

function formatarDataAdmin(dataISO) {
    if (!dataISO) return 'Sem data';
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return dataISO;
    return data.toLocaleString('pt-BR');
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const campanhaId = params.get('id');
    const usuario = obterUsuarioSessaoAdmin();

    if (!usuario) {
        alert('Você precisa estar logado para acessar esta area.');
        window.location.href = '../login/login.html';
        return;
    }

    if (!campanhaId) {
        alert('Campanha não informada.');
        window.location.href = './minhas-campanhas.html';
        return;
    }

    try {
        const campanha = await CampanhaService.buscarPorId(campanhaId);

        if (!campanhaEhDoUsuarioAdmin(campanha, usuario)) {
            alert('Acesso negado. Esta campanha não pertence ao seu perfil.');
            window.location.href = './minhas-campanhas.html';
            return;
        }

        document.getElementById('tituloCampanhaAdmin').textContent = campanha.titulo || 'Campanha';
        document.getElementById('subtituloCampanhaAdmin').textContent = `Categoria ${campanha.categoria || 'Não informada'} | Urgencia ${campanha.urgencia || 'media'}`;

        const btnNovaAtualizacao = document.getElementById('btnNovaAtualizacao');
        if (btnNovaAtualizacao) {
            btnNovaAtualizacao.href = `./criar-atualizacao.html?campanhaId=${campanha.id}`;
        }

        const painelInfos = document.getElementById('painelInfosCampanha');
        painelInfos.innerHTML = `
            <article class="item-info"><h3>Meta financeira</h3><p>${formatarMoedaAdmin(campanha.meta)}</p></article>
            <article class="item-info"><h3>Arrecadado</h3><p>${formatarMoedaAdmin(campanha.arrecadado)}</p></article>
            <article class="item-info"><h3>Doadores</h3><p>${Number(campanha.doadores || 0)}</p></article>
            <article class="item-info"><h3>Beneficiarios</h3><p>${Number(campanha.beneficiarios || 0)}</p></article>
            <article class="item-info"><h3>Periodo</h3><p>${campanha.inicio || '-'} ate ${campanha.fim || '-'}</p></article>
            <article class="item-info"><h3>Contato</h3><p>${campanha.email || 'Sem email'}</p></article>
        `;

        const listaAtualizacoes = document.getElementById('listaAtualizacoesAdmin');
        const atualizacoes = await AtualizacaoService.listarPorCampanha(campanha.id);
        listaAtualizacoes.innerHTML = '';

        if (!atualizacoes.length) {
            listaAtualizacoes.innerHTML = '<p class="texto-vazio">Nenhuma atualizacao registrada ainda.</p>';
            return;
        }

        atualizacoes
            .sort((a, b) => new Date(b.criadoEm || b.dataOcorrencia || 0) - new Date(a.criadoEm || a.dataOcorrencia || 0))
            .forEach((atualizacao) => {
                const item = document.createElement('article');
                item.className = 'item-atualizacao-admin';
                item.innerHTML = `
                    <h3>${atualizacao.titulo || 'Atualização sem titulo'}</h3>
                    <p>${(atualizacao.resumo || '').slice(0, 160)}</p>
                    <div class="meta-atualizacao">${formatarDataAdmin(atualizacao.criadoEm || atualizacao.dataOcorrencia)}</div>
                `;

                item.addEventListener('click', () => {
                    window.location.href = `./detalhe-atualizacao.html?id=${atualizacao.id}`;
                });

                listaAtualizacoes.appendChild(item);
            });
    } catch (erro) {
        console.error(erro);
        alert('Não foi possível carregar o painel da campanha.');
        window.location.href = './minhas-campanhas.html';
    }
});



