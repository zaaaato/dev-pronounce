import { getContext } from 'hono/context-storage';

/**
 * 現在のリクエストのオリジン（https://host）を返す。OGP の絶対URL生成に使う。
 * コンテキストが無い場合は空文字（相対URLにフォールバック）。
 */
export function getOrigin(): string {
  try {
    return new URL(getContext().req.url).origin;
  } catch {
    return '';
  }
}
