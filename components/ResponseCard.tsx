'use client';

import { LLMResponse } from '@/lib/types';

interface ResponseCardProps {
  response: LLMResponse;
}

const providerColors: Record<string, string> = {
  openai: 'border-green-500 bg-green-50',
  anthropic: 'border-orange-500 bg-orange-50',
  gemini: 'border-blue-500 bg-blue-50',
  mistral: 'border-purple-500 bg-purple-50',
  llama: 'border-pink-500 bg-pink-50',
};

const providerNames: Record<string, string> = {
  openai: 'OpenAI GPT-4o',
  anthropic: 'Anthropic Claude 3.5 Sonnet',
  gemini: 'Google Gemini 2.0 Flash',
  mistral: 'Mistral Large',
  llama: 'Meta LLaMa 3.3 70B',
};

export function ResponseCard({ response }: ResponseCardProps) {
  const colorClass = providerColors[response.provider] || 'border-gray-500 bg-gray-50';
  const displayName = providerNames[response.provider] || response.provider;

  return (
    <div className={`rounded-lg border-2 ${colorClass} p-4 shadow-md transition-all duration-300`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{displayName}</h3>
        {response.isStreaming && (
          <span className="flex items-center text-sm text-gray-600">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-gray-600"></span>
            Streaming...
          </span>
        )}
      </div>
      
      {response.error ? (
        <div className="rounded bg-red-100 p-3 text-red-700">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{response.error}</p>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-gray-700">
          {response.content || (
            <span className="text-gray-400 italic">Waiting for response...</span>
          )}
        </div>
      )}
    </div>
  );
}

