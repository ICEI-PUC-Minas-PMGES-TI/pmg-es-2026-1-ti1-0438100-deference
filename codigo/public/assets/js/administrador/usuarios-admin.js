let usuariosAdminCache = [];
let modalUsuarioAdmin = null;

function normalizar(valor) {
    return String(valor || '').replace(/\D/g, '');
}

function mascararTelefoneAdmin(valor) {
    const digitos = normalizar(valor).slice(0, 11);
    if (digitos.length <= 10) {
        return digitos.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digitos.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function mascararCpfAdmin(valor) {
    return normalizar(valor).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function renderUsuariosAdmin() {
    const termo = document.getElementById('buscaUsuariosAdmin').value.trim().toLowerCase();
    const lista = usuariosAdminCache.filter((u) => `${u.nome || ''} ${u.email || ''}`.toLowerCase().includes(termo));

    const html = `
        <table class="table admin-table table-hover align-middle">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cidade</th><th></th></tr></thead>
            <tbody>
                ${lista.map((u) => `
                    <tr>
                        <td>${u.nome || '-'}</td>
                        <td>${u.email || '-'}</td>
                        <td>${u.perfil || 'usuario'}</td>
                        <td>${u.cidade || '-'}</td>
                        <td><button class="btn btn-sm btn-outline-success" data-detalhe-usuario="${u.id}">Detalhar</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('listaUsuariosAdmin').innerHTML = lista.length ? html : '<p class="mb-0 text-muted">Nenhum usuario encontrado.</p>';

    document.querySelectorAll('[data-detalhe-usuario]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-detalhe-usuario'));
            const usuario = usuariosAdminCache.find((u) => Number(u.id) === id);
            if (!usuario) return;

            document.getElementById('detalheUsuarioAdmin').innerHTML = `
                <p><strong>Nome:</strong> ${usuario.nome || '-'}</p>
                <p><strong>E-mail:</strong> ${usuario.email || '-'}</p>
                <p><strong>Perfil:</strong> ${usuario.perfil || '-'}</p>
                <p><strong>Telefone:</strong> ${usuario.telefone || '-'}</p>
                <p><strong>Documento:</strong> ${usuario.documento || '-'}</p>
                <p><strong>Localizacao:</strong> ${usuario.localizacao || '-'}</p>
                <p><strong>Cadastro:</strong> ${usuario.criadoEm || '-'}</p>
            `;
            modalUsuarioAdmin.show();
        });
    });
}

function exibirErroCadastro(msg) {
    console.error(msg);
}

function limparErroCadastro() {
    return;
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('usuarios');

    modalUsuarioAdmin = new bootstrap.Modal(document.getElementById('modalUsuarioAdmin'));

    usuariosAdminCache = await buscarUsuarios();
    renderUsuariosAdmin();

    document.getElementById('buscaUsuariosAdmin').addEventListener('input', renderUsuariosAdmin);

    limparErroCadastro();
});
