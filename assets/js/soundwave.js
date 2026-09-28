/* =============================================================
   BRUNA PAZINATO
   soundwave.js — a linha

   Não é um equalizador. É uma linha orgânica: soma de senoides
   com envelope lento, gerada de forma periódica para poder
   deslizar em loop contínuo (período = 800 unidades do viewBox,
   o mesmo valor do translate no CSS).

   Cada ato pede um comportamento diferente da linha. O perfil
   vem do atributo data-wave no próprio <svg>:

     abertura   quase reta, respirando — o silêncio antes
     musica     onda de verdade: amplitude e ritmo
     cena       pulsos curtos sobre base lenta — marcação de cena

   Perfis novos entram em PERFIS, sem mexer no resto.
   ============================================================= */

(function () {
  'use strict';

  var PERIODO = 800;   /* período horizontal, em unidades do viewBox */
  var CICLOS  = 3;     /* 3 períodos: 2 visíveis + 1 de folga        */
  var MEIO    = 120;   /* meio vertical do viewBox (0 0 1600 240)    */
  var PASSO   = 2;     /* resolução do traçado (perfis com harmônico alto) */

  var PERFIS = {
    abertura: {
      linha: { a1: 15,   a2: 5.5, a3: 2.2, harm: [3, 7, 11],  fase: 0.35, envFase: 0.60, desloc: 0  },
      eco:   { a1: 10.5, a2: 7.5, a3: 3.4, harm: [3, 7, 11],  fase: 2.10, envFase: 2.40, desloc: 10 }
    },
    musica: {
      linha: { a1: 34, a2: 15,   a3: 7,   harm: [2, 5, 9],   fase: 0.20, envFase: 0.90, desloc: 0  },
      eco:   { a1: 22, a2: 19,   a3: 11,  harm: [3, 6, 13],  fase: 1.90, envFase: 2.60, desloc: 14 }
    },
    /* teatro tem tempo, não frequência: base lenta e pulsos curtos por cima */
    cena: {
      linha: { a1: 9,  a2: 27,   a3: 15,  harm: [1, 9, 18],  fase: 0.10, envFase: 1.30, desloc: 0  },
      eco:   { a1: 6,  a2: 18,   a3: 21,  harm: [1, 12, 24], fase: 2.40, envFase: 2.90, desloc: 12 }
    }
  };

  function construir(cfg) {
    var d = '';
    var fim = PERIODO * CICLOS;

    for (var x = 0; x <= fim; x += PASSO) {
      var w = (x / PERIODO) * Math.PI * 2;

      /* envelope lento: a linha respira ao longo do percurso */
      var env = 0.52 + 0.48 * Math.sin(w + cfg.envFase);

      var y = MEIO + cfg.desloc + env * (
        cfg.a1 * Math.sin(w * cfg.harm[0] + cfg.fase) +
        cfg.a2 * Math.sin(w * cfg.harm[1] + cfg.fase * 1.7) +
        cfg.a3 * Math.sin(w * cfg.harm[2] + cfg.fase * 2.4)
      );

      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(2) + ' ';
    }

    return d;
  }

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(document.querySelectorAll('.wave'), function (svg) {
    var linha = svg.querySelector('.wave__line');
    var eco   = svg.querySelector('.wave__echo');
    if (!linha || !eco) { return; }

    var perfil = PERFIS[svg.getAttribute('data-wave')] || PERFIS.abertura;

    linha.setAttribute('d', construir(perfil.linha));
    eco.setAttribute('d', construir(perfil.eco));

    /* traçado progressivo na entrada */
    if (reduzido) { return; }

    [linha, eco].forEach(function (path) {
      var comp = 0;
      try { comp = path.getTotalLength(); } catch (e) { comp = 0; }
      if (!comp) { return; }
      path.style.setProperty('--len', comp);
      path.style.strokeDasharray = comp;
    });
  });
})();
