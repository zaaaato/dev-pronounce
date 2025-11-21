'use server';

import { getTerms, saveTerms, updateVote } from './db/storage';
import { fetchControversialTerms } from './services/geminiService';
import { TermData } from './types';

export async function loadTermsAction(): Promise<TermData[]> {
  try {
    // まずDBからデータを取得
    let terms = await getTerms();

    // データが空（初回起動）の場合はGemini APIから生成
    if (!terms || terms.length === 0) {
      console.log('Database is empty. Generating terms via Gemini...');
      terms = await fetchControversialTerms();
      await saveTerms(terms);
    }

    return terms;
  } catch (error) {
    console.error('Failed to load terms:', error);
    throw new Error('Failed to load data');
  }
}

export async function voteAction(termId: string, optionId: string, customLabel?: string): Promise<TermData[]> {
  try {
    // DBを更新し、最新の全データを返す
    const updatedTerms = await updateVote(termId, optionId, customLabel);
    return updatedTerms;
  } catch (error) {
    console.error('Failed to vote:', error);
    throw new Error('Failed to submit vote');
  }
}