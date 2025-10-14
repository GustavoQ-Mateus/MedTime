(function(){
  'use strict';
  function byId(id){ return document.getElementById(id); }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function normalizePhone(v){ return (v||'').replace(/\D+/g,''); }
  function loadUsers(){ try { return JSON.parse(localStorage.getItem('medtime.users')||'[]'); } catch(e){ return []; } }
  function saveUsers(list){ localStorage.setItem('medtime.users', JSON.stringify(list||[])); }
  function setSession(s){ localStorage.setItem('medtime.session', JSON.stringify(s||{})); }
  function showMessage(el, text, type){ if(!el) return; el.textContent = text||''; el.style.color = type==='error'?'#DC2626':(type==='success'?'#16A34A':''); }
  function onRegisterSubmit(e){
    e.preventDefault();
        var form = e.currentTarget; var msg = qs('.form-messages', form);
        var firstName = byId('first-name')?.value?.trim();
        var lastName = byId('last-name')?.value?.trim();
        var birthDate = byId('birth-date')?.value?.trim();
  var phone = normalizePhone(byId('register-phone')?.value);
  var gender = byId('register-gender')?.value || '';
  var height = byId('register-height')?.value;
  var weight = byId('register-weight')?.value;
        var password = byId('register-password')?.value||'';
        var confirm = byId('confirm-password')?.value||'';
        if(!firstName || !lastName || !birthDate || !phone || !password || !confirm){ showMessage(msg, 'Preencha todos os campos obrigatórios.', 'error'); return; }
        if(password !== confirm){ showMessage(msg, 'As senhas não coincidem.', 'error'); return; }
        if(phone.length < 10){ showMessage(msg, 'Telefone inválido. Use DDD + número.', 'error'); return; }
        var users = loadUsers();
        if(users.some(function(u){ return normalizePhone(u.phone)===phone; })){ showMessage(msg, 'Telefone já cadastrado.', 'error'); return; }
        users.push({ 
          firstName:firstName, 
          lastName:lastName, 
          birthDate:birthDate, 
          phone:phone, 
          password:password,
          gender: gender || undefined,
          heightCm: height ? Number(height) : undefined,
          weightKg: weight ? Number(weight) : undefined
        });
        saveUsers(users);
        showMessage(msg, 'Cadastro realizado com sucesso.', 'success');
        setTimeout(function(){ window.location.href = 'index.html'; }, 500);
  }
  function onLoginSubmit(e){
    e.preventDefault();
        var form = e.currentTarget; var msg = qs('.form-messages', form);
        var phone = normalizePhone(byId('login-phone')?.value);
        var password = byId('login-password')?.value||'';
        if(!phone || !password){ showMessage(msg, 'Informe telefone e senha.', 'error'); return; }
        var user = loadUsers().find(function(u){ return normalizePhone(u.phone)===phone && u.password===password; });
        if(!user){ showMessage(msg, 'Credenciais inválidas.', 'error'); return; }
        setSession({ phone: phone, loggedAt: Date.now() });
  window.location.href = 'lista-medicamentos.html';
  }
  document.addEventListener('DOMContentLoaded', function(){
    var yearEl = byId('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
    var regForm = byId('registerForm') || byId('form-cadastro'); if(regForm) regForm.addEventListener('submit', onRegisterSubmit);
    var logForm = byId('loginForm') || byId('form-login'); if(logForm) logForm.addEventListener('submit', onLoginSubmit);
  });
})();
