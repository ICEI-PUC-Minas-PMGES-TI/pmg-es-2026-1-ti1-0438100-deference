const mapaImagensContribuicao = {
    alimentacao: '../../assets/images/alimentacao.jpg',
    saude: '../../assets/images/saude.jpg',
    educacao: '../../assets/images/educacao.jpg',
    moradia: '../../assets/images/moradia.jpg',
    vestuario: '../../assets/images/vestuario.jpg',
    'meio ambiente': '../../assets/images/meio-ambiente.jpg'
};

function acheImagemContribuicao(categoria) {
    const chave = String(categoria || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    return mapaImagensContribuicao[chave] || mapaImagensContribuicao.alimentacao;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(valor) || 0);
}

function extrairNumeroMoeda(texto) {
    if (!texto) return 0;

    const normalizado = texto
        .replace(/\s/g, '')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.');

    const valor = Number(normalizado);
    return Number.isFinite(valor) ? valor : 0;
}

function aplicarMascaraMoeda(texto) {
    const digitos = String(texto || '').replace(/\D/g, '');
    if (!digitos) return '';

    const valor = Number(digitos) / 100;
    return formatarMoeda(valor);
}

function aplicarMascaraCartao(texto) {
    const digitos = String(texto || '').replace(/\D/g, '').slice(0, 19);
    return digitos.replace(/(.{4})/g, '$1 ').trim();
}

function aplicarMascaraValidade(texto) {
    const digitos = String(texto || '').replace(/\D/g, '').slice(0, 4);
    if (digitos.length <= 2) return digitos;
    return digitos.slice(0, 2) + '/' + digitos.slice(2);
}

function validarCartaoLuhn(numero) {
    const digitos = String(numero || '').replace(/\D/g, '');
    if (digitos.length < 13 || digitos.length > 19) return false;

    let soma = 0;
    let dobrar = false;

    for (let i = digitos.length - 1; i >= 0; i -= 1) {
        let n = Number(digitos[i]);

        if (dobrar) {
            n *= 2;
            if (n > 9) n -= 9;
        }

        soma += n;
        dobrar = !dobrar;
    }

    return soma % 10 === 0;
}

function validarValidadeFutura(texto) {
    if (!/^\d{2}\/\d{2}$/.test(texto)) return false;

    const [mesTexto, anoTexto] = texto.split('/');
    const mes = Number(mesTexto);
    const ano = 2000 + Number(anoTexto);

    if (mes < 1 || mes > 12) return false;

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth() + 1;

    return ano > anoAtual || (ano === anoAtual && mes >= mesAtual);
}

document.addEventListener('DOMContentLoaded', async () => {
    const formContribuicao = document.getElementById('formContribuicao');
    const botoesValor = document.querySelectorAll('.valor-btn');

    const valorDoacao = document.getElementById('valorDoacao');
    const valorTotal = document.getElementById('valorTotal');
    const valorPersonalizado = document.getElementById('valorPersonalizado');

    const numeroCartao = document.getElementById('numeroCartao');
    const validadeCartao = document.getElementById('validadeCartao');
    const cvvCartao = document.getElementById('cvvCartao');
    const nomeCartao = document.getElementById('nomeCartao');

    const alertaContribuicao = document.getElementById('alertaContribuicao');
    const sucessoContribuicao = document.getElementById('sucessoContribuicao');

    const bannerContribuicao = document.getElementById('bannerContribuicao');
    const campanhaCategoria = document.getElementById('campanhaCategoria');
    const campanhaTituloBanner = document.getElementById('campanhaTituloBanner');
    const campanhaCategoriaResumo = document.getElementById('campanhaCategoriaResumo');
    const campanhaTituloResumo = document.getElementById('campanhaTituloResumo');
    const campanhaDescricao = document.getElementById('campanhaDescricao');
    const campanhaImagem = document.getElementById('campanhaImagem');
    const textoArrecadado = document.getElementById('textoArrecadado');
    const textoPorcentagem = document.getElementById('textoPorcentagem');
    const barraCampanha = document.getElementById('barraCampanha');

    if (!formContribuicao || !valorPersonalizado) return;

    let valorSelecionado = 0;
    let campanhaAtual = null;

    function mostrarErro(mensagem) {
        if (!alertaContribuicao) return;
        alertaContribuicao.textContent = mensagem;
        alertaContribuicao.classList.remove('d-none');
        if (sucessoContribuicao) sucessoContribuicao.classList.add('d-none');
    }

    function mostrarSucesso(mensagem) {
        if (!sucessoContribuicao) return;
        sucessoContribuicao.textContent = mensagem;
        sucessoContribuicao.classList.remove('d-none');
        if (alertaContribuicao) alertaContribuicao.classList.add('d-none');
    }

    function limparAlertas() {
        if (alertaContribuicao) alertaContribuicao.classList.add('d-none');
        if (sucessoContribuicao) sucessoContribuicao.classList.add('d-none');
    }

    function atualizarResumoValor(valor) {
        valorDoacao.textContent = formatarMoeda(valor);
        valorTotal.textContent = formatarMoeda(valor);
    }

    function limparSelecaoBotoes() {
        botoesValor.forEach((botao) => {
            botao.style.background = '#fff';
            botao.style.color = '#333';
            botao.style.borderColor = '#e9ecef';
        });
    }

    function destacarBotaoSelecionado(botaoSelecionado) {
        limparSelecaoBotoes();
        botaoSelecionado.style.background = '#2e7d32';
        botaoSelecionado.style.color = '#fff';
        botaoSelecionado.style.borderColor = '#2e7d32';
    }

    function atualizarResumoCampanha(campanha) {
        const arrecadado = Number(campanha.arrecadado) || 0;
        const meta = Number(campanha.meta) || 0;
        const porcentagem = meta > 0 ? Math.min((arrecadado / meta) * 100, 100) : 0;

        if (textoArrecadado) {
            textoArrecadado.textContent = formatarMoeda(arrecadado) + ' arrecadados';
        }

        if (textoPorcentagem) {
            textoPorcentagem.textContent = porcentagem.toFixed(0) + '%';
        }

        if (barraCampanha) {
            barraCampanha.style.width = porcentagem.toFixed(0) + '%';
        }
    }

    function setInvalido(campo, mensagem) {
        if (!campo) return;
        campo.classList.add('is-invalid');

        const feedback = campo.parentElement?.querySelector('.invalid-feedback') || campo.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = mensagem;
        }
    }

    function limparValidacoes() {
        [valorPersonalizado, numeroCartao, validadeCartao, cvvCartao, nomeCartao].forEach((campo) => {
            if (campo) campo.classList.remove('is-invalid');
        });
    }

    function validarFormulario() {
        limparValidacoes();

        let valido = true;

        if (!(valorSelecionado > 0)) {
            setInvalido(valorPersonalizado, 'Informe um valor maior que R$ 0,00.');
            valido = false;
        }

        if (!validarCartaoLuhn(numeroCartao.value)) {
            setInvalido(numeroCartao, 'Informe um numero de cartao valido.');
            valido = false;
        }

        if (!validarValidadeFutura(validadeCartao.value)) {
            setInvalido(validadeCartao, 'Informe uma validade futura no formato MM/AA.');
            valido = false;
        }

        if (!/^\d{3,4}$/.test(cvvCartao.value)) {
            setInvalido(cvvCartao, 'Informe um CVV com 3 ou 4 digitos.');
            valido = false;
        }

        const nomeNormalizado = nomeCartao.value.trim();
        if (nomeNormalizado.length < 3) {
            setInvalido(nomeCartao, 'Informe o nome impresso no cartao.');
            valido = false;
        }

        return valido;
    }

    function preencherCampanhaNaTela(campanha) {
        const imagem = campanha.imagem || acheImagemContribuicao(campanha.categoria);

        if (bannerContribuicao) {
            bannerContribuicao.style.backgroundImage = "url('" + imagem + "')";
        }

        if (campanhaCategoria) campanhaCategoria.textContent = campanha.categoria || 'Campanha';
        if (campanhaTituloBanner) campanhaTituloBanner.textContent = campanha.titulo || 'Sua contribuicao transforma vidas.';
        if (campanhaCategoriaResumo) campanhaCategoriaResumo.textContent = campanha.categoria || 'Campanha';
        if (campanhaTituloResumo) campanhaTituloResumo.textContent = campanha.titulo || 'Campanha';
        if (campanhaDescricao) campanhaDescricao.textContent = campanha.descricao || '';

        if (campanhaImagem) {
            campanhaImagem.src = imagem;
            campanhaImagem.alt = campanha.titulo || 'Imagem da campanha';
        }

        atualizarResumoCampanha(campanha);
    }

    const params = new URLSearchParams(window.location.search);
    const campanhaId = params.get('id');

    if (!campanhaId) {
        mostrarErro('Campanha não identificada. Volte para a lista de campanhas e tente novamente.');
        return;
    }

    try {
        campanhaAtual = await CampanhaService.buscarPorId(campanhaId);
        preencherCampanhaNaTela(campanhaAtual);
    } catch (erro) {
        console.error('Erro ao carregar campanha para contribuicao:', erro);
        mostrarErro('Não foi possível carregar os dados da campanha.');
        return;
    }

    atualizarResumoValor(0);

    botoesValor.forEach((botao) => {
        botao.addEventListener('click', () => {
            const valorBotao = Number(botao.getAttribute('data-valor')) || 0;
            valorSelecionado = valorBotao;

            valorPersonalizado.value = formatarMoeda(valorBotao);
            valorPersonalizado.classList.remove('is-invalid');

            destacarBotaoSelecionado(botao);
            atualizarResumoValor(valorSelecionado);
        });
    });

    valorPersonalizado.addEventListener('input', (evento) => {
        const valorMascarado = aplicarMascaraMoeda(evento.target.value);
        valorPersonalizado.value = valorMascarado;
        valorSelecionado = extrairNumeroMoeda(valorMascarado);

        valorPersonalizado.classList.remove('is-invalid');
        limparSelecaoBotoes();
        atualizarResumoValor(valorSelecionado);
    });

    numeroCartao.addEventListener('input', () => {
        numeroCartao.value = aplicarMascaraCartao(numeroCartao.value);
        numeroCartao.classList.remove('is-invalid');
    });

    validadeCartao.addEventListener('input', () => {
        validadeCartao.value = aplicarMascaraValidade(validadeCartao.value);
        validadeCartao.classList.remove('is-invalid');
    });

    cvvCartao.addEventListener('input', () => {
        cvvCartao.value = cvvCartao.value.replace(/\D/g, '').slice(0, 4);
        cvvCartao.classList.remove('is-invalid');
    });

    nomeCartao.addEventListener('input', () => {
        nomeCartao.value = nomeCartao.value.replace(/[^A-Za-zÀ-ÿ'\s]/g, '');
        nomeCartao.classList.remove('is-invalid');
    });

    formContribuicao.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        limparAlertas();

        if (!validarFormulario()) return;

        const usuarioSessaoTexto = localStorage.getItem('usuarioSessao');
        let usuarioSessao = null;

        try {
            usuarioSessao = usuarioSessaoTexto ? JSON.parse(usuarioSessaoTexto) : null;
        } catch (_) {
            usuarioSessao = null;
        }

        const contribuicao = {
            campanhaId: Number(campanhaId),
            usuarioId: usuarioSessao?.id || null,
            valor: valorSelecionado,
            criadoEm: new Date().toISOString(),
            pagamento: {
                cartaoFinal: numeroCartao.value.replace(/\D/g, '').slice(-4),
                validade: validadeCartao.value,
                nomeTitular: nomeCartao.value.trim()
            }
        };

        try {
            await registrarContribuicao(contribuicao);

            const arrecadadoAtual = Number(campanhaAtual.arrecadado) || 0;
            const doadoresAtuais = Number(campanhaAtual.doadores) || 0;

            campanhaAtual = {
                ...campanhaAtual,
                arrecadado: arrecadadoAtual + valorSelecionado,
                doadores: doadoresAtuais + 1
            };

            await CampanhaService.atualizar(campanhaAtual.id, campanhaAtual);

            if (
                typeof SolicitacaoService !== 'undefined' &&
                campanhaAtual.solicitacaoId &&
                Number(campanhaAtual.arrecadado) >= Number(campanhaAtual.meta)
            ) {
                try {
                    const solicitacaoVinculada = await SolicitacaoService.buscarPorId(campanhaAtual.solicitacaoId);

                    if (solicitacaoVinculada.status !== 'concluida') {
                        await SolicitacaoService.atualizar(solicitacaoVinculada.id, {
                            ...solicitacaoVinculada,
                            status: 'concluida',
                            atualizadoEm: new Date().toISOString()
                        });
                    }
                } catch (erroSolicitacao) {
                    console.error('Erro ao atualizar status da solicitacao:', erroSolicitacao);
                }
            }

            if (typeof AvisoService !== 'undefined') {
                await AvisoService.criar({
                    tipo: 'contribuicao_realizada',
                    titulo: 'Nova contribuicao registrada',
                    descricao: `${formatarMoeda(valorSelecionado)} para campanha ${campanhaAtual.titulo || campanhaAtual.id}`,
                    referenciaTipo: 'campanha',
                    referenciaId: campanhaAtual.id,
                    criadoEm: new Date().toISOString()
                });
            }

            atualizarResumoCampanha(campanhaAtual);
            mostrarSucesso('Doacao registrada com sucesso! Obrigado por contribuir.');

            formContribuicao.reset();
            limparValidacoes();
            limparSelecaoBotoes();

            valorSelecionado = 0;
            atualizarResumoValor(0);
        } catch (erro) {
            console.error('Erro ao registrar contribuicao:', erro);
            mostrarErro('Não foi possível concluir a doacao agora. Tente novamente em instantes.');
        }
    });
});

