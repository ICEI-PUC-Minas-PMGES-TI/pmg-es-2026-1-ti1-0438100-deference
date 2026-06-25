async function listarCampanhas() {
    const resposta =
        await fetch(`${API_URL}/campanhas`);

    return await resposta.json();
}

async function buscarCampanha(id) {

    const resposta =
        await fetch(
            `${API_URL}/campanhas/${id}`
        );

    return await resposta.json();
}

async function criarCampanha(campanha) {

    const resposta =
        await fetch(`${API_URL}/campanhas`, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(campanha)
        });

    return await resposta.json();
}

async function atualizarCampanha(
    id,
    campanha
) {

    const resposta =
        await fetch(
            `${API_URL}/campanhas/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(
                    campanha
                )
            }
        );

    return await resposta.json();
}