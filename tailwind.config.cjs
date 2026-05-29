/** @type {import('tailwindcss').Config} */
// DevPronounce design system — "POP BRUTALISM"（陽気なネオブルータリズム）
// クリーム地 + イエロー&コバルトの2アクセント + 等幅フォント中心。
// 骨格は据え置き: 角丸 0px・太枠・ハードなオフセット影。グラデーション/グラスモーフィズム禁止。
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FBF3E3', // page background (warm cream)
        surface: '#FFFFFF', // card surface
        paper: '#FFFFFF', // input / option surface
        ink: '#141414', // text + borders (near-black)
        line: '#141414',
        accent: '#FFD23F', // メインの陽気アクセント（ホバー / 勝者バー / 注目）。インク文字と高コントラスト
        accent2: '#2E5BFF', // サブのコバルト（ワードマーク // / YOU マーカー＝自分・ブランド）
        focus: '#FF2E88', // フォーカスリング専用（アクセントと被らないマゼンタ）
        muted: '#54524C', // secondary text / placeholders (AA on cream/white)
        disabled: '#DAD3C4',
        success: '#0E7A3B',
        danger: '#C81E00',
      },
      boxShadow: {
        brut: '6px 6px 0 0 #141414',
        'brut-lg': '8px 8px 0 0 #141414',
        'brut-sm': '3px 3px 0 0 #141414',
        'brut-md': '5px 5px 0 0 #141414',
        'brut-active': '0 0 0 0 #141414',
        focus: '0 0 0 2px #FFFFFF, 0 0 0 5px #FF2E88',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        sans: ['Space Grotesk', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Noto Sans JP', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      letterSpacing: {
        mono: '0.12em',
        wordmark: '0.08em',
        kana: '0.02em',
      },
      transitionTimingFunction: {
        brut: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
