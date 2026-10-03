/* Bruna Pazinato · montagem das listas
 *
 * Lê dados/ e reescreve APENAS os trechos entre marcadores dentro das
 * páginas. O que está fora dos marcadores não é tocado.
 *
 *   node ferramentas/montar.js             monta
 *   node ferramentas/montar.js --conferir  só avisa se está desatualizado
 */

const fs = require('fs');

const txt = s => String(s == null ? '' : s);

/* --- os carrosséis ------------------------------------------------- */

function palco(m){
  return `<li class="palco">
  <a class="palco__link" href="${txt(m.abre)}" data-galeria="${txt(m.galeria)}">
    <span class="palco__foto"><img src="${txt(m.miniatura)}" alt="${txt(m.alt)}" width="${m.largura}" height="${m.altura}" decoding="async"></span>
    <span class="palco__texto">
      <span class="palco__ano">${txt(m.ano)}</span>
      <span class="palco__obra">${txt(m.obra)}</span>${m.papel ? `
      <span class="palco__papel">${txt(m.papel)}</span>` : ''}
    </span>
  </a>
</li>`;
}

const lista = molde => itens => ({
  corpo: itens.map(molde).join('\n\n'),
  conta: itens.length,
});

/* --- a temporada ---------------------------------------------------- */

const MESES = ['janeiro','fevereiro','março','abril','maio','junho',
               'julho','agosto','setembro','outubro','novembro','dezembro'];

const partes = d => {
  const p = txt(d).split('-');
  return p.length === 3 ? { ano: +p[0], mes: +p[1] - 1, dia: +p[2] } : null;
};

const porExtenso = d => { const p = partes(d); return p ? `${p.dia} de ${MESES[p.mes]}` : ''; };
const curto      = d => { const p = partes(d); return p ? `${p.dia} ${MESES[p.mes].slice(0, 3)}` : ''; };

/* A faixa de datas: "10 de outubro a 29 de novembro de 2026", e sem
   repetir o ano quando a temporada não vira o ano. */
function periodo(t){
  const a = partes(t.estreia), b = partes(t.fim);
  if (!a || !b) { return ''; }
  const fim = `${porExtenso(t.fim)} de ${b.ano}`;
  return a.ano === b.ano ? `${porExtenso(t.estreia)} a ${fim}`
                         : `${porExtenso(t.estreia)} de ${a.ano} a ${fim}`;
}

/* Uma linha só não aparece se o dado não existe. É o que permite
   publicar sem o teatro e sem os horários, que ainda não vieram, em vez
   de inventá-los ou de deixar a página com um rótulo vazio. */
const linha = (classe, conteudo, i) =>
  conteudo ? `\n  <p class="${classe}" data-reveal style="--i:${i}">${conteudo}</p>` : '';

function temporada(t){
  if (!t || t.ativa === false || !partes(t.estreia) || !partes(t.fim)){
    return { corpo: '', conta: 0 };
  }

  const antes  = t.cidade ? `estreia no ${txt(t.cidade)} · ${curto(t.estreia)}` : `estreia ${curto(t.estreia)}`;
  const ativo  = t.cidade ? `em cartaz no ${txt(t.cidade)}` : 'em cartaz';
  const quando = [txt(t.teatro), periodo(t), txt(t.sessoes)].filter(Boolean).join(' · ');

  const selo =
    `<span class="cartaz" data-cartaz data-estreia="${txt(t.estreia)}" data-fim="${txt(t.fim)}"` +
    ` data-cartaz-ativo="${ativo}"><i class="cartaz__ponto" aria-hidden="true"></i>` +
    `<span data-cartaz-texto>${antes}</span></span>`;

  const acoes = [
    t.ingressos ? `    <a class="btn btn--ingresso" data-cartaz-botao href="${txt(t.ingressos)}" target="_blank" rel="noopener"><span class="btn__texto">Comprar ingresso</span></a>` : '',
    t.pagina    ? `    <a class="btn" href="${txt(t.pagina)}"><span class="btn__texto">Ver o espetáculo</span></a>` : '',
  ].filter(Boolean).join('\n');

  const corpo =
`<div class="cartaz-bloco__interior">
  <p class="cartaz-bloco__selo" data-reveal style="--i:0">${selo}</p>
  <h2 class="cartaz-bloco__titulo" data-reveal style="--i:1">${txt(t.obra)}${t.subtitulo ? `<span class="cartaz-bloco__sub">${txt(t.subtitulo)}</span>` : ''}</h2>` +
  linha('cartaz-bloco__papel', t.papel ? `como ${txt(t.papel)}` : '', 2) +
  linha('cartaz-bloco__quando', quando, 3) +
  (acoes ? `\n  <p class="cartaz-bloco__acoes" data-reveal style="--i:4">\n${acoes}\n  </p>` : '') +
`
</div>`;

  return { corpo, conta: 1 };
}

/* --- o que é montado onde ------------------------------------------- */

const LISTAS = [
  { pagina: 'em-cena.html',          marca: 'montagens', dados: 'dados/montagens.json', recuo: 8, monta: lista(palco) },
  { pagina: 'em-cena.html',          marca: 'televisao', dados: 'dados/televisao.json', recuo: 8, monta: lista(palco) },
  { pagina: 'index.html',            marca: 'temporada', dados: 'dados/temporada.json', recuo: 4, monta: temporada },
  { pagina: 'gambetta/index.html',   marca: 'temporada', dados: 'dados/temporada.json', recuo: 4, monta: temporada },
];

const recuar = (t, n) => t.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

let erros = 0, montados = 0;
const conferir = process.argv.includes('--conferir');

for (const L of LISTAS){
  const ini = `<!-- ${L.marca}:início -->`;
  const fim = `<!-- ${L.marca}:fim -->`;

  if (!fs.existsSync(L.pagina)){
    console.error(`  ${L.pagina}: não existe`);
    erros++; continue;
  }

  const t = fs.readFileSync(L.pagina, 'utf8').replace(/\r\n/g, '\n');
  const a = t.indexOf(ini), b = t.indexOf(fim);

  if (a < 0 || b < 0 || b < a){
    console.error(`  ${L.pagina} · ${L.marca}: marcadores não encontrados`);
    erros++; continue;
  }

  const { corpo, conta } = L.monta(JSON.parse(fs.readFileSync(L.dados, 'utf8')));
  const miolo = corpo
    ? '\n' + recuar(corpo, L.recuo) + '\n' + ' '.repeat(L.recuo)
    : '\n' + ' '.repeat(L.recuo);
  const novo = t.slice(0, a + ini.length) + miolo + t.slice(b);

  if (novo === t){ console.log(`  ${L.pagina} · ${L.marca}: em dia (${conta})`); continue; }
  if (conferir){ console.error(`  ${L.pagina} · ${L.marca}: DESATUALIZADO`); erros++; continue; }

  fs.writeFileSync(L.pagina, novo);
  console.log(`  ${L.pagina} · ${L.marca}: montado (${conta})`);
  montados++;
}

process.exit(erros ? 1 : 0);
