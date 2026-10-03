/* Bruna Pazinato · montagem das listas
 *
 * Lê dados/ e reescreve APENAS os trechos entre marcadores dentro das
 * páginas. O que está fora dos marcadores não é tocado.
 *
 *   node ferramentas/montar.js             monta
 *   node ferramentas/montar.js --conferir  só avisa se está desatualizado
 */

const fs = require('fs');

const LISTAS = [
  { pagina: 'em-cena.html', marca: 'montagens', dados: 'dados/montagens.json', recuo: 8 },
  { pagina: 'em-cena.html', marca: 'televisao', dados: 'dados/televisao.json', recuo: 8 },
];

const txt = s => String(s == null ? '' : s);

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

const recuar = (t, n) => t.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

let erros = 0, montados = 0;
const conferir = process.argv.includes('--conferir');

for (const L of LISTAS){
  const ini = `<!-- ${L.marca}:início -->`;
  const fim = `<!-- ${L.marca}:fim -->`;
  const t = fs.readFileSync(L.pagina, 'utf8').replace(/\r\n/g, '\n');
  const a = t.indexOf(ini), b = t.indexOf(fim);

  if (a < 0 || b < 0 || b < a){
    console.error(`  ${L.pagina} · ${L.marca}: marcadores não encontrados`);
    erros++; continue;
  }

  const itens = JSON.parse(fs.readFileSync(L.dados, 'utf8'));
  const corpo = '\n' + recuar(itens.map(palco).join('\n\n'), L.recuo) + '\n' + ' '.repeat(L.recuo);
  const novo = t.slice(0, a + ini.length) + corpo + t.slice(b);

  if (novo === t){ console.log(`  ${L.pagina} · ${L.marca}: em dia (${itens.length})`); continue; }
  if (conferir){ console.error(`  ${L.pagina} · ${L.marca}: DESATUALIZADO`); erros++; continue; }

  fs.writeFileSync(L.pagina, novo);
  console.log(`  ${L.pagina} · ${L.marca}: montado (${itens.length})`);
  montados++;
}

process.exit(erros ? 1 : 0);
