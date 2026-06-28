const AtualizacaoService = {

    async listar() {
        const response = await fetch(`${API_URL}/atualizacoes`);

        if (!response.ok) {
            throw new Error('Erro ao buscar atualizacoes');
        }

        return await response.json();
    },

    async listarPorCampanha(campanhaId) {
        const response = await fetch(`${API_URL}/atualizacoes?campanhaId=${campanhaId}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar atualizacoes da campanha');
        }

        return await response.json();
    },

    async buscarPorId(id) {
        const response = await fetch(`${API_URL}/atualizacoes/${id}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar atualizacao');
        }

        return await response.json();
    },

    async criar(atualizacao) {
        const response = await fetch(`${API_URL}/atualizacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atualizacao)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar atualizacao');
        }

        return await response.json();
    },

    async atualizar(id, atualizacao) {
        const response = await fetch(`${API_URL}/atualizacoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atualizacao)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar atualizacao');
        }

        return await response.json();
    }
};


