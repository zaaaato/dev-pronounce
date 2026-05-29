'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

interface ShareRowProps {
  url: string; // 共有する絶対URL（/t/[id]）。空ならクライアントで location から補う
  text: string; // 共有テキスト
}

const btn =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 font-mono font-bold uppercase tracking-mono text-xs border-[3px] border-ink shadow-brut-sm transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]';

const ShareRow: React.FC<ShareRowProps> = ({ url, text }) => {
  const [copied, setCopied] = useState(false);

  const resolvedUrl = () => url || (typeof window !== 'undefined' ? window.location.href : '');
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
    resolvedUrl(),
  )}`;

  const handleNative = async () => {
    const shareUrl = resolvedUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text, url: shareUrl });
      } catch {
        /* ユーザーキャンセルは無視 */
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={handleNative} className={`${btn} bg-accent2 text-surface`}>
        <Share2 className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        シェア
      </button>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-ink text-surface`}>
        <span aria-hidden="true" className="font-extrabold">𝕏</span>
        ポスト
      </a>
      <button type="button" onClick={handleCopy} className={`${btn} bg-paper text-ink`}>
        {copied ? (
          <Check className="w-4 h-4 text-success" strokeWidth={3} aria-hidden="true" />
        ) : (
          <Link2 className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        )}
        {copied ? 'コピーした！' : 'リンク'}
      </button>
    </div>
  );
};

export default ShareRow;
