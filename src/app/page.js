import Link from 'next/link';
import { CHARACTERS, QUESTIONS } from '@/lib/data';

export default function Home() {
  return (
    <main className="screen">
      <div className="intro-inner">
        <p className="eyebrow">Testory</p>
        <h1 className="intro-title">
          나의 전생
          <br />
          영혼동물
        </h1>
        <p className="intro-sub">
          빛 · 하늘 · 불꽃, 세 기운이 깨어나며
          <br />
          당신의 영혼동물이 결정된다.
        </p>
        <p className="intro-meta">
          약 1분 · {QUESTIONS.length}문항 · {CHARACTERS.length}가지 결과
        </p>
        <Link href="/quiz/" className="btn btn-primary">
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
}
