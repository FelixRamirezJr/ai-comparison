# LLM Comparison Tool

A modern web application built with Next.js that allows you to compare responses from multiple AI language models simultaneously. Get real-time streaming responses from OpenAI, Anthropic Claude, Google Gemini, Mistral AI, and Meta LLaMa all in one place.

## Features

- 🚀 **Real-time Streaming**: See responses appear as they're generated
- 🎯 **Multiple Providers**: Compare 5 different LLM providers side-by-side
- 🔑 **Flexible API Key Management**: Use environment variables or store keys in your browser
- 💅 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- ⚡ **Fast**: Built on Next.js 14+ with App Router and Edge Runtime
- 🛡️ **Error Handling**: Graceful error handling - if one API fails, others continue

## Supported AI Models

| Provider | Model | Description |
|----------|-------|-------------|
| OpenAI | GPT-4o | Latest and most capable GPT-4 model |
| Anthropic | Claude 3.5 Sonnet | Most intelligent Claude model |
| Google | Gemini 2.0 Flash | Fast and capable Gemini model |
| Mistral | Mistral Large | Flagship model from Mistral AI |
| Meta | LLaMa 3.3 70B | Open-source model via OpenRouter |

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for the LLM providers you want to use (see below)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd llm-comparison
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API keys (choose one method):**

   **Method A: Environment Variables (Recommended for development)**
   
   Create a `.env.local` file in the project root:
   ```bash
   cp env.template .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=AI...
   MISTRAL_API_KEY=...
   LLAMA_API_KEY=sk-or-v1-...
   ```

   **Method B: Browser Storage**
   
   Leave the `.env.local` file empty or with placeholder values. You can configure API keys directly in the app's Settings page after starting the application.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting API Keys

You'll need to sign up for API keys from each provider:

### OpenAI
- Sign up: https://platform.openai.com/signup
- Get API key: https://platform.openai.com/api-keys
- Pricing: Pay-per-use (starts at $0.0025/1K tokens for GPT-4o mini)

### Anthropic Claude
- Sign up: https://console.anthropic.com/
- Get API key: https://console.anthropic.com/settings/keys
- Pricing: Pay-per-use (starts at $3/MTok input for Claude 3.5 Sonnet)

### Google Gemini
- Sign up: https://makersuite.google.com/
- Get API key: https://makersuite.google.com/app/apikey
- Pricing: Free tier available, then pay-per-use

### Mistral AI
- Sign up: https://console.mistral.ai/
- Get API key: https://console.mistral.ai/api-keys
- Pricing: Pay-per-use (starts at $2/MTok for Mistral Large)

### Meta LLaMa (via OpenRouter)
- Sign up: https://openrouter.ai/
- Get API key: https://openrouter.ai/keys
- Pricing: Pay-per-use (varies by model, LLaMa 3.3 70B ~$0.35/MTok)

**Note:** You don't need all API keys to use the app. Configure only the providers you want to use and select them in the UI.

## Usage

1. **Enter a prompt** in the text area
2. **Select the AI models** you want to compare (checkboxes below the prompt)
3. **Click "Compare Responses"** to start
4. **Watch as responses stream in** from each provider in real-time

### Tips

- Configure your API keys in the Settings page (linked at the top of the main page)
- You can select any combination of providers
- Responses stream independently - if one is slow or fails, others continue
- Browser-stored API keys take priority over environment variables

## Project Structure

```
llm-comparison/
├── app/
│   ├── api/
│   │   ├── compare/
│   │   │   └── route.ts          # Streaming endpoint for LLM comparisons
│   │   └── settings/
│   │       └── route.ts          # API key configuration endpoint
│   ├── settings/
│   │   └── page.tsx              # Settings page for API key management
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main comparison UI
│   └── globals.css               # Global styles
├── components/
│   └── ResponseCard.tsx          # Card component for displaying LLM responses
├── lib/
│   ├── llm-clients/
│   │   ├── openai.ts            # OpenAI streaming client
│   │   ├── anthropic.ts         # Anthropic streaming client
│   │   ├── gemini.ts            # Google Gemini streaming client
│   │   ├── mistral.ts           # Mistral streaming client
│   │   └── llama.ts             # LLaMa streaming client (via OpenRouter)
│   ├── types.ts                 # TypeScript type definitions
│   └── api-keys.ts              # API key management utilities
├── env.template                 # Environment variable template
├── package.json
└── README.md
```

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI SDKs**:
  - `openai` - Official OpenAI SDK
  - `@anthropic-ai/sdk` - Official Anthropic SDK
  - `@google/generative-ai` - Google Generative AI SDK
  - `@mistralai/mistralai` - Official Mistral SDK
  - OpenRouter API for LLaMa (REST API)

## Development

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deployment

This app can be easily deployed to:

- **Vercel** (recommended): `vercel deploy`
- **Railway**: Connect your GitHub repo
- **Any Node.js hosting**: Build and run with `npm run build && npm start`

**Important**: When deploying, make sure to set your environment variables (API keys) in your hosting platform's settings.

## Troubleshooting

### Server Won't Start
If you get a network interface error, the project is already configured with `--hostname localhost` flag to fix this.

### Common Issues

**"API key not configured" error:**
- Check that you've entered the API key correctly in Settings or `.env.local`
- Make sure the key doesn't contain placeholder text like "your_key_here"
- Restart the dev server after changing `.env.local`

**Streaming not working:**
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari 16+)
- Check browser console for errors
- Verify your API keys are valid and have available credits

**Rate limiting errors:**
- You may have exceeded your API quota
- Check your usage on each provider's dashboard
- Consider upgrading your plan or waiting for the limit to reset

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

For more detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
