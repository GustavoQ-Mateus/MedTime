(function(){
  'use strict';
  function hasSession(){
    try {
      var s = JSON.parse(localStorage.getItem('medtime.session')||'null');
      return s && typeof s.phone === 'string' && s.phone.length > 0;
    } catch(e){ return false; }
  }
  if(!hasSession()){
    try { window.location.href = 'login.html'; } catch(_) {}
  }
})();
