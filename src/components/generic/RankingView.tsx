'use client';

import React, { useState } from 'react';
import type { RankedTerm } from '../../lib/ranking';

interface RankingViewProps {
  ranked: RankedTerm[];
  consensus: RankedTerm[];
  judging: RankedTerm[];
}

type Tab = 'divisive' | 'consensus';

const RankRow: React.FC<{ item: RankedTerm; index: number; mode: Tab }> = ({ item, index, mode }) => {
  const { term, top1, top2, total, score } = item;
  const bigNum = mode === 'divisive' ? score : top1?.pct ?? 0;
  const bigLabel = mode === 'divisive' ? '割れ度' : '一致度';

  return (
    <a
      href={`/t/${encodeURIComponent(term.id)}`}
      className="block bg-paper border-[3px] border-ink shadow-brut-sm p-4 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex items-center justify-center w-9 h-9 shrink-0 border-2 border-ink bg-surface font-mono font-bold text-sm tnum">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <div className="font-display font-bold text-2xl text-ink leading-none [overflow-wrap:anywhere]">
              {term.word}
            </div>
            <div className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mt-1 truncate">
              {term.description}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-extrabold text-3xl tnum text-ink leading-none">{bigNum}</div>
          <div className="font-mono text-[0.625rem] font-bold tracking-mono text-muted mt-0.5">{bigLabel}</div>
        </div>
      </div>

      {/* 上位2読みの対決バー（黄 vs コバルト、残りは空き＝その他） */}
      <div className="mt-3 flex w-full h-6 border-2 border-ink bg-surface overflow-hidden">
        <div className="h-full bg-accent border-r-2 border-ink" style={{ width: `${top1?.pct ?? 0}%` }} />
        <div className="h-full bg-accent2" style={{ width: `${top2?.pct ?? 0}%` }} />
      </div>
      <div className="mt-1.5 font-mono text-[0.6875rem] font-bold tracking-mono text-ink flex flex-wrap gap-x-2">
        {top1 && (
          <span>
            <span className="text-ink">■</span> {top1.label} {top1.pct}%
          </span>
        )}
        {top2 && (
          <span className="text-muted">
            <span className="text-accent2">■</span> {top2.label} {top2.pct}%
          </span>
        )}
        <span className="text-muted tnum">N={total}</span>
      </div>
    </a>
  );
};

const RankingView: React.FC<RankingViewProps> = ({ ranked, consensus, judging }) => {
  const [tab, setTab] = useState<Tab>('divisive');
  const list = tab === 'divisive' ? ranked : consensus;

  const tabBtn = (key: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      aria-pressed={tab === key}
      className={`min-h-[44px] px-5 font-mono font-bold uppercase tracking-mono text-xs border-[3px] border-ink transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px] ${
        tab === key
          ? 'bg-ink text-surface shadow-brut-active'
          : 'bg-paper text-ink shadow-brut-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-md'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {tabBtn('divisive', '論争 / 割れ度')}
        {tabBtn('consensus', '満場一致')}
      </div>

      <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-4">
        {tab === 'divisive'
          ? '▸ もっとも読み方が割れている用語ランキング'
          : '▸ もっとも読み方が一致している用語ランキング'}
      </p>

      <ol className="space-y-3">
        {list.map((item, i) => (
          <li key={item.term.id}>
            <RankRow item={item} index={i} mode={tab} />
          </li>
        ))}
      </ol>

      {judging.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-3">
            ▸ 判定中（票が少ない用語・{judging.length}件）
          </p>
          <div className="flex flex-wrap gap-2">
            {judging.map((j) => (
              <a
                key={j.term.id}
                href={`/t/${encodeURIComponent(j.term.id)}`}
                className="font-mono text-xs font-bold border-2 border-ink bg-paper px-3 py-2 hover:bg-accent transition-colors duration-[120ms] focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                {j.term.word} <span className="text-muted tnum">N={j.total}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingView;
