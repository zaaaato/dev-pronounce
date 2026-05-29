// 投票に付ける属性（職種 / 経験年数）の定義。クライアントの選択UI・表示ラベル・
// 合成シードで共有する。値(value)はDBに保存するキー、label は表示名。

export interface SegmentOption {
  value: string;
  label: string;
}

export const ROLES: SegmentOption[] = [
  { value: 'frontend', label: 'フロントエンド' },
  { value: 'backend', label: 'バックエンド' },
  { value: 'infra', label: 'インフラ・SRE' },
  { value: 'data', label: 'データ・ML' },
  { value: 'mobile', label: 'モバイル' },
  { value: 'other', label: 'その他' },
];

export const EXPERIENCES: SegmentOption[] = [
  { value: 'j', label: '〜3年' },
  { value: 'm', label: '3〜7年' },
  { value: 's', label: '7〜12年' },
  { value: 'v', label: '12年〜' },
];

export type Dim = 'role' | 'exp';

export interface UserSegment {
  role?: string; // ROLES の value
  exp?: string; // EXPERIENCES の value
}

// セグメント別の集計結果
export interface SegmentDist {
  bucket: string; // role/exp の value
  rows: { optionId: string; count: number }[];
  total: number;
}
export interface SegmentBreakdown {
  role?: SegmentDist | null;
  exp?: SegmentDist | null;
}

const ROLE_VALUES = new Set(ROLES.map((r) => r.value));
const EXP_VALUES = new Set(EXPERIENCES.map((e) => e.value));

export function roleLabel(value?: string): string | null {
  return ROLES.find((r) => r.value === value)?.label ?? null;
}
export function expLabel(value?: string): string | null {
  return EXPERIENCES.find((e) => e.value === value)?.label ?? null;
}

/** 受け取った値が正規の bucket か検証（不正な入力は無視する） */
export function sanitizeSegment(seg: UserSegment | null | undefined): UserSegment {
  if (!seg) return {};
  return {
    role: seg.role && ROLE_VALUES.has(seg.role) ? seg.role : undefined,
    exp: seg.exp && EXP_VALUES.has(seg.exp) ? seg.exp : undefined,
  };
}
