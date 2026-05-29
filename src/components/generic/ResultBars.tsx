'use client';

import React, { useEffect, useState } from 'react';
import { PronunciationOption } from '../../types';

interface MyPick {
  id?: string;
  label?: string;
}

interface ResultBarsProps {
  options: PronunciationOption[];
  totalVotes: number;
  myPick?: MyPick | null;
}

/**
 * 投票結果を硬質なdivバーで表示する（recharts は撤去）。
 * 順位は「色（ハザード/インクの輝度差）」「順位番号」「票数/％」「バー幅」で冗長にエンコードするため、
 * 色覚特性に依存せず判別できる（WCAG 1.4.1）。
 */
const ResultBars: React.FC<ResultBarsProps> = ({ options, totalVotes, myPick }) => {
  const [shown, setShown] = useState(false);

  // マウント時に一度だけ左→右へワイプ（票が入る度に再生しない）
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const data = [...options]
    .map((opt) => ({
      ...opt,
      percentage: totalVotes > 0 ? Math.round((opt.count / totalVotes) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const isMine = (opt: PronunciationOption) =>
    !!myPick &&
    ((myPick.id != null && opt.id === myPick.id) ||
      (myPick.label != null && opt.label.toLowerCase() === myPick.label.toLowerCase()));

  return (
    <div aria-live="polite">
      <ul className="space-y-3">
        {data.map((opt, i) => {
          const winner = i === 0 && opt.count > 0;
          const mine = isMine(opt);
          return (
            <li
              key={opt.id}
              className={`grid grid-cols-[28px_1fr] gap-3 ${mine ? 'pl-2 border-l-[3px] border-accent2' : ''}`}
              aria-label={`${opt.label}、${opt.count}票、${opt.percentage}パーセント、${i + 1}位${mine ? '、あなたの投票' : ''}`}
            >
              {/* 順位スクエア */}
              <span className="flex items-center justify-center w-7 h-7 border-2 border-ink font-mono font-bold text-sm tnum bg-surface">
                {i + 1}
              </span>

              <div>
                {/* ラベル行（トラック外なので常に ink-on-paper でコントラスト確保） */}
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-jp font-bold tracking-kana text-[0.9375rem] text-ink truncate">
                    {opt.label}
                    {mine && (
                      <span className="ml-2 font-mono text-[0.6875rem] font-bold text-accent2 align-middle">
                        YOU →
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-xs tnum text-ink shrink-0">
                    {opt.count}票 · {opt.percentage}%
                  </span>
                </div>

                {/* トラック + フィル */}
                <div className="relative w-full h-7 bg-surface border-2 border-ink overflow-hidden">
                  <div
                    className={`h-full border-r-[3px] border-ink transition-[width] duration-[350ms] [transition-timing-function:steps(20,end)] motion-reduce:transition-none ${
                      winner ? 'bg-accent' : 'bg-ink'
                    }`}
                    style={{ width: shown ? `${opt.percentage}%` : '0%' }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* データテーブルのように合計で締める */}
      <div className="mt-4 pt-3 border-t-2 border-ink font-mono text-xs font-bold tracking-mono tnum text-muted">
        TOTAL N={totalVotes}
      </div>
    </div>
  );
};

export default ResultBars;
