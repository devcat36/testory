// Build-time generator for OG share cards (1200x630 PNG per character + a default).
// Runs in the Docker build stage (amd64, native) before `next build`, writing into
// public/og/ so the static export picks them up. Pure text cards (no emoji) so we
// only need the bundled Korean font — no emoji image fetching at build time.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const design = JSON.parse(readFileSync(join(root, 'src/data/test-design.json'), 'utf8'));
const fontRegular = readFileSync(join(root, 'assets/fonts/Pretendard-Regular.ttf'));
const fontBold = readFileSync(join(root, 'assets/fonts/Pretendard-Bold.ttf'));

const outDir = join(root, 'public/og');
mkdirSync(outDir, { recursive: true });

const fonts = [
  { name: 'Pretendard', data: fontRegular, weight: 400, style: 'normal' },
  { name: 'Pretendard', data: fontBold, weight: 700, style: 'normal' },
];

function rarityLabel(r) {
  if (r <= 7) return '최고 레어';
  if (r <= 11) return '레어';
  if (r <= 15) return '언커먼';
  return '흔한 영혼';
}

const div = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function frame(children) {
  return div(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '76px',
      background: 'linear-gradient(135deg, #1a1140 0%, #2a1a5e 55%, #4a1f6e 100%)',
      color: '#f3efff',
      fontFamily: 'Pretendard',
    },
    children
  );
}

function header() {
  return div(
    { fontSize: '30px', letterSpacing: '8px', color: '#c9b8ff', fontWeight: 700 },
    'TESTORY · 나의 전생 영혼동물'
  );
}

function characterCard(ch) {
  return frame([
    header(),
    div({ flexDirection: 'column' }, [
      div({ fontSize: '40px', color: '#b69bff', marginBottom: '10px' }, ch.animal),
      div({ fontSize: '108px', fontWeight: 700, lineHeight: '1.05', marginBottom: '22px' }, ch.name),
      div({ fontSize: '42px', color: '#d8c9ff' }, `“${ch.tagline}”`),
    ]),
    div(
      {
        alignSelf: 'flex-start',
        fontSize: '34px',
        fontWeight: 700,
        color: '#1a1140',
        background: '#ffd86b',
        padding: '14px 32px',
        borderRadius: '999px',
      },
      `전체의 ${ch.rarity}% · ${rarityLabel(ch.rarity)}`
    ),
  ]);
}

function defaultCard() {
  return frame([
    header(),
    div({ flexDirection: 'column' }, [
      div({ fontSize: '116px', fontWeight: 700, lineHeight: '1.12' }, '나의 전생'),
      div({ fontSize: '116px', fontWeight: 700, lineHeight: '1.12', marginBottom: '22px' }, '영혼동물'),
      div({ fontSize: '44px', color: '#d8c9ff' }, '7개 질문이면 끝 — 당신은 어떤 영혼?'),
    ]),
    div(
      {
        alignSelf: 'flex-start',
        fontSize: '32px',
        fontWeight: 700,
        color: '#1a1140',
        background: '#ffd86b',
        padding: '14px 32px',
        borderRadius: '999px',
      },
      '지금 테스트하기'
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
  console.log(`[gen-og] wrote ${design.characters.length + 1} OG cards to public/og/`);
}

main().catch((err) => {
  console.error('[gen-og] failed:', err);
  process.exit(1);
});
