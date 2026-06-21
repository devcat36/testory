import './globals.css';

export const metadata = {
  metadataBase: new URL('https://testory.turtlelab.cc'),
  title: 'Testory — 나의 전생 영혼동물',
  description: '7개 질문으로 알아보는 나의 전생 영혼동물. 8종의 신화 아키타입 중 당신의 영혼은?',
  openGraph: {
    type: 'website',
    siteName: 'Testory',
    title: 'Testory — 나의 전생 영혼동물',
    description: '7개 질문이면 끝. 당신의 전생 영혼동물은 어떤 모습일까?',
    images: ['/og/default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testory — 나의 전생 영혼동물',
    description: '7개 질문이면 끝. 당신의 전생 영혼동물은?',
    images: ['/og/default.png'],
  },
};

export const viewport = {
  themeColor: '#a7e6ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
