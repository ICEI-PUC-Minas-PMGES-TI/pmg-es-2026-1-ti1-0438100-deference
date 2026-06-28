const mapaImagensCriar = {
    alimentacao: '../../assets/images/alimentacao.jpg',
    saude: '../../assets/images/saude.jpg',
    educacao: '../../assets/images/educacao.jpg',
    moradia: '../../assets/images/moradia.jpg',
    vestuario: '../../assets/images/vestuario.jpg',
    'meio ambiente': '../../assets/images/meio-ambiente.jpg'
};

function acheImagemCriar(categoria) {
    const chave = String(categoria || '').trim().toLowerCase();
    return mapaImagensCriar[chave] || mapaImagensCriar.alimentacao;
}

function obterUsuarioSessaoSegura() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function aplicarMascaraTelefone(valor) {
    const digitos = String(valor || '').replace(/\D/g, '').slice(0, 11);

    if (digitos.length <= 10) {
        return digitos
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return digitos
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}

function aplicarMascaraMoeda(valor) {
    const digitos = String(valor || '').replace(/\D/g, '');
    if (!digitos) return '';

    const numero = Number(digitos) / 100;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function obterParametroSolicitacaoId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('solicitacaoId');
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formCriarCampanha');
    const btnCancelar = document.getElementById('btnCancelar');

    const fields = {
        titulo: document.getElementById('campanhaTitulo'),
        categoria: document.getElementById('campanhaCategoria'),
        descricao: document.getElementById('campanhaDescricao'),
        meta: document.getElementById('campanhaMeta'),
        beneficiarios: document.getElementById('campanhaBeneficiarios'),
        local: document.getElementById('campanhaLocal'),
        inicio: document.getElementById('campanhaInicio'),
        fim: document.getElementById('campanhaFim'),
        org: document.getElementById('campanhaOrg'),
        email: document.getElementById('campanhaEmail'),
        tel: document.getElementById('campanhaTel')
    };

    const solicitacaoId = obterParametroSolicitacaoId();
    const usuario = obterUsuarioSessaoSegura();

    if (!usuario) {
        alert('Voce precisa estar logado para criar campanha.');
        window.location.href = '../login/login.html';
        return;
    }

    if (!solicitacaoId) {
        alert('Uma campanha precisa estar vinculada a uma solicitacao.');
        window.location.href = '../solicitacao/solicitacoes.html';
        return;
    }

    let solicitacao = null;

    try {
        solicitacao = await SolicitacaoService.buscarPorId(solicitacaoId);
    } catch (erro) {
        console.error(erro);
        alert('Nao foi possivel carregar a solicitacao selecionada.');
        window.location.href = '../solicitacao/solicitacoes.html';
        return;
    }

    if (solicitacao.status !== 'disponivel') {
        alert('Somente solicitacoes com status Disponivel podem receber campanha.');
        window.location.href = `../solicitacao/detalhe-solicitacao.html?id=${solicitacao.id}`;
        return;
    }

    if (solicitacao.campanhaId) {
        alert('Essa solicitacao ja possui campanha vinculada.');
        window.location.href = `../solicitacao/detalhe-solicitacao.html?id=${solicitacao.id}`;
        return;
    }

    const podeCriar = solicitacao.tipoSolicitacao === 'chamado_ajuda' || Number(solicitacao.criadorId) === Number(usuario.id);

    if (!podeCriar) {
        alert('Nesta solicitacao de Projeto Social apenas o usuario criador pode abrir campanha.');
        window.location.href = `../solicitacao/detalhe-solicitacao.html?id=${solicitacao.id}`;
        return;
    }

    fields.titulo.value = solicitacao.titulo || '';
    fields.descricao.value = solicitacao.descricaoCompleta || solicitacao.descricaoResumo || '';
    fields.local.value = solicitacao.local || '';

    const categoriaMap = {
        alimentacao: 'Alimentação',
        saude: 'Saúde',
        educacao: 'Educação',
        moradia: 'Moradia',
        vestuario: 'Vestuário',
        meio_ambiente: 'Meio Ambiente'
    };

    const categoriaCampanha = categoriaMap[solicitacao.categoriaAjuda] || '';

    if (!categoriaCampanha) {
        alert('A categoria da solicitacao nao e compativel com as categorias de campanha.');
        window.location.href = `../solicitacao/detalhe-solicitacao.html?id=${solicitacao.id}`;
        return;
    }

    fields.categoria.value = categoriaCampanha;
    fields.categoria.setAttribute('disabled', 'disabled');

    fields.tel.addEventListener('input', () => {
        fields.tel.value = aplicarMascaraTelefone(fields.tel.value);
    });

    fields.meta.addEventListener('input', () => {
        fields.meta.value = aplicarMascaraMoeda(fields.meta.value);
    });

    function validar() {
        form.classList.remove('was-validated');

        let valido = true;
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fields.titulo.value.trim().length < 5) valido = false;
        if (!categoriaCampanha) valido = false;
        if (fields.descricao.value.trim().length < 20) valido = false;

        const meta = Number(fields.meta.value.replace(/\./g, '').replace(',', '.'));
        if (isNaN(meta) || meta <= 0) valido = false;

        const beneficiarios = Number(fields.beneficiarios.value);
        if (!Number.isInteger(beneficiarios) || beneficiarios <= 0) valido = false;

        if (!fields.local.value.trim()) valido = false;
        if (!fields.inicio.value || !fields.fim.value) valido = false;
        if (fields.inicio.value && fields.fim.value && new Date(fields.inicio.value) > new Date(fields.fim.value)) valido = false;
        if (!fields.org.value.trim()) valido = false;
        if (!emailRe.test(fields.email.value.trim())) valido = false;
        if (String(fields.tel.value).replace(/\D/g, '').length < 10) valido = false;

        form.classList.add('was-validated');
        return valido;
    }

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        if (!validar()) {
            alert('Corrija os campos obrigatorios para continuar.');
            return;
        }

        const campanhaPayload = {
            titulo: fields.titulo.value.trim(),
            categoria: categoriaCampanha,
            descricao: fields.descricao.value.trim(),
            meta: Number(fields.meta.value.replace(/\./g, '').replace(',', '.')),
            beneficiarios: Number(fields.beneficiarios.value),
            local: fields.local.value.trim(),
            inicio: fields.inicio.value,
            fim: fields.fim.value,
            organizacao: fields.org.value.trim(),
            email: fields.email.value.trim(),
            telefone: fields.tel.value.replace(/\D/g, ''),
            imagem: acheImagemCriar(categoriaCampanha),
            urgencia: solicitacao.urgencia || 'media',
            arrecadado: 0,
            doadores: 0,
            criadorId: Number(usuario.id),
            criadorNome: usuario.nome || 'Usuario',
            solicitacaoId: Number(solicitacao.id),
            criadoEm: new Date().toISOString()
        };

        try {
            const campanhaCriada = await CampanhaService.criar(campanhaPayload);

            const solicitacaoAtualizada = {
                ...solicitacao,
                status: 'em_desenvolvimento',
                campanhaId: campanhaCriada.id,
                atualizadoEm: new Date().toISOString()
            };

            await SolicitacaoService.atualizar(solicitacao.id, solicitacaoAtualizada);

            if (typeof AvisoService !== 'undefined') {
                await AvisoService.criar({
                    tipo: 'criacao_campanha',
                    titulo: 'Nova campanha criada',
                    descricao: `${campanhaCriada.titulo} (${campanhaCriada.id})`,
                    referenciaTipo: 'campanha',
                    referenciaId: campanhaCriada.id,
                    criadoEm: new Date().toISOString()
                });
            }

            alert('Campanha criada com sucesso e vinculada a solicitacao.');
            window.location.href = `./detalhe-campanha.html?id=${campanhaCriada.id}`;
        } catch (erro) {
            console.error(erro);
            alert('Falha ao criar a campanha.');
        }
    });

    btnCancelar.addEventListener('click', () => {
        window.location.href = `../solicitacao/detalhe-solicitacao.html?id=${solicitacao.id}`;
    });
});
