import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CODES, getCharacter } from '@/lib/data';
import { rarityLabel } from '@/lib/rarity';
import ShareBar from '@/components/ShareBar';

export const dynamicParams = false;

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export function generateMetadata({ params }) {
  const ch = getCharacter(params.code);
  if (!ch) return {};
  const title = `나는 ${ch.name} · Testory`;
  const desc = ch.shareCopy;
  const img = `/og/${ch.code}.png`;
  const url = `/r/${ch.code}/`;
  return {
    title,
    description: desc,
    openGraph: { type: 'website', siteName: 'Testory', title, description: desc, url, images: [img] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [img] },
  };
}

export default function ResultPage({ params }) {
  const ch = getCharacter(params.code);
  if (!ch) notFound();
  const rl = rarityLabel(ch.rarity);

  return (
    <main className="screen result">
      <div className="result-card">
        <p className="eyebrow">나의 전생 영혼동물</p>
        <div className="result-emoji">{ch.emoji}</div>
        <h1 className="result-name">{ch.name}</h1>
        <p className="result-animal">{ch.animal}</p>
        <p className="result-tagline">“{ch.tagline}”</p>
        <div className={`rarity-pill ${rl.cls}`}>
          전체의 {ch.rarity}% · {rl.label}
        </div>
        <p className="result-desc">{ch.description}</p>
        <div className="result-strengths">
          <span>강점</span>
          {ch.strengths}
        </div>
      </div>

      <ShareBar code={ch.code} name={ch.name} shareCopy={ch.shareCopy} />

      <Link href="/" className="btn btn-ghost" style={{ maxWidth: 360 }}>
        다시 하기
      </Link>
      <p className="foot">TESTORY</p>
    </main>
  );
}
