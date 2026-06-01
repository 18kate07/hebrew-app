import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

export interface WordAIContent {
  explanation: string;
  examples: { hebrew: string; transliteration: string; translation: string }[];
  memoryTip: string;
}

export async function generateWordContent(
  hebrew: string,
  translation: string
): Promise<WordAIContent> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `You are a Hebrew teacher. For the word "${hebrew}" (${translation}), provide:
1. A brief grammatical explanation (1-2 sentences)
2. Three example sentences in Hebrew with transliteration and Russian translation
3. A memory tip to remember this word

Respond in JSON format:
{
  "explanation": "...",
  "examples": [
    {"hebrew": "...", "transliteration": "...", "translation": "..."},
    {"hebrew": "...", "transliteration": "...", "translation": "..."},
    {"hebrew": "...", "transliteration": "...", "translation": "..."}
  ],
  "memoryTip": "..."
}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content ?? '{}';
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
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Generate 5 multiple-choice quiz questions about Hebrew "${topic}" for ${level} level students.
Each question tests vocabulary or grammar understanding. Questions and options should be in Russian, Hebrew words can appear in questions.

Respond in JSON format:
{
  "questions": [
    {
      "question": "...",
      "options": ["option1", "option2", "option3", "option4"],
      "correctIndex": 0
    }
  ]
}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content ?? '{"questions":[]}';
  const parsed = JSON.parse(text) as { questions: QuizQuestion[] };
  return parsed.questions;
}
