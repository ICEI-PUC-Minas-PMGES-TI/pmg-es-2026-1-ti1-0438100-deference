const CampanhaService = {

    async listar() {

        const response = await fetch(
            `${API_URL}/campanhas`
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar campanhas');
        }

        return await response.json();
    },

    async buscarPorId(id) {

        const response = await fetch(
            `${API_URL}/campanhas/${id}`
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar campanha');
        }

        return await response.json();
    },

    async criar(campanha) {

        const response = await fetch(
            `${API_URL}/campanhas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campanha)
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao criar campanha');
        }

        return await response.json();
    },

    async atualizar(id, campanha) {

        const response = await fetch(
            `${API_URL}/campanhas/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campanha)
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar campanha');
        }

        return await response.json();
    },

    async excluir(id) {

        const response = await fetch(
            `${API_URL}/campanhas/${id}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao excluir campanha');
        }

        return true;
    }
};