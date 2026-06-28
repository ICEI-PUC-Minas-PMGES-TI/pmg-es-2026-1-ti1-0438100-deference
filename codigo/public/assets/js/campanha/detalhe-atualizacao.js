function formatarDataHoraDetalhe(dataISO) {
    if (!dataISO) return 'Sem data';
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return dataISO;
    return data.toLocaleString('pt-BR');
}

function formatarMoedaDetalhe(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('Atualizacao nao informada.');
        window.location.href = './campanhas.html';
        return;
    }

    try {
        const atualizacao = await AtualizacaoService.buscarPorId(id);
        const campanha = await CampanhaService.buscarPorId(atualizacao.campanhaId);

        document.getElementById('tituloAtualizacaoDetalhe').textContent = atualizacao.titulo || 'Atualizacao';
        document.getElementById('tagTipoAtualizacao').textContent = String(atualizacao.tipo || 'Atualizacao').replace(/_/g, ' ');
        document.getElementById('metaAtualizacaoDetalhe').textContent = `Campanha: ${campanha.titulo || '-'} | Publicado em ${formatarDataHoraDetalhe(atualizacao.criadoEm || atualizacao.dataOcorrencia)} por ${atualizacao.autorNome || 'Responsavel'}`;

        document.getElementById('resumoAtualizacaoDetalhe').textContent = atualizacao.resumo || '-';
        document.getElementById('descricaoAtualizacaoDetalhe').textContent = atualizacao.detalhes || '-';

        const cards = [];

        if (atualizacao.dataOcorrencia) {
            cards.push(`<article class="card-info"><h3>Data da ocorrencia</h3><p>${formatarDataHoraDetalhe(atualizacao.dataOcorrencia)}</p></article>`);
        }

        if (atualizacao.percentualConcluido !== null && atualizacao.percentualConcluido !== undefined && atualizacao.percentualConcluido !== '') {
            cards.push(`<article class="card-info"><h3>Percentual concluido</h3><p>${Number(atualizacao.percentualConcluido)}%</p></article>`);
        }

        if (atualizacao.valorAplicado !== null && atualizacao.valorAplicado !== undefined && atualizacao.valorAplicado !== '') {
            cards.push(`<article class="card-info"><h3>Valor aplicado</h3><p>${formatarMoedaDetalhe(atualizacao.valorAplicado)}</p></article>`);
        }

        if (atualizacao.destinoRecurso) {
            cards.push(`<article class="card-info"><h3>Destino do recurso</h3><p>${atualizacao.destinoRecurso}</p></article>`);
        }

        if (atualizacao.proximosPassos) {
            cards.push(`<article class="card-info"><h3>Proximos passos</h3><p>${atualizacao.proximosPassos}</p></article>`);
        }

        document.getElementById('gridInfoAtualizacao').innerHTML = cards.join('');

        const usuario = typeof obterSessao === 'function' ? obterSessao() : JSON.parse(localStorage.getItem('usuarioSessao'));
        const ehDono = (Number(campanha.criadorId) === Number(usuario?.id))
            || (campanha.email && usuario?.email && String(campanha.email).toLowerCase() === String(usuario.email).toLowerCase());

        document.getElementById('linkVoltarAtualizacao').href = ehDono
            ? `./detalhe-campanha-admin.html?id=${campanha.id}`
            : `./detalhe-campanha.html?id=${campanha.id}`;
    } catch (erro) {
        console.error(erro);
        alert('Nao foi possivel carregar os detalhes da atualizacao.');
        window.location.href = './campanhas.html';
    }
});
