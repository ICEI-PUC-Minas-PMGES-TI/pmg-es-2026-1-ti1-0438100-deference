function iniciarApp() {
    const cartoes = document.querySelectorAll('.cartao');
    const botoesFiltro = document.querySelectorAll('.botao-filtro');
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    function atualizarValores() {
        cartoes.forEach(cartao => {
            const elValorArrecadado = cartao.querySelector('.valor-arrecadado');
            const elMeta = cartao.querySelector('.meta-valor');
            const elBarra = cartao.querySelector('.preenchimento-progresso');
            const elPorcentagemTexto = cartao.querySelector('.porcentagem-texto');

            const valorAtual = parseFloat(elValorArrecadado.getAttribute('data-valor'));
            const valorMeta = parseFloat(elMeta.getAttribute('data-meta'));
            const porcentagem = Math.min((valorAtual / valorMeta) * 100, 100).toFixed(0);

            elValorArrecadado.innerText = formatador.format(valorAtual);
            elMeta.innerText = "Meta: " + formatador.format(valorMeta);
            elPorcentagemTexto.innerText = porcentagem + "%";
            elBarra.style.width = porcentagem + "%";
        });
    }

    function filtrar(categoria) {
        cartoes.forEach(cartao => {
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
            filtrar(botao.getAttribute('data-filtro'));
        });
    });

    atualizarValores();
}

window.addEventListener('DOMContentLoaded', iniciarApp);