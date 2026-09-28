/* =============================================================
   BRUNA PAZINATO
   pronto.js — libera as entradas da página

   Marca <html> com .is-ready quando as fontes terminam de
   carregar, para a tipografia não trocar no meio da animação.
   Vai em todas as páginas: é o gatilho de toda coreografia.
   ============================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var iniciado = false;

  function comecar() {
    if (iniciado) { return; }
    iniciado = true;
    root.classList.add('is-ready');
    /* avisa quem depende de medir a página já com a fonte certa */
    window.dispatchEvent(new Event('pagina:pronta'));
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(comecar, comecar);
  }

  window.addEventListener('load', comecar);
  window.setTimeout(comecar, 1400);   /* rede de segurança */
})();
