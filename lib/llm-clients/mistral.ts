import { Mistral } from '@mistralai/mistralai';

export async function* streamMistral(prompt: string, apiKey: string) {
  const client = new Mistral({
    apiKey: apiKey,
  });

  try {
    const stream = await client.chat.stream({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of stream) {
      const content = chunk.data.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Mistral API error');
  }
}

