/* =============================================================
   BRUNA PAZINATO
   galeria.js — visor de fotos de cena

   O conteúdo de cada galeria vem de um <script type="application/json">
   na própria página, com data-galeria batendo com o gatilho.
   Sem JavaScript, o gatilho continua sendo um link para a primeira
   foto — abre a imagem de verdade, não um link morto.
   ============================================================= */

(function () {
  'use strict';

  var visor = document.getElementById('visor');
  if (!visor || !document.querySelector('[data-galeria]')) { return; }

  var palco    = visor.querySelector('.visor__palco');
  var imagem   = palco.querySelector('img');
  var obra     = visor.querySelector('.visor__obra');
  var contador = visor.querySelector('.visor__contador');
  var credito  = visor.querySelector('.visor__credito');
  var fechar   = visor.querySelector('.visor__fechar');
  var anterior = visor.querySelector('.visor__nav--ant');
  var proximo  = visor.querySelector('.visor__nav--prox');
  var root     = document.documentElement;

  var atual = null;     /* dados da galeria aberta */
  var indice = 0;
  var focoAnterior = null;
  var relogio = 0;

  /* --- dados ---------------------------------------------------- */

  function dados(nome) {
    var fonte = document.querySelector('script.galeria-dados[data-galeria="' + nome + '"]');
    if (!fonte) { return null; }
    try { return JSON.parse(fonte.textContent); }
    catch (e) { return null; }
  }

  /* --- exibição ------------------------------------------------- */

  function preparar(caminho) {
    var pre = new Image();
    pre.src = caminho;
  }

  function mostrar(i) {
    if (!atual) { return; }
    var n = atual.fotos.length;
    indice = (i + n) % n;

    imagem.classList.remove('is-on');

    var caminho = atual.fotos[indice];
    var carga = new Image();
    carga.onload = function () {
      imagem.src = caminho;
      imagem.alt = atual.titulo + ' — foto ' + (indice + 1) + ' de ' + n;
      window.requestAnimationFrame(function () { imagem.classList.add('is-on'); });
      window.setTimeout(function () { imagem.classList.add('is-on'); }, 120);
    };
    carga.src = caminho;

    contador.innerHTML = '<b>' + String(indice + 1).padStart(2, '0') + '</b> / ' + String(n).padStart(2, '0');

    /* vizinhas prontas antes de serem pedidas */
    preparar(atual.fotos[(indice + 1) % n]);
    preparar(atual.fotos[(indice - 1 + n) % n]);
  }

  function abrir(nome, partida) {
    var d = dados(nome);
    if (!d || !d.fotos || !d.fotos.length) { return false; }

    atual = d;
    focoAnterior = document.activeElement;

    /* galeria de uma foto só não tem para onde navegar: sem setas e sem
       contagem, ela se apresenta como uma fotografia, não como carrossel */
    var unica = d.fotos.length < 2;
    anterior.hidden = unica;
    proximo.hidden  = unica;
    contador.hidden = unica;
    window.clearTimeout(relogio);

    obra.innerHTML = d.titulo + (d.sub ? '<i>' + d.sub + (d.ano ? ' · ' + d.ano : '') + '</i>' : '');
    credito.textContent = d.credito ? '© ' + d.credito : 'Crédito de fotografia a confirmar';

    /* frames de TV são pequenos: o visor não amplia além do original,
       senão a foto chega esticada na tela grande */
    palco.style.maxWidth = d.largura ? d.largura + 'px' : '';

    visor.hidden = false;
    void visor.offsetWidth;
    root.classList.add('visor-aberto');

    mostrar(partida || 0);
    fechar.focus();
    return true;
  }

  function encerrar() {
    if (visor.hidden) { return; }
    root.classList.remove('visor-aberto');
    imagem.classList.remove('is-on');
    if (focoAnterior && focoAnterior.focus) { focoAnterior.focus(); }
    relogio = window.setTimeout(function () {
      visor.hidden = true;
      imagem.removeAttribute('src');
      atual = null;
    }, 450);
  }

  /* --- gatilhos -------------------------------------------------- */

  /* delegação: a vitrine clona painéis depois deste script rodar,
     e clone com listener perdido vira link que navega para o .jpg */
  document.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) { return; }
    var g = e.target.closest ? e.target.closest('[data-galeria]') : null;
    if (!g) { return; }
    if (abrir(g.getAttribute('data-galeria'), 0)) { e.preventDefault(); }
  });

  anterior.addEventListener('click', function () { mostrar(indice - 1); });
  proximo.addEventListener('click', function () { mostrar(indice + 1); });
  fechar.addEventListener('click', encerrar);

  document.addEventListener('keydown', function (e) {
    if (visor.hidden) { return; }
    if (e.key === 'Escape')     { encerrar(); }
    if (e.key === 'ArrowLeft')  { mostrar(indice - 1); }
    if (e.key === 'ArrowRight') { mostrar(indice + 1); }
  });

  /* arrasto no celular */
  var partidaX = null;

  palco.addEventListener('touchstart', function (e) {
    partidaX = e.changedTouches[0].clientX;
  }, { passive: true });

  palco.addEventListener('touchend', function (e) {
    if (partidaX === null) { return; }
    var d = e.changedTouches[0].clientX - partidaX;
    if (Math.abs(d) > 48) { mostrar(indice + (d < 0 ? 1 : -1)); }
    partidaX = null;
  }, { passive: true });
})();
