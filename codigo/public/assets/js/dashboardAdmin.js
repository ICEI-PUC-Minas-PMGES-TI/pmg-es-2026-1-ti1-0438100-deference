// Script dashboard admin

// ==================== DADOS FICTÍCIOS ====================
const dadosOriginais = {
    dia: {
        campanhasAtivas: 24,
        contribuicoes: 1245,
        solicitacoes: 8,
        beneficiados: 342,
        taxaSucesso: 87,
        usuariosAtivos: 156
    },
    mes: {
        campanhasAtivas: 24,
        contribuicoes: 12450,
        solicitacoes: 8,
        beneficiados: 1042,
        taxaSucesso: 87,
        usuariosAtivos: 156
    },
    ano: {
        campanhasAtivas: 24,
        contribuicoes: 145230,
        solicitacoes: 8,
        beneficiados: 12542,
        taxaSucesso: 87,
        usuariosAtivos: 156
    }
};

// Dados para gráficos
const dadosGraficos = {
    statusCampanhas: {
        labels: ['Ativas', 'Pausadas', 'Concluídas', 'Canceladas'],
        valores: [24, 8, 12, 3],
        cores: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444']
    },
    contribuicoes: {
        dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
        valores: [1800, 2100, 1950, 2400, 2200, 1600, 800],
        cor: '#2e7d32'
    }
};

// Campanhas recentes
const campanhasRecentes = [
    { nome: 'Cestas Básicas de Emergência', status: 'ativo', progresso: 85 },
    { nome: 'Doações para Educação', status: 'ativo', progresso: 62 },
    { nome: 'Campanha de Saúde', status: 'concluido', progresso: 100 },
    { nome: 'Ajuda Habitacional', status: 'pendente', progresso: 45 }
];

// Atividades recentes
const atividadesRecentes = [
    { tipo: 'criacao', titulo: 'Nova campanha criada', descricao: 'Cestas Básicas de Emergência', hora: '2 horas atrás' },
    { tipo: 'contribuicao', titulo: 'Contribuição recebida', descricao: 'R$ 500 - João Silva', hora: '4 horas atrás' },
    { tipo: 'usuario', titulo: 'Novo usuário registrado', descricao: 'Maria Santos', hora: '1 dia atrás' },
    { tipo: 'notificacao', titulo: 'Solicitação pendente', descricao: 'Aguarda análise', hora: '2 dias atrás' },
    { tipo: 'contribuicao', titulo: 'Contribuição recebida', descricao: 'R$ 250 - Pedro Costa', hora: '3 dias atrás' }
];

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sidebar mobile
    inicializarSidebarMobile();

    // Inicializar filtros de período
    inicializarFiltrosPeriodo();

    // Carregar dados iniciais (dia)
    atualizarDashboard('dia');

    // Preencher tabelas
    preencherTabelaCampanhasRecentes();
    preencherAtividadesRecentes();

    // Desenhar gráficos
    desenharGraficoStatusCampanhas();
    desenharGraficoContribuicoes();
});

// ==================== SIDEBAR MOBILE ====================

function inicializarSidebarMobile() {
    const btnToggle = document.getElementById('btnToggleSidebar');
    const btnClose = document.getElementById('btnCloseSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    btnToggle?.addEventListener('click', () => {
        document.querySelector('.sidebar-wrapper').classList.add('show');
        overlay.classList.add('show');
    });

    btnClose?.addEventListener('click', () => {
        document.querySelector('.sidebar-wrapper').classList.remove('show');
        overlay.classList.remove('show');
    });

    overlay?.addEventListener('click', () => {
        document.querySelector('.sidebar-wrapper').classList.remove('show');
        overlay.classList.remove('show');
    });

    // Links da sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Fechar sidebar em mobile
            if (window.innerWidth < 992) {
                document.querySelector('.sidebar-wrapper').classList.remove('show');
                overlay.classList.remove('show');
            }
        });
    });
}

// ==================== FILTROS DE PERÍODO ====================

function inicializarFiltrosPeriodo() {
    const radios = document.querySelectorAll('input[name="periodo"]');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const periodo = e.target.value;
            atualizarDashboard(periodo);
        });
    });
}

function atualizarDashboard(periodo) {
    const dados = dadosOriginais[periodo];

    // Atualizar KPIs com animação
    animarValor('kpiCampanhasAtivas', dados.campanhasAtivas);
    animarValor('kpiContribuicoes', 'R$ ' + formatarMoeda(dados.contribuicoes));
    animarValor('kpiSolicitacoes', dados.solicitacoes);
    animarValor('kpiBeneficiados', dados.beneficiados);
    animarValor('kpiTaxaSucesso', dados.taxaSucesso + '%');

    // Atualizar variações
    atualizarVariacoes(periodo);
}

function animarValor(elementId, novoValor) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.style.opacity = '0.5';
        setTimeout(() => {
            elemento.textContent = novoValor;
            elemento.style.opacity = '1';
        }, 150);
        elemento.style.transition = 'opacity 0.3s ease';
    }
}

function atualizarVariacoes(periodo) {
    const variacaoContribuicoes = document.getElementById('kpiContribuicoesVariacao');
    const variacaoBeneficiados = document.getElementById('kpiBeneficiadosVariacao');
    const variacaoUsuarios = document.getElementById('kpiUsuariosVariacao');

    const variacoes = {
        dia: { contrib: '+2% vs ontem', benef: '+5 hoje', users: '+1 hoje' },
        mes: { contrib: '+5% vs mês anterior', benef: '+15 nesta semana', users: '+8 este mês' },
        ano: { contrib: '+12% vs ano anterior', benef: '+1.200 este ano', users: '+45 este ano' }
    };

    if (variacaoContribuicoes) variacaoContribuicoes.textContent = variacoes[periodo].contrib;
    if (variacaoBeneficiados) variacaoBeneficiados.textContent = variacoes[periodo].benef;
    if (variacaoUsuarios) variacaoUsuarios.textContent = variacoes[periodo].users;
}

// ==================== FORMATAÇÃO ====================

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarProgresso(valor) {
    return Math.round(valor * 100 / 100);
}

// ==================== TABELAS ====================

function preencherTabelaCampanhasRecentes() {
    const tbody = document.getElementById('tabelaCampanhasRecentes');

    campanhasRecentes.forEach(campanha => {
        const badgeClasse = `badge-status ${campanha.status}`;
        const badgeTexto = {
            ativo: 'Ativa',
            concluido: 'Concluída',
            pendente: 'Pendente'
        }[campanha.status];

        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><strong>${campanha.nome}</strong></td>
            <td><span class="${badgeClasse}">${badgeTexto}</span></td>
            <td>
                <div class="progress" style="height: 24px;">
                    <div class="progress-bar" style="width: ${campanha.progresso}%">
                        ${campanha.progresso}%
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(linha);
    });
}

function preencherAtividadesRecentes() {
    const container = document.getElementById('atividadesRecentes');

    atividadesRecentes.forEach(atividade => {
        const iconeClasse = `atividade-icone ${atividade.tipo}`;
        const icone = {
            criacao: '<i class="bi bi-plus-circle"></i>',
            contribuicao: '<i class="bi bi-cash-coin"></i>',
            usuario: '<i class="bi bi-person-plus"></i>',
            notificacao: '<i class="bi bi-bell"></i>'
        }[atividade.tipo];

        const div = document.createElement('div');
        div.className = 'atividade-item';
        div.innerHTML = `
            <div class="${iconeClasse}">${icone}</div>
            <div class="atividade-conteudo">
                <div class="atividade-titulo">${atividade.titulo}</div>
                <div class="atividade-descricao">${atividade.descricao}</div>
                <div class="atividade-hora">${atividade.hora}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==================== GRÁFICOS ====================

function desenharGraficoStatusCampanhas() {
    const canvas = document.getElementById('graficoStatusCampanhas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dados = dadosGraficos.statusCampanhas;

    // Configurar tamanho do canvas com DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 300;

    // Dimensões
    const padding = 50;
    const espaco = (width - 2 * padding) / dados.labels.length;
    const alturaMaxima = height - 2 * padding;
    const maxValor = Math.max(...dados.valores);

    // Fundo suave
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, width, height);

    // Grid horizontal
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.font = 'normal 12px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * alturaMaxima / 4);
        const value = Math.round((maxValor * (4 - i)) / 4);
        ctx.beginPath();
        ctx.moveTo(padding - 5, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.fillText(value, padding - 10, y);
    }

    // Desenhar barras com gradiente
    dados.valores.forEach((valor, index) => {
        const x = padding + index * espaco + espaco / 4;
        const altura = (valor / maxValor) * alturaMaxima;
        const y = height - padding - altura;

        // Gradiente
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, dados.cores[index]);
        gradient.addColorStop(1, dados.cores[index] + '80');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, espaco / 2, altura);

        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(x, height - padding, espaco / 2, 2);

        // Valor no topo
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(valor, x + espaco / 4, y - 8);

        // Label
        ctx.fillStyle = '#6b7280';
        ctx.font = 'normal 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(dados.labels[index], x + espaco / 4, height - padding + 10);
    });

    // Linha base
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
}

function desenharGraficoContribuicoes() {
    const canvas = document.getElementById('graficoContribuicoes');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dados = dadosGraficos.contribuicoes;

    // Configurar tamanho do canvas com DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 300;

    // Dimensões
    const padding = 50;
    const espaco = (width - 2 * padding) / (dados.dias.length - 1);
    const alturaMaxima = height - 2 * padding;
    const maxValor = Math.max(...dados.valores);

    // Fundo suave
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, width, height);

    // Grid horizontal
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.font = 'normal 12px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * alturaMaxima / 4);
        const value = Math.round((maxValor * (4 - i)) / 4);
        ctx.beginPath();
        ctx.moveTo(padding - 5, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.fillText('R$ ' + (value / 100).toFixed(0), padding - 10, y);
    }

    // Calcular pontos
    const pontos = dados.valores.map((valor, index) => {
        const x = padding + index * espaco;
        const altura = (valor / maxValor) * alturaMaxima;
        const y = height - padding - altura;
        return { x, y, valor };
    });

    // Desenhar área preenchida com gradiente
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(46, 125, 50, 0.3)');
    gradient.addColorStop(1, 'rgba(46, 125, 50, 0.01)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(pontos[0].x, height - padding);
    pontos.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pontos[pontos.length - 1].x, height - padding);
    ctx.fill();

    // Desenhar linha com sombra
    ctx.strokeStyle = 'rgba(46, 125, 50, 0.2)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    pontos.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    ctx.strokeStyle = dados.cor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    pontos.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Desenhar pontos com sombra
    pontos.forEach((p, index) => {
        // Sombra do ponto
        ctx.fillStyle = 'rgba(46, 125, 50, 0.15)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
        ctx.fill();

        // Ponto principal
        ctx.fillStyle = dados.cor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Anel branco
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.stroke();

        // Valor acima do ponto
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('R$ ' + (p.valor / 100).toFixed(0), p.x, p.y - 12);
    });

    // Labels dos dias
    ctx.fillStyle = '#6b7280';
    ctx.font = 'normal 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    dados.dias.forEach((dia, index) => {
        ctx.fillText(dia, pontos[index].x, height - padding + 10);
    });

    // Linha base
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
}

// ==================== RESPONSIVIDADE DOS GRÁFICOS ====================

let timeoutResize;
window.addEventListener('resize', () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(() => {
        desenharGraficoStatusCampanhas();
        desenharGraficoContribuicoes();
    }, 300);
});