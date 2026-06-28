let campanhasAdmin = [];

function calcularStatusCampanha(c) {
    const meta = Number(c.meta || 0);
    const arrecadado = Number(c.arrecadado || 0);

    if (meta > 0 && arrecadado >= meta) return 'concluida';
    return 'ativa';
}

function renderCampanhas() {
    const termo = document.getElementById('buscaCampanhasAdmin').value.trim().toLowerCase();
    const lista = campanhasAdmin.filter((c) => {
        const alvo = `${c.titulo || ''} ${c.categoria || ''} ${c.organizacao || ''}`.toLowerCase();
        return alvo.includes(termo);
    });

    const html = `
        <table class="table admin-table table-hover align-middle">
            <thead><tr><th>Titulo</th><th>Categoria</th><th>Status</th><th>Meta</th><th>Arrecadado</th><th></th></tr></thead>
            <tbody>
                ${lista.map((c) => `
                    <tr>
                        <td>${c.titulo || '-'}</td>
                        <td>${c.categoria || '-'}</td>
                        <td><span class="badge-status-admin ${calcularStatusCampanha(c)}">${calcularStatusCampanha(c)}</span></td>
                        <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(c.meta || 0))}</td>
                        <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(c.arrecadado || 0))}</td>
                        <td><a class="btn btn-sm btn-outline-success" href="../campanha/detalhe-campanha.html?id=${c.id}">Ver detalhe</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('listaCampanhasAdmin').innerHTML = lista.length ? html : '<p class="mb-0 text-muted">Nenhuma campanha encontrada.</p>';
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('campanhas');

    campanhasAdmin = await CampanhaService.listar();
    renderCampanhas();

    document.getElementById('buscaCampanhasAdmin').addEventListener('input', renderCampanhas);
});
