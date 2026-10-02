/* Bruna Pazinato · inicialização */

(function () {
  'use strict';

  var root = document.documentElement;
  var iniciado = false;

  function comecar() {
    if (iniciado) { return; }
    iniciado = true;
    root.classList.add('is-ready');

    window.dispatchEvent(new Event('pagina:pronta'));
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(comecar, comecar);
  }

  window.addEventListener('load', comecar);
  window.setTimeout(comecar, 1400);
})();
