/* =============================================================
   BRUNA PAZINATO
   player.js — clipes e filmes

   Três coisas:
   1. a miniatura que segue o cursor sobre a lista (só no Ato I)
   2. o player em tela cheia
   3. duas origens de vídeo: YouTube (iframe) e arquivo daqui (<video>)

   Os links apontam para o vídeo de verdade. O JS intercepta o
   clique; sem JS, o clipe abre no YouTube e o filme abre o .mp4.
   O iframe ou o <video> só nasce quando alguém abre, e é destruído
   ao fechar — é o que interrompe o som.
   ============================================================= */

(function () {
  'use strict';

  function todos(seletor) {
    return Array.prototype.slice.call(document.querySelectorAll(seletor));
  }

  /* faixas são os clipes do Ato I; filmes são a Cena 3 do Ato II */
  var faixas = todos('.faixa__link[data-video]');
  var filmes = todos('.filme__link[data-video], .filme__link[data-filme]');
  var links  = faixas.concat(filmes);
  if (!links.length) { return; }

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

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      /* deixa passar cliques de "abrir em nova aba" */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) { return; }
      e.preventDefault();
      var rotulo = link.querySelector('.faixa__titulo') || link.querySelector('.filme__marca');
      abrir({ id: link.getAttribute('data-video'), arquivo: link.getAttribute('data-filme') },
            rotulo ? rotulo.textContent.trim() : '',
            link.getAttribute('data-formato') === 'vertical');
    });
  });

  fechar.addEventListener('click', encerrar);

  player.addEventListener('click', function (e) {
    if (e.target === player) { encerrar(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { encerrar(); }
  });
})();
