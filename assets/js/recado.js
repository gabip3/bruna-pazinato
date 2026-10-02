/* Bruna Pazinato · recado */

(function () {
  'use strict';

  var form = document.querySelector('.recado__form');
  if (!form || !window.fetch) { return; }

  var botao = form.querySelector('.recado__enviar');
  var rotuloOriginal = botao ? botao.innerHTML : '';

  function aviso(texto, erro) {
    var p = form.querySelector('.recado__aviso');
    if (!p) {
      p = document.createElement('p');
      p.className = 'recado__aviso';
      p.setAttribute('role', 'status');
      form.appendChild(p);
    }
    p.textContent = texto;
    p.classList.toggle('recado__aviso--erro', !!erro);
    return p;
  }

  form.addEventListener('submit', function (e) {

    if (!form.checkValidity()) { return; }

    e.preventDefault();

    if (botao) {
      botao.disabled = true;
      botao.innerHTML = '<span>Enviando</span>';
    }

    var dados = {};
    new FormData(form).forEach(function (valor, chave) { dados[chave] = valor; });

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.success) { throw new Error(r.message || 'recusado'); }

        form.classList.add('recado__form--enviado');
        form.innerHTML =
          '<p class="recado__obrigado">Recebido. Ela responde por aqui.</p>';
      })
      .catch(function () {
        if (botao) {
          botao.disabled = false;
          botao.innerHTML = rotuloOriginal;
        }
        aviso('Não consegui enviar agora. Tente de novo, ou escreva direto para contato.brunapazinato@gmail.com', true);
      });
  });
})();
