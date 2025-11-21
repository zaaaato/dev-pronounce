import React from 'react';
import { Mic2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 md:p-6 bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">Pronounce</span>
            </h1>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
            エンジニア用語、どう読んでる？
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;