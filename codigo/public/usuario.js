
// =============================================
//  SOLIDARIZA — usuario.js
// =============================================
 
// ---------- DADOS INICIAIS (simulando usuário logado) ----------
const DEFAULT_USER = {
  nome: "Maria Silva",
  email: "maria.silva@email.com",
  telefone: "+55 11 98765-4321",
  localizacao: "Centro da Cidade, Região B",
  entrada: "15 de janeiro de 2026",
  configuracoes: {
    notif_campanhas: true,
    notif_atualizacoes: true,
    notif_relatorios: false,
    priv_doacoes: true,
    priv_contato: false,
  }
};
 
// Carrega usuário do localStorage ou usa o padrão
function getUser() {
  const saved = localStorage.getItem("solidariza_user");
  return saved ? JSON.parse(saved) : { ...DEFAULT_USER };
}
 
function saveUser(user) {
  localStorage.setItem("solidariza_user", JSON.stringify(user));
}
 
// ---------- RENDERIZA DADOS NA TELA ----------
function renderPerfil() {
  const user = getUser();
 
  document.getElementById("perfil-nome").textContent = user.nome;
  document.getElementById("info-email").textContent = user.email;
  document.getElementById("info-telefone").textContent = user.telefone;
  document.getElementById("info-localizacao").textContent = user.localizacao;
  document.getElementById("info-entrada").textContent = "Entrou em " + user.entrada;
 
  // Configurações
  const cfg = user.configuracoes;
  document.getElementById("cfg-notif-campanhas").checked   = cfg.notif_campanhas;
  document.getElementById("cfg-notif-atualizacoes").checked = cfg.notif_atualizacoes;
  document.getElementById("cfg-notif-relatorios").checked  = cfg.notif_relatorios;
  document.getElementById("cfg-priv-doacoes").checked      = cfg.priv_doacoes;
  document.getElementById("cfg-priv-contato").checked      = cfg.priv_contato;
}
 
// ---------- MODAL GENÉRICO ----------
function abrirModal(id) {
  document.getElementById(id).classList.add("modal-open");
}
 
function fecharModal(id) {
  document.getElementById(id).classList.remove("modal-open");
}
 
// Fecha modal ao clicar fora do conteúdo
document.addEventListener("click", function (e) {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) fecharModal(modal.id);
  });
});
 
// ---------- TOAST DE FEEDBACK ----------
function showToast(msg, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast toast-" + tipo + " toast-show";
  setTimeout(() => toast.classList.remove("toast-show"), 3000);
}
 
// ---------- EDITAR PERFIL ----------
function abrirEditarPerfil() {
  const user = getUser();
  document.getElementById("edit-nome").value       = user.nome;
  document.getElementById("edit-email").value      = user.email;
  document.getElementById("edit-telefone").value   = user.telefone;
  document.getElementById("edit-localizacao").value = user.localizacao;
  abrirModal("modal-editar");
}
 
function salvarPerfil() {
  const nome       = document.getElementById("edit-nome").value.trim();
  const email      = document.getElementById("edit-email").value.trim();
  const telefone   = document.getElementById("edit-telefone").value.trim();
  const localizacao = document.getElementById("edit-localizacao").value.trim();
 
  if (!nome || !email) {
    showToast("Nome e e-mail são obrigatórios.", "error");
    return;
  }
 
  const user = getUser();
  user.nome = nome;
  user.email = email;
  user.telefone = telefone;
  user.localizacao = localizacao;
  saveUser(user);
  renderPerfil();
  fecharModal("modal-editar");
  showToast("Perfil atualizado com sucesso!");
}
 
// ---------- ALTERAR SENHA ----------
function salvarSenha() {
  const atual   = document.getElementById("senha-atual").value;
  const nova    = document.getElementById("senha-nova").value;
  const confirm = document.getElementById("senha-confirmar").value;
 
  if (!atual || !nova || !confirm) {
    showToast("Preencha todos os campos.", "error");
    return;
  }
 
  // Senha atual simulada: "123456"
  const SENHA_ATUAL_SIMULADA = localStorage.getItem("solidariza_senha") || "123456";
  if (atual !== SENHA_ATUAL_SIMULADA) {
    showToast("Senha atual incorreta.", "error");
    return;
  }
 
  if (nova.length < 6) {
    showToast("A nova senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }
 
  if (nova !== confirm) {
    showToast("As senhas não coincidem.", "error");
    return;
  }
 
  localStorage.setItem("solidariza_senha", nova);
 
  // Limpa campos
  document.getElementById("senha-atual").value = "";
  document.getElementById("senha-nova").value = "";
  document.getElementById("senha-confirmar").value = "";
 
  fecharModal("modal-senha");
  showToast("Senha alterada com sucesso!");
}
 
// ---------- SALVAR CONFIGURAÇÕES ----------
function salvarConfiguracoes() {
  const user = getUser();
  user.configuracoes = {
    notif_campanhas:   document.getElementById("cfg-notif-campanhas").checked,
    notif_atualizacoes: document.getElementById("cfg-notif-atualizacoes").checked,
    notif_relatorios:  document.getElementById("cfg-notif-relatorios").checked,
    priv_doacoes:      document.getElementById("cfg-priv-doacoes").checked,
    priv_contato:      document.getElementById("cfg-priv-contato").checked,
  };
  saveUser(user);
  showToast("Configurações salvas com sucesso!");
}
 
// ---------- LOGOUT ----------
function logout() {
  abrirModal("modal-logout");
}
 
function confirmarLogout() {
  // Em produção redirecionaria para login
  showToast("Saindo...");
  setTimeout(() => {
    alert("Você saiu da conta. Em produção, redirecionaria para a tela de login.");
  }, 800);
  fecharModal("modal-logout");
}
 
// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", renderPerfil);