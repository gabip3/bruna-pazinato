/* =============================================================
   BRUNA PAZINATO
   vitrine.js — pistas horizontais infinitas

   Serve a mais de uma pista: a grande, das montagens, a miúda da
   Cena 2 e a linha do tempo da Trajetória. Qualquer elemento com
   [data-pista] ganha o mesmo comportamento; data-laco="nao" tira o
   laço infinito e data-comeca="fim" abre a pista na ponta direita. Cada pista acha as próprias
   setas pelo aria-controls, que já precisava existir para leitor
   de tela — assim não há id repetido nem seta trocada.

   Os painéis são triplicados e a rolagem começa no bloco do meio.
   Ao encostar numa ponta, reposiciona um bloco para trás ou para
   frente — a emenda não aparece porque o conteúdo é idêntico.

   Sem JS, a pista continua rolando na horizontal, só não dá a volta.
   ============================================================= */

(function () {
  'use strict';

  var pistas = Array.prototype.slice.call(document.querySelectorAll('.vitrine__pista, [data-pista]'));
  if (!pistas.length) { return; }

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pistas.forEach(montar);

  function montar(pista) {

    var originais = Array.prototype.slice.call(pista.children);
    if (!originais.length) { return; }

    /* --- laço infinito -------------------------------------------- */

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

    /* só vale a pena dar a volta se a pista de fato transborda */
    function avaliar() {
      var cabeTudo = pista.scrollWidth <= pista.clientWidth + 4;
      if (!infinito && !cabeTudo && !semLaco) { clonar(); centralizar(); }

      /* a linha do tempo abre no presente; quem quiser, volta no tempo */
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

    /* --- arrastar com o mouse -------------------------------------- */

    var arrastando = false;
    var partidaX = 0;
    var partidaScroll = 0;
    var andou = 0;

    pista.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') { return; }   /* toque já rola sozinho */
      arrastando = true;
      andou = 0;
      partidaX = e.clientX;
      partidaScroll = pista.scrollLeft;
      pista.setPointerCapture(e.pointerId);
    });

    pista.addEventListener('pointermove', function (e) {
      if (!arrastando) { return; }
      var d = e.clientX - partidaX;
      andou = Math.abs(d);
      if (andou > 6) { pista.classList.add('is-arrastando'); }
      pista.scrollLeft = partidaScroll - d;
    });

    function soltar(e) {
      if (!arrastando) { return; }
      arrastando = false;
      try { pista.releasePointerCapture(e.pointerId); } catch (err) {}
      /* o clique só volta a valer depois que a pista para */
      window.setTimeout(function () { pista.classList.remove('is-arrastando'); }, 40);
    }

    pista.addEventListener('pointerup', soltar);
    pista.addEventListener('pointercancel', soltar);

    /* --- setas ------------------------------------------------------ */

    function andar(direcao) {
      var painel = pista.querySelector('.palco');

      /* pista sem painéis, como a linha do tempo: anda 60% do que se vê */
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

      /* na pista larga anda de dois em dois — um só quase não sai do
         lugar. Na pista que mostra um painel apenas, anda de um em um. */
      var porVez = (pista.clientWidth + 4) >= passo * 2 ? 2 : 1;

      /* parte da posição de um painel inteiro, não de onde a rolagem
         parou: senão cada clique herda o arredondamento do anterior e
         o carrossel passa a parar no meio de dois cartões */
      var alinhado = Math.round(pista.scrollLeft / passo) * passo;
      var destino = alinhado + passo * porVez * direcao;
      var partida = pista.scrollLeft;

      pista.scrollTo({ left: destino, behavior: reduzido ? 'auto' : 'smooth' });

      /* a rolagem suave depende do ciclo de renderização; se ele estiver
         parado (aba oculta, por exemplo), o botão não pode falhar calado */
      window.setTimeout(function () {
        if (pista.scrollLeft === partida) { pista.scrollLeft = destino; }
      }, 320);
    }

    /* cada pista tem as suas: as setas apontam para ela pelo aria-controls */
    var alvo = pista.id ? '[aria-controls="' + pista.id + '"]' : '';
    var ant  = alvo ? document.querySelector('.vitrine__seta--ant' + alvo) : null;
    var prox = alvo ? document.querySelector('.vitrine__seta--prox' + alvo) : null;
    if (ant)  { ant.addEventListener('click', function () { andar(-1); }); }
    if (prox) { prox.addEventListener('click', function () { andar(1); }); }

    /* --- teclado ---------------------------------------------------- */

    pista.addEventListener('keydown', function (e) {
      var passo = pista.clientWidth * 0.6;
      if (e.key === 'ArrowRight') { pista.scrollBy({ left: passo, behavior: reduzido ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft')  { pista.scrollBy({ left: -passo, behavior: reduzido ? 'auto' : 'smooth' }); }
    });
  }
})();
