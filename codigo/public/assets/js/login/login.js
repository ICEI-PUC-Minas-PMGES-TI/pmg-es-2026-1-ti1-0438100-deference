document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "formLogin"
            );

        form.addEventListener(
            "submit",
            realizarLogin
        );
    }
);

async function realizarLogin(evento) {

    evento.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const usuario =
        await buscarUsuarioPorEmail(
            email
        );

    if (!usuario) {

        alert(
            "Usuário não encontrado."
        );

        return;
    }

    if (
        usuario.senha !== senha
    ) {

        alert(
            "Senha incorreta."
        );

        return;
    }

    salvarSessao(
        usuario
    );

    window.location.href =
        "../index.html";
}