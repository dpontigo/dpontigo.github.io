/* CUBALIBRE51 — script común a todas las páginas */
(function () {
  // Marquesina de videos (portada): duplica las tarjetas para que el desplazamiento sea continuo
  var t = document.getElementById('vtrack');
  if (t) t.innerHTML += t.innerHTML;

  // Visor de video: cualquier tarjeta con data-video="videos/...mp4" lo abre en grande y lo reproduce.
  // Delegación de eventos: las tarjetas de la marquesina están duplicadas con innerHTML.
  if (document.querySelector('[data-video]')) {
    var vm = document.createElement('div');
    vm.className = 'vmodal';
    vm.setAttribute('role', 'dialog');
    vm.setAttribute('aria-modal', 'true');
    vm.setAttribute('aria-label', 'Video');
    vm.setAttribute('aria-hidden', 'true');
    vm.innerHTML = '<button class="vmodal-close" type="button" aria-label="Cerrar video">✕</button>' +
      '<video controls playsinline preload="none" controlslist="nodownload"></video>' +
      '<button class="vmodal-play" type="button" aria-label="Reproducir">\u25B6\uFE0E</button>';
    document.body.appendChild(vm);
    var vv = vm.querySelector('video'), vx = vm.querySelector('.vmodal-close'), vlast = null,
        vpb = vm.querySelector('.vmodal-play');
    // Botón grande de play: se ve cuando el video está en pausa (por si el teléfono no lo deja arrancar solo)
    var vsync = function () { vm.classList.toggle('paused', vv.paused); };
    vv.addEventListener('play', vsync); vv.addEventListener('playing', vsync); vv.addEventListener('pause', vsync); vv.addEventListener('ended', vsync);
    vpb.addEventListener('click', function (e) { e.stopPropagation(); var p = vv.play(); if (p && p.catch) p.catch(function () {}); });

    var vopen = function (card) {
      var src = card.getAttribute('data-video');
      vlast = card;
      if (vv.getAttribute('src') !== src) {
        vv.setAttribute('src', src);
        vv.setAttribute('poster', card.getAttribute('data-poster') || '');
      }
      try { vv.currentTime = 0; } catch (e) {}
      vm.classList.add('open');
      vm.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      // play() dentro del mismo clic: el navegador permite que empiece solo y con sonido
      vm.classList.add('paused');
      var p = vv.play();
      if (p && p.catch) p.catch(function () { vsync(); });
      vx.focus({ preventScroll: true });
    };
    var vclose = function () {
      if (!vm.classList.contains('open')) return;
      vv.pause();
      try { vv.currentTime = 0; } catch (e) {}
      vm.classList.remove('open');
      vm.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      if (vlast) vlast.focus({ preventScroll: true });
    };

    document.addEventListener('click', function (e) {
      var card = e.target.closest && e.target.closest('[data-video]');
      if (card) { e.preventDefault(); vopen(card); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { vclose(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && !vm.classList.contains('open')) {
        var card = e.target.closest && e.target.closest('[data-video]');
        if (card) { e.preventDefault(); vopen(card); }
      }
    });
    vx.addEventListener('click', vclose);
    vm.addEventListener('click', function (e) { if (e.target === vm) vclose(); });
  }

  // Slider de la portada: una sola diapositiva visible a la vez (el CSS hace salir la anterior antes de que entre la nueva).
  // Avance automático cada 6 s, marcado por la barra del punto activo; se pausa con el ratón encima, con el foco dentro
  // o con la pestaña oculta. Flechas, puntos, teclado (← →) y deslizar en el móvil.
  var hero = document.querySelector('.hero-home'),
      sl = [].slice.call(document.querySelectorAll('.slide')),
      dt = [].slice.call(document.querySelectorAll('.dots button')),
      bg = [].slice.call(document.querySelectorAll('.hero-bg .bg'));
  if (sl.length > 1) {
    var i = 0, hov = false, foc = false;
    var go = function (n) {
      n = (n + sl.length) % sl.length;
      if (n === i) return;
      [sl, dt, bg].forEach(function (a) { if (a[i]) a[i].classList.remove('on'); });
      if (dt[i]) dt[i].removeAttribute('aria-current');
      i = n;
      [sl, dt, bg].forEach(function (a) { if (a[i]) { if (a === dt) void a[i].offsetWidth; a[i].classList.add('on'); } });
      if (dt[i]) dt[i].setAttribute('aria-current', 'true');
      sl.forEach(function (s, k) { s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); if ('inert' in s) s.inert = k !== i; });
    };
    var pz = function () { if (hero) hero.classList.toggle('paused', hov || foc || document.hidden); };
    sl.forEach(function (s, k) { s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); if ('inert' in s) s.inert = k !== i; });
    if (dt[0]) dt[0].setAttribute('aria-current', 'true');
    dt.forEach(function (b, n) {
      b.onclick = function () { go(n); };
      // la barra de progreso del punto activo marca el tiempo: al terminar, pasa a la siguiente
      b.addEventListener('animationend', function () { if (n === i) go(i + 1); });
    });
    var pv = document.querySelector('.hprev'), nx = document.querySelector('.hnext');
    if (pv) pv.onclick = function () { go(i - 1); };
    if (nx) nx.onclick = function () { go(i + 1); };
    if (hero) {
      hero.addEventListener('mouseenter', function () { hov = true; pz(); });
      hero.addEventListener('mouseleave', function () { hov = false; pz(); });
      hero.addEventListener('focusin', function () { foc = true; pz(); });
      hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) { foc = false; pz(); } });
      hero.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { go(i + 1); } else if (e.key === 'ArrowLeft') { go(i - 1); }
      });
      var x0 = null, y0 = 0;
      hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      hero.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) go(i + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }
    document.addEventListener('visibilitychange', pz);
  }

  // Menú móvil (hamburguesa)
  var hdr = document.querySelector('header'), mb = document.querySelector('.menu-btn');
  if (hdr && mb) {
    var menu = function (o) {
      hdr.classList.toggle('open', o);
      mb.setAttribute('aria-expanded', o);
      mb.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
    };
    mb.onclick = function () { menu(!hdr.classList.contains('open')); };
    document.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
    document.addEventListener('click', function (e) { if (hdr.classList.contains('open') && !hdr.contains(e.target)) menu(false); });
  }
})();
