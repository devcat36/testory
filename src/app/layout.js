import './globals.css';

export const metadata = {
  metadataBase: new URL('https://testory.turtlelab.cc'),
  title: 'Testory — 나의 전생 영혼동물',
  description: '나의 전생 영혼동물은? 8종의 신화 아키타입 중 당신의 영혼을 찾아보세요.',
  openGraph: {
    type: 'website',
    siteName: 'Testory',
    title: 'Testory — 나의 전생 영혼동물',
    description: '나의 전생 영혼동물은 어떤 모습일까? 지금 바로 확인!',
    images: ['/og/default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testory — 나의 전생 영혼동물',
    description: '나의 전생 영혼동물은 어떤 모습일까? 지금 바로 확인!',
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
