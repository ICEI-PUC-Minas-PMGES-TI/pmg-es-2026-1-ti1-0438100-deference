function obterUsuarioSessao() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function normalizarTelefone(telefone) {
    return String(telefone || '').replace(/\D/g, '');
}

function aplicarMascaraTelefone(valor) {
    const digitos = normalizarTelefone(valor).slice(0, 11);

    if (digitos.length <= 10) {
        return digitos
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return digitos
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}

function validarTelefone(telefone) {
    const qtd = normalizarTelefone(telefone).length;
    return qtd === 10 || qtd === 11;
}

function exibirAlerta(id, mensagem) {
    const alerta = document.getElementById(id);
    alerta.textContent = mensagem;
    alerta.classList.remove('d-none');
}

function ocultarAlertas() {
    document.getElementById('alertaSolicitacao').classList.add('d-none');
    document.getElementById('sucessoSolicitacao').classList.add('d-none');
}

function marcarInvalido(elemento, mensagem) {
    elemento.classList.add('is-invalid');

    const feedback = elemento.parentElement.querySelector('.invalid-feedback') || elemento.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = mensagem;
    }
}

function limparValidacoes(form) {
    Array.from(form.querySelectorAll('.is-invalid')).forEach((campo) => {
        campo.classList.remove('is-invalid');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCriarSolicitacao');
    const telefone = document.getElementById('contatoTelefone');
    const usuarioSessao = obterUsuarioSessao();

    if (!usuarioSessao) {
        window.location.href = '../cadastro/cadastro.html';
        return;
    }

    telefone.addEventListener('input', () => {
        telefone.value = aplicarMascaraTelefone(telefone.value);
        telefone.classList.remove('is-invalid');
    });

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarAlertas();
        limparValidacoes(form);

        const usuario = obterUsuarioSessao();

        if (!usuario) {
            exibirAlerta('alertaSolicitacao', 'Voce precisa estar logado para criar uma solicitacao.');
            return;
        }

        const campos = {
            tipoSolicitacao: document.getElementById('tipoSolicitacao'),
            categoriaAjuda: document.getElementById('categoriaAjuda'),
            titulo: document.getElementById('tituloSolicitacao'),
            descricaoResumo: document.getElementById('descricaoResumo'),
            descricaoCompleta: document.getElementById('descricaoCompleta'),
            local: document.getElementById('localSolicitacao'),
            urgencia: document.getElementById('urgenciaSolicitacao'),
            linkFoto: document.getElementById('linkFoto'),
            linkDocumento: document.getElementById('linkDocumento'),
            contatoNome: document.getElementById('contatoNome'),
            contatoTelefone: document.getElementById('contatoTelefone'),
            contatoEmail: document.getElementById('contatoEmail')
        };

        let valido = true;

        if (!campos.tipoSolicitacao.value) {
            marcarInvalido(campos.tipoSolicitacao, 'Selecione o tipo da solicitacao.');
            valido = false;
        }

        if (!campos.categoriaAjuda.value) {
            marcarInvalido(campos.categoriaAjuda, 'Selecione a categoria.');
            valido = false;
        }

        if (campos.titulo.value.trim().length < 6) {
            marcarInvalido(campos.titulo, 'Informe um titulo com pelo menos 6 caracteres.');
            valido = false;
        }

        if (campos.descricaoResumo.value.trim().length < 15) {
            marcarInvalido(campos.descricaoResumo, 'Informe um resumo com pelo menos 15 caracteres.');
            valido = false;
        }

        if (campos.descricaoCompleta.value.trim().length < 40) {
            marcarInvalido(campos.descricaoCompleta, 'Informe uma descricao completa com pelo menos 40 caracteres.');
            valido = false;
        }

        if (!campos.local.value.trim()) {
            marcarInvalido(campos.local, 'Informe o local da solicitacao.');
            valido = false;
        }

        if (!campos.urgencia.value) {
            marcarInvalido(campos.urgencia, 'Selecione a urgencia.');
            valido = false;
        }

        if (!campos.contatoNome.value.trim()) {
            marcarInvalido(campos.contatoNome, 'Informe o nome de contato.');
            valido = false;
        }

        if (!validarTelefone(campos.contatoTelefone.value)) {
            marcarInvalido(campos.contatoTelefone, 'Informe um telefone valido.');
            valido = false;
        }

        if (!campos.contatoEmail.checkValidity()) {
            marcarInvalido(campos.contatoEmail, 'Informe um e-mail valido.');
            valido = false;
        }

        if (campos.linkFoto.value && !campos.linkFoto.checkValidity()) {
            marcarInvalido(campos.linkFoto, 'Informe uma URL valida para foto.');
            valido = false;
        }

        if (campos.linkDocumento.value && !campos.linkDocumento.checkValidity()) {
            marcarInvalido(campos.linkDocumento, 'Informe uma URL valida para documento.');
            valido = false;
        }

        if (!valido) {
            exibirAlerta('alertaSolicitacao', 'Corrija os campos destacados antes de enviar.');
            return;
        }

        const now = new Date().toISOString();

        const payload = {
            titulo: campos.titulo.value.trim(),
            tipoSolicitacao: campos.tipoSolicitacao.value,
            status: 'em_analise',
            descricaoResumo: campos.descricaoResumo.value.trim(),
            descricaoCompleta: campos.descricaoCompleta.value.trim(),
            local: campos.local.value.trim(),
            categoriaAjuda: campos.categoriaAjuda.value,
            urgencia: campos.urgencia.value,
            documentos: campos.linkDocumento.value ? [campos.linkDocumento.value.trim()] : [],
            fotos: campos.linkFoto.value ? [campos.linkFoto.value.trim()] : [],
            contatoNome: campos.contatoNome.value.trim(),
            contatoTelefone: campos.contatoTelefone.value.trim(),
            contatoEmail: campos.contatoEmail.value.trim().toLowerCase(),
            criadorId: usuario.id,
            criadorNome: usuario.nome,
            criadoEm: now,
            atualizadoEm: now,
            campanhaId: null
        };

        try {
            const solicitacaoCriada = await SolicitacaoService.criar(payload);

            if (typeof AvisoService !== 'undefined') {
                await AvisoService.criar({
                    tipo: 'criacao_solicitacao',
                    titulo: 'Nova solicitacao criada',
                    descricao: `${solicitacaoCriada.titulo} (${solicitacaoCriada.id})`,
                    referenciaTipo: 'solicitacao',
                    referenciaId: solicitacaoCriada.id,
                    criadoEm: new Date().toISOString()
                });
            }

            document.getElementById('sucessoSolicitacao').textContent = 'Solicitacao enviada com sucesso! Status inicial: Em Analise.';
            document.getElementById('sucessoSolicitacao').classList.remove('d-none');
            form.reset();

            setTimeout(() => {
                window.location.href = './solicitacoes.html';
            }, 900);
        } catch (erro) {
            console.error(erro);
            exibirAlerta('alertaSolicitacao', 'Nao foi possivel enviar a solicitacao agora.');
        }
    });
});
