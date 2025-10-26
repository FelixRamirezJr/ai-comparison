# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys

Create a `.env.local` file:
```bash
cp env.template .env.local
```

Then edit `.env.local` and add at least one API key (you don't need all of them):

```env
# Add the API keys you have
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AI...
MISTRAL_API_KEY=...
LLAMA_API_KEY=sk-or-v1-...
```

**Alternative**: Skip this step and configure keys later via the Settings page in the web UI.

### 3. Run the Application
```bash
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

**Note:** The dev script uses `--hostname localhost` to avoid network interface detection issues.

## ✅ You're Ready!

1. Enter a prompt in the text area
2. Select which AI models to compare
3. Click "Compare Responses"
4. Watch the responses stream in real-time!

## 🔑 Don't Have API Keys?

Visit the Settings page in the app for direct links to sign up for each provider. Free tiers and trials are available for most providers.

## 📚 Need More Help?

See the full [README.md](README.md) for detailed documentation, troubleshooting, and deployment instructions.

