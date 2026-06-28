const AvisoService = {
    async listar() {
        const response = await fetch(`${API_URL}/avisos`);

        if (!response.ok) {
            throw new Error('Erro ao listar avisos');
        }

        return await response.json();
    },

    async criar(aviso) {
        const response = await fetch(`${API_URL}/avisos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aviso)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar aviso');
        }

        return await response.json();
    }
};
