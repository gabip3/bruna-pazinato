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

  /* tudo o que é deste cliente mora em config.js */
  var C = window.PAINEL;
  var CONFIG = C.firebase;
  var PERMITIDOS = C.permitidos;

  var espera  = document.getElementById('tela-espera');
  var entrar  = document.getElementById('tela-entrar');
  var casa    = document.getElementById('tela-casa');
  var form    = document.getElementById('form-entrar');
  var botao   = document.getElementById('botao-entrar');
  var aviso   = document.getElementById('aviso-entrar');
  var nome    = document.getElementById('casa-nome');
  var sair    = document.getElementById('botao-sair');
  var esqueci = document.getElementById('botao-esqueci');

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

    /* O NOME VEM DE UMA LISTA, NÃO DO E-MAIL.
       Recortar o que vem antes do arroba dava "Gabip3" — que não é o
       nome de ninguém. Para quem a gente conhece, a gente chama pelo
       nome; para quem não, o recorte continua valendo como último
       recurso. */
    var NOMES = {
      'contato.brunapazinato@gmail.com': 'Bruna',
      'gabip3@gmail.com': 'Gabi'
    };
    var email = (usuario.email || '').toLowerCase();
    var apelido = NOMES[email];
    if (!apelido) {
      apelido = (usuario.displayName || email).split(/[@ ]/)[0];
      apelido = apelido ? apelido.charAt(0).toUpperCase() + apelido.slice(1) : 'Bruna';
    }
    nome.textContent = apelido;
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

  /* Sem isto, esquecer a senha significa depender do Gabi — que é
     exatamente a dependência que este painel existe para acabar. O
     Firebase manda o link de troca direto para o e-mail dela.

     A resposta é a mesma havendo conta ou não: dizer "esse e-mail não
     existe aqui" contaria a um estranho quem tem acesso. */
  esqueci.addEventListener('click', function () {
    var email = form.email.value.trim();
    if (!email) {
      aviso.textContent = 'Escreve seu e-mail aí em cima e clica de novo.';
      form.email.focus();
      return;
    }
    esqueci.disabled = true;
    auth.sendPasswordResetEmail(email).catch(function () {}).then(function () {
      esqueci.disabled = false;
      aviso.textContent = 'Se esse e-mail tiver acesso, o link para criar a senha já está indo. Olha na caixa de entrada — e no lixo eletrônico, que às vezes ele cai lá.';
    });
  });

  sair.addEventListener('click', function () {
    auth.signOut();
    form.reset();
    aviso.textContent = '';
  });
})();
