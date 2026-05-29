import React from 'react';

interface FooterProps {
  onSubmitNew?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSubmitNew }) => {
  return (
    <footer className="bg-ink text-surface px-4 md:px-6 py-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs font-bold tracking-mono">
        <span>DEVPRONOUNCE // 2026</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-surface">データはぜんぶ みんなの投票</span>
          <a
            href="/ranking"
            className="text-surface hover:underline underline-offset-4 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            RANKING ▸
          </a>
          {onSubmitNew ? (
            <button
              type="button"
              onClick={onSubmitNew}
              className="text-accent hover:underline underline-offset-4 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
            >
              NEW WORD ▸
            </button>
          ) : (
            <a
              href="/"
              className="text-accent hover:underline underline-offset-4 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
            >
              NEW WORD ▸
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
