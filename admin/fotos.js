/* Bruna Pazinato · painel — minhas fotos
 *
 * Ela escolhe o espetáculo, vê as fotos que estão no ar, acrescenta e
 * pede para apagar. O que ela faz aqui não grava no site: vira um
 * pedido que chega no e-mail do Gabi, com a foto já hospedada e com um
 * link pronto. Ele publica.
 *
 * Por isso a tela nunca diz "pronto, alterado". Diz "enviado". Se
 * dissesse o primeiro, ela abriria o site dois minutos depois, não
 * veria nada e acharia que quebrou.
 */

(function () {
  'use strict';

  var C = window.PAINEL;

  var espera   = document.getElementById('tela-espera');
  var fora     = document.getElementById('tela-fora');
  var dentro   = document.getElementById('tela-fotos');
  var escolher = document.getElementById('passo-escolher');
  var verFotos = document.getElementById('passo-fotos');
  var lista    = document.getElementById('lista-montagens');
  var grade    = document.getElementById('grade-fotos');
  var titulo   = document.getElementById('fotos-titulo');
  var conta    = document.getElementById('fotos-conta');
  var area     = document.getElementById('area-soltar');
  var arquivo  = document.getElementById('arquivo');
  var aviso    = document.getElementById('aviso');
  var textos   = document.getElementById('textos');
  var barraOrdem = document.getElementById('ordem');
  var campos = {
    titulo:  document.getElementById('txt-titulo'),
    sub:     document.getElementById('txt-sub'),
    ano:     document.getElementById('txt-ano'),
    papel:   document.getElementById('txt-papel'),
    credito: document.getElementById('txt-credito')
  };

  var galerias = null;
  var papeis = {};   /* galeria -> personagem, juntado de montagens e televisão */
  var atual = null;
  var ocupado = false;
  var ordem = null;      /* a ordem na tela, que pode diferir da do site */
  var ordemOriginal = null;

  function mostrar(qual) {
    espera.hidden = qual !== 'espera';
    fora.hidden   = qual !== 'fora';
    dentro.hidden = qual !== 'dentro';
  }

  /* o nome que ela reconhece, não a chave técnica */
  function nomeDe(g) {
    return g.sub ? g.titulo + ' · ' + g.sub : g.titulo;
  }

  function plural(n) {
    return n === 1 ? '1 foto' : n + ' fotos';
  }

  /* UM LUGAR SÓ PARA FALAR COM ELA.

     aria-live para quem usa leitor de tela ouvir o andamento sem ter
     que procurar; sem isso o progresso existe só para quem enxerga. */
  function falar(texto, tom) {
    aviso.textContent = texto || '';
    aviso.className = 'aviso' + (tom ? ' aviso--' + tom : '');
    aviso.hidden = !texto;
  }

  function travar(sim) {
    ocupado = sim;
    area.classList.toggle('ocupada', sim);
    arquivo.disabled = sim;
  }

  function desenharLista() {
    lista.textContent = '';
    Object.keys(galerias).forEach(function (chave) {
      var g = galerias[chave];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'montagem';
      b.innerHTML = '<span class="montagem__nome"></span><span class="montagem__conta"></span>';
      b.querySelector('.montagem__nome').textContent = nomeDe(g);
      b.querySelector('.montagem__conta').textContent = plural(g.fotos.length);
      b.addEventListener('click', function () { abrir(chave); });
      lista.appendChild(b);
    });
  }

  function caminhoDe(f) {
    return typeof f === 'string' ? f : f.src;
  }

  function abrir(chave) {
    atual = chave;
    var g = galerias[chave];
    titulo.textContent = nomeDe(g);
    conta.textContent = plural(g.fotos.length) + (g.credito ? ' · fotos de ' + g.credito : '');
    falar('');

    ordem = g.fotos.map(caminhoDe);
    ordemOriginal = ordem.slice();
    barraOrdem.hidden = true;

    campos.titulo.value  = g.titulo || '';
    campos.sub.value     = g.sub || '';
    campos.papel.value   = papeis[chave] || '';
    campos.ano.value     = g.ano || '';
    campos.credito.value = g.credito || '';
    document.getElementById('botao-textos').disabled = true;
    textos.open = false;

    desenharGrade();

    escolher.hidden = true;
    verFotos.hidden = false;
    window.scrollTo(0, 0);
  }

  function desenharGrade() {
    grade.textContent = '';
    ordem.forEach(function (src, i) {
      grade.appendChild(celulaDoSite(src, i + 1, ordem.length));
    });
  }

  /* MOVER É POR BOTÃO, NÃO POR ARRASTAR.

     Arrastar numa grade é gostoso no mouse e uma tortura no dedo: a
     página rola junto, o alvo escapa, e numa galeria de dezenove fotos
     ela desiste. Duas setas por foto resolvem o caso real, que é
     escolher qual abre a galeria. */
  function mover(de, para) {
    if (para < 0 || para >= ordem.length) { return; }
    var f = ordem.splice(de, 1)[0];
    ordem.splice(para, 0, f);
    desenharGrade();
    barraOrdem.hidden = mesmaOrdem();
    if (!barraOrdem.hidden) { falar(''); }
  }

  function mesmaOrdem() {
    return ordem.join('|') === ordemOriginal.join('|');
  }

  function celulaDoSite(src, posicao, total) {
    var cel = document.createElement('div');
    cel.className = 'foto';

    var img = document.createElement('img');
    img.src = '../' + src;
    img.alt = '';
    img.loading = 'lazy';

    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'foto__apagar';
    x.setAttribute('aria-label', 'Apagar a foto ' + posicao + ' de ' + total);
    x.textContent = '×';
    x.addEventListener('click', function () { pedirParaApagar(cel, x, src, posicao); });

    var setas = document.createElement('span');
    setas.className = 'foto__mover';

    var antes = document.createElement('button');
    antes.type = 'button';
    antes.className = 'foto__seta';
    antes.textContent = '←';
    antes.disabled = posicao === 1;
    antes.setAttribute('aria-label', 'Mover a foto ' + posicao + ' para antes');
    antes.addEventListener('click', function () { mover(posicao - 1, posicao - 2); });

    var numero = document.createElement('span');
    numero.className = 'foto__num';
    numero.textContent = posicao;

    var depois = document.createElement('button');
    depois.type = 'button';
    depois.className = 'foto__seta';
    depois.textContent = '→';
    depois.disabled = posicao === total;
    depois.setAttribute('aria-label', 'Mover a foto ' + posicao + ' para depois');
    depois.addEventListener('click', function () { mover(posicao - 1, posicao); });

    setas.appendChild(antes);
    setas.appendChild(numero);
    setas.appendChild(depois);

    cel.appendChild(img);
    cel.appendChild(x);
    cel.appendChild(setas);
    return cel;
  }

  /* ------------------------------------------------------------------
   * ACRESCENTAR
   * ------------------------------------------------------------------ */

  function acrescentar(arquivos) {
    if (ocupado || !atual || !arquivos || !arquivos.length) { return; }

    var fotos = Array.prototype.slice.call(arquivos).filter(function (f) {
      return !/^video\//.test(f.type || '');
    });
    if (!fotos.length) { falar('Isso não parece uma foto.', 'erro'); return; }

    travar(true);
    var links = [];
    var falhas = [];

    /* uma de cada vez, de propósito. Em paralelo seria mais rápido no
       wi-fi e pior no celular dela: três envios disputando a mesma rede
       magra costuma acabar em três que falham. */
    var passo = fotos.reduce(function (fila, f, i) {
      return fila.then(function () {
        var deQuantas = fotos.length > 1 ? ' (' + (i + 1) + ' de ' + fotos.length + ')' : '';
        falar('Preparando a foto' + deQuantas + '…');
        return window.ENVIAR.preparar(f).then(function (pronta) {
          falar('Enviando' + deQuantas + '…');
          return window.ENVIAR.subir(pronta.blob).then(function (url) {
            links.push({ url: url, nome: f.name || 'foto', largura: pronta.largura, altura: pronta.altura });
            mostrarRecemChegada(url);
          });
        }).catch(function (err) {
          falhas.push((f.name || 'uma foto') + ' — ' + window.ENVIAR.explicar(err));
        });
      });
    }, Promise.resolve());

    passo.then(function () {
      if (!links.length) {
        travar(false);
        falar(falhas[0] || 'Nenhuma foto subiu.', 'erro');
        return;
      }

      falar('Avisando o Gabi…');
      var g = galerias[atual];
      var linhas = ['Acrescentar ' + plural(links.length) + ' em: ' + nomeDe(g), ''];
      links.forEach(function (l, i) {
        linhas.push((i + 1) + '. ' + l.url);
        linhas.push('   ' + l.nome + ' · ' + l.largura + 'x' + l.altura);
      });
      linhas.push('');
      linhas.push('Galeria: ' + atual + ' (hoje com ' + g.fotos.length + ')');
      if (falhas.length) {
        linhas.push('');
        linhas.push('Não subiram:');
        falhas.forEach(function (f) { linhas.push('· ' + f); });
      }

      return window.ENVIAR.pedir('acrescentar foto em ' + g.titulo, linhas, C.dona)
        .then(function () {
          travar(false);
          falar(
            links.length === 1
              ? 'Enviado. A foto entra no ar em seguida.'
              : links.length + ' fotos enviadas. Entram no ar em seguida.',
            'bom'
          );
        });
    }).catch(function (err) {
      travar(false);
      falar(window.ENVIAR.explicar(err), 'erro');
    });
  }

  /* A foto aparece na grade assim que sobe, marcada como pedido. Sem
     isto ela manda, não vê nada mudar e manda de novo. */
  function mostrarRecemChegada(url) {
    var cel = document.createElement('div');
    cel.className = 'foto foto--pedida';
    var img = document.createElement('img');
    img.src = url;
    img.alt = '';
    var selo = document.createElement('span');
    selo.className = 'foto__selo';
    selo.textContent = 'enviada';
    cel.appendChild(img);
    cel.appendChild(selo);
    grade.insertBefore(cel, grade.firstChild);
  }

  /* ------------------------------------------------------------------
   * APAGAR
   * ------------------------------------------------------------------ */

  function pedirParaApagar(cel, botao, src, posicao) {
    if (ocupado) { return; }
    if (!window.confirm('Pedir para o Gabi apagar esta foto?')) { return; }

    travar(true);
    botao.disabled = true;
    falar('Avisando o Gabi…');

    var g = galerias[atual];
    var linhas = [
      'Apagar a foto ' + posicao + ' de: ' + nomeDe(g),
      '',
      'Arquivo: ' + src,
      'Galeria: ' + atual + ' (hoje com ' + g.fotos.length + ')'
    ];

    window.ENVIAR.pedir('apagar foto de ' + g.titulo, linhas, C.dona)
      .then(function () {
        travar(false);
        cel.classList.add('foto--apagando');
        var selo = document.createElement('span');
        selo.className = 'foto__selo';
        selo.textContent = 'pedido para apagar';
        cel.appendChild(selo);
        falar('Enviado. O Gabi tira a foto em seguida.', 'bom');
      })
      .catch(function (err) {
        travar(false);
        botao.disabled = false;
        falar(window.ENVIAR.explicar(err), 'erro');
      });
  }

  /* ------------------------------------------------------------------
   * A NOVA ORDEM
   * ------------------------------------------------------------------ */

  document.getElementById('botao-desfazer').addEventListener('click', function () {
    ordem = ordemOriginal.slice();
    desenharGrade();
    barraOrdem.hidden = true;
    falar('');
  });

  document.getElementById('botao-ordem').addEventListener('click', function () {
    if (ocupado || mesmaOrdem()) { return; }
    travar(true);
    falar('Avisando o Gabi…');

    var g = galerias[atual];
    var linhas = ['Nova ordem das fotos de: ' + nomeDe(g), ''];
    ordem.forEach(function (src, i) {
      var antes = ordemOriginal.indexOf(src) + 1;
      var marca = antes === i + 1 ? '' : '   (era a ' + antes + ')';
      linhas.push((i + 1) + '. ' + src.split('/').pop() + marca);
    });
    linhas.push('');
    linhas.push('Galeria: ' + atual);

    window.ENVIAR.pedir('nova ordem em ' + g.titulo, linhas, C.dona)
      .then(function () {
        travar(false);
        ordemOriginal = ordem.slice();
        barraOrdem.hidden = true;
        desenharGrade();
        falar('Enviado. A nova ordem entra no ar em seguida.', 'bom');
      })
      .catch(function (err) {
        travar(false);
        falar(window.ENVIAR.explicar(err), 'erro');
      });
  });

  /* ------------------------------------------------------------------
   * OS TEXTOS
   * ------------------------------------------------------------------ */

  function textoMudou() {
    var g = galerias[atual];
    if (!g) { return false; }
    return campos.titulo.value.trim()  !== (g.titulo || '') ||
           campos.sub.value.trim()     !== (g.sub || '') ||
           campos.papel.value.trim()   !== (papeis[atual] || '') ||
           campos.ano.value.trim()     !== (g.ano || '') ||
           campos.credito.value.trim() !== (g.credito || '');
  }

  Object.keys(campos).forEach(function (k) {
    campos[k].addEventListener('input', function () {
      document.getElementById('botao-textos').disabled = !textoMudou();
    });
  });

  document.getElementById('botao-textos').addEventListener('click', function () {
    if (ocupado || !textoMudou()) { return; }
    travar(true);
    falar('Avisando o Gabi…');

    var g = galerias[atual];
    var rotulos = { titulo: 'Nome', sub: 'Subtítulo', papel: 'Personagem', ano: 'Ano', credito: 'Fotos de' };
    var linhas = ['Mudar os textos de: ' + nomeDe(g), ''];

    /* só o que mudou. Mandar os quatro sempre obrigaria ele a comparar
       campo a campo para descobrir o que ela quis. */
    Object.keys(campos).forEach(function (k) {
      var novo = campos[k].value.trim();
      /* o personagem não mora no galerias.json: vem do carrossel */
      var velho = (k === 'papel' ? papeis[atual] : g[k]) || '';
      if (novo === velho) { return; }
      linhas.push(rotulos[k] + ':');
      linhas.push('   de:   ' + (velho || '(vazio)'));
      linhas.push('   para: ' + (novo || '(vazio)'));
    });
    linhas.push('');
    linhas.push('Galeria: ' + atual);

    window.ENVIAR.pedir('mudar textos de ' + g.titulo, linhas, C.dona)
      .then(function () {
        travar(false);
        document.getElementById('botao-textos').disabled = true;
        falar('Enviado. Os textos entram no ar em seguida.', 'bom');
      })
      .catch(function (err) {
        travar(false);
        falar(window.ENVIAR.explicar(err), 'erro');
      });
  });

  /* ------------------------------------------------------------------ */

  document.getElementById('botao-outra').addEventListener('click', function () {
    verFotos.hidden = true;
    escolher.hidden = false;
    falar('');
    window.scrollTo(0, 0);
  });

  ['dragenter', 'dragover'].forEach(function (ev) {
    area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.add('sobre'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.remove('sobre'); });
  });
  area.addEventListener('drop', function (e) {
    acrescentar(e.dataTransfer && e.dataTransfer.files);
  });
  arquivo.addEventListener('change', function () {
    var escolhidas = arquivo.files;
    acrescentar(escolhidas);
    arquivo.value = '';
  });

  firebase.initializeApp(C.firebase);
  var auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  document.getElementById('botao-sair').addEventListener('click', function () {
    auth.signOut().then(function () { location.href = './'; });
  });

  auth.onAuthStateChanged(function (usuario) {
    if (!usuario || C.permitidos.indexOf((usuario.email || '').toLowerCase()) < 0) {
      mostrar('fora');
      return;
    }
    /* O PERSONAGEM VEM DE OUTRO ARQUIVO.

       galerias.json guarda nome, ano, crédito e as fotos. Quem ela
       interpreta mora no carrossel — em montagens.json e televisao.json
       — ligado pela mesma chave de galeria. Junto os dois aqui para ela
       ver um formulário só, em vez de aprender onde cada coisa mora.

       Três galerias ficam de fora: Piaf, Gal e Clara Nunes, que são os
       destaques e têm o personagem escrito no HTML, não em dados. Nelas
       o campo nasce vazio — ela escreve e o pedido chega igual. */
    Promise.all([
      fetch('../dados/galerias.json').then(function (r) { return r.json(); }),
      fetch('../dados/montagens.json').then(function (r) { return r.json(); }).catch(function () { return []; }),
      fetch('../dados/televisao.json').then(function (r) { return r.json(); }).catch(function () { return []; })
    ])
      .then(function (tudo) {
        galerias = tudo[0];
        tudo[1].concat(tudo[2]).forEach(function (m) {
          if (m && m.galeria && m.papel) { papeis[m.galeria] = m.papel; }
        });
        desenharLista();
        mostrar('dentro');
      })
      .catch(function () {
        mostrar('fora');
      });
  });
})();
