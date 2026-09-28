/* =============================================================
   BRUNA PAZINATO
   showreel.js — o vídeo do Ato III

   Duas etapas, de propósito:

   1. Prévia. Ao entrar na tela o vídeo toca em silêncio, em laço.
      Mudo é obrigatório — navegador nenhum deixa tocar com som sem
      alguém pedir, e mesmo que deixasse, som que começa sozinho é
      falta de educação. Sai da tela, pausa: não adianta gastar
      banda com o que ninguém está vendo.

   2. Com som. Ao clicar, o vídeo recomeça do zero, com áudio, sem
      laço e com os controles nativos do navegador. Nada de player
      escrito à mão: teclado, tela cheia e legenda já vêm prontos,
      e funcionam melhor do que qualquer coisa que eu fizesse.

   Quem pediu menos movimento no sistema não recebe prévia: vê o
   primeiro quadro parado e decide.
   ============================================================= */

(function () {
  'use strict';

  var quadro = document.querySelector('[data-showreel]');
  if (!quadro) { return; }

  var video = quadro.querySelector('video');
  var convite = quadro.querySelector('.showreel__som');
  if (!video) { return; }

  var comSom = false;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. prévia muda ------------------------------------------- */

  if (!reduzido && 'IntersectionObserver' in window) {
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (comSom) {
          /* com som, quem manda é quem está assistindo — só pausa
             se o vídeo saiu inteiro da tela, para não tocar áudio
             de uma seção que ninguém está mais vendo */
          if (e.intersectionRatio === 0) { video.pause(); }
          return;
        }
        if (e.intersectionRatio >= 0.35) {
          var p = video.play();
          if (p && p.catch) { p.catch(function () {}); }
        } else if (e.intersectionRatio === 0) {
          video.pause();
        }
      });
    }, { threshold: [0, 0.35] });

    olho.observe(video);
  }

  /* --- 2. som ---------------------------------------------------- */

  function ligarSom() {
    if (comSom) { return; }
    comSom = true;

    quadro.classList.add('is-com-som');
    if (convite) { convite.hidden = true; }

    video.loop = false;
    video.controls = true;
    video.muted = false;
    video.currentTime = 0;

    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        /* se o navegador recusar, os controles ficam lá e a pessoa
           aperta play — o vídeo não fica preso no silêncio */
      });
    }
  }

  quadro.addEventListener('click', function (e) {
    if (comSom) { return; }   /* daqui em diante são os controles nativos */
    e.preventDefault();
    ligarSom();
  });

  if (convite) {
    convite.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ligarSom();
      }
    });
  }
})();
