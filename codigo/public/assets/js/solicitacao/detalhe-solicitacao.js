function obterUsuarioSessaoSegura() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function formatarTipo(tipo) {
    const tipos = {
        projeto_social: 'Projeto Social',
        chamado_ajuda: 'Chamado de Ajuda'
    };

    return tipos[tipo] || 'Solicitacao';
}

function formatarStatus(status) {
    const statusMap = {
        em_analise: 'Em Analise',
        disponivel: 'Disponivel',
        em_desenvolvimento: 'Em Desenvolvimento',
        concluida: 'Concluida',
        reprovada: 'Reprovada'
    };

    return statusMap[status] || 'Em Analise';
}

function formatarCategoria(categoria) {
    if (!categoria) return 'Nao informada';

    const mapa = {
        alimentacao: 'Alimentacao',
        saude: 'Saude',
        educacao: 'Educacao',
        moradia: 'Moradia',
        vestuario: 'Vestuario',
        meio_ambiente: 'Meio Ambiente',
        outros: 'Outros'
    };

    return mapa[categoria] || categoria;
}

function formatarUrgencia(urgencia) {
    const mapa = {
        baixa: 'Baixa',
        media: 'Media',
        alta: 'Alta'
    };

    return mapa[urgencia] || 'Nao informada';
}

function renderizarEvidencias(solicitacao) {
    const lista = document.getElementById('detalheEvidencias');
    lista.innerHTML = '';

    const itens = [];

    if (solicitacao.fotos && solicitacao.fotos.length) {
        solicitacao.fotos.forEach((url) => {
            itens.push({ label: 'Foto', url });
        });
    }

    if (solicitacao.documentos && solicitacao.documentos.length) {
        solicitacao.documentos.forEach((url) => {
            itens.push({ label: 'Documento', url });
        });
    }

    if (!itens.length) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma evidencia foi anexada.';
        lista.appendChild(li);
        return;
    }

    itens.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.label}: <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a>`;
        lista.appendChild(li);
    });
}

function configurarAcaoSolicitacao(solicitacao) {
    const usuario = obterUsuarioSessaoSegura();
    const mensagem = document.getElementById('mensagemAcaoSolicitacao');
    const botao = document.getElementById('botaoAcaoSolicitacao');

    botao.classList.add('d-none');

    if (solicitacao.status === 'em_analise') {
        mensagem.textContent = 'A solicitacao esta em analise pela equipe administradora.';
        return;
    }

    if (solicitacao.status === 'reprovada') {
        const motivo = solicitacao.motivoReprovacao ? ` Motivo: ${solicitacao.motivoReprovacao}` : '';
        mensagem.textContent = `A solicitacao foi reprovada pela equipe administradora.${motivo}`;
        return;
    }

    if (solicitacao.status === 'disponivel') {
        if (!usuario) {
            mensagem.textContent = 'Faca login para verificar permissao de criacao da campanha.';
            botao.textContent = 'Entrar';
            botao.href = '../login/login.html';
            botao.classList.remove('d-none');
            return;
        }

        const criadorId = Number(solicitacao.criadorId);
        const usuarioId = Number(usuario.id);
        const podeCriar = solicitacao.tipoSolicitacao === 'chamado_ajuda' || (solicitacao.tipoSolicitacao === 'projeto_social' && criadorId === usuarioId);

        if (!podeCriar) {
            mensagem.textContent = 'Nesta solicitacao do tipo Projeto Social, apenas o usuario criador pode abrir a campanha.';
            return;
        }

        mensagem.textContent = 'Esta solicitacao esta apta para receber uma campanha.';
        botao.textContent = 'Criar Campanha';
        botao.href = `../campanha/criar-campanha.html?solicitacaoId=${solicitacao.id}`;
        botao.classList.remove('d-none');
        return;
    }

    if (solicitacao.status === 'em_desenvolvimento' || solicitacao.status === 'concluida') {
        if (!solicitacao.campanhaId) {
            mensagem.textContent = 'A solicitacao indica campanha vinculada, mas o registro da campanha ainda nao foi localizado.';
            return;
        }

        mensagem.textContent = solicitacao.status === 'concluida'
            ? 'A campanha relacionada foi concluida. Voce pode acompanhar os detalhes.'
            : 'A campanha para esta solicitacao esta em desenvolvimento.';

        botao.textContent = 'Ver Campanha';
        botao.href = `../campanha/detalhe-campanha.html?id=${solicitacao.campanhaId}`;
        botao.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const alerta = document.getElementById('alertaDetalheSolicitacao');
    const conteudo = document.getElementById('conteudoDetalheSolicitacao');

    const params = new URLSearchParams(window.location.search);
    const solicitacaoId = params.get('id');

    if (!solicitacaoId) {
        alerta.textContent = 'Solicitacao nao encontrada.';
        alerta.classList.remove('d-none');
        conteudo.classList.add('d-none');
        return;
    }

    try {
        const solicitacao = await SolicitacaoService.buscarPorId(solicitacaoId);

        document.getElementById('detalheTipoSolicitacao').textContent = formatarTipo(solicitacao.tipoSolicitacao);
        document.getElementById('detalheStatusSolicitacao').textContent = formatarStatus(solicitacao.status);
        document.getElementById('detalheTituloSolicitacao').textContent = solicitacao.titulo || 'Solicitacao';
        document.getElementById('detalheResumoSolicitacao').textContent = solicitacao.descricaoResumo || '';
        document.getElementById('detalheDescricaoCompleta').textContent = solicitacao.descricaoCompleta || '';
        document.getElementById('detalheCategoria').textContent = formatarCategoria(solicitacao.categoriaAjuda);
        document.getElementById('detalheUrgencia').textContent = formatarUrgencia(solicitacao.urgencia);
        document.getElementById('detalheLocal').textContent = solicitacao.local || 'Nao informado';
        document.getElementById('detalheBeneficiarios').textContent = solicitacao.numeroBeneficiarios || 'Nao informado';
        document.getElementById('detalheContatoNome').textContent = solicitacao.contatoNome || 'Nao informado';
        document.getElementById('detalheContatoTelefone').textContent = solicitacao.contatoTelefone || 'Nao informado';
        document.getElementById('detalheContatoEmail').textContent = solicitacao.contatoEmail || 'Nao informado';
        document.getElementById('detalheCriador').textContent = solicitacao.criadorNome || 'Usuario da plataforma';

        renderizarEvidencias(solicitacao);
        configurarAcaoSolicitacao(solicitacao);
    } catch (erro) {
        console.error(erro);
        alerta.textContent = 'Nao foi possivel carregar os detalhes da solicitacao.';
        alerta.classList.remove('d-none');
        conteudo.classList.add('d-none');
    }
});
