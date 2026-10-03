/* Bruna Pazinato · temporada */

(function () {
  'use strict';

  var selo = document.querySelector('[data-cartaz]');
  if (!selo) { return; }

  function dia(txt) {
    var p = (txt || '').split('-');
    if (p.length !== 3) { return null; }
    return Date.UTC(+p[0], +p[1] - 1, +p[2], 12);
  }

  var estreia = dia(selo.getAttribute('data-estreia'));
  var fim     = dia(selo.getAttribute('data-fim'));
  if (estreia === null || fim === null) { return; }

  var agora = Date.now();

  var acabou = agora > fim + 36e5 * 12;

  if (acabou) {
    selo.remove();
    var botao = document.querySelector('[data-cartaz-botao]');
    if (botao) { botao.remove(); }
    return;
  }

  if (agora >= estreia) {
    var texto = selo.querySelector('[data-cartaz-texto]');
    if (texto) { texto.textContent = 'em cartaz no Rio'; }
    selo.classList.add('cartaz--ativo');
  }
})();
