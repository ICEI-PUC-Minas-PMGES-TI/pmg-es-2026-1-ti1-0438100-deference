function iniciarApp() {
    const cartoes = document.querySelectorAll('.cartao');
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

    function atualizarValores() {
        cartoes.forEach(cartao => {
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
   
    cartoes.forEach(cartao => {
        cartao.addEventListener('click', () => {
           
            const titulo = cartao.querySelector('h3').innerText;
            const categoria = cartao.querySelector('.etiqueta').innerText;
            const sobreTexto = cartao.querySelector('p').innerText;
            const imagemUrl = cartao.querySelector('.imagem-cartao img').src;
            const valorArrecadado = parseFloat(cartao.querySelector('.valor-arrecadado').getAttribute('data-valor')) || 0;
            const valorMeta = parseFloat(cartao.querySelector('.meta-valor').getAttribute('data-meta')) || 1;
            const beneficiariosTexto = cartao.querySelector('.beneficiarios').innerText.replace('👤 ', '');

            const organizador = cartao.getAttribute('data-organizador') || "ONG Parceira";
            const local = cartao.getAttribute('data-local') || "Brasil";
            const dataInicio = cartao.getAttribute('data-inicio') || "01/01/2026";
            const dataFim = cartao.getAttribute('data-fim') || "31/12/2026";
            const totalDoadores = cartao.getAttribute('data-doadores') || "0";

            const porcentagem = Math.min((valorArrecadado / valorMeta) * 100, 100).toFixed(0);
            const restante = Math.max(valorMeta - valorArrecadado, 0);

          
            document.getElementById('detalhe-titulo').innerText = titulo;
            document.getElementById('detalhe-categoria').innerText = categoria;
            document.getElementById('detalhe-autor').innerText = "por " + organizador;
            document.getElementById('detalhe-sobre').innerText = sobreTexto;
            document.getElementById('detalhe-banner').style.backgroundImage = `url('${imagemUrl}')`;

            document.getElementById('detalhe-tech-organizador').innerText = organizador;
            document.getElementById('detalhe-tech-local').innerText = local;
            document.getElementById('detalhe-tech-inicio').innerText = dataInicio;
            document.getElementById('detalhe-tech-fim').innerText = dataFim;

            document.getElementById('detalhe-impacto-beneficiarios').innerText = beneficiariosTexto.split(' ')[0];
            document.getElementById('detalhe-impacto-doadores').innerText = totalDoadores;

            document.getElementById('detalhe-painel-arrecadado').innerText = formatador.format(valorArrecadado);
            document.getElementById('detalhe-painel-meta').innerText = "de " + formatador.format(valorMeta) + " meta";
            document.getElementById('detalhe-painel-barra').style.width = porcentagem + "%";
            document.getElementById('detalhe-painel-porcentagem').innerText = porcentagem + "% concluído";
            document.getElementById('detalhe-painel-restante').innerText = formatador.format(restante) + " restante";
            document.getElementById('detalhe-painel-pessoas-doaram').innerText = `👤 ${totalDoadores} pessoas já doaram`;

           
            telaListagem.style.display = 'none';
            telaDetalhes.style.display = 'block';
            
            linkInicio.classList.remove('ativo');
            linkCampanhas.classList.add('ativo');
            window.scrollTo(0, 0);
        });
    });

    function voltarParaHome() {
        telaDetalhes.style.display = 'none';
        telaListagem.style.display = 'block';
        linkCampanhas.classList.remove('ativo');
        linkInicio.classList.add('ativo');
    }

    if(linkInicio) linkInicio.addEventListener('click', (e) => { e.preventDefault(); voltarParaHome(); });
    if(linkCampanhas) linkCampanhas.addEventListener('click', (e) => { e.preventDefault(); voltarParaHome(); });

    if (btnAbrirCriar && modal) btnAbrirCriar.addEventListener('click', () => modal.style.display = 'flex');
    if (btnCancelar && modal) btnCancelar.addEventListener('click', () => modal.style.display = 'none');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

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
            cartoes.forEach(cartao => {
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
            cartoes.forEach(cartao => {
                const catCartao = cartao.getAttribute('data-categoria');
                cartao.style.display = (categoria === 'todos' || catCartao === categoria) ? 'block' : 'none';
            });
        });
    });

    atualizarValores();
  

const btnVoltarDetalhes = document.getElementById('btn-voltar-detalhes');

if (btnVoltarDetalhes) {
    btnVoltarDetalhes.addEventListener('click', () => {
      
        irParaHome(); 
    });
}


}

window.addEventListener('DOMContentLoaded', iniciarApp);