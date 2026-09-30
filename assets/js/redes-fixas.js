/* =============================================================
   BRUNA PAZINATO
   redes-fixas.js — quando a barrinha das redes aparece e some

   Duas regras, e as duas são sobre não atrapalhar:

   1. Ela não aparece no primeiro quadro. O hero é a composição mais
      trabalhada do site, e um grupo de ícones em cima dele disputa
      com o nome. Só acende depois que a pessoa rola meia tela.

   2. Ela some quando o rodapé entra. O rodapé tem os mesmos três
      ícones; com os dois na tela ao mesmo tempo, parece defeito.

   Sem JS nada disto roda e a barrinha fica visível o tempo todo —
   é o estado seguro, e está escrito assim no CSS.

   NENHUMA LEITURA DE LAYOUT POR EVENTO DE ROLAGEM. A posição do
   rodapé é medida uma vez (e de novo quando a página muda de
   tamanho); durante a rolagem o teste é só aritmética com scrollY e
   innerHeight, que não forçam recálculo.

   Aqui houve um IntersectionObserver, que é a ferramenta certa para
   "o rodapé está à vista". Saiu por um motivo prático: observer não
   dispara em documento oculto, e sem poder disparar eu não conseguia
   conferir o comportamento antes de publicar. Aritmética eu confiro.
   ============================================================= */

(function () {
  'use strict';

  var barra = document.querySelector('.redes-fixas');
  if (!barra) { return; }

  var rodape = document.querySelector('.rodape');

  var topoDoRodape = Infinity;
  var rolou = false;
  var noRodape = false;

  /* os 40px fazem a barrinha sair um pouco ANTES de o rodapé encostar
     nela, em vez de as duas se cruzarem */
  var FOLGA = 40;

  function passouDoHero() {
    return window.scrollY > window.innerHeight * 0.5;
  }

  function rodapeAVista() {
    return (window.scrollY + window.innerHeight) > (topoDoRodape + FOLGA);
  }

  /* Página curta demais não ganha barrinha.

     Na de contato ela acendia em scrollY 420 e apagava em 640: 220px de
     vida num rolar de 819. Aparecer e sumir nesse intervalo lê como
     defeito, e ali o rodapé — que tem os mesmos ícones — está a um
     dedo de distância. Abaixo de 300px de janela útil, nem nasce. */
  var JANELA_MINIMA = 300;
  var vale = true;

  function pintar() {
    if (vale && rolou && !noRodape) {
      barra.classList.add('is-on');
    } else {
      barra.classList.remove('is-on');
    }
  }

  /* roda a cada rolagem: duas contas, nenhuma medida */
  function aoRolar() {
    var a = passouDoHero();
    var b = rodapeAVista();
    if (a === rolou && b === noRodape) { return; }
    rolou = a;
    noRodape = b;
    pintar();
  }

  /* roda quando a página muda de tamanho: aí sim mede o rodapé.
     A altura muda quando as fotos carregam e quando a janela vira. */
  function remedir() {
    if (rodape) {
      topoDoRodape = rodape.getBoundingClientRect().top + window.scrollY;
    }

    /* onde ela acenderia e onde apagaria, em scrollY */
    var acende = window.innerHeight * 0.5;
    var apaga  = topoDoRodape + FOLGA - window.innerHeight;
    vale = (apaga - acende) >= JANELA_MINIMA;

    rolou = passouDoHero();
    noRodape = rodapeAVista();
    pintar();
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', remedir);
  window.addEventListener('load', remedir);

  remedir();
}());
