/* Bruna Pazinato · entrada dos blocos */

(function () {
  'use strict';

  var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!alvos.length) { return; }

  function revelar(el) {
    el.classList.add('is-in');
    var i = alvos.indexOf(el);
    if (i > -1) { alvos.splice(i, 1); }
  }

  function revelarTudo() {
    alvos.slice().forEach(revelar);
  }

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revelarTudo();
    return;
  }

  /* caminho 2: varredura por posição */

  function varrer() {
    var altura = window.innerHeight || document.documentElement.clientHeight;
    alvos.slice().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < altura * 0.94 && r.bottom > 0) { revelar(el); }
    });
    if (!alvos.length) { desligar(); }
  }

  var agendado = 0;

  function naRolagem() {
    if (agendado) { return; }
    agendado = window.setTimeout(function () {
      agendado = 0;
      varrer();
    }, 140);
  }

  function desligar() {
    window.removeEventListener('scroll', naRolagem);
    window.removeEventListener('resize', naRolagem);
    if (observador) { observador.disconnect(); }
  }

  /* caminho 1: intersectionobserver */

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) { return; }
      observador.unobserve(entrada.target);
      revelar(entrada.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -6% 0px'
  });

  alvos.forEach(function (el) { observador.observe(el); });

  window.addEventListener('scroll', naRolagem, { passive: true });
  window.addEventListener('resize', naRolagem);

  varrer();

  /* caminho 3: rede de segurança */

  window.setTimeout(function () {
    if (alvos.length === document.querySelectorAll('[data-reveal]').length) {
      revelarTudo();
      desligar();
    }
  }, 6000);
})();
