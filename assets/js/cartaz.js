/* Bruna Pazinato · temporada
 *
 * O selo tem três estados e nenhum deles precisa de alguém para virar a
 * chave: antes da estreia anuncia a data; a partir dela diz que está em
 * cartaz e a bolinha pulsa; passada a última sessão some sozinho, junto
 * do botão de ingresso — porque um "comprar ingresso" para temporada
 * encerrada é pior do que nenhum.
 *
 * As datas vêm do HTML, que por sua vez vem de dados/temporada.json.
 * Nada de data escrita aqui dentro.
 */

(function () {
  'use strict';

  var selos = Array.prototype.slice.call(document.querySelectorAll('[data-cartaz]'));
  if (!selos.length) { return; }

  function dia(txt) {
    var p = (txt || '').split('-');
    if (p.length !== 3) { return null; }
    /* meio-dia UTC: longe o bastante das duas bordas do dia para que
       nenhum fuso horário empurre a data para a véspera ou o seguinte */
    return Date.UTC(+p[0], +p[1] - 1, +p[2], 12);
  }

  var agora = Date.now();

  selos.forEach(function (selo) {
    var estreia = dia(selo.getAttribute('data-estreia'));
    var fim     = dia(selo.getAttribute('data-fim'));
    if (estreia === null || fim === null) { return; }

    /* a última sessão ainda está em cena na noite do dia marcado como
       fim, então o selo só cai na madrugada seguinte */
    if (agora > fim + 36e5 * 12) {
      var bloco = selo.closest('.cartaz-bloco');
      if (bloco) { bloco.remove(); return; }

      var caixa = selo.closest('.destaque') || document;
      var botao = caixa.querySelector('[data-cartaz-botao]');
      if (botao) { botao.remove(); }
      selo.remove();
      return;
    }

    if (agora >= estreia) {
      var texto = selo.querySelector('[data-cartaz-texto]');
      var ativo = selo.getAttribute('data-cartaz-ativo');
      if (texto && ativo) { texto.textContent = ativo; }
      selo.classList.add('cartaz--ativo');
    }
  });
})();
