/* Bruna Pazinato · painel — entrada
 *
 * Só o login. As telas de conteúdo vêm nas próximas etapas.
 *
 * As chaves aqui embaixo NÃO são segredo: elas identificam o projeto,
 * não autorizam nada. Quem decide o que cada pessoa pode ler ou gravar
 * são as regras do Firestore, que ficam no servidor. É por isso que o
 * Google publica essa configuração na documentação dele.
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

  /* Quem pode entrar NESTE painel. O projeto do Firebase é o mesmo de
     outros sites, então sem esta lista a dona de um site entraria no
     painel de outro. A lista é conferida de novo nas regras do
     Firestore — aqui é só para a tela não abrir à toa. */
  var PERMITIDOS = ['contato.brunapazinato@gmail.com', 'gabip3@gmail.com'];

  var espera  = document.getElementById('tela-espera');
  var entrar  = document.getElementById('tela-entrar');
  var casa    = document.getElementById('tela-casa');
  var form    = document.getElementById('form-entrar');
  var botao   = document.getElementById('botao-entrar');
  var aviso   = document.getElementById('aviso-entrar');
  var nome    = document.getElementById('casa-nome');
  var sair    = document.getElementById('botao-sair');

  function mostrar(qual) {
    espera.hidden = qual !== 'espera';
    entrar.hidden = qual !== 'entrar';
    casa.hidden   = qual !== 'casa';
  }

  /* As mensagens do Firebase vêm em inglês e em código. Quem está do
     outro lado não é programadora: cada erro vira uma frase que diz o
     que fazer. */
  function emPortugues(codigo) {
    switch (codigo) {
      case 'auth/invalid-email':        return 'Esse e-mail não parece certo. Confere se não falta alguma letra.';
      case 'auth/missing-password':     return 'Falta a senha.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':       return 'E-mail ou senha não conferem. Tenta de novo.';
      case 'auth/too-many-requests':    return 'Muitas tentativas seguidas. Espera alguns minutos e tenta outra vez.';
      case 'auth/network-request-failed':return 'Sem conexão. Confere a internet e tenta de novo.';
      case 'auth/user-disabled':        return 'Esse acesso está desativado. Fala com o Gabi.';
      default:                          return 'Não consegui entrar agora. Tenta de novo daqui a pouco.';
    }
  }

  firebase.initializeApp(CONFIG);
  var auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  auth.onAuthStateChanged(function (usuario) {
    if (!usuario) { mostrar('entrar'); return; }

    if (PERMITIDOS.indexOf((usuario.email || '').toLowerCase()) < 0) {
      auth.signOut();
      mostrar('entrar');
      aviso.textContent = 'Esse acesso não vale para este site.';
      return;
    }

    var apelido = (usuario.displayName || usuario.email || '').split(/[@ ]/)[0];
    nome.textContent = apelido ? apelido.charAt(0).toUpperCase() + apelido.slice(1) : 'Bruna';
    mostrar('casa');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    var senha = form.senha.value;

    if (!email || !senha) { aviso.textContent = 'Preenche o e-mail e a senha.'; return; }

    botao.disabled = true;
    botao.textContent = 'Entrando…';
    aviso.textContent = '';

    auth.signInWithEmailAndPassword(email, senha).catch(function (erro) {
      aviso.textContent = emPortugues(erro.code);
      form.senha.value = '';
      form.senha.focus();
    }).then(function () {
      botao.disabled = false;
      botao.textContent = 'Entrar';
    });
  });

  sair.addEventListener('click', function () {
    auth.signOut();
    form.reset();
    aviso.textContent = '';
  });
})();
