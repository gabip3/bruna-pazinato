/* =============================================================
   BRUNA PAZINATO
   player.js — clipes e filmes

   Duas coisas:
   1. o player em tela cheia
   2. duas origens de vídeo: YouTube (iframe) e arquivo daqui (<video>)

   Os links apontam para o vídeo de verdade. O JS intercepta o
   clique; sem JS, o clipe abre no YouTube e o filme abre o .mp4.
   O iframe ou o <video> só nasce quando alguém abre, e é destruído
   ao fechar — é o que interrompe o som.
   ============================================================= */

(function () {
  'use strict';

  /* Faixas são os clipes do Ato I; filmes, a Cena 3 do Ato II; palcos, os
     vídeos de show do Ato III, que usam o painel da vitrine em vez de uma
     linha de lista — mesmo gatilho, mesmo player.

     A escuta é no documento, e não link a link. A vitrine clona os painéis
     para fazer o laço infinito, e quem amarra no elemento só pega os
     originais: dos 18 painéis do Ato III, 12 eram clones e não abriam
     nada. Delegar resolve, e resolve para qualquer coisa clonada depois. */
  var GATILHOS = '.faixa__link[data-video], .filme__link[data-video],' +
                 '.filme__link[data-filme], .palco__link[data-filme]';

  if (!document.querySelector(GATILHOS)) { return; }

  /* ---------------------------------------------------------
     O player
     --------------------------------------------------------- */

  var player = document.getElementById('player');
  if (!player) { return; }

  var quadro  = player.querySelector('.player__quadro');
  var fechar  = player.querySelector('.player__fechar');
  var root    = document.documentElement;
  var anterior = null;
  var relogio  = 0;

  function abrir(fonte, titulo, vertical) {
    if (!fonte || !fonte.id && !fonte.arquivo) { return; }

    anterior = document.activeElement;
    window.clearTimeout(relogio);

    quadro.innerHTML = '';

    if (fonte.arquivo) {
      /* filme hospedado aqui: <video> nativo, com os controles do
         próprio navegador. Nada de player customizado — teclado,
         legenda e tela cheia já vêm prontos e acessíveis. */
      var video = document.createElement('video');
      video.src = fonte.arquivo;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('title', titulo || 'Filme');
      quadro.appendChild(video);
      var promessa = video.play();
      /* alguns navegadores recusam autoplay com som; o controle fica lá */
      if (promessa && promessa.catch) { promessa.catch(function () {}); }
    } else {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + fonte.id +
                   '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = titulo || 'Clipe';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.setAttribute('allowfullscreen', '');
      quadro.appendChild(iframe);
    }

    player.classList.toggle('player--vertical', !!vertical);
    player.hidden = false;
    void player.offsetWidth;              /* reflow: garante a transição */
    root.classList.add('player-aberto');

    fechar.focus();
  }

  function encerrar() {
    if (player.hidden) { return; }
    root.classList.remove('player-aberto');
    if (anterior && anterior.focus) { anterior.focus(); }

    /* pausar antes de descartar: em alguns navegadores o áudio de um
       <video> removido do documento continua tocando por um instante */
    var tocando = quadro.querySelector('video');
    if (tocando) { tocando.pause(); }

    relogio = window.setTimeout(function () {
      player.hidden = true;
      quadro.innerHTML = '';              /* destruir o quadro é o que corta o som */
    }, 450);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest(GATILHOS) : null;
    if (!link) { return; }

    /* deixa passar cliques de "abrir em nova aba" */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) { return; }
    e.preventDefault();

    var rotulo = link.querySelector('.faixa__titulo') ||
                 link.querySelector('.filme__marca') ||
                 link.querySelector('.palco__obra');

    abrir({ id: link.getAttribute('data-video'), arquivo: link.getAttribute('data-filme') },
          rotulo ? rotulo.textContent.trim() : '',
          link.getAttribute('data-formato') === 'vertical');
  });

  fechar.addEventListener('click', encerrar);

  player.addEventListener('click', function (e) {
    if (e.target === player) { encerrar(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { encerrar(); }
  });
})();
