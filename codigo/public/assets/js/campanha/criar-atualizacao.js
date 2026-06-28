function obterUsuarioSessaoAtualizacao() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function campanhaEhDoUsuarioAtualizacao(campanha, usuario) {
    if (!campanha || !usuario) return false;

    if (Number(campanha.criadorId) === Number(usuario.id)) return true;
    if (campanha.email && usuario.email && String(campanha.email).toLowerCase() === String(usuario.email).toLowerCase()) return true;

    return false;
}

function normalizarMoeda(valor) {
    const digitos = String(valor || '').replace(/\D/g, '');
    if (!digitos) return '';

    const numero = Number(digitos) / 100;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function moedaParaNumero(valor) {
    const limpo = String(valor || '').replace(/\./g, '').replace(',', '.');
    const numero = Number(limpo);
    return Number.isFinite(numero) ? numero : null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const campanhaId = params.get('campanhaId');
    const usuario = obterUsuarioSessaoAtualizacao();

    const form = document.getElementById('formAtualizacao');
    const valorAplicado = document.getElementById('valorAplicado');
    const btnCancelar = document.getElementById('btnCancelarAtualizacao');
    const linkVoltar = document.getElementById('linkVoltarAdmin');

    if (!usuario) {
        alert('Voce precisa estar logado para registrar atualizacao.');
        window.location.href = '../login/login.html';
        return;
    }

    if (!campanhaId) {
        alert('Campanha nao informada.');
        window.location.href = './minhas-campanhas.html';
        return;
    }

    let campanha;

    try {
        campanha = await CampanhaService.buscarPorId(campanhaId);
    } catch (erro) {
        console.error(erro);
        alert('Nao foi possivel carregar a campanha.');
        window.location.href = './minhas-campanhas.html';
        return;
    }

    if (!campanhaEhDoUsuarioAtualizacao(campanha, usuario)) {
        alert('Acesso negado para registrar atualizacao nesta campanha.');
        window.location.href = './minhas-campanhas.html';
        return;
    }

    linkVoltar.href = `./detalhe-campanha-admin.html?id=${campanha.id}`;
    btnCancelar.addEventListener('click', () => {
        window.location.href = `./detalhe-campanha-admin.html?id=${campanha.id}`;
    });

    valorAplicado.addEventListener('input', () => {
        valorAplicado.value = normalizarMoeda(valorAplicado.value);
    });

    document.getElementById('dataOcorrencia').value = new Date().toISOString().slice(0, 10);

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        form.classList.remove('was-validated');

        const payload = {
            campanhaId: Number(campanha.id),
            titulo: document.getElementById('tituloAtualizacao').value.trim(),
            tipo: document.getElementById('tipoAtualizacao').value,
            dataOcorrencia: document.getElementById('dataOcorrencia').value,
            resumo: document.getElementById('resumoAtualizacao').value.trim(),
            detalhes: document.getElementById('detalhesAtualizacao').value.trim(),
            percentualConcluido: document.getElementById('percentualConcluido').value ? Number(document.getElementById('percentualConcluido').value) : null,
            valorAplicado: valorAplicado.value ? moedaParaNumero(valorAplicado.value) : null,
            destinoRecurso: document.getElementById('destinoRecurso').value.trim() || null,
            proximosPassos: document.getElementById('proximosPassos').value.trim() || null,
            autorId: Number(usuario.id),
            autorNome: usuario.nome || 'Responsavel da campanha',
            criadoEm: new Date().toISOString()
        };

        let valido = true;
        if (payload.titulo.length < 5) valido = false;
        if (!payload.tipo) valido = false;
        if (!payload.dataOcorrencia) valido = false;
        if (payload.resumo.length < 10) valido = false;
        if (payload.detalhes.length < 20) valido = false;
        if (payload.percentualConcluido !== null && (payload.percentualConcluido < 0 || payload.percentualConcluido > 100)) valido = false;
        if (payload.valorAplicado !== null && payload.valorAplicado < 0) valido = false;

        form.classList.add('was-validated');

        if (!valido) {
            alert('Corrija os campos obrigatorios para publicar a atualizacao.');
            return;
        }

        try {
            await AtualizacaoService.criar(payload);
            alert('Atualizacao publicada com sucesso.');
            window.location.href = `./detalhe-campanha-admin.html?id=${campanha.id}`;
        } catch (erro) {
            console.error(erro);
            alert('Nao foi possivel publicar a atualizacao.');
        }
    });
});
