import { LLMProvider, APIKeys } from './types';

// Get API key for a provider, checking custom keys first, then falling back to env vars
export function getAPIKey(provider: LLMProvider, customKeys?: APIKeys): string | undefined {
  // Check custom keys from localStorage first
  if (customKeys?.[provider]) {
    return customKeys[provider];
  }

  // Fall back to environment variables
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'gemini':
      return process.env.GOOGLE_API_KEY;
    case 'mistral':
      return process.env.MISTRAL_API_KEY;
    case 'llama':
      return process.env.LLAMA_API_KEY;
    default:
      return undefined;
  }
}

// Validate that an API key exists and is not empty
export function validateAPIKey(key: string | undefined): boolean {
  return !!key && key.trim().length > 0 && !key.includes('your_') && !key.includes('_here');
}

