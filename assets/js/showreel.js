/* Bruna Pazinato · showreel */

(function () {
  'use strict';

  var quadro = document.querySelector('[data-showreel]');
  if (!quadro) { return; }

  var video = quadro.querySelector('video');
  var convite = quadro.querySelector('.showreel__som');
  if (!video) { return; }

  var comSom = false;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. prévia muda */

  if (!reduzido && 'IntersectionObserver' in window) {
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (comSom) {

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

  /* 2. som */

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

      });
    }
  }

  quadro.addEventListener('click', function (e) {
    if (comSom) { return; }
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
