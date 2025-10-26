import Anthropic from '@anthropic-ai/sdk';

export async function* streamAnthropic(prompt: string, apiKey: string) {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  try {
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Anthropic API error');
  }
}

