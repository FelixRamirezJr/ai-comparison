export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'llama';

export interface LLMConfig {
  name: string;
  displayName: string;
  model: string;
  enabled: boolean;
}

export interface CompareRequest {
  prompt: string;
  providers: LLMProvider[];
}

export interface StreamChunk {
  provider: LLMProvider;
  chunk: string;
  done: boolean;
  error?: string;
}

export interface APIKeys {
  openai?: string;
  anthropic?: string;
  gemini?: string;
  mistral?: string;
  llama?: string;
}

export interface LLMResponse {
  provider: LLMProvider;
  content: string;
  error?: string;
  isStreaming: boolean;
}

