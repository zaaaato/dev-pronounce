import React, { useState } from 'react';
import { TermData } from '../../types';
import { Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import ChartDisplay from './ChartDisplay';

interface VotingCardProps {
  term: TermData;
  onVote: (termId: string, optionId: string, customLabel?: string) => void;
  onNext: () => void;
  isLast: boolean;
}

const VotingCard: React.FC<VotingCardProps> = ({ term, onVote, onNext, isLast }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleVote = (optionId: string) => {
    onVote(term.id, optionId);
    setHasVoted(true);
  };

  const handleCustomVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onVote(term.id, 'custom', customInput.trim());
      setHasVoted(true);
      setShowCustomInput(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-500">
      {/* Decorative background circle inside card */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full opacity-60 blur-3xl pointer-events-none animate-pulse"></div>

      {/* Term Header */}
      <div className="text-center mb-10 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100/80 text-slate-500 text-sm font-bold mb-5 border border-slate-200 backdrop-blur-sm">
          {term.description}
        </span>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 mb-2 drop-shadow-sm transform transition-all duration-500 hover:scale-[1.02]">
          {term.word}
        </h2>
      </div>

      {/* Content Area */}
      {!hasVoted ? (
        <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-slate-500 text-center mb-8 font-bold text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            あなたはどう発音しますか？
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {term.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="group relative flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 bg-white/50 hover:bg-white hover:border-orange-400 transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
              >
                <span className="text-lg font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                  {option.label}
                </span>
                <div className="w-7 h-7 rounded-full border-2 border-slate-200 group-hover:border-orange-400 group-hover:bg-orange-400 flex items-center justify-center transition-colors duration-300">
                  <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100" />
                </div>
              </button>
            ))}
          </div>

          {/* Custom Option Input */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 text-slate-400 hover:text-orange-500 transition-colors text-sm font-bold border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/30"
            >
              <Plus className="w-5 h-5" />
              その他の読み方を追加
            </button>
          ) : (
            <form onSubmit={handleCustomVote} className="mt-6 flex gap-3 animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="カタカナで入力 (例: ヌル)"
                className="flex-1 bg-slate-50/50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 placeholder:text-slate-400 font-bold focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-orange-500/20"
              >
                投票
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold text-lg mb-3 border border-green-200 shadow-sm">
              <Check className="w-5 h-5 stroke-[3]" />
              投票ありがとう！
            </div>
            <p className="text-slate-400 text-sm font-medium">みんなの投票結果をチェック</p>
          </div>

          <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 shadow-inner mb-8">
            <ChartDisplay options={term.options} totalVotes={term.totalVotes} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="group flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
            >
              {isLast ? '結果をリセット' : '次の単語へ'}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingCard;