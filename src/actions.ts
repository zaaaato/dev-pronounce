'use server';

import { getTerms, updateVote, addTerm, getSegmentBreakdown } from './db/storage';
import { TermData, TERM_LIMITS } from './types';
import type { UserSegment, SegmentBreakdown } from './lib/segments';

export async function loadTermsAction(): Promise<TermData[]> {
  try {
    const terms = await getTerms();
    return terms ?? [];
  } catch (error) {
    console.error('Failed to load terms:', error);
    throw new Error('Failed to load data');
  }
}

export async function voteAction(
  termId: string,
  optionId: string,
  customLabel?: string,
  segment?: UserSegment,
): Promise<TermData[]> {
  try {
    // カスタム読みはサーバ側でも trim / 長さ制限 / 空チェック（クライアント検証のバックストップ）
    let label = customLabel;
    if (optionId === 'custom') {
      label = (customLabel ?? '').trim().slice(0, TERM_LIMITS.label);
      if (!label) throw new Error('読み方を入力してください');
    }
    return await updateVote(termId, optionId, label, segment);
  } catch (error) {
    console.error('Failed to vote:', error);
    throw new Error('Failed to submit vote');
  }
}

export async function getSegmentBreakdownAction(
  termId: string,
  role?: string,
  exp?: string,
): Promise<SegmentBreakdown> {
  try {
    return await getSegmentBreakdown(termId, role, exp);
  } catch (error) {
    console.error('Failed to load segment breakdown:', error);
    return {};
  }
}

/**
 * ユーザーが新しい用語を登録する。
 * word / description / 2件以上の読み方候補を受け取り、作成した TermData を返す。
 */
export async function addTermAction(
  word: string,
  description: string,
  optionLabels: string[],
): Promise<TermData> {
  const w = (word ?? '').trim();
  const d = (description ?? '').trim();

  // 空白除去 → 大文字小文字を無視した重複排除（表示は元の入力を保持）
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const raw of optionLabels ?? []) {
    const label = (raw ?? '').trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(label.slice(0, TERM_LIMITS.label));
  }

  if (!w) throw new Error('単語を入力してください');
  if (!d) throw new Error('説明を入力してください');
  if (labels.length < TERM_LIMITS.minOptions) {
    throw new Error(`読み方の候補を${TERM_LIMITS.minOptions}つ以上入力してください`);
  }

  try {
    return await addTerm(w.slice(0, TERM_LIMITS.word), d.slice(0, TERM_LIMITS.description), labels.slice(0, TERM_LIMITS.maxOptions));
  } catch (error) {
    console.error('Failed to add term:', error);
    throw new Error('用語の追加に失敗しました');
  }
}
