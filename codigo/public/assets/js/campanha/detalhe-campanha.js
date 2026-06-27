const mapaImagensDetalhe = {
    alimentacao: '../../assets/images/alimentacao.jpg',
    saude: '../../assets/images/saude.jpg',
    educacao: '../../assets/images/educacao.jpg',
    moradia: '../../assets/images/moradia.jpg',
    vestuario: '../../assets/images/vestuario.jpg',
    'meio ambiente': '../../assets/images/meio-ambiente.jpg'
};

function acheImagemDetalhe(categoria) {
    const chave = String(categoria || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return mapaImagensDetalhe[chave] || mapaImagensDetalhe.alimentacao;
}

function formatarData(dataISO) {
    if (!dataISO) return '00/00/0000';
    const data = new Date(dataISO + 'T00:00:00');
    if (isNaN(data.getTime())) return dataISO;
    return data.toLocaleDateString('pt-BR');
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const campanhaId = params.get('id');

    if (!campanhaId) {
        document.querySelector('.pagina-detalhe-campanha').innerHTML = 
            '<div class="container py-5 text-center"><p class="text-danger">Campanha n\u00e3o encontrada.</p>' +
            '<a href="./campanhas.html" class="btn botao-cadastrar">Voltar para campanhas</a></div>';
        return;
    }

    try {
        const campanha = await CampanhaService.buscarPorId(campanhaId);
        if (!campanha) throw new Error('Campanha n\u00e3o encontrada');

        const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        const arrecadado = campanha.arrecadado || 0;
        const meta = campanha.meta || 1;
        const doadores = campanha.doadores || 0;
        const porcentagem = Math.min((arrecadado / meta) * 100, 100).toFixed(0);
        const restante = Math.max(meta - arrecadado, 0);
        const imagemCategoria = acheImagemDetalhe(campanha.categoria);

        // Banner
        document.getElementById('detalhe-banner').style.backgroundImage = "url('" + imagemCategoria + "')";
        document.getElementById('detalhe-categoria').innerText = campanha.categoria || '';
        document.getElementById('detalhe-titulo').innerText = campanha.titulo || '';
        document.getElementById('detalhe-autor').innerText = 'por ' + (campanha.organizacao || 'ONG Parceira');

        // Sobre
        document.getElementById('detalhe-sobre').innerText = campanha.descricao || '';

        // Detalhes tecnicos
        document.getElementById('detalhe-tech-organizador').innerText = campanha.organizacao || 'ONG Parceira';
        document.getElementById('detalhe-tech-local').innerText = campanha.local || 'Brasil';
        document.getElementById('detalhe-tech-inicio').innerText = formatarData(campanha.inicio);
        document.getElementById('detalhe-tech-fim').innerText = formatarData(campanha.fim);

        // Impacto
        document.getElementById('detalhe-impacto-beneficiarios').innerText = campanha.beneficiarios || 0;
        document.getElementById('detalhe-impacto-doadores').innerText = doadores;

        // Painel de arrecadacao
        document.getElementById('detalhe-painel-arrecadado').innerText = formatador.format(arrecadado);
        document.getElementById('detalhe-painel-meta').innerText = 'de ' + formatador.format(meta) + ' meta';
        document.getElementById('detalhe-painel-barra').style.width = porcentagem + '%';
        document.getElementById('detalhe-painel-porcentagem').innerText = porcentagem + '% conclu\u00eddo';
        document.getElementById('detalhe-painel-restante').innerText = formatador.format(restante) + ' restante';
        document.getElementById('detalhe-painel-pessoas-doaram').innerText = 
            '\ud83d\udc64 ' + doadores + ' pessoas j\u00e1 doaram';

        // Botao Doar agora - redireciona para realizar-contribuicao.html
        const btnDoar = document.getElementById('btnFazerDoacao');
        btnDoar.href = '../contribuicao/realizar-contribuicao.html?id=' + campanhaId;

        // Botao Compartilhar
        const btnCompartilhar = document.getElementById('btnCompartilharLink');
        btnCompartilhar.addEventListener('click', function () {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    alert('Link copiado com sucesso!');
                });
            } else {
                alert('Copie o link da barra de endere\u00e7os.');
            }
        });

    } catch (erro) {
        console.error('Erro ao carregar detalhes da campanha:', erro);
        document.querySelector('.pagina-detalhe-campanha').innerHTML = 
            '<div class="container py-5 text-center"><p class="text-danger">Erro ao carregar os detalhes da campanha.</p>' +
            '<a href="./campanhas.html" class="btn botao-cadastrar">Voltar para campanhas</a></div>';
    }
});
