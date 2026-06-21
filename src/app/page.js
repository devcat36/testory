import Link from 'next/link';
import { CHARACTERS, QUESTIONS } from '@/lib/data';

export default function Home() {
  return (
    <main className="screen">
      <div className="win">
        <div className="win-title">
          <span className="win-title-text">★ testory.exe</span>
          <span className="win-btns">
            <i>─</i>
            <i>□</i>
            <i>✕</i>
          </span>
        </div>
        <div className="win-body">
          <div className="marquee">
            <span>＼환영합니다／ ✦ 당신의 전생 영혼동물은? ✦ 지금 바로 확인 ✦ 친구랑 같이 해봐 ✦</span>
          </div>
          <p className="eyebrow">⭐ 무료 심리테스트 ⭐</p>
          <h1 className="intro-title">
            나의 전생
            <br />
            영혼동물
          </h1>
          <p className="intro-sub">
            빛 · 하늘 · 불꽃, 세 기운이 깨어나며
            <br />
            너의 영혼동물이 결정된다!
          </p>
          <div className="spec-table">
            <div>
              <b>문항</b>
              <span>{QUESTIONS.length}개</span>
            </div>
            <div>
              <b>소요</b>
              <span>약 2분</span>
            </div>
            <div>
              <b>결과</b>
              <span>{CHARACTERS.length}종</span>
            </div>
          </div>
          <Link href="/quiz/" className="btn btn-primary">
            ▶ 테스트 시작!
          </Link>
          <p className="foot">best viewed in 1024×768 ⊹ since 2026</p>
        </div>
      </div>
    </main>
  );
}
