function salvarSessao(usuario) {

    localStorage.setItem(
        "usuarioSessao",
        JSON.stringify(usuario)
    );
}

function obterSessao() {

    return JSON.parse(
        localStorage.getItem(
            "usuarioSessao"
        )
    );
}

function logout() {

    localStorage.removeItem(
        "usuarioSessao"
    );
}