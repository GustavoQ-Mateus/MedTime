document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
  var primaryAction = document.querySelector('.hero__actions a, .auth-card__form input, .auth-card__form button');
  if (primaryAction) { try { primaryAction.focus({ preventScroll: true }); } catch (_) { primaryAction.focus(); } }
  var registerForm = document.getElementById('registerForm');
  var loginForm = document.getElementById('loginForm');
  if (registerForm) {
    var firstInput = registerForm.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Formulário de cadastro acionado');
    });
  }
  if (loginForm) {
    var firstInput = loginForm.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Formulário de login acionado');
    });
  }
});
