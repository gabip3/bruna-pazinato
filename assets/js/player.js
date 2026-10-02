/* Bruna Pazinato · player */

(function () {
  'use strict';

  var GATILHOS = '.faixa__link[data-video], .filme__link[data-video],' +
                 '.filme__link[data-filme], .palco__link[data-filme]';

  if (!document.querySelector(GATILHOS)) { return; }

  /* o player */

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

      var video = document.createElement('video');
      video.src = fonte.arquivo;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('title', titulo || 'Filme');
      quadro.appendChild(video);
      var promessa = video.play();

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
    void player.offsetWidth;
    root.classList.add('player-aberto');

    fechar.focus();
  }

  function encerrar() {
    if (player.hidden) { return; }
    root.classList.remove('player-aberto');
    if (anterior && anterior.focus) { anterior.focus(); }

    var tocando = quadro.querySelector('video');
    if (tocando) { tocando.pause(); }

    relogio = window.setTimeout(function () {
      player.hidden = true;
      quadro.innerHTML = '';
    }, 450);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest(GATILHOS) : null;
    if (!link) { return; }

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
