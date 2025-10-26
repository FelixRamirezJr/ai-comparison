import { NextRequest, NextResponse } from 'next/server';
import { CompareRequest, LLMProvider, StreamChunk } from '@/lib/types';
import { getAPIKey, validateAPIKey } from '@/lib/api-keys';
import { streamOpenAI } from '@/lib/llm-clients/openai';
import { streamAnthropic } from '@/lib/llm-clients/anthropic';
import { streamGemini } from '@/lib/llm-clients/gemini';
import { streamMistral } from '@/lib/llm-clients/mistral';
import { streamLlama } from '@/lib/llm-clients/llama';

export const runtime = 'edge';

async function* streamProvider(
  provider: LLMProvider,
  prompt: string,
  apiKey: string
): AsyncGenerator<StreamChunk> {
  try {
    let generator;
    
    switch (provider) {
      case 'openai':
        generator = streamOpenAI(prompt, apiKey);
        break;
      case 'anthropic':
        generator = streamAnthropic(prompt, apiKey);
        break;
      case 'gemini':
        generator = streamGemini(prompt, apiKey);
        break;
      case 'mistral':
        generator = streamMistral(prompt, apiKey);
        break;
      case 'llama':
        generator = streamLlama(prompt, apiKey);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    for await (const chunk of generator) {
      yield {
        provider,
        chunk,
        done: false,
      };
    }

    yield {
      provider,
      chunk: '',
      done: true,
    };
  } catch (error: any) {
    yield {
      provider,
      chunk: '',
      done: true,
      error: error.message || 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CompareRequest & { apiKeys?: any } = await request.json();
    const { prompt, providers, apiKeys: customKeys } = body;

    if (!prompt || !providers || providers.length === 0) {
      return NextResponse.json(
        { error: 'Missing prompt or providers' },
        { status: 400 }
      );
    }

    // Validate API keys for all selected providers
    const validProviders: LLMProvider[] = [];
    const errors: Record<string, string> = {};

    for (const provider of providers) {
      const apiKey = getAPIKey(provider, customKeys);
      if (!validateAPIKey(apiKey)) {
        errors[provider] = 'API key not configured';
      } else {
        validProviders.push(provider);
      }
    }

    // Create a ReadableStream that merges all provider streams
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send errors for invalid providers immediately
        for (const [provider, error] of Object.entries(errors)) {
          const chunk: StreamChunk = {
            provider: provider as LLMProvider,
            chunk: '',
            done: true,
            error,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }

        // Stream from all valid providers concurrently
        const streams = validProviders.map((provider) => {
          const apiKey = getAPIKey(provider, customKeys)!;
          return streamProvider(provider, prompt, apiKey);
        });

        // Process all streams concurrently
        const promises = streams.map(async (stream) => {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          }
        });

        await Promise.all(promises);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

