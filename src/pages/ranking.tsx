import { getTerms } from '../db/storage';
import { computeRanking } from '../lib/ranking';
import { getOrigin } from '../lib/origin';
import Header from '../components/generic/Header';
import Footer from '../components/generic/Footer';
import RankingView from '../components/generic/RankingView';

export default async function RankingPage() {
  const terms = await getTerms();
  const { ranked, consensus, judging } = computeRanking(terms);

  const origin = getOrigin();
  const ogImage = `${origin}/ogp.png`;
  const title = '論争ランキング — DevPronounce';
  const desc = 'エンジニアでいちばん読み方が割れている技術用語ランキング。あなたの界隈の論争用語は何位？';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />

      <Header current="ranking" />

      <main className="flex-1 w-full px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-[-0.02em] mb-2">
            論争ランキング
          </h2>
          <p className="font-jp text-sm text-muted mb-8">
            みんなの投票で、いま最も読み方が割れている用語は？
          </p>
          <RankingView ranked={ranked} consensus={consensus} judging={judging} />
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getConfig = async () => ({ render: 'dynamic' as const });
