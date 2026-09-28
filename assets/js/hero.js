/* =============================================================
   BRUNA PAZINATO
   hero.js — contorno do nome sobre a fotografia

   Onde a fotografia atravessa as últimas letras de PAZINATO, um
   contorno fino continua o desenho por cima da imagem.
   --cut = distância entre o início do nome e a borda da foto.

   Só a home tem hero; nas outras páginas isso sai de cena sozinho.
   ============================================================= */

(function () {
  'use strict';

  var figura = document.querySelector('.hero__figure');
  var linha  = document.querySelector('.name__line--last');
  var ghost  = document.querySelector('.name__ghost');

  if (!figura || !linha || !ghost) { return; }

  var pequeno = window.matchMedia('(max-width: 900px)');

  function sincronizar() {
    if (pequeno.matches) {
      ghost.style.removeProperty('--cut');
      return;
    }
    var f = figura.getBoundingClientRect();
    var l = linha.getBoundingClientRect();
    ghost.style.setProperty('--cut', Math.max(0, Math.round(f.left - l.left)) + 'px');
  }

  var quadro = 0;

  function agendar() {
    window.cancelAnimationFrame(quadro);
    quadro = window.requestAnimationFrame(sincronizar);
    /* rAF pode não rodar em aba oculta; garante a medida de todo jeito */
    window.setTimeout(sincronizar, 200);
  }

  window.addEventListener('resize', agendar, { passive: true });
  window.addEventListener('orientationchange', agendar);
  window.addEventListener('pagina:pronta', sincronizar);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sincronizar, function () {});
  }

  sincronizar();
})();
