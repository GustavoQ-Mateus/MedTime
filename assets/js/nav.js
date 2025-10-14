(function(){
  'use strict';
  function setActive(){
    var nav = document.querySelector('.topbar__nav');
    if(!nav) return;
    var here = location.pathname.split('/').pop().toLowerCase();
    nav.querySelectorAll('a[href]').forEach(function(a){
      var href = (a.getAttribute('href')||'').toLowerCase();
      if(href === here){
        a.classList.add('is-active');
        a.setAttribute('aria-current','page');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', setActive);
})();
