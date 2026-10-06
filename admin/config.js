/* Painel · configuração
 *
 * TUDO O QUE É DESTE CLIENTE MORA AQUI, e só aqui. Para montar o mesmo
 * painel para outra pessoa, copia-se a pasta inteira e troca-se este
 * arquivo: outro Firebase, outra lista, outra pasta no Cloudinary,
 * outra chave de recado. Nenhum outro arquivo precisa ser lido.
 *
 * Nada aqui é segredo, e isso é de propósito. A chave do Firebase e o
 * preset do Cloudinary são públicos por natureza — qualquer um que abra
 * o site os vê. O que protege não é escondê-los:
 *
 *   · o Firebase só deixa entrar quem tem senha de um usuário criado
 *   · o preset do Cloudinary só grava na pasta dele, com nome
 *     aleatório, e não sobrescreve nada
 *   · a chave do recado só sabe mandar e-mail para uma caixa, a do Gabi
 *
 * O pior que alguém mal-intencionado consegue com tudo isto em mãos é
 * mandar um e-mail para o Gabi e sujar uma pasta de imagens. Nenhum
 * deles toca no site.
 */

window.PAINEL = {

  /* quem está do outro lado */
  dona: 'Bruna',

  /* o nome de cada um, para a saudação e para assinar os pedidos. Sem
     isto o painel recorta o que vem antes do arroba e chama a pessoa de
     "Gabip3", e todo pedido chega assinado com o nome da dona do site. */
  nomes: {
    'contato.brunapazinato@gmail.com': 'Bruna',
    'gabip3@gmail.com': 'Gabi'
  },

  /* entrada */
  firebase: {
    apiKey: 'AIzaSyDyedBAi5UUXMNcRTKRdZLJOlEjRK5ly60',
    authDomain: 'websites-f4984.firebaseapp.com',
    projectId: 'websites-f4984',
    storageBucket: 'websites-f4984.firebasestorage.app',
    messagingSenderId: '311825434715',
    appId: '1:311825434715:web:a494120041dd8cf5e3177e'
  },

  /* este projeto do Firebase atende vários sites. Sem esta lista, quem
     tem conta em qualquer um deles entraria no painel da Bruna. */
  permitidos: [
    'contato.brunapazinato@gmail.com',
    'gabip3@gmail.com'
  ],

  /* onde as fotos pousam a caminho do site */
  cloudinary: {
    nuvem: 'nvachzof',
    preset: 'bruna-painel'
  },

  /* para onde vão os pedidos dela */
  recado: {
    chave: '2719b64e-f169-4f1b-ad2d-a597d973755d',
    assunto: 'Painel da Bruna'
  },

  /* O MAIOR LADO DA FOTO DEPOIS DE REDUZIDA.

     2200 porque o maior uso do site hoje é a faixa de abertura, que
     pede 1619 de largura, e o Gabi precisa de sobra para recortar. Mais
     que isso é peso que ninguém vê: a tela da Bruna não mostra, o site
     não serve, e o celular dela gasta dados para subir. */
  ladoMaximo: 2200,

  /* acima disto nem adianta tentar: é foto de câmera profissional ou
     arquivo que não é foto. Melhor avisar do que deixar travar. */
  pesoMaximoMB: 40
};
