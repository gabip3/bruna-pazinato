# BRUNA PAZINATO — website

Home: **header + hero + os três atos**. As páginas de ato ainda não existem.

## Estrutura do site

```
HOME             2 telas    hero + os três atos          ← construído
  ↓
ATO I   MÚSICA              autoral, 8 clipes
ATO II  EM CENA             CENA 1 teatro musical (~14 produções)
                            CENA 2 televisão
                            CENA 3 publicidade + locução
ATO III AO VIVO             CENA 1 shows
                            CENA 2 carnaval
TRAJETÓRIA                  fora da numeração: é ficha técnica
CONTATO                     fora da numeração: é bilheteria
```

Cada ato vira **página própria**, não seção de uma home longa. Com esse volume de
conteúdo, página única daria umas quinze telas seguidas.

A luz e a cor crescem ato a ato — abertura quase preta, carnaval como pico — e
**baixam de novo na TRAJETÓRIA**. Terminar no pico deixaria o site sem pouso.

A linha do hero (`soundwave.js`) é o fio que costura tudo: ela desce a página e
muda de comportamento em cada ato — onda na música, marcação de cena no teatro,
amplitude máxima no ao vivo.

---

## Como abrir

Basta abrir `index.html` no navegador (duplo clique). Não há build, framework ou dependência.
Se preferir servir localmente:

```bash
node -e "const http=require('http'),fs=require('fs'),p=require('path');http.createServer((q,s)=>{let f=decodeURIComponent(q.url.split('?')[0]);if(f.endsWith('/'))f+='index.html';fs.readFile(p.join(process.cwd(),f),(e,d)=>{if(e){s.writeHead(404);return s.end('404')}s.end(d)})}).listen(5173,()=>console.log('http://localhost:5173'))"
```

---

## Estrutura

```
index.html
assets/
  css/
    base.css      tokens (cor, tipografia, métrica), reset, animações base
    header.css    navegação transparente + menu mobile
    hero.css      composição da abertura
  js/
    hero.js       coreografia de entrada + contorno do nome sobre a foto
    soundwave.js  geração da linha/onda
    nav.js        menu mobile
  img/
    hero-placeholder.svg   ← imagem temporária
    favicon.svg
```

---

## A fotografia

Em uso: `assets/img/bruna-hero.jpg` — 1600 × 2000, 227 KB, gerada a partir de
`BP_1.jpg` (original 4378 × 5472, na raiz do projeto). **Falta o crédito do
fotógrafo.**

O fundo original é vermelho pleno (`#BD0001`). O tratamento em `.hero__photo`
puxa para vermelho queimado, aproximando do `--coral` da paleta — há três
ajustes comentados no CSS (cru / médio / queimado) para trocar em uma linha.

Para trocar por outra foto: substitua o `src` em `index.html` (e o `preload`
e o `og:image` no `<head>`, que apontam para o mesmo arquivo). Recomendado
retrato vertical, mínimo 1600 × 2000 px.

O enquadramento fica em `assets/css/hero.css`, no bloco `.hero`:

| Variável        | O que faz                                        | Padrão      |
|-----------------|--------------------------------------------------|-------------|
| `--photo-pos`   | ponto focal da foto (`object-position`)          | `50% 24%`   |
| `--photo-edge`  | onde a fotografia começa no desktop              | `50%`       |
| `--name-size`   | escala de PAZINATO                               | `10.8vw`    |

`assets/img/hero-placeholder.svg` continua no projeto, caso seja preciso voltar
a testar composição sem foto.

---

## Identidade

**PAZIN`ATO`** — o `ATO` recebe o coral e acende alguns segundos depois do nome entrar,
como uma descoberta dentro da palavra. Está preparado para virar sistema:
os capítulos futuros podem ser ATO I — MÚSICA, ATO II — EM CENA, ATO III — AO VIVO.

O mesmo tratamento aparece, bem mais discreto, na assinatura do header.

### Paleta (`assets/css/base.css`)

| Token       | Valor     | Uso                                  |
|-------------|-----------|--------------------------------------|
| `--ink`     | `#0B0B0C` | fundo                                |
| `--paper`   | `#F0EBE4` | off-white quente, tipografia         |
| `--coral`   | `#D14B32` | `ATO`, pontos finais, hairlines      |
| `--gold`    | `#E3B879` | luz quente sobre a fotografia        |

### Números

**Sempre alinhados.** A Young Serif usa por padrão algarismos de texto, em que
o 9, o 7, o 5 e o 4 descem abaixo da linha como letras: "2019" ficava torto ao
lado de "2021" na linha do tempo. A fonte tem a variante alinhada (`lnum`),
ligada para o site inteiro em `base.css` com `font-variant-numeric:
lining-nums`. Não é Playfair, e não precisou trocar de fonte.

### Pontuação

**Nada de travessão (—) no site.** Onde havia, entrou `·` ou vírgula:
`Chacrinha, O Musical` · `Lia · Record TV` · `Ato II · Em cena`.

Continuam em uso os **hifens de intervalo** em anos (`2013–14`), que são
meia-risca, não travessão. Se também tiverem de sair, é uma troca só.

### Tipografia

Três fontes, com papéis separados. Os tokens estão em `base.css`.

| Token | Fonte | Uso |
|---|---|---|
| `--font-name` | **Fraunces** | **só** a assinatura BRUNA PAZINATO |
| `--font-display` | **Young Serif** | menu, títulos, tudo o mais em corpo grande |
| `--font-sans` | **Archivo** | micro-tipografia em caixa alta espaçada |

A separação é proposital: a Fraunces tem ondulação proposital nos contornos.
No nome, em escala de logotipo, isso vira personalidade. No menu, em texto que
se lê de fato, vira tremor. Por isso a Fraunces está **reservada à assinatura** —
qualquer título novo usa `--font-display`.

Duas armadilhas ao trocar qualquer uma delas:

- A Fraunces é variável e **afina as hastes conforme o corpo cresce**. Por isso
  `--name-axes` trava a optical size em 16. Fonte variável com eixo `opsz` que
  entre no lugar precisa do mesmo travamento.
- Foi por hastes finas que a **Bodoni Moda** caiu antes: didone tem o contraste
  grosso/fino como definição de projeto, não havia como engrossar.

---

## Navegação

**Menu sanduíche em todas as larguras**, inclusive no desktop.

O menu horizontal existia e funcionava, mas atravessava a fotografia: três dos
cinco itens caíam em cima da Bruna e exigiam um véu escuro no topo da imagem só
para continuarem legíveis. Com o sanduíche, a foto fica inteira e o topo da tela
tem apenas duas marcas — a assinatura à esquerda e o traço à direita.

O menu aberto ocupa a tela toda, com a fotografia desfocada por trás. No rodapé,
separada por hairline: a assinatura à esquerda e os **ícones de Instagram,
YouTube e Facebook** à direita — desenhados em SVG de traço, na mesma espessura
das outras linhas do site, sem logo colorido de marca. O markup do menu horizontal continua no `index.html` e o CSS
continua em `header.css` (desativado por `.nav{ display:none }`), caso valha
reativar depois de existirem mais seções.

---

## Movimento

A entrada segue a ordem de um espetáculo, em ~5 s:

```
0,25s  hairline coral
0,55s  header
0,90s  BRUNA
1,15s  PAZINATO
1,45s  a fotografia acende (cortina preta se dissolve)
2,15s  o ATO ganha cor
2,50s  a linha é traçada
3,05s  UMA VOZ. MUITOS PALCOS.
4,50s  marcador de rolagem
```

Tudo em `opacity`, `clip-path` e `transform` — nada de salto.
`prefers-reduced-motion` desliga a coreografia e entrega a composição pronta.

### A linha

`soundwave.js` gera uma soma de senoides com envelope lento, periódica, para poder
deslizar em loop contínuo sem emenda. Não é um equalizador e não reage a áudio —
ainda. Ela está isolada e pronta para mudar de comportamento por seção no futuro.

---

## Responsivo

Desktop e mobile são composições diferentes, não a mesma reduzida:

- **Desktop** — nome grande à esquerda, fotografia à direita atravessando as últimas
  letras de PAZINATO (um contorno fino continua o desenho por cima da imagem).
- **Mobile** (≤ 900px) — cartaz: fotografia no alto dissolvendo para o preto, nome
  ancorado embaixo ocupando a largura toda, a linha atravessando a dissolução.

---

## Os três atos (segunda tela da home)

Três painéis lado a lado, como cortinas fechadas, separados por hairline de 1px.
Escuros de propósito — mais escuros que o hero: a luz ainda não subiu. No hover,
a foto clareia e ganha escala, e o traço coral sob o algarismo se estica.

No mobile viram três faixas empilhadas de ~250px. Os três cabem em menos de uma
tela, e o total da home fica em 1,9 telas nos dois formatos.

`reveal.js` é genérico: qualquer elemento com `[data-reveal]` e um `--i` inline
entra escalonado. As próximas seções usam o mesmo sem alteração. Como o conteúdo
nasce invisível, ele tem três caminhos (observer, varredura por posição na
rolagem, e liberação total após 6s) — uma falha ali apagaria a página.

**Fotos dos painéis, todas provisórias:**

| Painel | Arquivo | Origem |
|---|---|---|
| Ato I — Música | `ato-musica.jpg` | recorte de `BP_005` — **provisória**, ver ressalva abaixo |
| Ato II — Em cena | `ato-em-cena.jpg` | `Fotos/Clara Nunes/ClaraNunesBP01.jpg` |
| Ato III — Ao vivo | `ato-ao-vivo.jpg` | recorte de `BP_007`, palco com PAZINATO no telão |

Ressalva no Ato I: a foto é de paetê vermelho com boá rosa, e lê como show de
carnaval. Como carnaval virou a CENA 2 do Ato III, ela está anunciando a seção
errada. Vale trocar por algo que diga "música autoral" quando houver material.

## Ato I — Música (`musica.html`)

**1,9 telas** no desktop e no mobile.

Abertura tipográfica: `ATO I` em coral, `MÚSICA` gigante, e a linha — que aqui
muda de perfil pela primeira vez. Depois, os oito clipes em **lista tipográfica**:
número, título, formato. Oito linhas ocupam meia tela; oito cards ocupariam
quatro, e card estava vetado no briefing desde o começo.

A imagem só aparece quando alguém se interessa: no desktop, a **miniatura do
clipe segue o cursor**; no toque, vai direto para o player. As miniaturas vêm do
YouTube (`i.ytimg.com`), com `maxresdefault` e queda para `mqdefault` quando o
vídeo não tem a versão grande.

O player abre em tela cheia com o `youtube-nocookie`. O iframe **nasce no clique
e é destruído ao fechar** — é o que interrompe o som. Fecha no X, no Esc e no
clique fora, e devolve o foco para onde estava.

Sem JavaScript, cada linha continua sendo um link comum para o YouTube.

### O molde das páginas de ato

`ato.css` vale para os três atos: a abertura e a passagem para o ato seguinte são
sempre as mesmas. Cada ato só troca conteúdo e perfil da linha. `musica.css` tem
apenas o que é específico do Ato I.

`soundwave.js` agora aceita perfis por `data-wave` no `<svg>`:

| Perfil | Comportamento |
|---|---|
| `abertura` | quase reta, respirando — o silêncio antes |
| `musica` | onda de verdade: amplitude e ritmo |

Perfis novos entram na constante `PERFIS`, sem tocar no resto.

`pronto.js` foi separado do `hero.js`: ele marca `.is-ready` quando as fontes
carregam e dispara `pagina:pronta`. Vai em todas as páginas — é o gatilho de
toda coreografia. O `hero.js` ficou só com o contorno do nome, que é da home.

## Ato II — Em cena (`em-cena.html`)

**4,0 telas** no desktop, 4,3 no mobile. É a maior página do site — 15 musicais
e 3 produções de TV.

Duas cenas, por enquanto: `CENA 1 — TEATRO MUSICAL` e `CENA 2 — TELEVISÃO`.
A CENA 3 (publicidade e locução) entra quando houver material.

O princípio é o do programa de peça: **três destaques com fotografia e escala,
o resto num índice tipográfico**. Quinze montagens tratadas igualmente viram
currículo; a hierarquia é o que separa portfólio de currículo. Os destaques
alternam o lado da fotografia; o índice é hairline e tipo, sem card nenhum.

A linha muda de perfil pela terceira vez: `data-wave="cena"` troca a onda por
**pulsos curtos sobre base lenta** — teatro tem tempo, não frequência.

### O programa — bloco claro

**38% da página é off-white.** Todo o índice — as outras montagens e a Cena 2,
Televisão — sai do preto e vira papel: tipo escuro sobre `#EDE8E0`, com grão em
`multiply` para não parecer tela acesa.

Não é alternância decorativa. O palco é escuro; **a ficha da peça é impressa**.
São dois suportes diferentes, e é por isso que o corte entre eles é seco, sem
degradê.

Custou pouco porque a paleta inteira já estava em token: a classe `.claro`
redefine `--ink`, `--paper` e derivados num escopo, e todos os componentes
acompanham sozinhos — inclusive os botões de galeria. O único ajuste manual foi
o **coral, que escurece para `#A8341F`**: o `#D14B32` não tem contraste
suficiente sobre off-white em tipo pequeno.

`.claro` é reaproveitável — é o mesmo mecanismo se a TRAJETÓRIA for para o claro.

### A vitrine — as montagens em painéis

No lugar da lista longa, **doze painéis com a capa de cada montagem**. O painel
sob o cursor cresce; a pista rola na horizontal e **dá a volta** — os painéis
são triplicados e o `vitrine.js` reposiciona a rolagem ao encostar nas pontas,
sem emenda visível.

**Só o painel sob o cursor cresce, e os vizinhos não encolhem.** A referência
encolhia, mas ali a fileira ocupava a largura exata da tela. Aqui a pista rola e
tem 36 painéis contando os clones: encolher todos contraía a pista em centenas
de pixels a cada hover e tudo disparava para o lado. A transição é de 0,95s.

É `flex-basis` com `transition` no `:hover`. **Sem React, sem Tailwind, sem
framer-motion** — a referência que inspirou isso usava as três coisas, mas a
interação é CSS puro. Trocar a arquitetura do site por causa de um componente
custaria muito mais do que o componente vale.

**Setas no topo direito**, alinhadas com o rótulo. A pista sangra até a borda e
corta os painéis de propósito, mas corte sozinho não avisa que dá para andar —
as setas avisam. Andam de dois em dois painéis; um só quase não sai do lugar.

Arrasta com o mouse, rola no trackpad, desliza no toque, setas do teclado.
Enquanto arrasta, o clique fica desligado — senão qualquer arrasto abriria uma
galeria por acidente.

### Cena 2 — Televisão, um cartão de cada vez

O índice tipográfico saiu; as três produções viraram **carrossel de um cartão
só**, com as setas ao lado dele. Três linhas de texto não justificavam uma
lista, e a coluna ganhou o branco que faltava.

É a mesma pista da vitrine, com outro tamanho. O `vitrine.js` passou a montar
**todas** as `.vitrine__pista` da página, e cada uma acha as próprias setas
pelo `aria-controls` — que já precisava existir para leitor de tela, então não
custou atributo novo nem id repetido. O passo também virou automático: lê o vão
real do `gap` e anda de dois em dois quando cabem dois painéis, de um em um
quando cabe um.

O tamanho do painel virou variável (`--palco-largura`, `--palco-altura`,
`--palco-aberto`), e `.vitrine--miuda` só troca os valores. Na miúda a altura
vem de `aspect-ratio: 5/7`, a mesma da capa, para a foto nunca ser recortada
por causa do tamanho da janela — e o painel não cresce no hover, porque
mostrando um só não há para onde crescer.

**O cartão ocupa o que sobra da coluna**, não uma medida em `vw`: a pista é
`flex: 1 1 auto` com teto de 440px e o painel é `100%` dela. Assim o cartão é o
maior possível em cada largura e nunca empurra as setas para fora — no celular
ele mede 242px e as setas encostam exatamente na borda da coluna. Fica mais
alto que a coluna da publicidade, e tudo bem: são duas colunas de programa
impresso, não uma grade.

**Um por um, sempre inteiro.** Duas travas para isso, porque uma só não bastava:
a seta parte de `Math.round(scrollLeft / passo) * passo` em vez de somar sobre
onde a rolagem parou — senão cada clique herda o arredondamento do anterior e o
carrossel passa a parar no meio de dois cartões. E a pista tem
`scroll-snap-type: x mandatory`, que assenta qualquer rolagem, inclusive o
arrasto e o trackpad. O encaixe sai da frente enquanto `.is-arrastando` está
ligada e volta a valer quando solta.

**O respiro embaixo da fileira de musicais.** Ao embrulhar as duas cenas no
`.programa__par`, a regra `.programa__coluna + .programa__coluna` deixou de
alcançá-las — o par não é uma coluna — e o bloco encostou na fileira. Voltou
como `.programa__coluna + .programa__par`, e maior: a fileira sangra a página
inteira e precisa de ar antes de o texto começar.

**A data deixou de ser coral.** `#D14B32` sobre a fotografia escurecida dá
contraste 4:1, abaixo do mínimo para texto miúdo — não se lia. O dourado
`#E3B879` é a mesma família quente e chega a 9:1.

**Dezesseis galerias curadas.** Os carrosséis do site antigo misturavam cena,
cartaz, recorte de jornal, arte de divulgação e foto de coquetel de lançamento.
Só entrou **fotografia de cena** — o resto foi descartado um a um.

| Galeria | Fotos | Descartado |
|---|---|---|
| Clara Nunes | 12 | — |
| O Rico e Lázaro | 10 | retrato de book, bastidor |
| Quem Inventou o Amor | 9 | — |
| Mulheres à Beira de um Ataque de Nervos | 8 | cartaz, retrato de divulgação |
| Noite de Patroa | 7 | cartaz |
| O Pequeno Príncipe | 6 | cartaz |
| Aparecida | 5 | cartaz, 2 de imprensa, retrato de divulgação |
| Enlace | 5 | cartaz, foto de ensaio |
| Lia | 5 | arte da série, arte de estreia |
| Tic Tic Tati | 5 | arte/logo |
| Brasil Raiz | 4 | — |
| Grandes Encontros da MPB | 4 | cartaz, recorte de jornal |
| A Princesinha | 2 | logotipo |
| Chacrinha | 2 | cartaz, retrato de divulgação |
| Os Dez Mandamentos | 2 | fachada do teatro |
| Uma Luz Cor de Luar | 1 | cartaz |

**A Fundação Lia Maria Aguiar vinha num carrossel só.** O site antigo agrupava
por instituição, não por montagem: seis arquivos de *Uma Luz Cor de Luar* e de
*A Princesinha* dividiam a mesma galeria. Cheguei a declarar as duas sem foto
por não conseguir separá-las. Dá para separar, e a prova está dentro da imagem:
o elenco veste camiseta **LCZ** numa, o logotipo de *A Princesinha* está impresso
no cenário da outra, e a foto de estúdio traz a marca d'água
`facebook.com/aprincesinhaomusical`. Sobraram de fora os dois cartazes e um
retrato de bastidor de celular, borrado e sem sinal de qual das duas montagens é.

**Galeria de uma foto só não vira carrossel.** Quando o JSON tem uma imagem
apenas, o visor esconde as setas e a contagem — ela se apresenta como uma
fotografia, não como uma sequência truncada.

**Nas galerias de baixa resolução o visor não amplia** além do original — o
campo `largura` no JSON limita o palco. Frames de TV (600–960 px) aparecem
centrados no tamanho real em vez de esticados.

### Cena 3 — Publicidade

Três filmes. Pouco para um ato inteiro, muito para virar uma linha de texto.
Viraram um **índice com imagem**: o mesmo compasso da Cena 2, só que a coluna
da esquerda é um quadro do filme em vez do ano.

**As duas cenas ficam lado a lado no desktop.** Empilhadas, a página crescia
meia tela; pareadas, cresce 0,13 — e o programa impresso ganha duas colunas,
que é como programa impresso se parece mesmo. Abaixo de 861px elas empilham.

| Filme | Origem | Papel |
|---|---|---|
| Faber Castell, 2022 | arquivo daqui, 1472×828 | Compositora, e a narração |
| Nio, 2025 | YouTube | Tubarão |
| Globo Receitas, 2022 | arquivo daqui, 740×458 | a confirmar |

**O player é o mesmo do Ato I**, agora com duas origens: `data-video` abre um
iframe do YouTube, `data-filme` cria um `<video>` com os controles nativos do
navegador. Nada de player customizado — teclado, tela cheia e acessibilidade já
vêm prontos. O bloco saiu de `musica.css` e virou `player.css`, carregado nas
duas páginas. Ao fechar, o vídeo é pausado antes de ser descartado: em alguns
navegadores o áudio de um `<video>` removido do documento continua tocando.

Os filmes não têm todos o mesmo formato — um é 2,16:1, outro 1,62:1, o do
YouTube é 16:9. Em vez de uma classe por formato, o vídeo se encaixa no quadro
com `object-fit: contain` e o que sobra fica preto, como no cinema.

**Duas ressalvas de material, escritas na página.** O Spaten entrou com o que
existe: o arquivo da Wix tem quatro segundos. Cheguei a marcar a linha como
"2022 · trecho", e o Gabi mandou tirar — a palavra chamava atenção para a
falta em vez de deixar o filme passar como os outros. Fica só o ano. Ele veio de um
embed do YouTube e trazia o **botão do player queimado na tarja preta de
baixo** — o recorte para os 1472×560 de imagem real tira a tarja e o botão
junto. E o arquivo do Globo Receitas veio com o **botão de mudo do player
gravado na imagem** — é captura de tela, não master; cortei a faixa da direita
para tirá-lo, o que levou o filme de 828 para 740 de largura.

### Galeria (piloto: Clara Nunes)

A porta de entrada é um **botão** — `VER GALERIA 12`, retangular, canto vivo,
hairline de 1px. No hover o coral varre de baixo para cima e o texto inverte
para o preto. Nada de border-radius ou sombra: é botão, não pílula de SaaS.

O mesmo componente serve ao destaque e às cinco linhas do índice — muda só o
número. Não é hover sobre a imagem: hover não anuncia nada para quem não passa
o cursor, e não existe no celular. A fotografia segue clicável como atalho, mas
quem avisa é o botão.

O clique abre o **visor em tela cheia**. Uma foto por vez, no preto, sem grade e
sem moldura — a galeria **não acrescenta nenhuma rolagem à página**, ela abre
por cima. A página continua com as mesmas 4,0 telas.

Setas na tela, setas do teclado, arrasto no celular, Esc fecha. Navegação
circular. As vizinhas são pré-carregadas; ao fechar, o `src` é limpo.

As 12 fotos pesam 1,5 MB e **só carregam quando alguém abre** a galeria.

O componente é genérico: `galeria.css` + `galeria.js` servem a qualquer ato. O
conteúdo de cada galeria vem de um `<script type="application/json">` na própria
página, casado com o gatilho pelo `data-galeria`. Para acrescentar a galeria de
outro espetáculo, basta o JSON e o gatilho — não se mexe no JS.

Sem JavaScript, o gatilho continua sendo um link para a primeira foto.

**O visor não escreve nada quando não há crédito.** A frase de espera aparecia
em quase toda galeria e virava ruído — além de anunciar uma pendência nossa a
quem só queria ver as fotos. O crédito de verdade continua onde existe.

### O que está pendente e visível na página

Os anos do `Piaf` e da `Cassia Eller` foram confirmados, e a foto de cena da
Cassia chegou em 29/9/2026 — era a única montagem do site sem fotografia
nenhuma. O que ainda falta de ficha técnica está em
[pedido-de-material.md](conteudo/pedido-de-material.md); ficha técnica não se
inventa, então o que não veio não está escrito.

## Pendências desta etapa

- Os links do menu (`#musica`, `#em-cena`, `#ao-vivo`, `#trajetoria`, `#contato`)
  ainda não têm destino — as seções entram nas próximas etapas.
- O marcador de rolagem no canto inferior esquerdo sugere continuidade; faz sentido
  a partir da próxima seção.
- A fotografia é um placeholder.
- `CANTA. INTERPRETA. CONTA.` foi retirado do hero. O texto pode voltar mais
  adiante, provavelmente ligado aos ATOS.

## TRAJETÓRIA (`trajetoria.html`)

Página própria, apontada pelo item TRAJETÓRIA do menu nas quatro páginas.

**É a página de leitura, então é clara.** Depois da abertura escura (o mesmo
molde dos atos), tudo fica no registro `.claro` do programa impresso. As fotos
de estúdio de fundo branco, que o acervo marcava como "não servem para fundo
preto", finalmente têm onde morar. O retrato é a `BP_004`, ela rindo: o hero
já tem o retrato sério, e esta é a página da pessoa. A `BP_001` fica de
alternativa. A foto está em `mix-blend-mode: multiply`, então o branco do
estúdio vira a cor do papel e a figura aparece impressa na folha, sem
retângulo em volta.

**Não é currículo.** A ordem é de matéria de revista:
1. **O arco.** "Aos doze anos, no interior gaúcho, já se apresentava em
   festivais e CTGs. Em 2026, cantou para um milhão e meio de pessoas na Rua
   da Consolação." Dois parágrafos curtos embaixo, e só
2. **A crítica** da Tania Brandão, a primeira frase, centrada e sozinha no meio
   da folha. A segunda está na Clara Nunes do Ato II, para não repetir
3. **A foto do fim.** Ela no palco com o próprio nome no telão, em parallax.
   A folha clara corta direto na fotografia, sem transição: é o papel acabando
   e a luz voltando

**A medida da citação fica no `<p>`, não no `<blockquote>`.** `ch` se mede na
fonte do próprio elemento: no blockquote, que herda a Archivo de 16px, os 19ch
viravam uma coluna de 150px para um texto de 48px — uma palavra por linha. No
parágrafo, 22ch são 22 caracteres da Young Serif grande, que é o que se queria
dizer. Vale para qualquer medida em `ch` ou `em` posta num pai: ela se resolve
lá, não no filho.

Saíram duas coisas a pedido do Gabi: a **linha do tempo** (um fio de 1px com um
ponto por obra, arrastável como a vitrine) e a parede de nomes dos diretores, o
`Dirigida por`. As duas ficaram engessadas na página. Os dados seguem no
`conteudo/bio-release-2023.md` e no acervo, se um dia voltarem.

Todo fato ali tem fonte: o release de 2023 (`conteudo/bio-release-2023.md`),
o site antigo, e o que foi conferido no Instagram e na imprensa. O que não
tinha fonte ficou de fora, inclusive o "lidera" do Baixo Augusta: o texto diz
"uma das vozes da banda", que é o que as fontes sustentam.

**O cabeçalho troca de tom sobre o papel.** Ele é fixo e claro, feito para o
preto; sobre uma seção `.claro` a assinatura e o MENU sumiam. O `nav.js` liga
`.header--claro` quando uma seção clara passa pela linha do cabeçalho, e a
regra não vale com o menu aberto, que é preto. Isso corrigiu também o bloco
claro do Ato II, onde o problema já existia.

A passagem no fim leva ao **Ato I**: depois do programa, o espetáculo começa.

## A abertura dos atos

As aberturas eram só tipografia sobre o preto, e o Gabi acertou o diagnóstico:
"cara de IA". O motivo é que a tela era 100% ornamento, tipo grande mais um fio
decorativo, que é a receita de gerador de site. O hero nunca teve esse problema
porque lá a fotografia atravessa as letras, e a tensão entre imagem e tipo é o
que faz parecer desenhado por alguém. As aberturas tinham ficado só com a
metade tipográfica da ideia.

Agora a foto entra pela direita com a borda esquerda dissolvida em máscara e o
título avança por cima dela. Mesmo princípio do hero, em banda mais baixa.

**A imagem é a do painel da home**, de propósito: quem clica no painel do ato
cai na fotografia que acabou de ver. A exceção é o Ato II, que precisou de uma
foto mais forte: a do painel deixava a figura pequena e escura no canto, então
ali entra um retrato de palco da série da Clara Nunes. Brilho e enquadramento
são variáveis por página (`--foto-brilho`, `--foto-pos`).

**A máscara não pode cair em cima da pessoa.** A foto da abertura era um
retrato de 933×1400 numa banda deitada: o `cover` cortava a Bruna no pescoço, e
a dissolvência da esquerda passava por cima do resto — "o fade que eu tava
falando era aqui q corta a Bruna inteira". Eu tinha lido a primeira reclamação
como escuridão e mexido no brilho, que era a metade errada do problema.

O conserto foi de arquivo: a imagem foi recortada da original
(`ClaraNunesBP02`, 1365×2048) já deitada, 1600×1172, com ela inteira no quadro e
folga em cima e embaixo. **Recorte a foto para o formato do quadro em vez de
deixar o `cover` decidir onde cortar.**

**Depois disso o quadro chegou a seguir a proporção da imagem** (`aspect-ratio`),
para não cortar nada. Durou pouco: a largura do quadro passa a sair da altura da
banda, e uma foto em retrato virava uma tira — o Ato I ficou com 543px de faixa,
"nada a ver". O pedido que resolveu foi do Gabi: *"não precisa manter a foto
toda, mas faz tipo um hero"*.

**Hoje as aberturas são o hero em banda**, e o molde é o do `hero.css`: a foto
ocupa uma faixa à direita a partir de `--foto-borda`, cobre o quadro cortando o
que precisar, e dissolve na esquerda com `--foto-fade`. A banda é alta de
propósito — `clamp(520px, 90svh, 1060px)` — porque quanto mais alta, menos o
`cover` precisa cortar na vertical. Cada ato ajusta `--foto-borda`, `--foto-pos`
e `--foto-fade`; o Ato I, cuja foto é quadrada e a figura ocupa o quadro todo,
usa borda 42% e rampa 26%.

**A lição das três voltas:** a moldura não pode ser refém da foto nem a foto
refém da moldura. Recorte a imagem perto do formato do quadro, e deixe o `cover`
resolver os últimos por cento.

**A dissolvência estava comendo a pessoa** — "é tanto fade aqui q não dá pra ver
a mulher". Dois efeitos se somavam justamente em cima do rosto: a máscara só
chegava a opaca em 44% da figura, e o véu de leitura jogava 62% de preto sobre
os primeiros 30% dela. Como a figura começa em 46% da tela, essa soma caía
exatamente onde o rosto está. Agora a máscara fecha em 26%, o véu começa em 55%
e morre em 20%, e o brilho de repouso subiu de .76 para .9. A máscara existe
para entregar o título, não para esconder a fotografia.

**Saíram os "Cena 1, Cena 2, Cena 3".** Os títulos já dizem o que cada bloco é —
Teatro musical, Televisão, Publicidade — e o número só repetia a estrutura para
quem já estava vendo. O rótulo que sobrou é o que descreve de verdade: "As
outras montagens". A regra `.cena__num` saiu junto, e as margens que existiam
para separar título de eyebrow foram a zero.

**As miniaturas dos clipes estavam em `brightness(.78)`.** No quadro do
"Imaginei Você", que já é preto e branco e escuro, isso dava um retângulo vazio
na página. Foram para `.9`, com menos dessaturação. Mesma doença da abertura:
tratamento pensado para foto clara, aplicado em foto escura.

A Trajetória fica sem foto na abertura de propósito: ela não é ato, e o retrato
vem logo abaixo, na folha clara.

**Os clipes perderam a numeração.** O `01 02 03` ao lado dos títulos ficou
brega, e não informava nada: a ordem já é visível. Saiu a coluna inteira da
grade, não só o texto, para o título não ficar com um buraco à esquerda.

**O Ato I é lista**, e chegou aqui depois de três tentativas e de um erro meu de
leitura.

A primeira versão era só tipografia, com a miniatura aparecendo apenas ao
seguir o cursor: a página ficava preta e vazia, e no celular não havia imagem
nenhuma, porque não há cursor para seguir.

A segunda pôs a miniatura fixa ao lado do título, na gramática dos filmes da
Cena 3. É esta que está no ar.

A terceira foi um mosaico de cartões 16:9 com o título por cima da imagem, e
nasceu de um diagnóstico errado: li "mas não tá bonito igual tô vendo aqui no
lado" como rejeição do desenho em linha, quando o que estava feio era a folha
de estilo velha no cache do navegador. O Gabi mandou as duas telas lado a lado
— "não é assim que eu quero" no mosaico, "é assim" na lista — e o mosaico saiu
com `git checkout 10c9049`.

**A lição é sobre diagnóstico, não sobre desenho.** Antes de refazer uma tela
porque ela "está feia", confirme que o que a outra pessoa está vendo é o que
você acabou de publicar. Era cache. A reforma inteira foi trabalho perdido, e
é a origem do carimbo de versão descrito logo abaixo.

As miniaturas vêm do YouTube mas ficam hospedadas aqui (`assets/img/clipes/`,
268 KB), para não depender de terceiro nem entregar o visitante ao rastreio do
YouTube antes do clique. A miniatura que seguia o cursor saiu do CSS e do
`player.js`.


## Clicar num painel não abria a galeria

O sintoma: no computador, clicar num musical não fazia nada. No celular
funcionava. E clicar pelo console (`palco.click()`) funcionava também, o que
mandou a investigação para o lado errado — o visor abria, a foto carregava, o
CSS estava certo, os 47 gatilhos batiam com as 16 galerias, os arquivos
respondiam 200. Não havia nada quebrado para achar.

A causa está no arrasto da vitrine, em `vitrine.js`: ele chamava
`setPointerCapture` já no `pointerdown`. **Com o ponteiro capturado, o navegador
entrega o `click` ao elemento que capturou** — a pista — e não ao painel dentro
dela. O `galeria.js` procura o `data-galeria` a partir do alvo do clique
(`e.target.closest('[data-galeria]')`), achava o `<ul>`, que não tem atributo
nenhum, e desistia em silêncio. No toque o código nem entra nesse caminho, daí
o celular funcionar. E `element.click()` não passa por ponteiro, daí o console
funcionar.

A captura agora só começa depois que o cursor anda mais de 6px, quando já é
arrasto de verdade e não mais candidato a clique. Ao soltar depois de arrastar,
um `click` de capture-phase é engolido uma única vez, para o gesto não abrir uma
galeria por acidente.

**A lição:** quando o clique programático funciona e o do usuário não, o
problema está no caminho do evento, não no que o clique faz. E `setPointerCapture`
muda esse caminho.


## O showreel do Ato III

So o video, sem titulo, sem cartao, sem moldura e sem legenda. Um minuto e meio
de cortes de show se explica sozinho — o titulo "Bruna no palco." chegou a
existir e saiu a pedido do Gabi: dizia em palavra o que a imagem ja dizia.

**O vídeo entra mudo e sai do silêncio quando alguém pede.** Ao chegar à tela
ele toca em laço, sem som, como uma fotografia que se mexe; ao clique, recomeça
do zero com áudio, sem laço e com os controles nativos do navegador. Mudo na
prévia não é escolha estética: navegador nenhum deixa tocar com som sem gesto do
usuário, e mesmo que deixasse, som que começa sozinho é falta de educação. Fora
da tela o vídeo pausa, inclusive depois de ligado o som — áudio tocando numa
seção que ninguém está vendo é pior do que silêncio.

Nada de player escrito à mão: `controls` nativo já traz teclado, tela cheia e
acessibilidade, e funciona melhor do que qualquer coisa que eu fizesse. O convite
ao som é tipografia, não botão — o mesmo corpo das notas do site com o triângulo
que já abre clipes e filmes — e some ao ser usado.

A prévia está um passo mais escura (`brightness(.86)`), no mesmo tratamento das
fotografias do site; ao ligar o som volta ao brilho cheio. É a diferença entre
olhar e assistir, dita sem palavra nenhuma.

**O arquivo.** O original tem 180 MB a 15,6 Mbps, o que não se serve numa página.
Reencodado em 1920×1080 a 2 Mbps dá **23 MB**, com `faststart` para começar antes
de baixar tudo e `preload="metadata"` para não gastar banda de quem não desceu
até aqui. Uma primeira tentativa a 4 Mbps deu 46 MB — bonito e impraticável.

**A entrada por rolagem está escrita aqui dentro.** A regra geral de
`[data-reveal]` mora no `atos.css`, e só a home carrega aquele arquivo: em
`musica.html` e `em-cena.html` o atributo está no HTML, o `reveal.js` roda, e
nada acontece, porque não existe o `opacity: 0` de onde animar. Como o pedido
era fazer só esta seção, copiei a regra escopada em `.showreel`. **Fica anotado
que a animação de entrada daquelas duas páginas nunca funcionou** — mover o
bloco genérico para o `base.css` conserta as três de uma vez, e é conversa para
depois da aprovação desta seção.


## A página de contato

Não é formulário e não são cartões: são três linhas de um índice, do tamanho de
um título. A tipografia é a interface — quem lê "Shows & booking" em corpo 76 já
sabe onde clicar, e não precisa de caixa em volta para entender que aquilo é
clicável.

**A hierarquia é a da carreira dela agora.** Ao vivo é a prioridade, então
`Shows & booking` vem primeiro, em corpo 76 contra 50 dos outros dois, com mais
respiro em cima e embaixo. Não é destaque decorativo: é a ordem em que ela quer
ser procurada.

**O coral aparece em dois lugares e só:** o rótulo da abertura e o fio que
atravessa a linha no hover — o mesmo gesto da lista de clipes do Ato I. No
hover, nada acende e nada muda de cor: a linha inteira anda um fio para a
direita, o texto de apoio clareia e a seta avança. Em mais lugares que isso, o
coral deixaria de ser detalhe.

**O e-mail dela é um só.** Então os três blocos apontam para o mesmo endereço e
mudam apenas o assunto — `?subject=Shows e booking`, `Projetos e parcerias`,
`Imprensa` — que chega pronto na caixa e separa o que e o que. Três portas, uma
sala, e ela sabendo de qual porta a pessoa veio sem precisar de três contas.

O endereço ainda não existe, e inventar e-mail de assessoria seria pior do que
deixar em branco: os href trazem a palavra `ENDERECO`, que é impossível
confundir com um endereço real. Trocá-la nos três liga a página.

**O retrato é ela estendendo o microfone** (`BP_000`), e é o motivo de a foto
ficar ao lado do título e não no fim da página: o gesto diz "vamos conversar"
antes da tipografia dizer. No celular ela desce para baixo do texto e vira
paisagem, que é o recorte que cabe sem empurrar os contatos para fora da tela.

A página não menciona ato nenhum, de propósito: o programa em atos organiza a
obra, e quem chega aqui quer falar com uma pessoa.


## O formulário, o endereço e o registro

A primeira versão da página proibia formulário — estava escrito no pedido. O
Gabi mudou de ideia depois de ver a página pronta, e tem razão: contratante em
celular não abre o programa de e-mail, escreve ali e vai embora.

**Sem botão na abertura e sem título no formulário.** O "Escrever" virou
redundante quando o formulário entrou logo abaixo — era um botão para rolar
dois dedos de página — e o "Escreva." dizia em palavra o que o primeiro campo
já diz. Mesma poda do título do showreel: nas duas telas, a coisa se apresenta
sozinha.

**Formulário sem caixa.** Cada campo é uma linha com um fio de 1px embaixo, que
vira coral ao ser usado — o mesmo fio do convite e da lista de clipes. Retângulo
cinza com canto arredondado é a única coisa que faria esta página parecer
template. Nome e e-mail dividem a linha, a mensagem ocupa a largura inteira, e
no celular tudo empilha.

**Web3Forms.** O formulário sai no formato que eles esperam: `POST` para
`api.web3forms.com/submit`, com a `access_key` no HTML — ela é pública de
propósito, e é assim que o serviço funciona: quem protege é o domínio e o
filtro de spam deles, não o segredo da chave, um `subject` que chega pronto
na caixa dela, e o campo `botcheck` — a armadilha de robô, que existe no HTML e
não na tela. Sem `redirect`, o Web3Forms mostra a página de sucesso dele; se ela
quiser voltar para o site, é um campo a mais.

**O amarelo do autofill** é desfeito com `box-shadow` interno da cor do fundo:
sem isso, o navegador pinta o campo preenchido de amarelo no meio da página
preta.

**O endereço é `contato.brunapazinato@gmail.com`**, escrito no pé da seção para
quem prefere o próprio programa de e-mail. O convite lá em cima deixou de ser
`mailto:` e passou a levar ao formulário, para não existirem dois caminhos
competindo na mesma tela.

**DRT 0037897 SSP · OMB 68682** ficam nesse mesmo pé, em corpo miúdo. Registro
profissional não é conteúdo de portfólio: quem procura é contratante e imprensa,
e os dois chegam por esta página. No rodapé global ficaria repetindo em cinco
páginas que não têm nada a ver com isso.

## Carimbo de versão nos arquivos

Todo `<link>` de CSS e `<script>` de JS leva `?v=<data e hora>`. O GitHub Pages
serve tudo com `max-age=600`, então por até dez minutos o navegador pode ficar
com a folha antiga e o HTML novo. Quando isso aconteceu de verdade, a página do
Ato I apareceu crua, sem estilo nenhum: as classes tinham mudado de `faixa` para
`clipe` e nenhuma regra guardada casava mais.

**A regra vale para imagem trocada no mesmo nome.** O painel do Ato III passou
da foto de chapéu para a de palco, e o Gabi continuou vendo o chapéu: o arquivo
mudou de conteúdo mas manteve o caminho, e o navegador guardou o antigo por dez
minutos. Conferido no ar, o arquivo servido já era o novo. Só o HTML é que não
tinha como avisar.

Quando a fotografia muda e o nome fica, carimbe **aquele `src`** — não todos.
Carimbar imagem que não mudou joga fora cache bom, e são centenas de KB por
página. Hoje carregam carimbo só `ato-ao-vivo.jpg` e `abertura-em-cena.jpg`,
que foram substituídas no lugar. Renomear o arquivo resolveria igual; o carimbo
é mais barato porque não mexe em quem aponta para ele.

**As cinco páginas** — o carimbo agora cobre `index`, `musica`, `em-cena`,
`ao-vivo` e `trajetoria`.

**Ao publicar mudança de CSS ou JS, atualize o carimbo nas seis páginas.**
Uma linha resolve:

```powershell
$v = Get-Date -Format "yyyyMMddHHmm"
Get-ChildItem *.html | ForEach-Object {
  $t = [System.IO.File]::ReadAllText($_.FullName)
  $t = [regex]::Replace($t, '(assets/[^"]+\.(css|js))\?v=\d+', '$1')
  $t = [regex]::Replace($t, '(assets/[^"]+\.(css|js))"', ('$1?v=' + $v + '"'))
  [System.IO.File]::WriteAllText($_.FullName, $t, (New-Object System.Text.UTF8Encoding $false))
}
```
