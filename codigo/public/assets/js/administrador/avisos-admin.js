let avisosAdminCache = [];

function dentroPeriodoAviso(dataIso, periodo) {
    if (periodo === 'todos') return true;
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return false;

    const hoje = new Date();

    if (periodo === 'dia') return data.toDateString() === hoje.toDateString();
    if (periodo === 'mes') return data.getFullYear() === hoje.getFullYear() && data.getMonth() === hoje.getMonth();
    if (periodo === 'ano') return data.getFullYear() === hoje.getFullYear();

    return true;
}

function renderAvisosAdmin() {
    const tipo = document.getElementById('filtroTipoAviso').value;
    const periodo = document.getElementById('filtroPeriodoAviso').value;

    const lista = avisosAdminCache
        .filter((a) => tipo === 'todos' || a.tipo === tipo)
        .filter((a) => dentroPeriodoAviso(a.criadoEm, periodo))
        .sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));

    if (!lista.length) {
        document.getElementById('listaAvisosAdmin').innerHTML = '<p class="mb-0 text-muted">Nenhum aviso para os filtros selecionados.</p>';
        return;
    }

    const html = `
        <table class="table admin-table table-hover align-middle">
            <thead><tr><th>Data</th><th>Tipo</th><th>Titulo</th><th>Descricao</th></tr></thead>
            <tbody>
                ${lista.map((a) => `
                    <tr>
                        <td>${new Date(a.criadoEm || 0).toLocaleString('pt-BR')}</td>
                        <td>${a.tipo || '-'}</td>
                        <td>${a.titulo || '-'}</td>
                        <td>${a.descricao || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('listaAvisosAdmin').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('avisos');

    avisosAdminCache = await AvisoService.listar();
    renderAvisosAdmin();

    document.getElementById('filtroTipoAviso').addEventListener('change', renderAvisosAdmin);
    document.getElementById('filtroPeriodoAviso').addEventListener('change', renderAvisosAdmin);
});
