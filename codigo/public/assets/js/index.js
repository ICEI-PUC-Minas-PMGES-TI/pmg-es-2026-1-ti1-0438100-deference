const mapaImagens = {
    alimentacao: "../assets/images/alimentacao.jpg",
    saude: "../assets/images/saude.jpg",
    educacao: "../assets/images/educacao.jpg",
    moradia: "../assets/images/moradia.jpg",
    vestuario: "../assets/images/vestuario.jpg",
    "meio ambiente": "../assets/images/meio-ambiente.jpg"
};

function normalizarCategoria(categoria) {
    return String(categoria || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function acheImagem(categoria) {
    return mapaImagens[normalizarCategoria(categoria)] || mapaImagens.alimentacao;
}

function formatarNumeroInteiro(valor) {
    return new Intl.NumberFormat("pt-BR").format(Number(valor) || 0);
}

async function carregarIndicadoresHome() {
    const elTotalArrecadado = document.getElementById("statTotalArrecadado");
    const elDoadoresAtivos = document.getElementById("statDoadoresAtivos");
    const elPessoasAjudadas = document.getElementById("statPessoasAjudadas");

    if (!elTotalArrecadado || !elDoadoresAtivos || !elPessoasAjudadas) return;

    try {
        const [campanhas, contribuicoes] = await Promise.all([
            CampanhaService.listar(),
            fetch(`${API_URL}/contribuicoes`).then((resposta) => resposta.ok ? resposta.json() : [])
        ]);

        const totalArrecadado = campanhas.reduce(
            (acumulador, campanha) => acumulador + Number(campanha.arrecadado || 0),
            0
        );

        const idsDoadores = new Set(
            contribuicoes
                .map((contribuicao) => Number(contribuicao.usuarioId || 0))
                .filter((id) => id > 0)
        );

        const pessoasAjudadas = campanhas.reduce(
            (acumulador, campanha) => acumulador + Number(campanha.beneficiarios || 0),
            0
        );

        elTotalArrecadado.textContent = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(totalArrecadado);

        elDoadoresAtivos.textContent = formatarNumeroInteiro(idsDoadores.size);
        elPessoasAjudadas.textContent = formatarNumeroInteiro(pessoasAjudadas);
    } catch (erro) {
        console.error("Erro ao carregar indicadores da home:", erro);
    }
}

async function carregarCampanhasDestaque() {

    const container = document.getElementById("campanhas-destaque");

    try {

        const campanhas = await CampanhaService.listar();
        const formatador = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const cards = campanhas
            .slice(0, 3)
            .map((campanha) => {

                const arrecadado = campanha.arrecadado || campanha.valorArrecadado || 0;
                const meta = campanha.meta || 1;
                const porcentagem = Math.min((arrecadado / meta) * 100, 100).toFixed(0);
                const campanhaId = campanha.id || "";

                return `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <a href="./campanha/detalhe-campanha.html?id=${campanhaId}" class="text-decoration-none">
                            <article class="cartao h-100" data-id="${campanhaId}" data-categoria="${campanha.categoria || ''}">
                                <div class="imagem-cartao">
                                    <img
                                        src="${campanha.imagem || acheImagem(campanha.categoria)}"
                                        alt="${campanha.titulo || ''}">
                                </div>

                                <span class="etiqueta">
                                    ${campanha.categoria || ''}
                                </span>

                                <h3>
                                    ${campanha.titulo || ''}
                                </h3>

                                <p>
                                    ${campanha.descricao || ''}
                                </p>

                                <div class="cabecalho-estatisticas">
                                    <span
                                        class="valor-arrecadado"
                                        data-valor="${arrecadado}">
                                        ${formatador.format(arrecadado)}
                                    </span>

                                    <span class="porcentagem-texto">
                                        ${porcentagem}%
                                    </span>
                                </div>

                                <div class="fundo-progresso">
                                    <div
                                        class="preenchimento-progresso"
                                        style="width: ${porcentagem}%">
                                    </div>
                                </div>

                                <div
                                    class="meta-valor"
                                    data-meta="${meta}">
                                    Meta: ${formatador.format(meta)}
                                </div>

                                <div class="beneficiarios">
                                    &#128100; ${campanha.beneficiarios || 0} benefici&aacute;rios
                                </div>
                            </article>
                        </a>
                    </div>
                `;
            });

        container.innerHTML = cards.join("");

    } catch (erro) {

        console.error("Erro ao carregar campanhas:", erro);

        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">
                    Não foi possível carregar as campanhas em destaque.
                </p>
            </div>
        `;
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        carregarIndicadoresHome(),
        carregarCampanhasDestaque()
    ]);
});

