/* =============================================================
   BRUNA PAZINATO
   cartaz.js — o selo de temporada se apaga sozinho

   O "em cartaz" é a única informação do site com prazo de validade.
   Em setembro o Piaf saiu de cartaz e o selo e o botão de ingresso
   tiveram de ser removidos na mão, num commit só para isso. Quem
   esquece de remover deixa no ar um convite para comprar ingresso de
   um espetáculo que fechou — que é pior do que não ter selo nenhum.

   Então a data manda, não a memória. O HTML traz a temporada em
   data-estreia e data-fim, e este script decide entre três estados:

     antes da estreia   "estreia 10 de outubro", ponto parado
     durante            "em cartaz", ponto pulsando
     depois             selo e botão saem do documento

   O HTML nasce no estado de ANTES, que é o verdadeiro no dia em que
   isto foi escrito. Assim a página continua correta e indexável sem
   JavaScript; o script só adianta o relógio.

   As datas são lidas como meio-dia UTC para o fuso não empurrar a
   virada para o dia anterior no Brasil.
   ============================================================= */

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

  /* a última sessão ainda conta como em cartaz: o fim vale até o
     término daquele dia */
  var acabou = agora > fim + 36e5 * 12;

  if (acabou) {
    selo.remove();
    var botao = document.querySelector('[data-cartaz-botao]');
    if (botao) { botao.remove(); }
    return;
  }

  if (agora >= estreia) {
    var texto = selo.querySelector('[data-cartaz-texto]');
    if (texto) { texto.textContent = 'em cartaz'; }
    selo.classList.add('cartaz--ativo');
  }
})();
