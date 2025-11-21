import React, { useState } from 'react';
import { TermData } from '../types';
import { Plus, Check, ArrowRight } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto bg-white border-2 border-white/50 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
      {/* Decorative background circle inside card */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
      
      {/* Term Header */}
      <div className="text-center mb-10 relative">
        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-sm font-bold mb-4 border border-slate-200">
          {term.description}
        </span>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 mb-2 drop-shadow-sm">
          {term.word}
        </h2>
      </div>

      {/* Content Area */}
      {!hasVoted ? (
        <div className="space-y-4 relative z-10">
          <p className="text-slate-500 text-center mb-6 font-bold text-lg">
            あなたはどう発音しますか？
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {term.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="group relative flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 bg-white hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-left shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <span className="text-lg font-bold text-slate-700 group-hover:text-orange-600">
                  {option.label}
                </span>
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-orange-400 group-hover:bg-orange-400 flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {/* Custom Option Input */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 text-slate-400 hover:text-orange-500 transition-colors text-sm font-bold border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/50"
            >
              <Plus className="w-5 h-5" />
              その他の読み方を追加
            </button>
          ) : (
            <form onSubmit={handleCustomVote} className="mt-6 flex gap-3 animate-in slide-in-from-top-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="カタカナで入力 (例: ヌル)"
                className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 placeholder:text-slate-400 font-bold focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
              >
                投票
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold text-lg mb-2 border border-green-200">
              <Check className="w-5 h-5 stroke-[3]" />
              投票ありがとう！
            </div>
            <p className="text-slate-400 text-sm font-medium mt-2">みんなの投票結果をチェック</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <ChartDisplay options={term.options} totalVotes={term.totalVotes} />
          </div>
          
          <div className="mt-10 flex justify-center">
            <button
              onClick={onNext}
              className="group flex items-center gap-3 bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-700 hover:scale-105 transition-all shadow-xl shadow-slate-800/20"
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