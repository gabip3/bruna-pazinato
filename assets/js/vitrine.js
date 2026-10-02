/* Bruna Pazinato · vitrine */

(function () {
  'use strict';

  var pistas = Array.prototype.slice.call(document.querySelectorAll('.vitrine__pista, [data-pista]'));
  if (!pistas.length) { return; }

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pistas.forEach(montar);

  function montar(pista) {

    var originais = Array.prototype.slice.call(pista.children);
    if (!originais.length) { return; }

    /* laço infinito */

    var infinito = false;
    var semLaco = pista.getAttribute('data-laco') === 'nao';
    var posicionado = false;

    function clonar() {
      var antes = document.createDocumentFragment();
      var depois = document.createDocumentFragment();
      originais.forEach(function (el) {
        var a = el.cloneNode(true);
        var d = el.cloneNode(true);
        a.setAttribute('aria-hidden', 'true');
        d.setAttribute('aria-hidden', 'true');
        antes.appendChild(a);
        depois.appendChild(d);
      });
      pista.insertBefore(antes, pista.firstChild);
      pista.appendChild(depois);
      infinito = true;
    }

    function larguraBloco() {
      return pista.scrollWidth / 3;
    }

    function centralizar() {
      pista.scrollLeft = larguraBloco();
    }

    var coluna = pista.closest('.programa__coluna')
              || (pista.closest('.vitrine') || pista).parentElement;

    function avaliar() {
      var cabeTudo = pista.scrollWidth <= pista.clientWidth + 4;
      if (!infinito && !cabeTudo && !semLaco) { clonar(); centralizar(); }

      if (coluna && !infinito) { coluna.classList.toggle('cabe-tudo', cabeTudo); }

      if (!posicionado && pista.getAttribute('data-comeca') === 'fim') {
        pista.scrollLeft = pista.scrollWidth;
        posicionado = true;
      }
    }

    function envolver() {
      if (!infinito) { return; }
      var bloco = larguraBloco();
      if (pista.scrollLeft < bloco * 0.5) {
        pista.scrollLeft += bloco;
      } else if (pista.scrollLeft > bloco * 1.5) {
        pista.scrollLeft -= bloco;
      }
    }

    pista.addEventListener('scroll', envolver, { passive: true });
    window.addEventListener('resize', function () {
      window.setTimeout(avaliar, 120);
    });

    window.setTimeout(avaliar, 200);
    window.addEventListener('load', avaliar);

    /* arrastar com o mouse */

    var arrastando = false;
    var capturou   = false;
    var partidaX = 0;
    var partidaScroll = 0;
    var andou = 0;

    function engolirClique(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    pista.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') { return; }
      arrastando = true;
      capturou = false;
      andou = 0;
      partidaX = e.clientX;
      partidaScroll = pista.scrollLeft;
    });

    pista.addEventListener('pointermove', function (e) {
      if (!arrastando) { return; }
      var d = e.clientX - partidaX;
      andou = Math.abs(d);

      if (!capturou) {
        if (andou <= 6) { return; }
        capturou = true;
        pista.classList.add('is-arrastando');
        try { pista.setPointerCapture(e.pointerId); } catch (err) {}
      }

      pista.scrollLeft = partidaScroll - d;
    });

    function soltar(e) {
      if (!arrastando) { return; }
      arrastando = false;
      if (!capturou) { return; }
      capturou = false;

      try { pista.releasePointerCapture(e.pointerId); } catch (err) {}

      pista.addEventListener('click', engolirClique, true);
      window.setTimeout(function () {
        pista.removeEventListener('click', engolirClique, true);
        pista.classList.remove('is-arrastando');
      }, 40);
    }

    pista.addEventListener('pointerup', soltar);
    pista.addEventListener('pointercancel', soltar);

    /* setas */

    function andar(direcao) {
      var painel = pista.querySelector('.palco');

      if (!painel) {
        var partidaLivre = pista.scrollLeft;
        var saltoLivre = pista.clientWidth * 0.6 * direcao;
        pista.scrollBy({ left: saltoLivre, behavior: reduzido ? 'auto' : 'smooth' });
        window.setTimeout(function () {
          if (pista.scrollLeft === partidaLivre) { pista.scrollLeft = partidaLivre + saltoLivre; }
        }, 320);
        return;
      }

      var estilo = window.getComputedStyle(pista);
      var vao = parseFloat(estilo.columnGap || estilo.gap) || 0;
      var passo = painel ? painel.getBoundingClientRect().width + vao : pista.clientWidth * 0.5;

      var porVez = (pista.clientWidth + 4) >= passo * 2 ? 2 : 1;

      var alinhado = Math.round(pista.scrollLeft / passo) * passo;
      var destino = alinhado + passo * porVez * direcao;
      var partida = pista.scrollLeft;

      pista.scrollTo({ left: destino, behavior: reduzido ? 'auto' : 'smooth' });

      window.setTimeout(function () {
        if (pista.scrollLeft === partida) { pista.scrollLeft = destino; }
      }, 320);
    }

    var alvo = pista.id ? '[aria-controls="' + pista.id + '"]' : '';
    var ant  = alvo ? document.querySelector('.vitrine__seta--ant' + alvo) : null;
    var prox = alvo ? document.querySelector('.vitrine__seta--prox' + alvo) : null;
    if (ant)  { ant.addEventListener('click', function () { andar(-1); }); }
    if (prox) { prox.addEventListener('click', function () { andar(1); }); }

    /* teclado */

    pista.addEventListener('keydown', function (e) {
      var passo = pista.clientWidth * 0.6;
      if (e.key === 'ArrowRight') { pista.scrollBy({ left: passo, behavior: reduzido ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft')  { pista.scrollBy({ left: -passo, behavior: reduzido ? 'auto' : 'smooth' }); }
    });
  }
})();
