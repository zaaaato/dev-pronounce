'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TermData } from '../../types';
import { computeContrarian, type Pick } from '../../lib/contrarian';
import ShareRow from './ShareRow';

interface ContrarianMeterProps {
  picks: Pick[];
  terms: TermData[];
  onBack: () => void;
}

const ContrarianMeter: React.FC<ContrarianMeterProps> = ({ picks, terms, onBack }) => {
  const r = computeContrarian(picks, terms);
  const minorityRows = r.rows.filter((row) => row.isMinority);

  const shareText = `DevPronounceで診断したら逆張り度${r.score}%「${r.title}」だった #DevPronounce`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface border-4 border-ink shadow-brut">
      <div className="bg-ink text-surface px-5 md:px-7 py-3">
        <h2 className="font-mono text-sm font-bold tracking-mono">
          <span className="text-accent">&gt;</span> 逆張り度しんだん
        </h2>
      </div>

      <div className="p-6 md:p-10">
        {/* スコア + メーター */}
        <div className="flex items-end gap-3 mb-3">
          <span className="font-display font-bold leading-none text-[clamp(4rem,18vw,7rem)] tracking-[-0.04em] text-ink tnum">
            {r.score}
          </span>
          <span className="font-mono font-extrabold text-3xl text-ink mb-2">%</span>
          <span className="font-mono text-xs font-bold tracking-mono text-muted mb-3 ml-1">逆張り度</span>
        </div>
        <div className="w-full h-8 border-[3px] border-ink bg-paper overflow-hidden mb-6">
          <div
            className="h-full bg-accent border-r-[3px] border-ink transition-[width] duration-[600ms] [transition-timing-function:steps(20,end)] motion-reduce:transition-none"
            style={{ width: `${r.score}%` }}
          />
        </div>

        {/* 称号 */}
        <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-1">あなたは…</p>
        <h3 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-[-0.02em] mb-1">
          「{r.title}」
        </h3>
        <p className="font-jp text-sm text-muted mb-6">{r.sub}</p>

        <p className="font-mono text-xs font-bold tracking-mono text-ink mb-5">
          {r.total}語中 <span className="text-accent2 tnum">{r.minorityCount}</span>語で少数派だった
        </p>

        {/* 少数派だった単語 */}
        {minorityRows.length > 0 && (
          <div className="border-t-2 border-ink pt-4 mb-7">
            <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-3">
              ▸ 少数派だった読み
            </p>
            <ul className="space-y-2">
              {minorityRows.map((row, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 border-2 border-ink bg-paper px-3 py-2"
                >
                  <span className="min-w-0 flex items-baseline gap-2">
                    <span className="font-display font-bold text-ink shrink-0">{row.word}</span>
                    <span className="font-jp font-bold tracking-kana text-sm text-ink truncate">
                      {row.pickLabel}
                    </span>
                  </span>
                  <span className="font-mono text-xs font-bold tnum text-muted shrink-0">{row.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* シェア */}
        <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-3">
          ▸ 診断結果をシェア
        </p>
        <ShareRow url={shareUrl} text={shareText} />

        <div className="mt-7">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-ink text-surface font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-6 py-3 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
            投票に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContrarianMeter;
