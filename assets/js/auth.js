(function(){
  'use strict';

  function byId(id){ return document.getElementById(id); }
  function qs(sel, root){ return (root||document).querySelector(sel); }

  function normalizePhone(value){
    return (value||'').replace(/\D+/g,'');
  }

  function loadUsers(){
    try { return JSON.parse(localStorage.getItem('medtime.users')||'[]'); }
    catch(e){ return []; }
  }
  function saveUsers(list){
    localStorage.setItem('medtime.users', JSON.stringify(list||[]));
  }
  function setSession(session){
    localStorage.setItem('medtime.session', JSON.stringify(session||{}));
  }

  function showMessage(container, text, type){
    if(!container) return;
    container.textContent = text || '';
    container.style.color = type === 'error' ? '#DC2626' : (type==='success'?'#16A34A':'');
  }

  function onRegisterSubmit(e){
    e.preventDefault();
    var form = e.currentTarget;
    var msg = qs('.form-messages', form);

    var firstName = byId('first-name')?.value?.trim();
    var lastName = byId('last-name')?.value?.trim();
    var birthDate = byId('birth-date')?.value?.trim();
    var phone = normalizePhone(byId('register-phone')?.value);
    var password = byId('register-password')?.value||'';
    var confirm = byId('confirm-password')?.value||'';

    if(!firstName || !lastName || !birthDate || !phone || !password || !confirm){
      showMessage(msg, 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }
    if(password !== confirm){
      showMessage(msg, 'As senhas não coincidem.', 'error');
      return;
    }
    if(phone.length < 10){
      showMessage(msg, 'Telefone inválido. Use DDD + número.', 'error');
      return;
    }

    var users = loadUsers();
    var exists = users.some(function(u){ return normalizePhone(u.phone) === phone; });
    if(exists){
      showMessage(msg, 'Telefone já cadastrado.', 'error');
      return;
    }

    var newUser = { firstName:firstName, lastName:lastName, birthDate:birthDate, phone:phone, password:password };
    users.push(newUser);
    saveUsers(users);
    showMessage(msg, 'Cadastro realizado com sucesso.', 'success');

    // Redireciona para a tela principal após breve delay
    setTimeout(function(){ window.location.href = 'index.html'; }, 600);
  }

  function onLoginSubmit(e){
    e.preventDefault();
    var form = e.currentTarget;
    var msg = qs('.form-messages', form);

    var phone = normalizePhone(byId('login-phone')?.value);
    var password = byId('login-password')?.value||'';

    if(!phone || !password){
      showMessage(msg, 'Informe telefone e senha.', 'error');
      return;
    }

    var users = loadUsers();
    var user = users.find(function(u){ return normalizePhone(u.phone) === phone && u.password === password; });
    if(!user){
      showMessage(msg, 'Credenciais inválidas.', 'error');
      return;
    }

    setSession({ phone: phone, loggedAt: Date.now() });
    window.location.href = 'app.html';
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Ano no footer, para páginas que não carregam main.js
    var yearEl = byId('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    var regForm = byId('registerForm') || byId('form-cadastro');
    var logForm = byId('loginForm') || byId('form-login');
    if(regForm){ regForm.addEventListener('submit', onRegisterSubmit); }
    if(logForm){ logForm.addEventListener('submit', onLoginSubmit); }
  });
})();
