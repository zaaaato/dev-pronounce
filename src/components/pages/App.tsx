'use client';

import React, { useState, useEffect } from 'react';
import { TermData, AppState } from '../../types';
import { loadTermsAction, voteAction } from '../../actions';
import Header from '../generic/Header';
import VotingCard from '../generic/VotingCard';
import { Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOADING);
  const [terms, setTerms] = useState<TermData[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);

  const loadTerms = async () => {
    setState(AppState.LOADING);
    try {
      const fetchedTerms = await loadTermsAction();
      if (fetchedTerms && fetchedTerms.length > 0) {
        setTerms(fetchedTerms);
        // 現在のインデックスが範囲外にならないように調整
        setCurrentTermIndex(prev => Math.min(prev, fetchedTerms.length - 1));
        setState(AppState.VOTING);
      } else {
        setState(AppState.ERROR);
      }
    } catch (error) {
      console.error(error);
      setState(AppState.ERROR);
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const handleVote = async (termId: string, optionId: string, customLabel?: string) => {
    try {
      // サーバーアクションを呼び出してDBを更新し、最新のデータを取得
      const updatedTerms = await voteAction(termId, optionId, customLabel);
      setTerms(updatedTerms);
    } catch (error) {
      console.error('Vote failed:', error);
      // 必要に応じてエラーハンドリング（Toast表示など）
    }
  };

  const handleNext = () => {
    if (currentTermIndex < terms.length - 1) {
      setCurrentTermIndex(prev => prev + 1);
    } else {
      // 最後の項目の場合、データをリロードして最新の結果を表示（または最初に戻る）
      loadTerms();
      setCurrentTermIndex(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF0] text-slate-800 relative selection:bg-orange-200">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden z-0">

        {/* Background decorative elements - POP style */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 -z-10"></div>

        <div className="w-full max-w-4xl mx-auto z-10">
          {state === AppState.LOADING && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-600">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-orange-100 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-xl font-bold text-slate-800">読み込んでいます...</p>
                <p className="text-sm text-slate-500 mt-2">みんなの投票データを取得中</p>
              </div>
            </div>
          )}

          {state === AppState.ERROR && (
            <div className="text-center p-8 bg-white border-2 border-red-100 rounded-3xl shadow-xl max-w-lg mx-auto">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">おっと、エラーです！</h2>
              <p className="text-slate-500 mb-6">データの取得に失敗しちゃいました。<br />サーバーの状態を確認してください。</p>
              <button
                onClick={loadTerms}
                className="flex items-center gap-2 mx-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" />
                もう一度トライ
              </button>
            </div>
          )}

          {state === AppState.VOTING && terms.length > 0 && (
            <div className="w-full">
              {/* Progress Indicator */}
              <div className="flex justify-center mb-8 items-center gap-3">
                <span className="font-bold text-slate-400 text-sm">START</span>
                <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${((currentTermIndex + 1) / terms.length) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-orange-500 text-lg">{currentTermIndex + 1} <span className="text-slate-400 text-sm">/ {terms.length}</span></span>
              </div>

              <VotingCard
                key={terms[currentTermIndex].id} // Force remount on term change to reset voted state
                term={terms[currentTermIndex]}
                onVote={handleVote}
                onNext={handleNext}
                isLast={currentTermIndex === terms.length - 1}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 text-center text-slate-500 text-sm font-medium">
        <p>Designed & Developed with <span className="text-pink-500">♥</span> by Gemini</p>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;