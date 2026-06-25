document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "formCadastro"
            );

        form.addEventListener(
            "submit",
            cadastrarUsuario
        );
    }
);

async function cadastrarUsuario(evento) {

    evento.preventDefault();

    const nome =
        document.getElementById("nome").value;

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const perfil =
        document.querySelector(
            'input[name="perfil"]:checked'
        ).value;

    const usuarioExistente =
        await buscarUsuarioPorEmail(
            email
        );

    if (usuarioExistente) {

        alert(
            "E-mail já cadastrado."
        );

        return;
    }

    const usuario = {

        nome,
        email,
        senha,
        perfil
    };

    const usuarioCriado =
        await criarUsuario(
            usuario
        );

    salvarSessao(
        usuarioCriado
    );

    window.location.href =
        "../index.html";
}