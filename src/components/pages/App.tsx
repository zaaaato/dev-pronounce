'use client';

import React, { useState, useEffect } from 'react';
import { TermData, AppState } from '../../types';
import { loadTermsAction, voteAction, addTermAction } from '../../actions';
import Header from '../generic/Header';
import Footer from '../generic/Footer';
import VotingCard from '../generic/VotingCard';
import ProgressTape from '../generic/ProgressTape';
import AddTermForm from '../generic/AddTermForm';
import ContrarianMeter from '../generic/ContrarianMeter';
import SegmentBar from '../generic/SegmentBar';
import type { Pick } from '../../lib/contrarian';
import { sanitizeSegment, type UserSegment } from '../../lib/segments';
import { TriangleAlert, Flame } from 'lucide-react';

type View = 'deck' | 'add' | 'meter';

const PICKS_KEY = 'devpronounce:picks';
const SEGMENT_KEY = 'devpronounce:segment';
const METER_MIN_PICKS = 3;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOADING);
  const [terms, setTerms] = useState<TermData[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [view, setView] = useState<View>('deck');
  const [myPicks, setMyPicks] = useState<Pick[]>([]);
  const [segment, setSegment] = useState<UserSegment>({});

  const loadTerms = async (focusId?: string) => {
    setState(AppState.LOADING);
    try {
      const fetched = await loadTermsAction();
      const list = fetched ?? [];
      setTerms(list);
      setCurrentTermIndex((prev) => {
        if (focusId) {
          const i = list.findIndex((t) => t.id === focusId);
          if (i >= 0) return i;
        }
        return list.length > 0 ? Math.min(prev, list.length - 1) : 0;
      });
      setState(AppState.VOTING);
    } catch (error) {
      console.error(error);
      setState(AppState.ERROR);
    }
  };

  useEffect(() => {
    // セッションの投票履歴（逆張り度メーター用）と属性（職種/経験年数）を復元
    try {
      const saved = localStorage.getItem(PICKS_KEY);
      if (saved) setMyPicks(JSON.parse(saved));
      const savedSeg = localStorage.getItem(SEGMENT_KEY);
      if (savedSeg) setSegment(sanitizeSegment(JSON.parse(savedSeg)));
    } catch {
      /* noop */
    }
    // 共有リンク（/?t=<id>）から来た場合はその単語でデッキを開く
    const focusId =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('t') ?? undefined
        : undefined;
    loadTerms(focusId);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PICKS_KEY, JSON.stringify(myPicks));
    } catch {
      /* noop */
    }
  }, [myPicks]);

  const updateSegment = (seg: UserSegment) => {
    const clean = sanitizeSegment(seg);
    setSegment(clean);
    try {
      localStorage.setItem(SEGMENT_KEY, JSON.stringify(clean));
    } catch {
      /* noop */
    }
  };

  const handleVote = async (termId: string, optionId: string, customLabel?: string) => {
    // 失敗は VotingCard 側で捕捉してユーザーに通知する（ここでは握り潰さない）
    const updated = await voteAction(termId, optionId, customLabel, segment);
    setTerms(updated);
    // 逆張り度メーター用に自分の選択を記録（同じ単語は最新で上書き）
    const pick: Pick = optionId === 'custom' ? { termId, label: customLabel } : { termId, optionId };
    setMyPicks((prev) => [...prev.filter((p) => p.termId !== termId), pick]);
  };

  const handleNext = () => {
    if (currentTermIndex < terms.length - 1) {
      setCurrentTermIndex((prev) => prev + 1);
    } else {
      setCurrentTermIndex(0);
      loadTerms();
    }
  };

  const handleAddTerm = async (word: string, description: string, labels: string[]) => {
    // 失敗時は AddTermForm 側が例外を捕まえてエラー表示する
    const created = await addTermAction(word, description, labels);
    setTerms((prev) => [created, ...prev]);
    setCurrentTermIndex(0);
    setView('deck');
    setState(AppState.VOTING);
  };

  const openAdd = () => setView('add');
  const closeAdd = () => setView('deck');

  return (
    <>
      <Header onSubmitNew={openAdd} />

      <main className="flex-1 w-full px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {view === 'meter' ? (
            <ContrarianMeter picks={myPicks} terms={terms} onBack={() => setView('deck')} />
          ) : view === 'add' ? (
            <AddTermForm onSubmit={handleAddTerm} onCancel={closeAdd} />
          ) : state === AppState.LOADING ? (
            <div className="bg-surface border-[3px] border-ink shadow-brut p-8 text-center">
              <p className="font-mono text-sm font-bold tracking-mono text-ink">
                LOADING<span className="caret-blink">▮</span>
              </p>
              <p className="font-mono text-xs font-bold tracking-mono text-muted mt-2">
                みんなの投票をあつめてます
              </p>
            </div>
          ) : state === AppState.ERROR ? (
            <div className="bg-surface border-[3px] border-danger shadow-brut p-8">
              <div className="flex items-center gap-3 mb-3">
                <TriangleAlert className="w-7 h-7 text-danger shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <h2 className="font-mono text-base font-bold tracking-mono text-ink">ERROR / 読み込み失敗</h2>
              </div>
              <p className="font-jp text-sm text-muted mb-6">
                データの取得に失敗しました。サーバーの状態を確認して、もう一度お試しください。
              </p>
              <button
                type="button"
                onClick={() => loadTerms()}
                className="inline-flex items-center justify-center min-h-[48px] bg-ink text-surface font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-6 py-3 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                RETRY / 再試行
              </button>
            </div>
          ) : terms.length === 0 ? (
            <div className="bg-surface border-[3px] border-ink shadow-brut p-8 text-center">
              <h2 className="font-mono text-base font-bold tracking-mono text-ink mb-2">
                まだ単語がありません
              </h2>
              <p className="font-jp text-sm text-muted mb-6">
                さいしょの1語を登録して、みんなの読み方調査を始めよう。
              </p>
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center min-h-[48px] bg-ink text-accent font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-6 py-3 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
              >
                さいしょの単語を登録 ▸
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <SegmentBar segment={segment} onChange={updateSegment} />
              <ProgressTape
                current={currentTermIndex}
                total={terms.length}
                label={terms[currentTermIndex].description}
              />
              {myPicks.length >= METER_MIN_PICKS && (
                <button
                  type="button"
                  onClick={() => setView('meter')}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-accent2 text-surface font-mono font-bold uppercase tracking-mono text-xs border-[3px] border-ink shadow-brut-sm px-4 py-3 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
                >
                  <Flame className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                  あなたの逆張り度をみる（{myPicks.length}語投票済み）
                </button>
              )}
              <VotingCard
                key={terms[currentTermIndex].id}
                term={terms[currentTermIndex]}
                onVote={handleVote}
                onNext={handleNext}
                isLast={currentTermIndex === terms.length - 1}
                segment={segment}
              />
            </div>
          )}
        </div>
      </main>

      <Footer onSubmitNew={openAdd} />
    </>
  );
};

export default App;
