function iniciarApp() {
    const cartoes = document.querySelectorAll('.cartao');
    const botoesFiltro = document.querySelectorAll('.botao-filtro');
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const btnAbrirCriar = document.getElementById('btnAbrirCriar');
    const modal = document.getElementById('modalCriarCampanha');
    const btnCancelar = document.getElementById('btnCancelar');
    const formNovaCampanha = document.getElementById('formNovaCampanha');
    const inputBusca = document.getElementById('inputBusca');

    function atualizarValores() {
        const cartoesAtuais = document.querySelectorAll('.cartao');
        
        cartoesAtuais.forEach(cartao => {
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

    if (btnAbrirCriar && modal) {
        btnAbrirCriar.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (btnCancelar && modal) {
        btnCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (formNovaCampanha) {
        formNovaCampanha.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Campanha enviada com sucesso para análise!');
            formNovaCampanha.reset();
            modal.style.display = 'none';
        });
    }

    if (inputBusca) {
        inputBusca.addEventListener('input', () => {
            const termoBusca = inputBusca.value.toLowerCase().trim();
            const cartoesAtuais = document.querySelectorAll('.cartao');

            cartoesAtuais.forEach(cartao => {
                const titulo = cartao.querySelector('h3')?.innerText.toLowerCase() || '';
                const descricao = cartao.querySelector('p')?.innerText.toLowerCase() || '';

                if (titulo.includes(termoBusca) || descricao.includes(termoBusca)) {
                    cartao.style.display = 'block';
                } else {
                    cartao.style.display = 'none';
                }
            });
        });
    }

    function filtrar(categoria) {
        const cartoesAtuais = document.querySelectorAll('.cartao');
        cartoesAtuais.forEach(cartao => {
            const catCartao = cartao.getAttribute('data-categoria');
            if (categoria === 'todos' || catCartao === categoria) {
                cartao.style.display = 'block';
            } else {
                cartao.style.display = 'none';
            }
        });
    }

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
            botao.classList.add('ativo');
            if (inputBusca) inputBusca.value = ''; 
            filtrar(botao.getAttribute('data-filtro'));
        });
    });

    atualizarValores();
}

window.addEventListener('DOMContentLoaded', iniciarApp);