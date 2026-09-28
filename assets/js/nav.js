/* =============================================================
   BRUNA PAZINATO
   nav.js — menu mobile
   ============================================================= */

(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var menu   = document.getElementById('menu');
  var root   = document.documentElement;

  if (!burger || !menu) { return; }

  var isOpen = false;
  var timer  = 0;

  function setOpen(state) {
    isOpen = state;

    burger.setAttribute('aria-expanded', state ? 'true' : 'false');
    burger.setAttribute('aria-label', state ? 'Fechar menu' : 'Abrir menu');

    window.clearTimeout(timer);

    if (state) {
      menu.hidden = false;
      void menu.offsetWidth;            /* reflow: garante a transição */
      root.classList.add('menu-open');
    } else {
      root.classList.remove('menu-open');
      timer = window.setTimeout(function () {
        if (!isOpen) { menu.hidden = true; }
      }, 520);
    }
  }

  burger.addEventListener('click', function () {
    setOpen(!isOpen);
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('a')) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) {
      setOpen(false);
      burger.focus();
    }
  });
})();

/* --- tom do cabeçalho ----------------------------------------------
   Quando uma seção .claro passa por baixo do cabeçalho, ele troca de
   tom. Conta direto no scroll, sem requestAnimationFrame: a conta é
   barata e não pode depender do ciclo de pintura estar rodando. */

(function () {
  'use strict';

  var header = document.querySelector('.header');
  var claros = Array.prototype.slice.call(document.querySelectorAll('.claro'));
  if (!header || !claros.length) { return; }

  function tom() {
    var linha = header.offsetHeight / 2;
    var sobre = claros.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= linha && r.bottom >= linha;
    });
    header.classList.toggle('header--claro', sobre);
  }

  document.addEventListener('scroll', tom, { passive: true, capture: true });
  window.addEventListener('resize', tom);
  window.addEventListener('load', tom);
  tom();
})();
