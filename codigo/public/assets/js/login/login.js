document.addEventListener(
    "DOMContentLoaded",
    () => {

        const usuarioSessao =
            typeof obterSessao === "function"
                ? obterSessao()
                : null;

        if (usuarioSessao) {
            window.location.href =
                usuarioSessao.perfil === "admin"
                    ? "../administrador/dashboard-admin.html"
                    : "../index.html";
            return;
        }

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
        usuario.perfil === "admin"
            ? "../administrador/dashboard-admin.html"
            : "../index.html";
}