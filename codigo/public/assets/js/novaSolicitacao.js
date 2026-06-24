// Guarda em qual etapa o usuário está
var etapaAtual = 1;

// ── Avança para a próxima etapa ──
function avancar(proximaEtapa) {

  // Valida os campos da etapa atual antes de avançar
  var valido = validar(etapaAtual);

  if (valido == false) {
    return; // Para aqui se tiver campo vazio
  }

  // Esconde a etapa atual
  document.getElementById('etapa-' + etapaAtual).classList.add('escondido');

  // Marca o passo atual como concluído
  document.getElementById('passo-' + etapaAtual).classList.remove('ativo');
  document.getElementById('passo-' + etapaAtual).classList.add('concluido');

  // Pinta a linha entre os passos
  document.getElementById('linha-' + etapaAtual).classList.add('ativa');

  // Atualiza a variável
  etapaAtual = proximaEtapa;

  // Mostra a nova etapa
  document.getElementById('etapa-' + etapaAtual).classList.remove('escondido');

  // Marca o novo passo como ativo
  document.getElementById('passo-' + etapaAtual).classList.add('ativo');
}

// ── Volta para a etapa anterior ──
function voltar(etapaAnterior) {

  // Esconde a etapa atual
  document.getElementById('etapa-' + etapaAtual).classList.add('escondido');

  // Remove o ativo do passo atual
  document.getElementById('passo-' + etapaAtual).classList.remove('ativo');

  // Remove a linha ativa da etapa anterior
  document.getElementById('linha-' + etapaAnterior).classList.remove('ativa');

  // Atualiza a variável
  etapaAtual = etapaAnterior;

  // Mostra a etapa anterior
  document.getElementById('etapa-' + etapaAtual).classList.remove('escondido');

  // Volta o passo para ativo (remove concluido)
  document.getElementById('passo-' + etapaAtual).classList.remove('concluido');
  document.getElementById('passo-' + etapaAtual).classList.add('ativo');
}

// ── Validação dos campos de cada etapa ──
function validar(etapa) {
  var valido = true;

  if (etapa == 1) {
    var campanha = document.getElementById('campanha');
    var erroCampanha = document.getElementById('erro-campanha');

    if (campanha.value == '') {
      campanha.classList.add('campo-erro');
      erroCampanha.textContent = 'Selecione uma campanha para continuar.';
      valido = false;
    } else {
      campanha.classList.remove('campo-erro');
      erroCampanha.textContent = '';
    }
  }

  if (etapa == 2) {
    var nome = document.getElementById('nome');
    var erroNome = document.getElementById('erro-nome');

    if (nome.value.trim() == '') {
      nome.classList.add('campo-erro');
      erroNome.textContent = 'Digite seu nome completo.';
      valido = false;
    } else {
      nome.classList.remove('campo-erro');
      erroNome.textContent = '';
    }

    var telefone = document.getElementById('telefone');
    var erroTelefone = document.getElementById('erro-telefone');

    if (telefone.value.trim() == '') {
      telefone.classList.add('campo-erro');
      erroTelefone.textContent = 'Digite seu telefone para contato.';
      valido = false;
    } else {
      telefone.classList.remove('campo-erro');
      erroTelefone.textContent = '';
    }

    var endereco = document.getElementById('endereco');
    var erroEndereco = document.getElementById('erro-endereco');

    if (endereco.value.trim() == '') {
      endereco.classList.add('campo-erro');
      erroEndereco.textContent = 'Digite seu endereço completo.';
      valido = false;
    } else {
      endereco.classList.remove('campo-erro');
      erroEndereco.textContent = '';
    }
  }

  return valido;
}

// ── Máscara de telefone ──
document.getElementById('telefone').addEventListener('input', function() {
  var v = this.value.replace(/\D/g, '');

  if (v.length > 11) {
    v = v.slice(0, 11);
  }

  if (v.length >= 7) {
    v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
  } else if (v.length >= 3) {
    v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
  } else if (v.length > 0) {
    v = '(' + v;
  }

  this.value = v;
});

// ── Enviar o formulário ──
function enviar() {
  var familia = document.getElementById('familia');
  var erroFamilia = document.getElementById('erro-familia');
  var motivo = document.getElementById('motivo');
  var erroMotivo = document.getElementById('erro-motivo');
  var valido = true;

  if (familia.value.trim() == '') {
    familia.classList.add('campo-erro');
    erroFamilia.textContent = 'Informe o número de pessoas na família.';
    valido = false;
  } else {
    familia.classList.remove('campo-erro');
    erroFamilia.textContent = '';
  }

  if (motivo.value.trim() == '') {
    motivo.classList.add('campo-erro');
    erroMotivo.textContent = 'Conte-nos o motivo da sua solicitação.';
    valido = false;
  } else {
    motivo.classList.remove('campo-erro');
    erroMotivo.textContent = '';
  }

  if (valido == false) {
    return;
  }

  // Mostra o toast de sucesso
  var toast = document.getElementById('toast');
  toast.classList.add('show');

  setTimeout(function() {
    toast.classList.remove('show');
  }, 3500);

  // Limpa o formulário e volta para etapa 1
  setTimeout(function() {
    limpar();
  }, 500);
}

// ── Limpar tudo e voltar ao início ──
function limpar() {
  // Limpa os valores
  document.getElementById('campanha').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('telefone').value = '';
  document.getElementById('endereco').value = '';
  document.getElementById('familia').value = '';
  document.getElementById('motivo').value = '';

  // Remove bordas de erro
  var campos = ['campanha', 'nome', 'telefone', 'endereco', 'familia', 'motivo'];
  for (var i = 0; i < campos.length; i++) {
    document.getElementById(campos[i]).classList.remove('campo-erro');
  }

  // Esconde etapa atual e mostra etapa 1
  document.getElementById('etapa-' + etapaAtual).classList.add('escondido');
  document.getElementById('etapa-1').classList.remove('escondido');

  // Reseta a barra de progresso
  document.getElementById('passo-1').classList.remove('concluido');
  document.getElementById('passo-1').classList.add('ativo');
  document.getElementById('passo-2').classList.remove('ativo', 'concluido');
  document.getElementById('passo-3').classList.remove('ativo', 'concluido');
  document.getElementById('linha-1').classList.remove('ativa');
  document.getElementById('linha-2').classList.remove('ativa');

  etapaAtual = 1;
}