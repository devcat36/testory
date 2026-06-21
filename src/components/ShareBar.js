'use client';

import { useState } from 'react';

export default function ShareBar({ code, name, shareCopy }) {
  const [copied, setCopied] = useState(false);

  function resultUrl() {
    if (typeof window !== 'undefined') return `${window.location.origin}/r/${code}/`;
    return `https://testory.turtlelab.cc/r/${code}/`;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${shareCopy}\n${resultUrl()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard unavailable (e.g. insecure context) — ignore */
    }
  }

  async function share() {
    const data = { title: `Testory · ${name}`, text: shareCopy, url: resultUrl() };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    copy();
  }

  return (
    <div className="share">
      <button className="btn btn-pink" onClick={share}>
        ✉ 공유하기
      </button>
      <div className="share-row">
        <button className="btn btn-cyan" onClick={copy}>
          {copied ? '복사완료!' : '🔗 링크복사'}
        </button>
        <a className="btn btn-ghost" href={`/og/${code}.png`} download={`testory-${code}.png`}>
          💾 카드저장
        </a>
      </div>
    </div>
  );
}
