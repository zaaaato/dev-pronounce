import React, { useState } from 'react';
import { TermData, TERM_LIMITS } from '../../types';
import { Plus, ArrowRight, RotateCcw } from 'lucide-react';
import ResultBars from './ResultBars';
import ShareRow from './ShareRow';
import SegmentBreakdown from './SegmentBreakdown';
import type { UserSegment } from '../../lib/segments';

interface VotingCardProps {
  term: TermData;
  onVote: (termId: string, optionId: string, customLabel?: string) => Promise<void>;
  onNext: () => void;
  isLast: boolean;
  segment?: UserSegment;
}

const VotingCard: React.FC<VotingCardProps> = ({ term, onVote, onNext, isLast, segment }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [myPick, setMyPick] = useState<{ id?: string; label?: string } | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  // 投票はサーバへの永続化が成功してから初めて結果表示に切り替える（失敗時は VOTED にしない）
  const submitVote = async (optionId: string, customLabel: string | undefined, pick: { id?: string; label?: string }) => {
    if (isVoting) return;
    setVoteError(null);
    setIsVoting(true);
    try {
      await onVote(term.id, optionId, customLabel);
      setMyPick(pick);
      setHasVoted(true);
      setShowCustomInput(false);
    } catch (err) {
      console.error('Vote failed:', err);
      setVoteError('投票に失敗しました。もう一度お試しください。');
    } finally {
      setIsVoting(false);
    }
  };

  const handleVote = (optionId: string) => submitVote(optionId, undefined, { id: optionId });

  const handleCustomVote = (e: React.FormEvent) => {
    e.preventDefault();
    const label = customInput.trim();
    if (!label) return;
    submitVote('custom', label, { label });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface border-4 border-ink shadow-brut p-6 md:p-10">
      {/* スペックライン（機械ラベル風の説明バー、カード幅いっぱい） */}
      <div className="-mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-6 bg-ink text-surface px-6 md:px-10 py-2">
        <p className="font-mono text-xs md:text-[0.8125rem] font-bold tracking-mono truncate">
          <span className="text-accent">&gt;</span> {term.description}
        </p>
      </div>

      {/* 用語（左寄せの看板タイポ。実際の大文字小文字を保持） */}
      <h2 className="font-display font-bold leading-[0.95] text-ink [overflow-wrap:anywhere] text-[clamp(2.5rem,8vw,4.75rem)] tracking-[-0.03em] mb-3">
        {term.word}
      </h2>
      <div className="border-t-2 border-ink mb-7" />

      {!hasVoted ? (
        <div>
          <p className="font-mono text-xs font-bold tracking-mono text-muted mb-4">
            どう読む？ / HOW DO YOU SAY IT?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {term.options.map((option, i) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVote(option.id)}
                disabled={isVoting}
                className="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-paper text-ink border-[3px] border-ink shadow-brut-sm px-4 py-3 text-left transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 shrink-0 border-2 border-ink font-mono font-bold text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-jp font-bold tracking-kana text-lg [overflow-wrap:anywhere]">{option.label}</span>
                </span>
                <span className="font-mono text-xs font-bold tracking-mono text-ink shrink-0">▸ VOTE</span>
              </button>
            ))}
          </div>

          {/* 自分の読み方を追加（小文字 = 1票ぶんの追加） */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="mt-4 w-full min-h-[48px] flex items-center justify-center gap-2 border-2 border-dashed border-ink bg-transparent text-ink font-mono text-xs font-bold tracking-mono hover:bg-paper transition-colors duration-[120ms] focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              add a reading / 自分の読み方を追加
            </button>
          ) : (
            <form onSubmit={handleCustomVote} className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="カタカナで入力（例: ヌル）"
                maxLength={TERM_LIMITS.label}
                aria-label="自分の読み方"
                className="flex-1 min-h-[48px] bg-paper text-ink placeholder:text-muted font-jp font-bold tracking-kana border-[3px] border-ink px-4 py-3 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customInput.trim() || isVoting}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-ink text-surface font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut-sm px-6 py-3 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active disabled:bg-disabled disabled:text-ink disabled:shadow-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                投票 ▸
              </button>
            </form>
          )}

          {voteError && (
            <p className="mt-4 font-mono text-xs font-bold text-danger" role="alert">
              <span aria-hidden="true">! </span>
              {voteError}
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <p className="font-mono text-xs font-bold tracking-mono text-ink">▸ 投票ありがとう！</p>
            <p className="font-mono text-xs font-bold tracking-mono text-muted">RESULTS / みんなの投票</p>
          </div>

          <ResultBars options={term.options} totalVotes={term.totalVotes} myPick={myPick} />

          <SegmentBreakdown termId={term.id} term={term} segment={segment ?? {}} />

          {/* この結果をシェア */}
          <div className="mt-7 pt-5 border-t-2 border-ink">
            <p className="font-mono text-[0.6875rem] font-bold tracking-mono text-muted mb-3">
              ▸ この結果をシェア
            </p>
            <ShareRow
              url={
                typeof window !== 'undefined'
                  ? `${window.location.origin}/t/${encodeURIComponent(term.id)}`
                  : ''
              }
              text={(() => {
                const top = [...term.options].sort((a, b) => b.count - a.count)[0];
                const pct = top && term.totalVotes > 0 ? Math.round((top.count / term.totalVotes) * 100) : 0;
                return `「${term.word}」どう読む？ ${top ? `いまは${top.label}が${pct}%` : ''} #DevPronounce`;
              })()}
            />
          </div>

          <div className="mt-8 flex justify-center">
            {isLast ? (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-transparent text-ink font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-8 py-4 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
                RESET / 最初から
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-ink text-surface font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-8 py-4 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                次の単語へ NEXT
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingCard;
