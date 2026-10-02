/* Bruna Pazinato · menu */

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
      void menu.offsetWidth;
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

/* tom do cabeçalho */

(function () {
  'use strict';

  var header = document.querySelector('.header');
  if (!header) { return; }

  /* A lista de seções claras pode estar vazia — há páginas sem nenhuma.
     Antes a função inteira desistia aqui, e com ela ia embora também o
     fundo do header, que toda página precisa. */
  var claros = Array.prototype.slice.call(document.querySelectorAll('.claro'));

  function tom() {
    /* FUNDO AO ROLAR.

       O header é fixo e nasce sem fundo, de propósito: no alto de cada
       página ele flutua sobre a fotografia. Mas assim que a página anda,
       o conteúdo passa POR BAIXO dele e aparece através — o que se via
       como "o texto por cima do header" era na verdade texto atrás de
       uma faixa invisível.

       Doze pixels de folga para a barra não piscar a cada toque de
       rolagem no celular. */
    header.classList.toggle('header--rolado', window.scrollY > 12);

    if (!claros.length) { return; }
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
