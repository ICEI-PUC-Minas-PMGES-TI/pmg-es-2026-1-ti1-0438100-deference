function obterSessaoSeguraAdmin() {
    try {
        return typeof obterSessao === 'function'
            ? obterSessao()
            : JSON.parse(localStorage.getItem('usuarioSessao'));
    } catch (_) {
        return null;
    }
}

function redirecionarInicioPorPerfil(usuario) {
    const perfil = usuario?.perfil;

    if (perfil === 'admin') {
        window.location.href = '../administrador/dashboard-admin.html';
        return;
    }

    window.location.href = '../index.html';
}

function garantirAcessoAdmin() {
    const usuario = obterSessaoSeguraAdmin();

    if (!usuario) {
        window.location.href = '../login/login.html';
        return null;
    }

    if (usuario.perfil !== 'admin') {
        redirecionarInicioPorPerfil(usuario);
        return null;
    }

    return usuario;
}

function configurarLayoutAdmin() {
    const btnToggle = document.getElementById('btnToggleSidebar');
    const btnClose = document.getElementById('btnCloseSidebar');
    const wrapper = document.getElementById('sidebarWrapper');
    const overlay = document.getElementById('sidebarOverlay');

    const abrir = () => {
        wrapper?.classList.add('show');
        overlay?.classList.add('show');
    };

    const fechar = () => {
        wrapper?.classList.remove('show');
        overlay?.classList.remove('show');
    };

    btnToggle?.addEventListener('click', abrir);
    btnClose?.addEventListener('click', fechar);
    overlay?.addEventListener('click', fechar);

    document.querySelectorAll('.sidebar-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                fechar();
            }
        });
    });
}

function configurarTopoAdmin(usuario) {
    const nome = document.getElementById('nomeAdminNav');
    const perfilLink = document.getElementById('linkPerfilAdmin');
    const btnSair = document.getElementById('btnSairAdmin');

    if (nome) {
        nome.textContent = usuario?.nome || 'Administrador';
    }

    if (perfilLink) {
        perfilLink.href = '../perfil/perfil.html';
    }

    btnSair?.addEventListener('click', (evento) => {
        evento.preventDefault();
        if (typeof logout === 'function') {
            logout();
        } else {
            localStorage.removeItem('usuarioSessao');
        }
        window.location.href = '../login/login.html';
    });
}

function aplicarMenuAtivo(menuAtual) {
    document.querySelectorAll('.sidebar-link').forEach((link) => {
        const menu = link.getAttribute('data-menu');
        link.classList.toggle('active', menu === menuAtual);
    });
}
