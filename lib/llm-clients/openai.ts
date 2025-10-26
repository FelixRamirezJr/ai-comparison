import OpenAI from 'openai';

export async function* streamOpenAI(prompt: string, apiKey: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-5-nano-2025-08-07',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    throw new Error(error?.message || 'OpenAI API error');
  }
}

