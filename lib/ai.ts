import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
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
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
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
    ...
  ],
  "memoryTip": "..."
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]) as WordAIContent;
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
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Generate 5 multiple-choice quiz questions about Hebrew "${topic}" for ${level} level students.
Each question tests vocabulary or grammar understanding.
Respond in JSON array format:
[
  {
    "question": "...",
    "options": ["option1", "option2", "option3", "option4"],
    "correctIndex": 0
  }
]`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]) as QuizQuestion[];
}
