function normalizarAdmin(valor) {
    return String(valor || '').replace(/\D/g, '');
}

function mascararTelefoneAdminCadastro(valor) {
    const digitos = normalizarAdmin(valor).slice(0, 11);
    if (digitos.length <= 10) {
        return digitos.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digitos.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function mascararCpfAdminCadastro(valor) {
    return normalizarAdmin(valor).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function exibirErroAdmin(msg) {
    const erro = document.getElementById('alertaCadastroAdmin');
    erro.textContent = msg;
    erro.classList.remove('d-none');
    document.getElementById('sucessoCadastroAdmin').classList.add('d-none');
}

function exibirSucessoAdmin(msg) {
    const ok = document.getElementById('sucessoCadastroAdmin');
    ok.textContent = msg;
    ok.classList.remove('d-none');
    document.getElementById('alertaCadastroAdmin').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = garantirAcessoAdmin();
    if (!usuario) return;

    configurarLayoutAdmin();
    configurarTopoAdmin(usuario);
    aplicarMenuAtivo('usuarios');

    const telefone = document.getElementById('telefone');
    const documento = document.getElementById('documento');
    const form = document.getElementById('formCadastroAdmin');

    telefone.addEventListener('input', () => { telefone.value = mascararTelefoneAdminCadastro(telefone.value); });
    documento.addEventListener('input', () => { documento.value = mascararCpfAdminCadastro(documento.value); });

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            exibirErroAdmin('As senhas nao coincidem.');
            return;
        }

        const existente = await buscarUsuarioPorEmail(email);
        if (existente) {
            exibirErroAdmin('E-mail ja cadastrado.');
            return;
        }

        const cidade = document.getElementById('cidade').value.trim();
        const estado = document.getElementById('estado').value.trim().toUpperCase();

        const payload = {
            nome,
            email,
            senha,
            perfil: 'admin',
            telefone: document.getElementById('telefone').value.trim(),
            documento: document.getElementById('documento').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value,
            cidade,
            estado,
            localizacao: `${cidade}, ${estado}`,
            entrada: new Date().toLocaleDateString('pt-BR'),
            ativo: true,
            criadoEm: new Date().toISOString(),
            aceiteTermos: { aceito: true, data: new Date().toISOString() },
            configuracoes: {
                notifCampanhas: true,
                notifAtualizacoes: true,
                notifRelatorios: false,
                privDoacoes: true,
                privContato: false
            }
        };

        const criado = await criarUsuario(payload);

        if (typeof AvisoService !== 'undefined') {
            await AvisoService.criar({
                tipo: 'cadastro_usuario',
                titulo: 'Novo administrador cadastrado',
                descricao: `${criado.nome} (${criado.email})`,
                referenciaTipo: 'usuario',
                referenciaId: criado.id,
                criadoEm: new Date().toISOString()
            });
        }

        form.reset();
        form.classList.remove('was-validated');
        exibirSucessoAdmin('Administrador cadastrado com sucesso.');
    });
});
