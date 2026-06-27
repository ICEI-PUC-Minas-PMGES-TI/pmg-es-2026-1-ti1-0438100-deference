async function buscarUsuarios() {
    const resposta =
        await fetch(`${API_URL}/usuarios`);

    return await resposta.json();
}

async function buscarUsuarioPorEmail(email) {

    const resposta =
        await fetch(
            `${API_URL}/usuarios?email=${email}`
        );

    const usuarios =
        await resposta.json();

    return usuarios[0];
}

async function criarUsuario(usuario) {

    const resposta =
        await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(usuario)
        });

    return await resposta.json();
}

async function atualizarUsuario(id, usuario) {

    const resposta =
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(usuario)
        });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar usuario");
    }

    return await resposta.json();
}
