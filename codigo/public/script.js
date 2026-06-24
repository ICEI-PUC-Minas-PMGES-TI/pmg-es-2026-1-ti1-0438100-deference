const botoes = document.querySelectorAll(".valor-btn");

const valorDoacao = document.getElementById("valorDoacao");
const valorTotal = document.getElementById("valorTotal");

const confirmarBtn = document.getElementById("confirmarBtn");
const valorPersonalizado = document.getElementById("valorPersonalizado");

const numeroCartao = document.getElementById("numeroCartao");

const validade = document.getElementById("validadeCartao");

const cvv = document.getElementById("cvvCartao");

const nomeCartao = document.getElementById("nomeCartao");

let valorSelecionado = 0;

// CLIQUE NOS BOTÕES
botoes.forEach(botao => {

    botao.addEventListener("click", () => {

        // remove seleção anterior
        botoes.forEach(btn => {
            btn.style.background = "white";
            btn.style.color = "#333";
        });

        // destaca botão clicado
        botao.style.background = "#2e7d32";
        botao.style.color = "white";

        // pega valor
        valorSelecionado = botao.innerText;

        // atualiza resumo
        valorDoacao.innerText = valorSelecionado;
        valorTotal.innerText = valorSelecionado;

    });

});

// VALOR PERSONALIZADO

valorPersonalizado.addEventListener("input", function(){

    let valor = valorPersonalizado.value;

    if(valor !== ""){

        valorSelecionado = "R$ " + valor;

        valorDoacao.innerText = valorSelecionado;
        valorTotal.innerText = valorSelecionado;

        // remover seleção dos botões
        botoes.forEach(function(btn){
            btn.style.backgroundColor = "white";
            btn.style.color = "#333";
        });

    }

});


// BOTÃO CONFIRMAR
confirmarBtn.addEventListener("click", function(){

    // verificar valor
    if(valorSelecionado === ""){

        alert("Selecione um valor para doar!");
        return;
    }

    // verificar cartão
    if(numeroCartao.value === ""){

        alert("Preencha o número do cartão!");
        return;
    }

    // verificar validade
    if(validade.value === ""){

        alert("Preencha a validade!");
        return;
    }

    // verificar cvv
    if(cvv.value === ""){

        alert("Preencha o CVV!");
        return;
    }

    // verificar nome
    if(nomeCartao.value === ""){

        alert("Preencha o nome do cartão!");
        return;
    }

    // tudo certo
    alert("Doação confirmada ❤️");

});