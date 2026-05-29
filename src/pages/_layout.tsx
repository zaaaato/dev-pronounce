import type { ReactNode } from 'react';
import '../styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  // React 19 は <link> を自動で <head> へホイストする。
  // Latin（Space Grotesk / JetBrains Mono）と日本語（Noto Sans JP, 500/700 のみ）を分けて読み込む。
  return (
    <>
      <link
        rel="icon"
        href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23141414'/%3E%3Ctext x='16' y='24' font-family='monospace' font-size='22' font-weight='800' fill='%232E5BFF' text-anchor='middle'%3E//%3C/text%3E%3C/svg%3E"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        precedence="high"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Space+Grotesk:wght@400;500;700&display=swap"
      />
      <link
        rel="stylesheet"
        precedence="high"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap"
      />
      <div className="min-h-screen flex flex-col font-sans text-ink selection:bg-accent selection:text-ink">
        {children}
      </div>
    </>
  );
}
