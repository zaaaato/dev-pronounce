import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  // Waku injects this into the body of index.html.
  return (
    <div className="font-['Inter', 'Noto_Sans_JP', sans-serif] bg-[#FFFBF0] text-slate-800 min-h-screen antialiased selection:bg-orange-200 selection:text-orange-900">
      {children}
    </div>
  );
}