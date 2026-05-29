import { getTermById } from '../../db/storage';
import { getOrigin } from '../../lib/origin';
import { scoreTerm } from '../../lib/ranking';
import Header from '../../components/generic/Header';
import Footer from '../../components/generic/Footer';
import ResultBars from '../../components/generic/ResultBars';
import ShareRow from '../../components/generic/ShareRow';

export default async function TermPage({ id }: { id: string }) {
  const term = await getTermById(id);
  const origin = getOrigin();

  if (!term) {
    const t = '用語が見つかりません — DevPronounce';
    return (
      <>
        <title>{t}</title>
        <Header />
        <main className="flex-1 w-full px-4 py-12">
          <div className="w-full max-w-2xl mx-auto bg-surface border-[3px] border-ink shadow-brut p-8 text-center">
            <h2 className="font-mono text-base font-bold tracking-mono text-ink mb-2">
              NOT FOUND / 用語が見つかりません
            </h2>
            <p className="font-jp text-sm text-muted mb-6">この用語は削除されたか、URLが間違っているかもッス。</p>
            <a
              href="/"
              className="inline-flex items-center justify-center min-h-[48px] bg-ink text-accent font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-6 py-3 hover:bg-accent hover:text-ink transition-colors duration-[120ms]"
            >
              投票しに行く ▸
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { score, top1, top2 } = scoreTerm(term);
  const title = `${term.word} の読み方は？ — DevPronounce`;
  const desc =
    top1 && top2
      ? `${top1.label} ${top1.pct}% vs ${top2.label} ${top2.pct}% ・ 割れ度${score ?? '—'} ・ N=${term.totalVotes}。あなたはどう読む？`
      : `${term.word}（${term.description}）の読み方をみんなで投票中。あなたはどう読む？`;
  const pageUrl = `${origin}/t/${encodeURIComponent(term.id)}`;
  const ogImage = `${origin}/ogp.png`;
  const shareText = `「${term.word}」どう読む？ ${top1 ? `いまは${top1.label}が${top1.pct}%` : ''} #DevPronounce`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />

      <Header />

      <main className="flex-1 w-full px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto bg-surface border-4 border-ink shadow-brut p-6 md:p-10">
          <div className="-mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-6 bg-ink text-surface px-6 md:px-10 py-2">
            <p className="font-mono text-xs md:text-[0.8125rem] font-bold tracking-mono truncate">
              <span className="text-accent">&gt;</span> {term.description}
            </p>
          </div>

          <h2 className="font-display font-bold leading-[0.95] text-ink [overflow-wrap:anywhere] text-[clamp(2.5rem,8vw,4.75rem)] tracking-[-0.03em] mb-3">
            {term.word}
          </h2>
          <div className="border-t-2 border-ink mb-7" />

          <p className="font-mono text-xs font-bold tracking-mono text-muted mb-4">
            RESULTS / みんなの投票 {score != null && `・ 割れ度 ${score}`}
          </p>

          <ResultBars options={term.options} totalVotes={term.totalVotes} />

          <div className="mt-8 space-y-4">
            <ShareRow url={pageUrl} text={shareText} />
            <a
              href={`/?t=${encodeURIComponent(term.id)}`}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto bg-ink text-surface font-mono font-bold uppercase tracking-wordmark border-[3px] border-ink shadow-brut px-8 py-4 transition-[transform,box-shadow,background-color] duration-[120ms] ease-brut hover:bg-accent hover:text-ink hover:shadow-brut-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-brut-active focus-visible:outline-none focus-visible:shadow-focus focus-visible:[outline:2px_solid_#141414] focus-visible:[outline-offset:-2px]"
            >
              この単語に投票する ▸
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getConfig = async () => ({ render: 'dynamic' as const });
