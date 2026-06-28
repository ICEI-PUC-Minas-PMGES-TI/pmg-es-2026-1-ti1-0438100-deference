document.addEventListener(
    "DOMContentLoaded",
    () => {
        const form =
            document.getElementById(
                "formCadastro"
            );

        configurarMascaras();

        form.addEventListener(
            "submit",
            cadastrarUsuario
        );
    }
);

async function cadastrarUsuario(evento) {

    evento.preventDefault();

    const form = evento.currentTarget;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const nome =
        document.getElementById("nome").value.trim();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const telefone =
        document.getElementById("telefone").value.trim();

    const documento =
        document.getElementById("documento").value.trim();

    const dataNascimento =
        document.getElementById("dataNascimento").value;

    const cidade =
        document.getElementById("cidade").value.trim();

    const estado =
        document.getElementById("estado").value;

    const senha =
        document.getElementById("senha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    const perfil = "usuario";

    if (!validarCPF(documento)) {
        exibirErro("Informe um CPF valido.");
        return;
    }

    if (!validarTelefone(telefone)) {
        exibirErro("Informe um telefone valido.");
        return;
    }

    if (!validarIdadeMinima(dataNascimento, 16)) {
        exibirErro("O cadastro exige idade minima de 16 anos.");
        return;
    }

    if (senha !== confirmarSenha) {
        exibirErro("As senhas não coincidem.");
        return;
    }

    const usuarioExistente =
        await buscarUsuarioPorEmail(
            email
        );

    if (usuarioExistente) {
        exibirErro("E-mail ja cadastrado.");
        return;
    }

    const usuarios =
        await buscarUsuarios();

    const documentoExistente =
        usuarios.some(
            usuario =>
                normalizarDocumento(usuario.documento) ===
                normalizarDocumento(documento)
        );

    if (documentoExistente) {
        exibirErro("CPF ja cadastrado.");
        return;
    }

    const usuario = {
        nome,
        email,
        senha,
        perfil,
        telefone,
        documento,
        dataNascimento,
        cidade,
        estado,
        localizacao: `${cidade}, ${estado}`,
        entrada: formatarDataEntrada(new Date()),
        ativo: true,
        criadoEm: new Date().toISOString(),
        aceiteTermos: {
            aceito: true,
            data: new Date().toISOString()
        },
        configuracoes: {
            notifCampanhas: true,
            notifAtualizacoes: true,
            notifRelatorios: false,
            privDoacoes: true,
            privContato: false
        }
    };

    try {
        const usuarioCriado =
            await criarUsuario(
                usuario
            );

        if (typeof AvisoService !== "undefined") {
            await AvisoService.criar({
                tipo: "cadastro_usuario",
                titulo: "Novo usuario cadastrado",
                descricao: `${usuarioCriado.nome} (${usuarioCriado.email})`,
                referenciaTipo: "usuario",
                referenciaId: usuarioCriado.id,
                criadoEm: new Date().toISOString()
            });
        }

        salvarSessao(
            usuarioCriado
        );

        window.location.href =
            "../index.html";
    } catch (erro) {
        console.error(erro);
        exibirErro("Não foi possível concluir o cadastro.");
    }
}

function exibirErro(mensagem) {
    const alerta =
        document.getElementById("alertaErro");

    alerta.textContent = mensagem;
    alerta.classList.remove("d-none");
}

function configurarMascaras() {
    const telefone =
        document.getElementById("telefone");

    const documento =
        document.getElementById("documento");

    const confirmarSenha =
        document.getElementById("confirmarSenha");

    telefone.addEventListener("input", () => {
        telefone.value = mascararTelefone(telefone.value);
    });

    documento.addEventListener("input", () => {
        documento.value = mascararCPF(documento.value);
    });

    confirmarSenha.addEventListener("input", validarConfirmacaoSenha);
    document.getElementById("senha").addEventListener("input", validarConfirmacaoSenha);
}

function formatarDataEntrada(data) {
    return data.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}

function normalizarDocumento(documento) {
    return String(documento || "").replace(/\D/g, "");
}

function normalizarTelefone(telefone) {
    return String(telefone || "").replace(/\D/g, "");
}

function mascararCPF(valor) {
    return normalizarDocumento(valor)
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascararTelefone(valor) {
    const numeros = normalizarTelefone(valor).slice(0, 11);

    if (numeros.length <= 10) {
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

function validarTelefone(telefone) {
    const numeros = normalizarTelefone(telefone);
    return numeros.length === 10 || numeros.length === 11;
}

function validarCPF(cpf) {
    const numeros = normalizarDocumento(cpf);

    if (numeros.length !== 11 || /^(\d)\1+$/.test(numeros)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(numeros[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;
    digito = digito === 10 ? 0 : digito;

    if (digito !== Number(numeros[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(numeros[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;
    digito = digito === 10 ? 0 : digito;

    return digito === Number(numeros[10]);
}

function validarIdadeMinima(dataNascimento, idadeMinima) {
    const nascimento = new Date(`${dataNascimento}T00:00:00`);
    const hoje = new Date();

    if (Number.isNaN(nascimento.getTime()) || nascimento > hoje) {
        return false;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= idadeMinima;
}

function validarConfirmacaoSenha() {
    const senha =
        document.getElementById("senha");

    const confirmarSenha =
        document.getElementById("confirmarSenha");

    confirmarSenha.setCustomValidity(
        senha.value && confirmarSenha.value && senha.value !== confirmarSenha.value
            ? "As senhas não coincidem."
            : ""
    );
}

