/* Painel · preparar, subir e pedir
 *
 * Três serviços, nesta ordem: deixar a foto leve, levá-la ao Cloudinary
 * e mandar o pedido para o Gabi. Nenhum deles sabe o que é uma galeria
 * ou um espetáculo — quem sabe é quem chama.
 */

window.ENVIAR = (function () {
  'use strict';

  var C = window.PAINEL;

  /* ------------------------------------------------------------------
   * PREPARAR
   *
   * Isto aqui é a parte que já quebrou num site irmão, e por isso está
   * escrita com desconfiança.
   *
   * Lá, o código tentava reduzir a foto num canvas e, se o navegador não
   * conseguisse abrir o arquivo, devolvia o ORIGINAL calado. O original
   * de um iPhone passa de 10 MB, batia numa trava logo adiante e a
   * pessoa via "File size too large" — em inglês, sem dizer o que fazer.
   * Ela nunca conseguiu subir uma foto, e ninguém entendeu por quê.
   *
   * O formato dos iPhones é HEIC, e nenhum navegador fora do mundo da
   * Apple sabe abrir. Então aqui: tenta abrir; se não conseguir, busca o
   * tradutor de HEIC e tenta de novo; e se ainda assim não der, PARA e
   * diz em português o que houve. O original nunca segue escondido.
   * ------------------------------------------------------------------ */

  var tradutorHeic = null;

  function carregarTradutorHeic() {
    if (tradutorHeic) { return tradutorHeic; }
    tradutorHeic = new Promise(function (ok, erro) {
      var s = document.createElement('script');
      /* 1,3 MB. Só desce quando é preciso — na maioria das vezes não é,
         porque no próprio iPhone o navegador abre HEIC sozinho. */
      s.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
      s.onload = function () { ok(window.heic2any); };
      s.onerror = function () { erro(new Error('TRADUTOR_NAO_VEIO')); };
      document.head.appendChild(s);
    });
    return tradutorHeic;
  }

  function abrirImagem(arquivo) {
    /* from-image respeita a marca de rotação da câmera. Sem isso, foto
       tirada de lado chega deitada no site. */
    return createImageBitmap(arquivo, { imageOrientation: 'from-image' });
  }

  function pareceHeic(arquivo) {
    var n = (arquivo.name || '').toLowerCase();
    return /heic|heif/.test(arquivo.type || '') || /\.hei[cf]$/.test(n);
  }

  function preparar(arquivo) {
    if (arquivo.size > C.pesoMaximoMB * 1024 * 1024) {
      return Promise.reject(new Error('PESADA_DEMAIS'));
    }

    return abrirImagem(arquivo)
      .catch(function () {
        /* não abriu. Se tem cara de HEIC, vale o tradutor */
        if (!pareceHeic(arquivo)) { throw new Error('NAO_ABRIU'); }
        return carregarTradutorHeic().then(function (heic2any) {
          return heic2any({ blob: arquivo, toType: 'image/jpeg', quality: 0.9 });
        }).then(function (saida) {
          var b = Array.isArray(saida) ? saida[0] : saida;
          return abrirImagem(b);
        }).catch(function () {
          throw new Error('HEIC_NAO_DEU');
        });
      })
      .then(function (bitmap) {
        var escala = Math.min(1, C.ladoMaximo / Math.max(bitmap.width, bitmap.height));
        var tela = document.createElement('canvas');
        tela.width = Math.round(bitmap.width * escala);
        tela.height = Math.round(bitmap.height * escala);
        tela.getContext('2d').drawImage(bitmap, 0, 0, tela.width, tela.height);
        bitmap.close && bitmap.close();

        return new Promise(function (ok, erro) {
          tela.toBlob(function (blob) {
            /* sem blob não há plano B: devolver o original aqui é
               exatamente o erro que se quis evitar */
            if (!blob) { erro(new Error('NAO_CONVERTEU')); return; }
            ok({ blob: blob, largura: tela.width, altura: tela.height });
          }, 'image/jpeg', 0.85);
        });
      });
  }

  /* O que a Bruna lê quando dá errado. Cada uma diz o que fazer, não o
     que aconteceu — "File size too large" não ajuda ninguém. */
  var RECADOS = {
    PESADA_DEMAIS: 'Essa foto é grande demais para o navegador abrir. Se veio de câmera profissional, pede para o Gabi.',
    HEIC_NAO_DEU:  'Essa foto é do formato do iPhone e não deu para converter aqui. No iPhone: abre a foto, toca em compartilhar, escolhe "Copiar foto" e tenta de novo.',
    NAO_ABRIU:     'Não consegui abrir esse arquivo. Tem certeza de que é uma foto?',
    NAO_CONVERTEU: 'Não consegui preparar essa foto. Tenta outra, ou manda para o Gabi.',
    SUBIDA_FALHOU: 'A foto não chegou ao destino. Confere a internet e tenta de novo.',
    RECADO_FALHOU: 'A foto subiu, mas o aviso não chegou ao Gabi. Manda uma mensagem para ele.'
  };

  function explicar(err) {
    return RECADOS[err && err.message] || 'Deu algum problema. Tenta de novo daqui a pouco.';
  }

  /* ------------------------------------------------------------------
   * SUBIR
   * ------------------------------------------------------------------ */

  function subir(blob) {
    var dados = new FormData();
    dados.append('file', blob);
    dados.append('upload_preset', C.cloudinary.preset);

    return fetch('https://api.cloudinary.com/v1_1/' + C.cloudinary.nuvem + '/image/upload', {
      method: 'POST',
      body: dados
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || !j.secure_url) { throw new Error('SUBIDA_FALHOU'); }
        return j.secure_url;
      });
    }).catch(function (e) {
      throw (e && RECADOS[e.message]) ? e : new Error('SUBIDA_FALHOU');
    });
  }

  /* ------------------------------------------------------------------
   * PEDIR
   *
   * O Web3Forms grátis só aceita chamada vinda do navegador — de
   * servidor ele recusa. Para nós dá no mesmo, mas fica registrado
   * porque não é óbvio.
   * ------------------------------------------------------------------ */

  function pedir(assunto, linhas, quem) {
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: C.recado.chave,
        subject: C.recado.assunto + ' · ' + assunto,
        from_name: C.recado.assunto,
        message: linhas.join('\n') + '\n\n— ' + (quem || C.dona) + ', ' + agora()
      })
    }).then(function (r) {
      return r.json();
    }).then(function (j) {
      if (!j.success) { throw new Error('RECADO_FALHOU'); }
      return true;
    }).catch(function () {
      throw new Error('RECADO_FALHOU');
    });
  }

  function agora() {
    var d = new Date();
    var dois = function (n) { return (n < 10 ? '0' : '') + n; };
    return dois(d.getDate()) + '/' + dois(d.getMonth() + 1) + ' às ' + dois(d.getHours()) + 'h' + dois(d.getMinutes());
  }

  return {
    preparar: preparar,
    subir: subir,
    pedir: pedir,
    explicar: explicar
  };
})();
