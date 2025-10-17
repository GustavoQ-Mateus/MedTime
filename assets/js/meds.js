(function(){
  'use strict';
  var KEY = 'medtime.meds';
  function normalizePhone(v){ return (v||'').replace(/\D+/g,''); }
  function loadSession(){ try { return JSON.parse(localStorage.getItem('medtime.session')||'null'); } catch(e){ return null; } }
  function loadMeds(){ try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch(e){ return []; } }
  function saveMeds(list){ try { localStorage.setItem(KEY, JSON.stringify(list||[])); } catch(_){} }
  function byId(id){ return document.getElementById(id); }
  function qs(sel,root){ return (root||document).querySelector(sel); }

  // Date helpers (store as YYYY-MM-DD to avoid UTC shift)
  function isYMD(s){ return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function toYMD(d){ var y=d.getFullYear(); var m=String(d.getMonth()+1).padStart(2,'0'); var day=String(d.getDate()).padStart(2,'0'); return y+'-'+m+'-'+day; }
  function parseYMD(s){ if(!isYMD(s)) return null; var a=s.split('-'); return new Date(Number(a[0]), Number(a[1])-1, Number(a[2]), 0,0,0,0); }
  function localDateFromStored(v){ if(!v) return null; if(isYMD(v)) return parseYMD(v); var dt = new Date(v); if(isNaN(dt)) return null; return parseYMD(toYMD(dt)); }

  function freqToIntervalHours(freq){
    var map = { '1': 24, '2': 12, '3': 8, '4': 6 };
    return map[String(freq)] || 24;
  }

  function parseTimeHHMM(t){
    var m = /^(\d{1,2}):(\d{2})$/.exec(t||'');
    if(!m) return {h:8,m:0};
    var h = Math.max(0, Math.min(23, parseInt(m[1],10)));
    var mi = Math.max(0, Math.min(59, parseInt(m[2],10)));
    return {h:h,m:mi};
  }
  function atDateTime(d, time){
    var dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time.h, time.m, 0, 0);
    return dt;
  }
  function nextDoseFrom(now, firstDose, intervalHours, startDate, endDate){
    var start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), firstDose.getHours(), firstDose.getMinutes(),0,0);
    var end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23,59,59,999);
    if(now < start) return start; // next is the first dose
    if(now > end) return null; // finished
    var msInterval = intervalHours*60*60*1000;
    var elapsed = now - start;
    if(elapsed < 0) return start;
    var k = Math.floor(elapsed / msInterval) + 1;
    var next = new Date(start.getTime() + k*msInterval);
    if(next > end) return null;
    return next;
  }
  function fmtTime(dt){
    if(!dt) return '-';
    return dt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }
  function fmtCountdown(ms){
    if(ms <= 0) return 'agora';
    var s = Math.floor(ms/1000);
    var h = Math.floor(s/3600); s -= h*3600;
    var m = Math.floor(s/60); s -= m*60;
    if(h>0) return h+'h '+String(m).padStart(2,'0')+'m '+String(s).padStart(2,'0')+'s';
    return m+'m '+String(s).padStart(2,'0')+'s';
  }

  function renderList(){
    var sess = loadSession(); if(!sess) return;
    var list = loadMeds().filter(function(x){ return normalizePhone(x.ownerPhone)===normalizePhone(sess.phone); });
    var host = byId('med-list'); if(!host) return;
    host.innerHTML = '';
    if(list.length===0){ host.innerHTML = '<p class="card__meta">Nenhum medicamento cadastrado.</p>'; return; }
    var ul = document.createElement('ul'); ul.className='list';
    list.forEach(function(med, idx){
      var li = document.createElement('li'); li.className='card'; li.setAttribute('data-idx', idx);
      var title = document.createElement('h3'); title.className='card__title'; title.textContent = med.name;
      var meta = document.createElement('div'); meta.className='card__meta';
      var badge = document.createElement('span'); badge.className='badge';
      badge.textContent = med.dosageAmount + ' ' + med.dosageUnit + ' • '+ med.frequencyPerDay + 'x/dia';
      meta.appendChild(badge);
      var next = document.createElement('div'); next.className='card__meta'; next.innerHTML = 'Próxima dose: <span class="next-time">-</span> · <span class="countdown">-</span>';
      li.appendChild(title); li.appendChild(meta); li.appendChild(next);
      li.addEventListener('click', function(){ openMedActions(list[idx]); });
      ul.appendChild(li);
    });
    host.appendChild(ul);

    function updateCountdown(){
      var now = new Date();
      var items = ul.querySelectorAll('li.card');
      items.forEach(function(li){
        var i = parseInt(li.getAttribute('data-idx'),10);
        var med = list[i];
        var tObj = parseTimeHHMM(med.firstDoseTime);
        var interval = freqToIntervalHours(med.frequencyPerDay);
        var startDate = localDateFromStored(med.startDate) || new Date();
        var endDate = localDateFromStored(med.endDate) || new Date();
        var firstDose = atDateTime(startDate, tObj);
        var next = nextDoseFrom(now, firstDose, interval, startDate, endDate);
        var nextSpan = li.querySelector('.next-time');
        var cdSpan = li.querySelector('.countdown');
        if(!next){ nextSpan.textContent = '-'; cdSpan.textContent = 'finalizado'; return; }
        nextSpan.textContent = fmtTime(next);
        var ms = next.getTime() - now.getTime();
        cdSpan.textContent = fmtCountdown(ms);
      });
    }
    updateCountdown();
    if(window._medsCountdown) clearInterval(window._medsCountdown);
    window._medsCountdown = setInterval(updateCountdown, 1000);
  }
  function getQueryParam(name){
    var m = new RegExp('(?:^|[?&])'+name+'=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g,' ')) : '';
  }
  function openMedActions(med){
    closeModal();
    var wrap = document.createElement('div'); wrap.className='modal'; wrap.setAttribute('role','dialog'); wrap.setAttribute('aria-modal','true');
    var backdrop = document.createElement('div'); backdrop.className='modal__backdrop'; backdrop.addEventListener('click', closeModal);
    var dialog = document.createElement('div'); dialog.className='modal__dialog';
    var title = document.createElement('h3'); title.className='modal__title'; title.textContent = med.name;
    var body = document.createElement('div'); body.className='modal__body';
    var sd = localDateFromStored(med.startDate);
    var ed = localDateFromStored(med.endDate);
    body.innerHTML = '<div class="card__meta">'+
      (med.dosageAmount+' '+med.dosageUnit)+' • '+(med.frequencyPerDay)+'x/dia'+
      '<br>Janela: '+ (sd? sd.toLocaleDateString(): '-') +' — '+ (ed? ed.toLocaleDateString(): '-') +
    '</div>';
    var actions = document.createElement('div'); actions.className='modal__actions';
    var btnEdit = document.createElement('button'); btnEdit.className='btn btn--primary'; btnEdit.textContent='Editar';
    btnEdit.addEventListener('click', function(){ 
      try { window.location.href = 'cadastrar-medicamentos.html?edit='+ med.createdAt; } catch(_){}
    });
    var btnDel = document.createElement('button'); btnDel.className='btn btn--outline'; btnDel.textContent='Excluir';
    btnDel.addEventListener('click', function(){
      if(confirm('Excluir este medicamento?')){
        var sess = loadSession(); if(!sess) return;
        var meds = loadMeds();
        meds = meds.filter(function(x){ 
          return !(String(x.createdAt)===String(med.createdAt) && normalizePhone(x.ownerPhone)===normalizePhone(sess.phone));
        });
        saveMeds(meds);
        closeModal();
        renderList();
      }
    });
    var btnClose = document.createElement('button'); btnClose.className='btn btn--ghost'; btnClose.textContent='Fechar'; btnClose.addEventListener('click', closeModal);
    actions.appendChild(btnClose); actions.appendChild(btnDel); actions.appendChild(btnEdit);
    dialog.appendChild(title); dialog.appendChild(body); dialog.appendChild(actions);
    wrap.appendChild(backdrop); wrap.appendChild(dialog);
    document.body.appendChild(wrap);
    function onEsc(ev){ if(ev.key==='Escape'){ closeModal(); } }
    document.addEventListener('keydown', onEsc, { once: true });
  }
  function closeModal(){
    var m = document.querySelector('.modal'); if(m) m.remove();
  }

  function handleCreate(){
    var form = byId('medForm'); if(!form) return;
    var editId = getQueryParam('edit');
    // Prefill if editing
    if(editId){
      var sess = loadSession();
      var meds = loadMeds();
      var med = meds.find(function(x){ return String(x.createdAt)===String(editId) && normalizePhone(x.ownerPhone)===normalizePhone(sess && sess.phone); });
      if(med){
        byId('med-name').value = med.name || '';
        byId('med-dose-amount').value = med.dosageAmount != null ? med.dosageAmount : '';
        byId('med-dose-unit').value = med.dosageUnit || 'mg';
        byId('med-frequency').value = String(med.frequencyPerDay || '1');
        byId('med-first-time').value = med.firstDoseTime || '';
        var sds = med.startDate ? (isYMD(med.startDate) ? med.startDate : (function(){ var d=localDateFromStored(med.startDate); return d? toYMD(d): ''; })()) : '';
        var eds = med.endDate ? (isYMD(med.endDate) ? med.endDate : (function(){ var d=localDateFromStored(med.endDate); return d? toYMD(d): ''; })()) : '';
        byId('med-start').value = sds;
        byId('med-end').value = eds;
        var h1 = document.querySelector('.section__title'); if(h1) h1.textContent = 'Editar Medicamento';
      }
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var sess = loadSession(); if(!sess) return;
      var name = byId('med-name').value.trim();
      var amount = byId('med-dose-amount').value;
      var unit = byId('med-dose-unit').value;
      var freq = byId('med-frequency').value; // 1,2,3,4
      var firstTime = byId('med-first-time').value; // HH:MM
      var start = byId('med-start').value; // YYYY-MM-DD
      var end = byId('med-end').value; // YYYY-MM-DD
      if(!name || !amount || !unit || !freq || !firstTime || !start || !end){ alert('Preencha todos os campos.'); return; }
      var startDate = parseYMD(start);
      var endDate = parseYMD(end);
      if(endDate < startDate){ alert('Data de término deve ser após a data de início.'); return; }
      var meds = loadMeds();
      if(editId){
        meds = meds.map(function(x){
          if(String(x.createdAt)===String(editId) && normalizePhone(x.ownerPhone)===normalizePhone(sess.phone)){
            return Object.assign({}, x, {
              name: name,
              dosageAmount: Number(amount),
              dosageUnit: unit,
              frequencyPerDay: Number(freq),
              firstDoseTime: firstTime,
              startDate: start, // store as YYYY-MM-DD
              endDate: end // store as YYYY-MM-DD
            });
          }
          return x;
        });
      } else {
        meds.push({
          ownerPhone: sess.phone,
          name: name,
          dosageAmount: Number(amount),
          dosageUnit: unit,
          frequencyPerDay: Number(freq),
          firstDoseTime: firstTime,
          startDate: start,
          endDate: end,
          createdAt: Date.now()
        });
      }
      saveMeds(meds);
      try { window.location.href = 'lista-medicamentos.html'; } catch(_){}
    });

    var cancel = byId('med-cancel');
    if(cancel){ cancel.addEventListener('click', function(){ window.location.href='lista-medicamentos.html'; }); }
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderList();
    handleCreate();
  });
})();
