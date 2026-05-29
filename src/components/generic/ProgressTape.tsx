import React from 'react';

interface ProgressTapeProps {
  current: number; // 0-based index
  total: number;
  label?: string; // 現在の用語の説明
}

const CELL_MODE_MAX = 12;

/**
 * デッキ内の現在位置を示すセグメント「テープ」。
 * 用語数が CELL_MODE_MAX 以下なら1用語1セルのフィルムストリップ、
 * それを超えたら単一トラックに自動で切り替える。視覚部は装飾（mono の "TERM n / N" が正）。
 */
const ProgressTape: React.FC<ProgressTapeProps> = ({ current, total, label }) => {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3 mb-2 font-mono text-xs font-bold tracking-mono">
        <span className="tnum text-ink shrink-0">
          WORD {String(current + 1).padStart(2, '0')} / {total}
        </span>
        {label && <span className="text-muted truncate uppercase">{label}</span>}
      </div>

      {total <= CELL_MODE_MAX ? (
        <div
          aria-hidden="true"
          className="w-full flex h-3.5 border-2 border-ink [&>span]:flex-1 [&>span+span]:border-l-2 [&>span+span]:border-ink"
        >
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={i < current ? 'bg-ink' : i === current ? 'bg-accent' : 'bg-surface'}
            />
          ))}
        </div>
      ) : (
        <div aria-hidden="true" className="w-full h-3.5 border-2 border-ink bg-surface">
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
};

export default ProgressTape;
