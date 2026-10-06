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

  var galerias = null;
  var atual = null;
  var ocupado = false;

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

  function abrir(chave) {
    atual = chave;
    var g = galerias[chave];
    titulo.textContent = nomeDe(g);
    conta.textContent = plural(g.fotos.length) + (g.credito ? ' · fotos de ' + g.credito : '');
    falar('');

    grade.textContent = '';
    g.fotos.forEach(function (f, i) {
      var src = (typeof f === 'string' ? f : f.src);
      grade.appendChild(celulaDoSite(src, i + 1, g.fotos.length));
    });

    escolher.hidden = true;
    verFotos.hidden = false;
    window.scrollTo(0, 0);
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

    cel.appendChild(img);
    cel.appendChild(x);
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
    fetch('../dados/galerias.json')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        galerias = j;
        desenharLista();
        mostrar('dentro');
      })
      .catch(function () {
        mostrar('fora');
      });
  });
})();
