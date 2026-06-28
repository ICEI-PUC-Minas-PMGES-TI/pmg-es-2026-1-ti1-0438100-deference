const SolicitacaoService = {

    async listar() {
        const response = await fetch(`${API_URL}/solicitacoes`);

        if (!response.ok) {
            throw new Error('Erro ao listar solicitacoes');
        }

        return await response.json();
    },

    async buscarPorId(id) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar solicitacao');
        }

        return await response.json();
    },

    async criar(solicitacao) {
        const response = await fetch(`${API_URL}/solicitacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitacao)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar solicitacao');
        }

        return await response.json();
    },

    async atualizar(id, solicitacao) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitacao)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar solicitacao');
        }

        return await response.json();
    }
};
