'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LLMProvider, LLMResponse, StreamChunk } from '@/lib/types';
import { ResponseCard } from '@/components/ResponseCard';

const providers: { id: LLMProvider; name: string }[] = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic Claude' },
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'mistral', name: 'Mistral AI' },
  { id: 'llama', name: 'Meta LLaMa' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<Set<LLMProvider>>(
    new Set(['openai', 'anthropic', 'gemini', 'mistral', 'llama'])
  );
  const [responses, setResponses] = useState<Map<LLMProvider, LLMResponse>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const toggleProvider = (provider: LLMProvider) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(provider)) {
      newSelected.delete(provider);
    } else {
      newSelected.add(provider);
    }
    setSelectedProviders(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || selectedProviders.size === 0) {
      return;
    }

    setIsLoading(true);
    setResponses(new Map());

    // Initialize responses for selected providers
    const initialResponses = new Map<LLMProvider, LLMResponse>();
    selectedProviders.forEach((provider) => {
      initialResponses.set(provider, {
        provider,
        content: '',
        isStreaming: true,
      });
    });
    setResponses(new Map(initialResponses));

    try {
      // Get API keys from localStorage
      const apiKeys: any = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('llm-api-keys');
        if (stored) {
          Object.assign(apiKeys, JSON.parse(stored));
        }
      }

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          providers: Array.from(selectedProviders),
          apiKeys,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const chunk: StreamChunk = JSON.parse(data);
              
              setResponses((prev) => {
                const newResponses = new Map(prev);
                const existing = newResponses.get(chunk.provider);
                
                if (existing) {
                  newResponses.set(chunk.provider, {
                    ...existing,
                    content: existing.content + chunk.chunk,
                    isStreaming: !chunk.done,
                    error: chunk.error,
                  });
                }
                
                return newResponses;
              });
            } catch (e) {
              console.error('Failed to parse chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching responses. Please check your API keys.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            LLM Comparison Tool
          </h1>
          <p className="text-gray-600">
            Compare responses from multiple AI models simultaneously
          </p>
          <Link
            href="/settings"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Configure API Keys
          </Link>
        </div>

        <div className="mx-auto max-w-4xl mb-8">
          <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4">
              <label htmlFor="prompt" className="mb-2 block text-sm font-semibold text-gray-700">
                Enter your prompt:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                placeholder="Ask a question or provide a prompt..."
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select AI Models:
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {providers.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProviders.has(provider.id)}
                      onChange={() => toggleProvider(provider.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">{provider.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim() || selectedProviders.size === 0}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Compare Responses'}
            </button>
          </form>
        </div>

        {responses.size > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from(responses.entries()).map(([provider, response]) => (
              <ResponseCard key={provider} response={response} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
