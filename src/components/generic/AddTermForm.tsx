import React, { useRef, useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { TERM_LIMITS } from '../../types';

interface AddTermFormProps {
  onSubmit: (word: string, description: string, labels: string[]) => Promise<void>;
  onCancel: () => void;
}

interface Errors {
  word?: string;
  description?: string;
  options?: string;
  form?: string;
}

const captionClass = 'block font-mono text-xs font-bold tracking-mono text-muted mb-2';
const inputClass =
  'w-full min-h-[48px] bg-paper text-ink placeholder:text-muted border-[3px] border-ink px-4 py-3 focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]';

const AddTermForm: React.FC<AddTermFormProps> = ({ onSubmit, onCancel }) => {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const nonEmptyLabels = options.map((o) => o.trim()).filter(Boolean);
  const uniqueCount = new Set(nonEmptyLabels.map((l) => l.toLowerCase())).size;
  const canSubmit =
    !submitting && word.trim().length > 0 && description.trim().length > 0 && uniqueCount >= TERM_LIMITS.minOptions;

  const setOption = (i: number, val: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));

  const addOption = () => {
    setOptions((prev) => (prev.length >= TERM_LIMITS.maxOptions ? prev : [...prev, '']));
  };

  const removeOption = (i: number) => {
    setOptions((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
    // キーボード利用者が迷子にならないよう追加ボタンへフォーカスを戻す
    requestAnimationFrame(() => addBtnRef.current?.focus());
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!word.trim()) next.word = '単語を入力してください';
    if (!description.trim()) next.description = '説明を入力してください';
    if (uniqueCount < TERM_LIMITS.minOptions) {
      next.options = `読み方の候補を${TERM_LIMITS.minOptions}つ以上入力してください（重複は除外されます）`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit(word.trim(), description.trim(), options.map((o) => o.trim()).filter(Boolean));
      // 成功時は親がこのフォームをアンマウントする（state はここで触らない）
    } catch (err) {
      setSubmitting(false);
      setErrors({ form: err instanceof Error ? err.message : '用語の追加に失敗しました' });
    }
  };

  const errorLine = (msg?: string) =>
    msg ? (
      <p className="mt-2 font-mono text-xs font-bold text-danger">
        <span aria-hidden="true">! </span>
        {msg}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-surface border-4 border-ink shadow-brut"
      noValidate
    >
      {/* ヘッダーバー */}
      <div className="bg-ink text-surface px-5 py-3">
        <h2 className="font-mono text-sm font-bold tracking-mono">
          <span className="text-accent">&gt;</span> NEW WORD / 新しい単語
        </h2>
      </div>

      <div className="p-5 md:p-7 space-y-6">
        {/* 単語 */}
        <div>
          <label htmlFor="nt-word" className={captionClass}>
            TERM / 単語
          </label>
          <input
            id="nt-word"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="例: nginx"
            maxLength={TERM_LIMITS.word}
            className={`${inputClass} font-display font-bold text-lg`}
          />
          {errorLine(errors.word)}
        </div>

        {/* 説明 */}
        <div>
          <label htmlFor="nt-desc" className={captionClass}>
            DESCRIPTION / 説明
          </label>
          <input
            id="nt-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: Webサーバー / リバースプロキシ"
            maxLength={TERM_LIMITS.description}
            className={`${inputClass} font-jp`}
          />
          {errorLine(errors.description)}
        </div>

        <div className="border-t-2 border-ink" />

        {/* 読み方候補 */}
        <fieldset className="min-w-0 border-0 p-0 m-0">
          <legend className={captionClass}>PRONUNCIATIONS / 読み方候補</legend>
          <ul className="space-y-3">
            {options.map((opt, i) => (
              <li key={i} className="grid grid-cols-[28px_1fr_44px] items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 border-2 border-ink font-mono font-bold text-sm">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder="カタカナで入力（例: エンジンエックス）"
                  maxLength={TERM_LIMITS.label}
                  aria-label={`読み方候補 ${String.fromCharCode(65 + i)}`}
                  className={`${inputClass} font-jp font-bold tracking-kana`}
                />
                {options.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    aria-label={`読み方候補 ${String.fromCharCode(65 + i)} を削除`}
                    className="flex items-center justify-center w-11 h-11 text-danger border-[3px] border-ink bg-paper transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
                  >
                    <X className="w-5 h-5" strokeWidth={3} aria-hidden="true" />
                  </button>
                ) : (
                  <span aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>

          {options.length < TERM_LIMITS.maxOptions && (
            <button
              ref={addBtnRef}
              type="button"
              onClick={addOption}
              className="mt-3 w-full min-h-[48px] flex items-center justify-center gap-2 border-2 border-dashed border-ink bg-transparent text-ink font-mono text-xs font-bold tracking-mono hover:bg-paper transition-colors duration-[120ms] focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              ADD ANOTHER READING / 候補を追加
            </button>
          )}
          {errorLine(errors.options)}
        </fieldset>

        {errors.form && (
          <p className="font-mono text-xs font-bold text-danger border-[3px] border-danger px-3 py-2">
            <span aria-hidden="true">! </span>
            {errors.form}
          </p>
        )}

        {/* 送信 / キャンセル */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] flex-1 bg-ink text-accent font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-6 py-4 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active disabled:bg-disabled disabled:text-ink disabled:shadow-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            {submitting ? 'SUBMITTING…' : 'SUBMIT'}
            {!submitting && <ArrowRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex items-center justify-center min-h-[48px] bg-transparent text-ink font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink px-6 py-4 transition-[transform,box-shadow] duration-[120ms] ease-brut hover:shadow-brut active:translate-x-0.5 active:translate-y-0.5 active:shadow-brut-active disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTermForm;
