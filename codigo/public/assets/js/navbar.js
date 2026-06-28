document.addEventListener("DOMContentLoaded", () => {
    atualizarNavbar();
});

function atualizarNavbar() {

    const usuarioSessaoTexto =
        localStorage.getItem("usuarioSessao");

    let usuarioSessao = null;

    try {
        usuarioSessao = usuarioSessaoTexto
            ? JSON.parse(usuarioSessaoTexto)
            : null;
    } catch (_) {
        usuarioSessao = null;
    }

    const navGuest =
        document.querySelectorAll(".nav-guest");

    const navAuth =
        document.querySelectorAll(".nav-auth");

    const linksNavAuth =
        document.querySelectorAll(".nav-auth a");

    if (usuarioSessao) {

        navGuest.forEach(
            elemento =>
                elemento.classList.add("d-none")
        );

        navAuth.forEach(
            elemento =>
                elemento.classList.remove("d-none")
        );

        const perfilAdmin = usuarioSessao.perfil === "admin";

        linksNavAuth.forEach((link) => {
            if (perfilAdmin) {
                link.setAttribute("href", "/modulos/administrador/dashboard-admin.html");
                link.innerHTML = '<i class="bi bi-speedometer2 me-1"></i>Painel Administrativo';
                return;
            }

            link.setAttribute("href", "/modulos/perfil/perfil.html");
            link.innerHTML = '<i class="bi bi-person-circle me-1"></i>Meu Perfil';
        });

    } else {

        navGuest.forEach(
            elemento =>
                elemento.classList.remove("d-none")
        );

        navAuth.forEach(
            elemento =>
                elemento.classList.add("d-none")
        );
    }
}