import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="screen">
      <div className="intro-inner">
        <p className="eyebrow">Testory</p>
        <h1 className="intro-title" style={{ fontSize: '2rem' }}>
          영혼을 찾지 못했어요
        </h1>
        <p className="intro-sub">존재하지 않는 결과예요. 처음부터 다시 해볼까요?</p>
        <Link href="/" className="btn btn-primary">
          처음으로
        </Link>
      </div>
    </main>
  );
}
