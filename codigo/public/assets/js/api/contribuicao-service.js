async function registrarContribuicao(
    contribuicao
) {

    const resposta =
        await fetch(
            `${API_URL}/contribuicoes`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(
                    contribuicao
                )
            }
        );

    if (!resposta.ok) {
        throw new Error(
            "Erro ao registrar contribuicao"
        );
    }

    return await resposta.json();
}