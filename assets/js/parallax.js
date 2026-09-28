/* =============================================================
   BRUNA PAZINATO
   parallax.js — a imagem do fim se move mais devagar que a página

   Sem background-attachment: fixed, que trava no iOS e no Android.
   Aqui a foto é um <img> de verdade dentro de uma janela com
   overflow: hidden, deslocada por transform conforme a janela
   passa por ela. Se o JS não rodar, a foto fica parada e certa.

   Quem pediu menos movimento no sistema não recebe nenhum.
   ============================================================= */

(function () {
  'use strict';

  var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!alvos.length) { return; }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  /* o quanto a foto anda, no total, de uma ponta à outra da tela */
  var CURSO = 70;

  function mover() {
    for (var i = 0; i < alvos.length; i++) {
      var caixa = alvos[i];
      var foto = caixa.firstElementChild;
      if (!foto) { continue; }

      var r = caixa.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) { continue; }

      /* -1 quando a janela ainda vem chegando, +1 quando já passou */
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
