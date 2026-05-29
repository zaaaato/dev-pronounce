import React from 'react';
import { AudioLines, SquarePlus, Trophy } from 'lucide-react';

interface HeaderProps {
  onSubmitNew?: () => void;
  current?: 'home' | 'ranking';
}

const Header: React.FC<HeaderProps> = ({ onSubmitNew, current }) => {
  return (
    <header className="sticky top-0 z-20 w-full flex items-center justify-between gap-3 bg-surface border-b-[3px] border-ink px-4 md:px-6 h-16">
      <a href="/" aria-label="DevPronounce ホーム" className="flex items-center gap-3 shrink-0">
        <span className="flex items-center justify-center w-11 h-11 bg-accent2 border-[3px] border-ink shrink-0">
          <AudioLines className="w-6 h-6 text-surface" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="font-mono font-extrabold tracking-wordmark text-lg md:text-xl text-ink leading-none">
          DEV<span className="text-accent2">//</span>PRONOUNCE
        </h1>
      </a>

      <nav className="flex items-center gap-2 md:gap-3">
        <a
          href="/ranking"
          aria-current={current === 'ranking' ? 'page' : undefined}
          className={`inline-flex items-center gap-2 font-mono font-bold uppercase tracking-mono text-xs md:text-[0.8125rem] border-[3px] border-ink px-3 py-2 transition-[transform,box-shadow] duration-[120ms] ease-brut focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px] ${
            current === 'ranking'
              ? 'bg-ink text-surface shadow-brut-active'
              : 'bg-paper text-ink shadow-brut-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active'
          }`}
        >
          <Trophy className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
          <span className="hidden sm:inline">RANKING</span>
        </a>

        {onSubmitNew ? (
          <button
            type="button"
            onClick={onSubmitNew}
            className="inline-flex items-center gap-2 bg-ink text-accent font-mono font-bold uppercase tracking-mono text-xs md:text-[0.8125rem] border-[3px] border-ink shadow-brut-sm px-3 py-2 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            <SquarePlus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            <span className="hidden sm:inline">NEW WORD</span>
            <span className="sm:hidden">NEW</span>
          </button>
        ) : (
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-ink text-accent font-mono font-bold uppercase tracking-mono text-xs md:text-[0.8125rem] border-[3px] border-ink shadow-brut-sm px-3 py-2 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            <SquarePlus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            <span className="hidden sm:inline">投票する</span>
            <span className="sm:hidden">投票</span>
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;
