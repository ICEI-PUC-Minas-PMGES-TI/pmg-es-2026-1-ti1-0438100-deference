const botoes = document.querySelectorAll(".valor-btn");

const valorDoacao = document.getElementById("valorDoacao");
const valorTotal = document.getElementById("valorTotal");

const confirmarBtn = document.getElementById("confirmarBtn");

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


// BOTÃO CONFIRMAR
confirmarBtn.addEventListener("click", () => {

    if(valorSelecionado === 0){

        alert("Selecione um valor para doar!");

    }else{

        alert("Doação confirmada ❤️");

    }

});