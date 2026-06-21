// Build-time OG share cards (1200x630 PNG per character + default), Y2K / 2000s style:
// pixel font (Galmuri), fake window chrome, thick ink border + hard offset shadow on a
// bright dotted sky. Runs in the Docker build stage (amd64) before `next build`.
// Pure text (no emoji) so only the bundled Galmuri fonts are needed.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const design = JSON.parse(readFileSync(join(root, 'src/data/test-design.json'), 'utf8'));
const fontDir = join(root, 'assets/fonts');
const fonts = [
  { name: 'Galmuri11', data: readFileSync(join(fontDir, 'Galmuri11.ttf')), weight: 400, style: 'normal' },
  { name: 'Galmuri11', data: readFileSync(join(fontDir, 'Galmuri11-Bold.ttf')), weight: 700, style: 'normal' },
  { name: 'Galmuri14', data: readFileSync(join(fontDir, 'Galmuri14.ttf')), weight: 400, style: 'normal' },
];

const INK = '#1a1736';
const outDir = join(root, 'public/og');
mkdirSync(outDir, { recursive: true });

function rarityLabel(r) {
  if (r <= 7) return '최고 레어';
  if (r <= 11) return '레어';
  if (r <= 15) return '언커먼';
  return '흔한 영혼';
}

const div = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function windowFrame(titleText, bodyChildren) {
  return div(
    {
      width: '1200px',
      height: '630px',
      padding: '56px',
      background: '#a7e6ff',
      fontFamily: 'Galmuri11',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [
      div(
        {
          width: '100%',
          flexDirection: 'column',
          background: '#ffffff',
          border: `5px solid ${INK}`,
          borderRadius: '14px',
          boxShadow: `14px 14px 0 ${INK}`,
          overflow: 'hidden',
        },
        [
          // title bar
          div(
            {
              background: '#ff5fa2',
              borderBottom: `5px solid ${INK}`,
              padding: '16px 26px',
              color: '#ffffff',
              fontSize: '28px',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            [div({}, titleText), div({ letterSpacing: '6px' }, '_ ㅁ X')]
          ),
          // body
          div({ flexDirection: 'column', padding: '44px 52px' }, bodyChildren),
        ]
      ),
    ]
  );
}

function characterCard(ch) {
  return windowFrame('★ testory.exe', [
    div({ fontSize: '32px', color: '#ff2e93', marginBottom: '6px' }, ch.animal),
    div({ fontFamily: 'Galmuri14', fontSize: '92px', color: INK, lineHeight: '1.1', marginBottom: '20px' }, ch.name),
    div({ fontSize: '34px', color: '#4a4766' }, `"${ch.tagline}"`),
    div(
      {
        alignSelf: 'flex-start',
        marginTop: '30px',
        fontSize: '30px',
        color: INK,
        background: '#ffd62e',
        border: `4px solid ${INK}`,
        borderRadius: '999px',
        padding: '12px 28px',
        boxShadow: `5px 5px 0 ${INK}`,
      },
      `전체의 ${ch.rarity}% · ${rarityLabel(ch.rarity)}`
    ),
  ]);
}

function defaultCard() {
  return windowFrame('★ testory.exe — 나의 전생 영혼동물', [
    div({ fontFamily: 'Galmuri14', fontSize: '88px', color: INK, lineHeight: '1.15' }, '나의 전생 영혼동물'),
    div({ fontSize: '36px', color: '#4a4766', marginTop: '18px' }, `${design.questions.length}개 질문이면 끝! 당신은 어떤 영혼?`),
    div(
      {
        alignSelf: 'flex-start',
        marginTop: '30px',
        fontSize: '30px',
        color: '#ffffff',
        background: '#ff5fa2',
        border: `4px solid ${INK}`,
        borderRadius: '999px',
        padding: '12px 28px',
        boxShadow: `5px 5px 0 ${INK}`,
      },
      '지금 테스트 ▶'
    ),
  ]);
}

async function toPng(node) {
  const svg = await satori(node, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

async function main() {
  for (const ch of design.characters) {
    writeFileSync(join(outDir, `${ch.code}.png`), await toPng(characterCard(ch)));
  }
  writeFileSync(join(outDir, 'default.png'), await toPng(defaultCard()));
  console.log(`[gen-og] wrote ${design.characters.length + 1} Y2K OG cards to public/og/`);
}

main().catch((err) => {
  console.error('[gen-og] failed:', err);
  process.exit(1);
});
