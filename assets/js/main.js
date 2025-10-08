// Protótipo MedTime - JS. Somente Front-end, sem integração real.
// TODO: Implementar integração backend, autenticação JWT, validação de campos, máscara de telefone, etc.

document.addEventListener('DOMContentLoaded', function () {
  // Foca automaticamente o primeiro campo dos formulários
  var registerForm = document.getElementById('registerForm');
  var loginForm = document.getElementById('loginForm');
  if (registerForm) {
    var firstInput = registerForm.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Formulário de cadastro acionado');
      // TODO: validateRegistration(formData)
      // Função de validação futura
      // Exemplo:
      // function validateRegistration(formData) {
      //   // Checar campos obrigatórios, formato do telefone, força da senha, etc.
      // }
    });
  }
  if (loginForm) {
    var firstInput = loginForm.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Formulário de login acionado');
      // TODO: validateLogin(formData)
      // Função de validação futura
      // Exemplo:
      // function validateLogin(formData) {
      //   // Checar formato do telefone, senha não vazia, etc.
      // }
    });
  }
  // TODO: Adicionar máscara/normalização simples do telefone
  // Exemplo: ao digitar, formatar para (xx) xxxxx-xxxx
});
