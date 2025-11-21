import React from 'react';
import { Mic2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 md:p-6 bg-white/60 backdrop-blur-xl sticky top-0 z-50 border-b border-white/40 shadow-sm support-[backdrop-filter]:bg-white/60">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/30 rotate-3 group-hover:rotate-12 transition-transform duration-500 ease-out">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 leading-none">
              Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">Pronounce</span>
            </h1>
            <span className="text-[0.65rem] font-bold text-slate-400 tracking-widest uppercase hidden sm:block">
              Engineering Terminology
            </span>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="bg-white/80 backdrop-blur-md text-slate-600 text-xs font-bold px-4 py-2 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            エンジニア用語、どう読んでる？
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;