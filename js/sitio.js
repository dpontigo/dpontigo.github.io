/* PROHIBIDO OLVIDAR — script común a todas las páginas */
(function () {
  // Marquesina de videos (portada): duplica las tarjetas para que el desplazamiento sea continuo
  var t = document.getElementById('vtrack');
  if (t) t.innerHTML += t.innerHTML;

  // Slider de la portada (diapositivas + fondos + puntos)
  var sl = [].slice.call(document.querySelectorAll('.slide')),
      dt = [].slice.call(document.querySelectorAll('.dots button')),
      bg = [].slice.call(document.querySelectorAll('.hero-bg .bg'));
  if (sl.length > 1) {
    var i = 0;
    var go = function (n) {
      [sl, dt, bg].forEach(function (a) { if (a[i]) a[i].classList.remove('on'); });
      i = n;
      [sl, dt, bg].forEach(function (a) { if (a[i]) a[i].classList.add('on'); });
    };
    dt.forEach(function (b, n) { b.onclick = function () { go(n); }; });
    setInterval(function () { go((i + 1) % sl.length); }, 5000);
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
