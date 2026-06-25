document.addEventListener("DOMContentLoaded", () => {
    atualizarNavbar();
});

function atualizarNavbar() {

    const usuarioSessao =
        localStorage.getItem("usuarioSessao");

    const navGuest =
        document.querySelectorAll(".nav-guest");

    const navAuth =
        document.querySelectorAll(".nav-auth");

    if (usuarioSessao) {

        navGuest.forEach(
            elemento =>
                elemento.classList.add("d-none")
        );

        navAuth.forEach(
            elemento =>
                elemento.classList.remove("d-none")
        );

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