(function(){
  'use strict';
  var KEY = 'medtime.theme';
  function apply(theme){
    document.documentElement.setAttribute('data-theme', theme);
  }
  function load(){
    try { return localStorage.getItem(KEY) || 'light'; } catch(e){ return 'light'; }
  }
  function save(theme){ try { localStorage.setItem(KEY, theme); } catch(e){} }
  function init(){
    var t = load();
    apply(t);
    var toggle = document.getElementById('theme-toggle');
    if(toggle){ toggle.checked = (t==='dark'); }
  }

  function toggleTheme(){
    var current = document.documentElement.getAttribute('data-theme') || load();
    var next = current === 'dark' ? 'light' : 'dark';
    apply(next); save(next);
    var toggle = document.getElementById('theme-toggle');
    if(toggle){ toggle.checked = (next==='dark'); }
  }
  document.addEventListener('DOMContentLoaded', init);
  window.MedTimeTheme = { toggle: toggleTheme, apply: apply };
})();