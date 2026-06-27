const mapaImagens = {
    alimentacao: "./assets/images/photo-1593113630400-ea4288922497.jpg",
    saude: "./assets/images/photo-1758691462321-9b6c98c40f7e.jpg",
    educacao: "./assets/images/photo-1581929207722-a3ac7efe8930.jpg",
    moradia: "./assets/images/photo-1769028885299-c5c3503d6778.jpg",
    vestuario: "./assets/images/photo-1593113598332-cd288d649433.jpg"
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

                const porcentagem = Math.min(
                    (arrecadado / meta) * 100,
                    100
                ).toFixed(0);

                return `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <article class="cartao h-100">
                            <div class="imagem-cartao">
                                <img
                                    src="${campanha.imagem || acheImagem(campanha.categoria)}"
                                    alt="${campanha.titulo || ""}">
                            </div>

                            <span class="etiqueta">
                                ${campanha.categoria || ""}
                            </span>

                            <h3>
                                ${campanha.titulo || ""}
                            </h3>

                            <p>
                                ${campanha.descricao || ""}
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
                    </div>
                `;
            });

        container.innerHTML = cards.join("");

    } catch (erro) {

        console.error("Erro ao carregar campanhas:", erro);

        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">
                    Nao foi possivel carregar as campanhas em destaque.
                </p>
            </div>
        `;
    }
}

window.addEventListener("DOMContentLoaded", carregarCampanhasDestaque);
