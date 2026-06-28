const mapaImagens = {
    alimentacao: '../../assets/images/alimentacao.jpg',
    saude: '../../assets/images/saude.jpg',
    educacao: '../../assets/images/educacao.jpg',
    moradia: '../../assets/images/moradia.jpg',
    vestuario: '../../assets/images/vestuario.jpg',
    'meio ambiente': '../../assets/images/meio-ambiente.jpg'
};

function acheImagem(categoria) {
    const chave = String(categoria || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return mapaImagens[chave] || mapaImagens.alimentacao;
}

const gradeCampanhas = document.getElementById('grade-campanhas');

function obterUsuarioSessaoLista() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function campanhaPertenceAoUsuario(campanha, usuario) {
    if (!campanha || !usuario) return false;

    if (Number(campanha.criadorId) === Number(usuario.id)) return true;
    if (campanha.email && usuario.email && String(campanha.email).toLowerCase() === String(usuario.email).toLowerCase()) return true;

    return false;
}

function configurarBotaoMinhasCampanhas(campanhas) {
    const btnMinhasCampanhas = document.getElementById('btnMinhasCampanhas');
    if (!btnMinhasCampanhas) return;

    const usuario = obterUsuarioSessaoLista();
    if (!usuario) {
        btnMinhasCampanhas.classList.add('d-none');
        return;
    }

    const possuiCampanha = campanhas.some(campanha => campanhaPertenceAoUsuario(campanha, usuario));
    btnMinhasCampanhas.classList.toggle('d-none', !possuiCampanha);
}

function iniciarApp() {
    function obterCartoes() {
        return document.querySelectorAll('.cartao');
    }
    const botoesFiltro = document.querySelectorAll('.botao-filtro');
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const btnAbrirCriar = document.getElementById('btnAbrirCriar');
    const modal = document.getElementById('modalCriarCampanha');
    const btnCancelar = document.getElementById('btnCancelar');
    const formNovaCampanha = document.getElementById('formNovaCampanha');
    const inputBusca = document.getElementById('inputBusca');

    const telaListagem = document.getElementById('tela-listagem');
    const telaDetalhes = document.getElementById('tela-detalhes');
    const linkInicio = document.getElementById('link-inicio');
    const linkCampanhas = document.getElementById('link-campanhas');

    const btnFazerDoacao = document.getElementById('btnFazerDoacao');
    let cartaoAtivo = null;

    function atualizarValores() {
        obterCartoes().forEach(cartao => {
            const elValorArrecadado = cartao.querySelector('.valor-arrecadado');
            const elMeta = cartao.querySelector('.meta-valor');
            const elBarra = cartao.querySelector('.preenchimento-progresso');
            const elPorcentagemTexto = cartao.querySelector('.porcentagem-texto');

            const valorAtual = parseFloat(elValorArrecadado?.getAttribute('data-valor')) || 0;
            const valorMeta = parseFloat(elMeta?.getAttribute('data-meta')) || 1;
            const porcentagem = Math.min((valorAtual / valorMeta) * 100, 100).toFixed(0);

            if (elValorArrecadado) elValorArrecadado.innerText = formatador.format(valorAtual);
            if (elMeta) elMeta.innerText = "Meta: " + formatador.format(valorMeta);
            if (elPorcentagemTexto) elPorcentagemTexto.innerText = porcentagem + "%";
            if (elBarra) elBarra.style.width = porcentagem + "%";
        });
    }

    function registrarCartao(cartao) {
        cartao.addEventListener('click', () => {
            const campanhaId = cartao.getAttribute('data-id');
            if (campanhaId) {
                window.location.href = './detalhe-campanha.html?id=' + campanhaId;
                return;
            }
            cartaoAtivo = cartao;

            const titulo = cartao.querySelector('h3').innerText;
            const categoria = cartao.querySelector('.etiqueta').innerText;
            const sobreTexto = cartao.querySelector('p').innerText;
            const imagemUrl = cartao.querySelector('.imagem-cartao img').src;
            const valorArrecadado = parseFloat(cartao.querySelector('.valor-arrecadado').getAttribute('data-valor')) || 0;
            const valorMeta = parseFloat(cartao.querySelector('.meta-valor').getAttribute('data-meta')) || 1;
            const beneficiariosTexto = cartao.querySelector('.beneficiarios').innerText;
            const beneficiariosNumero = (beneficiariosTexto.match(/\d+/) || ['0'])[0];

            const organizador = cartao.getAttribute('data-organizador') || "ONG Parceira";
            const local = cartao.getAttribute('data-local') || "Brasil";
            const dataInicio = cartao.getAttribute('data-inicio') || "01/01/2026";
            const dataFim = cartao.getAttribute('data-fim') || "31/12/2026";
            const totalDoadores = parseInt(cartao.getAttribute('data-doadores')) || 0;

            atualizarPainelDetalhes(valorArrecadado, valorMeta, totalDoadores);

            document.getElementById('detalhe-titulo').innerText = titulo;
            document.getElementById('detalhe-categoria').innerText = categoria;
            document.getElementById('detalhe-autor').innerText = "por " + organizador;
            document.getElementById('detalhe-sobre').innerText = sobreTexto;
            document.getElementById('detalhe-banner').style.backgroundImage = `url('${imagemUrl}')`;

            document.getElementById('detalhe-tech-organizador').innerText = organizador;
            document.getElementById('detalhe-tech-local').innerText = local;
            document.getElementById('detalhe-tech-inicio').innerText = dataInicio;
            document.getElementById('detalhe-tech-fim').innerText = dataFim;

            document.getElementById('detalhe-impacto-beneficiarios').innerText = beneficiariosNumero;

            telaListagem.style.display = 'none';
            telaDetalhes.style.display = 'block';

            linkInicio.classList.remove('ativo');
            linkCampanhas.classList.add('ativo');
            window.scrollTo(0, 0);
        });
    }

    obterCartoes().forEach(registrarCartao);

    function atualizarPainelDetalhes(arrecadado, meta, doadores) {
        const porcentagem = Math.min((arrecadado / meta) * 100, 100).toFixed(0);
        const restante = Math.max(meta - arrecadado, 0);

        document.getElementById('detalhe-impacto-doadores').innerText = doadores;
        document.getElementById('detalhe-painel-arrecadado').innerText = formatador.format(arrecadado);
        document.getElementById('detalhe-painel-meta').innerText = "de " + formatador.format(meta) + " meta";
        document.getElementById('detalhe-painel-barra').style.width = porcentagem + "%";
        document.getElementById('detalhe-painel-porcentagem').innerText = porcentagem + "% concluído";
        document.getElementById('detalhe-painel-restante').innerText = formatador.format(restante) + " restante";
        document.getElementById('detalhe-painel-pessoas-doaram').innerText = `${doadores} pessoas já doaram`;
    }

        if (btnFazerDoacao) {
        btnFazerDoacao.addEventListener('click', () => {
            if (!cartaoAtivo) return;
            const campanhaId = cartaoAtivo.getAttribute('data-id');
            if (campanhaId) {
                window.location.href = '../contribuicao/realizar-contribuicao.html?id=' + campanhaId;
            }
        });
    }

    function voltarParaHome() {
        telaDetalhes.style.display = 'none';
        telaListagem.style.display = 'block';
        linkCampanhas.classList.remove('ativo');
        linkInicio.classList.add('ativo');
    }

    if (linkInicio) linkInicio.addEventListener('click', (e) => { e.preventDefault(); voltarParaHome(); });
    if (linkCampanhas) linkCampanhas.addEventListener('click', (e) => { e.preventDefault(); voltarParaHome(); });

    const btnVoltarDetalhes = document.getElementById('btn-voltar-detalhes');
    if (btnVoltarDetalhes) {
        btnVoltarDetalhes.addEventListener('click', () => {
            voltarParaHome();
        });
    }

    if (btnAbrirCriar && modal) btnAbrirCriar.addEventListener('click', () => modal.style.display = 'flex');
    if (btnCancelar && modal) btnCancelar.addEventListener('click', () => modal.style.display = 'none');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    if (formNovaCampanha) {

        formNovaCampanha.addEventListener('submit', async (e) => {

            e.preventDefault();

            try {

                const categoria = document.getElementById('categoria').value;

                const campanha = {
                    titulo: document.getElementById('titulo').value,
                    categoria,
                    descricao: document.getElementById('descricao').value,
                    meta: Number(document.getElementById('meta').value),
                    beneficiarios: Number(document.getElementById('beneficiarios').value),
                    local: document.getElementById('local').value,
                    organizacao: document.getElementById('organizacao').value,
                    arrecadado: 0,
                    doadores: 0,
                    imagem: acheImagem(categoria)
                };

                const campanhaCriada =
                    await CampanhaService.criar(campanha);

                adicionarCampanhaNaTela(campanhaCriada);

                atualizarValores();

                alert('Campanha criada com sucesso!');

                formNovaCampanha.reset();

                if (modal) {
                    modal.style.display = 'none';
                }

            } catch (erro) {

                console.error(erro);

                alert('Erro ao criar campanha.');

            }

        });

    }
    if (inputBusca) {
        inputBusca.addEventListener('input', () => {
            const termoBusca = inputBusca.value.toLowerCase().trim();
            obterCartoes().forEach(cartao => {
                const titulo = cartao.querySelector('h3')?.innerText.toLowerCase() || '';
                const descricao = cartao.querySelector('p')?.innerText.toLowerCase() || '';
                cartao.style.display = (titulo.includes(termoBusca) || descricao.includes(termoBusca)) ? 'block' : 'none';
            });
        });
    }

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
            botao.classList.add('ativo');
            if (inputBusca) inputBusca.value = '';
            const categoria = botao.getAttribute('data-filtro');
            obterCartoes().forEach(cartao => {
                const catCartao = cartao.getAttribute('data-categoria');
                cartao.style.display = (categoria === 'todos' || catCartao === categoria) ? 'block' : 'none';
            });
        });
    });

    atualizarValores();

}
function adicionarCampanhaNaTela(campanha) {

    const grade = document.getElementById('grade-campanhas');

    function criarCardCampanha(campanha) {

        const cartao = document.createElement("article");
        cartao.className = "cartao";

        cartao.setAttribute(
            'data-categoria',
            campanha.categoria || ''
        );

        cartao.setAttribute(
            'data-organizador',
            campanha.organizacao || 'ONG Parceira'
        );

        cartao.setAttribute(
            'data-local',
            campanha.local || 'Brasil'
        );

        cartao.setAttribute(
            'data-doadores',
            campanha.doadores || 0
        );

        cartao.setAttribute(
            'data-id',
            campanha.id || ''
        );

        cartao.innerHTML = `
        <div class="imagem-cartao">
            <img src="${campanha.imagem || acheImagem(campanha.categoria)}" alt="${campanha.titulo}">
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
                data-valor="${campanha.arrecadado || 0}">
            </span>

            <span class="porcentagem-texto">
                0%
            </span>

        </div>

        <div class="fundo-progresso">
            <div class="preenchimento-progresso"></div>
        </div>

        <div
            class="meta-valor"
            data-meta="${campanha.meta || 0}">
        </div>

        <div class="beneficiarios">
            ${campanha.beneficiarios || 0} beneficiários
        </div>
    `;

        return cartao;
    }

    const cartao = criarCardCampanha(campanha);

    grade.appendChild(cartao);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {

        const campanhas = await CampanhaService.listar();

        configurarBotaoMinhasCampanhas(campanhas);

        campanhas.forEach(campanha => {
            adicionarCampanhaNaTela(campanha);
        });

        iniciarApp();

    } catch (erro) {

        console.error('Erro ao carregar campanhas:', erro);

        alert('Não foi possível carregar as campanhas.');

    }
});

