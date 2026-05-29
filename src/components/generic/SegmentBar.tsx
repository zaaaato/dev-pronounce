'use client';

import React from 'react';
import { ROLES, EXPERIENCES, type UserSegment } from '../../lib/segments';

interface SegmentBarProps {
  segment: UserSegment;
  onChange: (seg: UserSegment) => void;
}

const selectClass =
  'min-h-[40px] bg-paper text-ink font-mono text-xs font-bold border-2 border-ink px-2 py-1.5 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]';

const SegmentBar: React.FC<SegmentBarProps> = ({ segment, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 border-[3px] border-ink bg-surface shadow-brut-sm px-3 py-2">
      <span className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted">
        あなたについて（任意）
      </span>
      <select
        aria-label="職種"
        value={segment.role ?? ''}
        onChange={(e) => onChange({ ...segment, role: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">職種…</option>
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <select
        aria-label="経験年数"
        value={segment.exp ?? ''}
        onChange={(e) => onChange({ ...segment, exp: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">経験年数…</option>
        {EXPERIENCES.map((x) => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </select>
      {(segment.role || segment.exp) && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted hover:text-ink underline underline-offset-2 focus-visible:outline-none focus-visible:shadow-focus"
        >
          クリア
        </button>
      )}
    </div>
  );
};

export default SegmentBar;
