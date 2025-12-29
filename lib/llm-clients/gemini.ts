import { GoogleGenAI } from '@google/genai';

export async function* streamGemini(prompt: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const stream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Gemini API error');
  }
}

