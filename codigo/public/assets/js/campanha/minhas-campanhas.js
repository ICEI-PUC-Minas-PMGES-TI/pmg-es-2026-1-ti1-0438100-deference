function obterUsuarioSessaoMinhas() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function campanhaEhDoUsuario(campanha, usuario) {
    if (!campanha || !usuario) return false;

    if (Number(campanha.criadorId) === Number(usuario.id)) return true;
    if (campanha.email && usuario.email && String(campanha.email).toLowerCase() === String(usuario.email).toLowerCase()) return true;

    return false;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = obterUsuarioSessaoMinhas();
    const lista = document.getElementById('listaMinhasCampanhas');

    if (!usuario) {
        alert('Você precisa estar logado para acessar suas campanhas.');
        window.location.href = '../login/login.html';
        return;
    }

    try {
        const campanhas = await CampanhaService.listar();
        const minhasCampanhas = campanhas.filter(campanha => campanhaEhDoUsuario(campanha, usuario));

        lista.innerHTML = '';

        if (!minhasCampanhas.length) {
            lista.innerHTML = '<p class="texto-vazio">Você ainda não criou campanhas.</p>';
            return;
        }

        minhasCampanhas
            .sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0))
            .forEach((campanha) => {
                const card = document.createElement('article');
                card.className = 'card-minha-campanha';
                card.innerHTML = `
                    <span class="tag-categoria">${campanha.categoria || 'Sem categoria'}</span>
                    <h2 class="titulo-campanha">${campanha.titulo || 'Campanha sem titulo'}</h2>
                    <p class="resumo-campanha">${(campanha.descricao || '').slice(0, 120)}</p>
                    <div class="meta-campanha">
                        Arrecadado ${formatarMoeda(campanha.arrecadado)} de ${formatarMoeda(campanha.meta)}
                    </div>
                `;

                card.addEventListener('click', () => {
                    window.location.href = `./detalhe-campanha-admin.html?id=${campanha.id}`;
                });

                lista.appendChild(card);
            });
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<p class="texto-vazio text-danger">Não foi possível carregar suas campanhas.</p>';
    }
});

