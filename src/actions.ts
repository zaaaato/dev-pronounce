'use server';

import { getTerms, updateVote } from './db/storage';
import { TermData } from './types';

export async function loadTermsAction(): Promise<TermData[]> {
  try {
    // まずDBからデータを取得
    const terms = await getTerms();

    // データが空の場合は空配列を返す
    if (!terms) {
      return [];
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