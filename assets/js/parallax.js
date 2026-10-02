/* Bruna Pazinato · paralaxe */

(function () {
  'use strict';

  var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!alvos.length) { return; }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  var CURSO = 44;

  function mover() {
    for (var i = 0; i < alvos.length; i++) {
      var caixa = alvos[i];
      var foto = caixa.firstElementChild;
      if (!foto) { continue; }

      var r = caixa.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) { continue; }

      var centro = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      if (centro < -1) { centro = -1; }
      if (centro > 1) { centro = 1; }

      foto.style.transform = 'translate3d(0, ' + (-centro * CURSO).toFixed(1) + 'px, 0)';
    }
  }

  document.addEventListener('scroll', mover, { passive: true, capture: true });
  window.addEventListener('resize', mover);
  window.addEventListener('load', mover);
  mover();
})();
