const perfilPadrao = {
    nome: "Usuario Solidariza",
    email: "usuario@email.com",
    perfil: "doador",
    telefone: "Nao informado",
    documento: "",
    dataNascimento: "",
    cidade: "",
    estado: "",
    localizacao: "Brasil",
    entrada: "Membro da comunidade",
    configuracoes: {
        notifCampanhas: true,
        notifAtualizacoes: true,
        notifRelatorios: false,
        privDoacoes: true,
        privContato: false
    }
};

let modalEditarPerfil;
let modalSenha;
let toastPerfil;

document.addEventListener("DOMContentLoaded", () => {
    const usuario = obterUsuarioAtual();

    if (!usuario) {
        window.location.href = "../login/login.html";
        return;
    }

    modalEditarPerfil = new bootstrap.Modal(
        document.getElementById("modalEditarPerfil")
    );

    modalSenha = new bootstrap.Modal(
        document.getElementById("modalSenha")
    );

    toastPerfil = new bootstrap.Toast(
        document.getElementById("toastPerfil")
    );

    renderizarPerfil(usuario);
    configurarEventos();
    configurarMascaras();
});

function obterUsuarioAtual() {
    if (typeof obterSessao !== "function") {
        return null;
    }

    const usuarioSessao = obterSessao();

    if (!usuarioSessao) {
        return null;
    }

    const configuracoes = carregarConfiguracoes(
        usuarioSessao.email,
        usuarioSessao.configuracoes
    );

    return {
        ...perfilPadrao,
        ...usuarioSessao,
        telefone: usuarioSessao.telefone || perfilPadrao.telefone,
        documento: usuarioSessao.documento || perfilPadrao.documento,
        dataNascimento: usuarioSessao.dataNascimento || perfilPadrao.dataNascimento,
        cidade: usuarioSessao.cidade || inferirCidade(usuarioSessao.localizacao),
        estado: usuarioSessao.estado || inferirEstado(usuarioSessao.localizacao),
        localizacao: usuarioSessao.localizacao || perfilPadrao.localizacao,
        entrada: usuarioSessao.entrada || perfilPadrao.entrada,
        configuracoes
    };
}

async function salvarUsuarioAtual(usuario) {
    const usuarioSessao = {
        ...obterSessao(),
        ...usuario
    };

    let usuarioPersistido = usuarioSessao;

    if (usuarioSessao.id && typeof atualizarUsuario === "function") {
        usuarioPersistido = await atualizarUsuario(usuarioSessao.id, usuarioSessao);
    }

    salvarSessao(usuarioPersistido);
    salvarConfiguracoes(usuarioPersistido.email, usuarioPersistido.configuracoes);

    return usuarioPersistido;
}

function obterChaveConfiguracoes(email) {
    return `perfilConfiguracoes:${email || "usuario"}`;
}

function carregarConfiguracoes(email, configuracoesBase = {}) {
    const configuracoesSalvas = localStorage.getItem(
        obterChaveConfiguracoes(email)
    );

    if (!configuracoesSalvas) {
        return {
            ...perfilPadrao.configuracoes,
            ...configuracoesBase
        };
    }

    return {
        ...perfilPadrao.configuracoes,
        ...JSON.parse(configuracoesSalvas)
    };
}

function salvarConfiguracoes(email, configuracoes) {
    localStorage.setItem(
        obterChaveConfiguracoes(email),
        JSON.stringify(configuracoes)
    );
}

function renderizarPerfil(usuario) {
    document.getElementById("perfilNome").textContent = usuario.nome;
    document.getElementById("perfilEmail").textContent = usuario.email;
    document.getElementById("perfilTelefone").textContent =
        usuario.telefone === perfilPadrao.telefone
            ? usuario.telefone
            : mascararTelefone(usuario.telefone);
    document.getElementById("perfilLocalizacao").textContent = usuario.localizacao;
    document.getElementById("perfilEntrada").textContent = usuario.entrada;
    document.getElementById("perfilTipo").textContent = formatarPerfil(usuario.perfil);

    document.getElementById("cfgNotifCampanhas").checked =
        usuario.configuracoes.notifCampanhas;
    document.getElementById("cfgNotifAtualizacoes").checked =
        usuario.configuracoes.notifAtualizacoes;
    document.getElementById("cfgNotifRelatorios").checked =
        usuario.configuracoes.notifRelatorios;
    document.getElementById("cfgPrivDoacoes").checked =
        usuario.configuracoes.privDoacoes;
    document.getElementById("cfgPrivContato").checked =
        usuario.configuracoes.privContato;
}

function formatarPerfil(perfil) {
    const perfis = {
        doador: "Doador",
        beneficiario: "Beneficiario",
        admin: "Administrador"
    };

    return perfis[perfil] || "Usuario";
}

function configurarEventos() {
    document.getElementById("btnEditarPerfil").addEventListener("click", abrirEditarPerfil);
    document.getElementById("btnAlterarSenha").addEventListener("click", () => modalSenha.show());
    document.getElementById("btnSairNavbar").addEventListener("click", sair);
    document.getElementById("formPerfil").addEventListener("submit", salvarPerfil);
    document.getElementById("formSenha").addEventListener("submit", salvarSenha);
    document.getElementById("formConfiguracoes").addEventListener("submit", salvarPreferencias);
}

function configurarMascaras() {
    const editTelefone = document.getElementById("editTelefone");
    const editDocumento = document.getElementById("editDocumento");
    const senhaNova = document.getElementById("senhaNova");
    const senhaConfirmar = document.getElementById("senhaConfirmar");

    editTelefone.addEventListener("input", () => {
        editTelefone.value = mascararTelefone(editTelefone.value);
    });

    editDocumento.addEventListener("input", () => {
        editDocumento.value = mascararCPF(editDocumento.value);
    });

    senhaNova.addEventListener("input", validarConfirmacaoSenha);
    senhaConfirmar.addEventListener("input", validarConfirmacaoSenha);
}

function abrirEditarPerfil() {
    const usuario = obterUsuarioAtual();

    document.getElementById("editNome").value = usuario.nome;
    document.getElementById("editEmail").value = usuario.email;
    document.getElementById("editTelefone").value =
        usuario.telefone === perfilPadrao.telefone ? "" : mascararTelefone(usuario.telefone);
    document.getElementById("editDocumento").value = mascararCPF(usuario.documento);
    document.getElementById("editDataNascimento").value = usuario.dataNascimento;
    document.getElementById("editCidade").value = usuario.cidade;
    document.getElementById("editEstado").value = usuario.estado;

    modalEditarPerfil.show();
}

async function salvarPerfil(evento) {
    evento.preventDefault();

    const usuario = obterUsuarioAtual();
    const nome = document.getElementById("editNome").value.trim();
    const email = document.getElementById("editEmail").value.trim().toLowerCase();
    const telefone = document.getElementById("editTelefone").value.trim();
    const documento = document.getElementById("editDocumento").value.trim();
    const dataNascimento = document.getElementById("editDataNascimento").value;
    const cidade = document.getElementById("editCidade").value.trim();
    const estado = document.getElementById("editEstado").value;

    if (!nome || !email || !telefone || !documento || !dataNascimento || !cidade || !estado) {
        exibirAlerta("Preencha todos os dados obrigatorios do perfil.");
        return;
    }

    if (!validarTelefone(telefone)) {
        exibirAlerta("Informe um telefone valido.");
        return;
    }

    if (!validarCPF(documento)) {
        exibirAlerta("Informe um CPF valido.");
        return;
    }

    if (!validarIdadeMinima(dataNascimento, 16)) {
        exibirAlerta("O perfil exige idade minima de 16 anos.");
        return;
    }

    try {
        if (email !== usuario.email && typeof buscarUsuarioPorEmail === "function") {
            const usuarioExistente = await buscarUsuarioPorEmail(email);

            if (usuarioExistente && usuarioExistente.id !== usuario.id) {
                exibirAlerta("E-mail ja cadastrado.");
                return;
            }
        }

        const emailAnterior = usuario.email;

        const usuarioAtualizado = {
            ...usuario,
            nome,
            email,
            telefone,
            documento,
            dataNascimento,
            cidade,
            estado,
            localizacao: `${cidade}, ${estado}`
        };

        if (emailAnterior !== email) {
            localStorage.removeItem(obterChaveConfiguracoes(emailAnterior));
        }

        const usuarioPersistido = await salvarUsuarioAtual(usuarioAtualizado);

        renderizarPerfil(usuarioPersistido);
        modalEditarPerfil.hide();
        exibirToast("Perfil atualizado com sucesso.");
    } catch (erro) {
        console.error(erro);
        exibirAlerta("Nao foi possivel atualizar o perfil.");
    }
}

async function salvarSenha(evento) {
    evento.preventDefault();

    const usuario = obterUsuarioAtual();
    const senhaAtual = document.getElementById("senhaAtual").value;
    const senhaNova = document.getElementById("senhaNova").value;
    const senhaConfirmar = document.getElementById("senhaConfirmar").value;
    const senhaSessao = usuario.senha || localStorage.getItem("solidariza_senha") || "123456";

    if (!senhaAtual || !senhaNova || !senhaConfirmar) {
        exibirAlerta("Preencha todos os campos de senha.");
        return;
    }

    if (senhaAtual !== senhaSessao) {
        exibirAlerta("Senha atual incorreta.");
        return;
    }

    if (!validarSenhaForte(senhaNova)) {
        exibirAlerta("A senha deve ter ao menos 6 caracteres, letras e numeros.");
        return;
    }

    if (senhaNova !== senhaConfirmar) {
        exibirAlerta("As senhas nao coincidem.");
        return;
    }

    try {
        const usuarioPersistido = await salvarUsuarioAtual({
            ...usuario,
            senha: senhaNova
        });

        localStorage.setItem("solidariza_senha", senhaNova);

        evento.target.reset();
        modalSenha.hide();
        renderizarPerfil(usuarioPersistido);
        exibirToast("Senha alterada com sucesso.");
    } catch (erro) {
        console.error(erro);
        exibirAlerta("Nao foi possivel alterar a senha.");
    }
}

async function salvarPreferencias(evento) {
    evento.preventDefault();

    const usuario = obterUsuarioAtual();

    usuario.configuracoes = {
        notifCampanhas: document.getElementById("cfgNotifCampanhas").checked,
        notifAtualizacoes: document.getElementById("cfgNotifAtualizacoes").checked,
        notifRelatorios: document.getElementById("cfgNotifRelatorios").checked,
        privDoacoes: document.getElementById("cfgPrivDoacoes").checked,
        privContato: document.getElementById("cfgPrivContato").checked
    };

    try {
        const usuarioPersistido = await salvarUsuarioAtual(usuario);
        renderizarPerfil(usuarioPersistido);
        exibirToast("Configuracoes salvas com sucesso.");
    } catch (erro) {
        console.error(erro);
        exibirAlerta("Nao foi possivel salvar as configuracoes.");
    }
}

function sair() {
    if (typeof logout === "function") {
        logout();
    } else {
        localStorage.removeItem("usuarioSessao");
    }

    window.location.href = "../login/login.html";
}

function exibirAlerta(mensagem) {
    const alerta = document.getElementById("alertaPerfil");

    alerta.textContent = mensagem;
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3500);
}

function exibirToast(mensagem) {
    document.getElementById("toastPerfilMensagem").textContent = mensagem;
    toastPerfil.show();
}

function inferirCidade(localizacao) {
    return String(localizacao || "").split(",")[0]?.trim() || "";
}

function inferirEstado(localizacao) {
    return String(localizacao || "").split(",")[1]?.trim() || "";
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

function validarSenhaForte(senha) {
    return senha.length >= 6 && /[A-Za-z]/.test(senha) && /\d/.test(senha);
}

function validarConfirmacaoSenha() {
    const senhaNova = document.getElementById("senhaNova");
    const senhaConfirmar = document.getElementById("senhaConfirmar");

    senhaConfirmar.setCustomValidity(
        senhaNova.value && senhaConfirmar.value && senhaNova.value !== senhaConfirmar.value
            ? "As senhas nao coincidem."
            : ""
    );
}
