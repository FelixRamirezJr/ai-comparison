import { NextResponse } from 'next/server';

export async function GET() {
  // Return which API keys are configured in environment variables (without revealing the actual keys)
  const configured = {
    openai: !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_'),
    anthropic: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your_'),
    gemini: !!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY.includes('your_'),
    mistral: !!process.env.MISTRAL_API_KEY && !process.env.MISTRAL_API_KEY.includes('your_'),
    llama: !!process.env.LLAMA_API_KEY && !process.env.LLAMA_API_KEY.includes('your_'),
  };

  return NextResponse.json({ configured });
}

