const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const API_URL = 'https://api.openai.com/v1/chat/completions';

async function chat(prompt: string, maxTokens = 800): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '{}';
}

export interface WordAIContent {
  explanation: string;
  examples: { hebrew: string; transliteration: string; translation: string }[];
  memoryTip: string;
}

export async function generateWordContent(
  hebrew: string,
  translation: string
): Promise<WordAIContent> {
  const text = await chat(`You are a Hebrew teacher. For the word "${hebrew}" (${translation}), provide:
1. A brief grammatical explanation (1-2 sentences)
2. Three example sentences in Hebrew with transliteration and Russian translation
3. A memory tip to remember this word

Respond in JSON:
{"explanation":"...","examples":[{"hebrew":"...","transliteration":"...","translation":"..."}],"memoryTip":"..."}`);
  return JSON.parse(text) as WordAIContent;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export async function generateQuiz(
  topic: string,
  level: string
): Promise<QuizQuestion[]> {
  const text = await chat(`Generate 5 multiple-choice quiz questions about Hebrew "${topic}" for ${level} level. Questions and options in Russian, Hebrew words can appear.

Respond in JSON:
{"questions":[{"question":"...","options":["a","b","c","d"],"correctIndex":0}]}`);
  const parsed = JSON.parse(text) as { questions: QuizQuestion[] };
  return parsed.questions ?? [];
}
