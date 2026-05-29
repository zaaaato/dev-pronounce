'use client';

import React, { useEffect, useState } from 'react';
import { TermData } from '../../types';
import {
  roleLabel,
  expLabel,
  type UserSegment,
  type SegmentBreakdown as SB,
  type SegmentDist,
} from '../../lib/segments';
import { getSegmentBreakdownAction } from '../../actions';

interface Props {
  termId: string;
  term: TermData;
  segment: UserSegment;
}

const MIN_SEGMENT_VOTES = 10;

const SegmentBreakdown: React.FC<Props> = ({ termId, term, segment }) => {
  const [data, setData] = useState<SB | null>(null);
  const hasSegment = !!(segment.role || segment.exp);

  useEffect(() => {
    if (!hasSegment) return;
    let alive = true;
    setData(null);
    getSegmentBreakdownAction(termId, segment.role, segment.exp).then((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
    };
  }, [termId, segment.role, segment.exp, hasSegment]);

  if (!hasSegment) {
    return (
      <p className="mt-6 pt-5 border-t-2 border-ink font-mono text-[0.6875rem] font-bold tracking-mono text-muted">
        ▸ 上の「あなたについて」を選ぶと、職種・世代ごとの読み方が見られるッス
      </p>
    );
  }

  const overallPct = (optionId: string) => {
    const o = term.options.find((x) => x.id === optionId);
    return o && term.totalVotes > 0 ? Math.round((o.count / term.totalVotes) * 100) : 0;
  };
  const labelOf = (optionId: string) => term.options.find((x) => x.id === optionId)?.label ?? '?';

  const block = (title: string, dist: SegmentDist | null | undefined) => {
    if (!dist) return null;
    if (dist.total < MIN_SEGMENT_VOTES) {
      return (
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-ink mb-2">{title}</p>
          <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted">
            集計中…（まだ{dist.total}票）
          </p>
        </div>
      );
    }
    const rows = dist.rows
      .filter((r) => r.count > 0)
      .map((r) => ({ ...r, pct: Math.round((r.count / dist.total) * 100) }))
      .sort((a, b) => b.count - a.count);
    return (
      <div>
        <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-ink mb-2">
          {title} <span className="text-muted tnum">N={dist.total}</span>
        </p>
        <ul className="space-y-1.5">
          {rows.map((r) => {
            const ov = overallPct(r.optionId);
            const delta = r.pct - ov;
            return (
              <li key={r.optionId} className="text-xs">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="font-jp font-bold tracking-kana text-ink truncate">{labelOf(r.optionId)}</span>
                  <span className="font-mono font-bold tnum text-ink shrink-0">
                    {r.pct}%
                    {delta !== 0 && (
                      <span className={delta > 0 ? 'text-accent2 ml-1' : 'text-muted ml-1'}>
                        {delta > 0 ? `▲${delta}` : `▼${-delta}`}
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full h-3 border-2 border-ink bg-surface overflow-hidden">
                  <div className="h-full bg-accent2" style={{ width: `${r.pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const roleTitle = segment.role ? `あなたの ${roleLabel(segment.role)} では` : '';
  const expTitle = segment.exp ? `あなたの ${expLabel(segment.exp)} 世代では` : '';

  return (
    <div className="mt-6 pt-5 border-t-2 border-ink space-y-5">
      <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted">
        ▸ セグメント別（全体との差: <span className="text-accent2">▲</span>多い / <span className="text-muted">▼</span>少ない）
      </p>
      {data === null ? (
        <p className="font-mono text-xs font-bold tracking-mono text-muted">よみこみ中…</p>
      ) : (
        <>
          {block(roleTitle, data.role)}
          {block(expTitle, data.exp)}
        </>
      )}
    </div>
  );
};

export default SegmentBreakdown;
