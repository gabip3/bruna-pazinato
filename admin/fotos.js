/* Bruna Pazinato · painel — minhas fotos
 *
 * Esta etapa MOSTRA: ela escolhe o espetáculo e vê as fotos que estão
 * no ar, em grade. Acrescentar e apagar ainda não gravam — os botões
 * existem e avisam. A gravação entra na próxima etapa, junto com o
 * envio para o Cloudinary.
 */

(function () {
  'use strict';

  var CONFIG = {
    apiKey: 'AIzaSyDyedBAi5UUXMNcRTKRdZLJOlEjRK5ly60',
    authDomain: 'websites-f4984.firebaseapp.com',
    projectId: 'websites-f4984',
    storageBucket: 'websites-f4984.firebasestorage.app',
    messagingSenderId: '311825434715',
    appId: '1:311825434715:web:a494120041dd8cf5e3177e'
  };
  var PERMITIDOS = ['contato.brunapazinato@gmail.com', 'gabip3@gmail.com'];

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

  var galerias = null;

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
    var g = galerias[chave];
    titulo.textContent = nomeDe(g);
    conta.textContent = plural(g.fotos.length) + (g.credito ? ' · fotos de ' + g.credito : '');

    grade.textContent = '';
    g.fotos.forEach(function (f) {
      var src = (typeof f === 'string' ? f : f.src);
      var cel = document.createElement('div');
      cel.className = 'foto';

      var img = document.createElement('img');
      img.src = '../' + src;
      img.alt = '';
      img.loading = 'lazy';

      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'foto__apagar';
      x.setAttribute('aria-label', 'Apagar esta foto');
      x.textContent = '×';
      x.addEventListener('click', function () {
        alert('Apagar ainda não está ligado. É a próxima etapa.');
      });

      cel.appendChild(img);
      cel.appendChild(x);
      grade.appendChild(cel);
    });

    escolher.hidden = true;
    verFotos.hidden = false;
    window.scrollTo(0, 0);
  }

  document.getElementById('botao-outra').addEventListener('click', function () {
    verFotos.hidden = true;
    escolher.hidden = false;
    window.scrollTo(0, 0);
  });

  /* arrastar para dentro da área */
  ['dragenter', 'dragover'].forEach(function (ev) {
    area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.add('sobre'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.remove('sobre'); });
  });
  area.addEventListener('drop', function () {
    alert('Acrescentar ainda não está ligado. É a próxima etapa.');
  });
  arquivo.addEventListener('change', function () {
    arquivo.value = '';
    alert('Acrescentar ainda não está ligado. É a próxima etapa.');
  });

  firebase.initializeApp(CONFIG);
  var auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  document.getElementById('botao-sair').addEventListener('click', function () {
    auth.signOut().then(function () { location.href = './'; });
  });

  auth.onAuthStateChanged(function (usuario) {
    if (!usuario || PERMITIDOS.indexOf((usuario.email || '').toLowerCase()) < 0) {
      mostrar('fora');
      return;
    }
    fetch('../dados/galerias.json').then(function (r) { return r.json(); }).then(function (d) {
      galerias = d;
      desenharLista();
      mostrar('dentro');
    }).catch(function () {
      mostrar('fora');
      fora.querySelector('.espera').textContent = 'Não consegui carregar suas fotos agora. Tenta recarregar a página.';
    });
  });
})();
