import App from '../components/pages/App';
import { getOrigin } from '../lib/origin';

export default function Page() {
  const ogImage = `${getOrigin()}/ogp.png`;
  const title = 'DevPronounce — エンジニア用語 読み方投票';
  const desc =
    'width? Kubernetes? char? エンジニアで読み方が分かれる技術用語を投票して、みんなの発音の分布を可視化するアプリ。';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <App />
    </>
  );
}
