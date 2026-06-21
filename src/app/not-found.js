import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="screen">
      <div className="win">
        <div className="win-title">
          <span className="win-title-text">오류 — 404</span>
          <span className="win-btns">
            <i>─</i>
            <i>□</i>
            <i>✕</i>
          </span>
        </div>
        <div className="win-body">
          <div className="result-emoji">💾</div>
          <h1 className="intro-title" style={{ fontSize: '1.6rem' }}>
            페이지를 찾을 수 없어요
          </h1>
          <p className="intro-sub">존재하지 않는 영혼이에요.
            <br />처음부터 다시 해볼까요?</p>
          <Link href="/" className="btn btn-primary">
            ▶ 처음으로
          </Link>
        </div>
      </div>
    </main>
  );
}
