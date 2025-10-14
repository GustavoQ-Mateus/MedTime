(function(){
  'use strict';
  function hasSession(){
    try {
      var s = JSON.parse(localStorage.getItem('medtime.session')||'null');
      return s && typeof s.phone === 'string' && s.phone.length > 0;
    } catch(e){ return false; }
  }
  function logout(){
    try { localStorage.removeItem('medtime.session'); } catch(_){}
    try { window.location.href = 'login.html'; } catch(_){}
  }
  if(!hasSession()){
    try { window.location.href = 'login.html'; } catch(_) {}
  }
  window.MedTimeSession = { logout: logout, hasSession: hasSession };
})();
