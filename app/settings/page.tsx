'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { APIKeys } from '@/lib/types';

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [envConfigured, setEnvConfigured] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage
    const stored = localStorage.getItem('llm-api-keys');
    if (stored) {
      setApiKeys(JSON.parse(stored));
    }

    // Check which keys are configured in environment variables
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setEnvConfigured(data.configured))
      .catch(console.error);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('llm-api-keys', JSON.stringify(apiKeys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateKey = (provider: keyof APIKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const providers = [
    {
      id: 'openai' as keyof APIKeys,
      name: 'OpenAI',
      link: 'https://platform.openai.com/api-keys',
    },
    {
      id: 'anthropic' as keyof APIKeys,
      name: 'Anthropic Claude',
      link: 'https://console.anthropic.com/settings/keys',
    },
    {
      id: 'gemini' as keyof APIKeys,
      name: 'Google Gemini',
      link: 'https://makersuite.google.com/app/apikey',
    },
    {
      id: 'mistral' as keyof APIKeys,
      name: 'Mistral AI',
      link: 'https://console.mistral.ai/api-keys',
    },
    {
      id: 'llama' as keyof APIKeys,
      name: 'Meta LLaMa (via OpenRouter)',
      link: 'https://openrouter.ai/keys',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">API Key Settings</h1>
            <p className="text-gray-600">
              Configure your API keys to use the LLM comparison tool
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg mb-6">
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Configuration Options</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Store keys in your browser (using localStorage)</li>
                <li>Or set keys in <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
                <li>Browser keys take priority over environment variables</li>
              </ul>
            </div>

            <form onSubmit={handleSave}>
              <div className="space-y-6">
                {providers.map((provider) => (
                  <div key={provider.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor={provider.id} className="font-semibold text-gray-700">
                        {provider.name}
                      </label>
                      <div className="flex items-center gap-3">
                        {envConfigured[provider.id] && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Configured in .env
                          </span>
                        )}
                        <a
                          href={provider.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Get API Key
                        </a>
                      </div>
                    </div>
                    <input
                      id={provider.id}
                      type="password"
                      value={apiKeys[provider.id] || ''}
                      onChange={(e) => updateKey(provider.id, e.target.value)}
                      placeholder={`Enter your ${provider.name} API key`}
                      className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  Save API Keys
                </button>
                {saved && (
                  <span className="text-sm font-medium text-green-600">
                    ✓ Saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
            <h3 className="mb-2 font-semibold text-yellow-900">Alternative: Environment Variables</h3>
            <p className="text-sm text-yellow-800 mb-2">
              You can also create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in your project root:
            </p>
            <pre className="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
{`OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
LLAMA_API_KEY=your_key_here`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

