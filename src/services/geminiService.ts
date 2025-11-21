import { GoogleGenAI, Type } from "@google/genai";
import { TermData } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const fetchControversialTerms = async (): Promise<TermData[]> => {
  try {
    const prompt = `
      日本のWebエンジニア界隈で、人によって読み方が分かれる技術用語を5つ選定してください。
      例: async (エイシンク/アシンク), kubernetes (クバネテス/クーベネティス), width (ウィズ/ワイズ), gif (ジフ/ギフ), warning (ワーニング/ウォーニング) など。
      
      それぞれの単語について、以下の情報を含むJSON配列を生成してください：
      1. word: 英単語
      2. description: 簡単な日本語の説明（30文字以内）
      3. options: 一般的な読み方のカタカナ候補（2〜4つ）。
         - label: カタカナの読み方
         - count: その読み方の推定使用率に基づいた初期投票数（合計が概ね100〜500になるようにランダムに配分してください）。これはグラフの初期データとして使います。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              description: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    count: { type: Type.INTEGER }
                  },
                  required: ["label", "count"]
                }
              }
            },
            required: ["word", "description", "options"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");

    // Transform to internal type with IDs
    return rawData.map((item: any, index: number) => ({
      id: `term-${index}-${Date.now()}`,
      word: item.word,
      description: item.description,
      options: item.options.map((opt: any, i: number) => ({
        id: `opt-${index}-${i}`,
        label: opt.label,
        count: opt.count,
        isCustom: false
      })),
      totalVotes: item.options.reduce((acc: number, cur: any) => acc + cur.count, 0)
    }));

  } catch (error) {
    console.error("Failed to fetch terms from Gemini:", error);
    // Fallback data in case API fails
    return [
      {
        id: 'fallback-1',
        word: 'async',
        description: '非同期処理のキーワード',
        options: [
          { id: 'f1-o1', label: 'エイシンク', count: 120 },
          { id: 'f1-o2', label: 'アシンク', count: 80 }
        ],
        totalVotes: 200
      },
      {
        id: 'fallback-2',
        word: 'Kubernetes',
        description: 'コンテナオーケストレーションツール',
        options: [
          { id: 'f2-o1', label: 'クバネテス', count: 150 },
          { id: 'f2-o2', label: 'クーベネティス', count: 40 },
          { id: 'f2-o3', label: 'ケーエイツ', count: 30 }
        ],
        totalVotes: 220
      }
    ];
  }
};