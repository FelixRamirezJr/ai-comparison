# Troubleshooting Guide

## Common Issues and Solutions

### Server Won't Start - Network Interface Error

**Error:**
```
NodeError [SystemError]: A system error occurred: uv_interface_addresses returned Unknown system error 1
```

**Solution:**
This is already fixed in the project! The `package.json` includes `--hostname localhost` flag to avoid network interface detection issues.

If you still encounter this, you can also try:
```bash
# Option 1: Use the hostname flag directly
next dev --hostname localhost

# Option 2: Set environment variable
HOST=localhost npm run dev

# Option 3: Use 0.0.0.0
next dev --hostname 0.0.0.0
```

---

### API Key Errors

**Error:** "API key not configured"

**Solutions:**
1. **Check Environment Variables:**
   - Ensure `.env.local` file exists and contains valid API keys
   - Make sure there are no quotes around the keys
   - Restart the dev server after changing `.env.local`

2. **Check Browser Storage:**
   - Open DevTools → Application → Local Storage
   - Look for `llm-api-keys`
   - Ensure keys are stored correctly

3. **Verify Key Format:**
   - OpenAI: Should start with `sk-`
   - Anthropic: Should start with `sk-ant-`
   - Gemini: Should start with `AI`
   - Mistral: Varies
   - LLaMa (OpenRouter): Should start with `sk-or-v1-`

**Example `.env.local`:**
```env
OPENAI_API_KEY=sk-proj-abc123...
ANTHROPIC_API_KEY=sk-ant-api03-abc123...
GOOGLE_API_KEY=AIzaSyA...
MISTRAL_API_KEY=abc123...
LLAMA_API_KEY=sk-or-v1-abc123...
```

---

### Streaming Not Working

**Symptoms:** Responses don't appear or appear all at once

**Solutions:**
1. Check browser console for errors
2. Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 16+)
3. Disable browser extensions that might interfere with streaming
4. Check if your network/firewall is blocking SSE (Server-Sent Events)

---

### Rate Limit Errors

**Error:** "Rate limit exceeded" or 429 status code

**Solutions:**
1. Wait a few minutes before trying again
2. Check your API usage on the provider's dashboard
3. Upgrade your API plan if needed
4. Use fewer providers simultaneously

**Provider Dashboards:**
- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/settings/limits
- Gemini: https://makersuite.google.com/
- Mistral: https://console.mistral.ai/usage
- OpenRouter: https://openrouter.ai/activity

---

### Specific Provider Errors

#### OpenAI
- **"Invalid API key"**: Regenerate key at https://platform.openai.com/api-keys
- **"Insufficient credits"**: Add payment method at https://platform.openai.com/account/billing

#### Anthropic Claude
- **"Authentication error"**: Check key at https://console.anthropic.com/settings/keys
- **"Model not available"**: Ensure you have access to Claude 3.5 Sonnet

#### Google Gemini
- **"API key not valid"**: Create new key at https://makersuite.google.com/app/apikey
- **"Quota exceeded"**: Check limits at https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com

#### Mistral AI
- **"Unauthorized"**: Verify key at https://console.mistral.ai/api-keys
- **"Model not found"**: Ensure you have access to Mistral Large

#### Meta LLaMa (OpenRouter)
- **"Invalid key"**: Get new key at https://openrouter.ai/keys
- **"Model not available"**: Check model availability at https://openrouter.ai/models

---

### Build Errors

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for type errors
npm run build
```

---

### Port Already in Use

**Error:** "Port 3000 is already in use"

**Solutions:**
```bash
# Option 1: Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
npm run dev -- -p 3001

# Option 3: Find and stop the process manually
lsof -i:3000
# Then kill the PID shown
```

---

### Module Not Found Errors

**Error:** "Cannot find module '@/...'"

**Solution:**
```bash
# Reinstall dependencies
npm install

# Ensure tsconfig.json has the correct paths configuration
# (already configured in this project)
```

---

### Styling Not Applied

**Symptoms:** Page looks unstyled or plain HTML

**Solutions:**
1. Ensure Tailwind CSS is installed:
   ```bash
   npm install -D tailwindcss @tailwindcss/postcss
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

3. Clear browser cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)

---

### Browser Console Errors

**Error:** "Hydration failed"

**Solution:**
- This usually means server and client HTML don't match
- Check if you're using `localStorage` or `window` without proper client-side checks
- Clear browser cache and reload

---

## Performance Issues

### Slow Response Times

**Causes and Solutions:**
1. **API latency**: Different models have different response times
   - GPT-4o: Usually fast (1-3 seconds)
   - Claude 3.5 Sonnet: Fast (1-2 seconds)
   - Gemini 2.0 Flash: Very fast (<1 second)
   - Mistral Large: Fast (1-2 seconds)
   - LLaMa (OpenRouter): Can vary (2-5 seconds)

2. **Network issues**: Check your internet connection

3. **Too many concurrent requests**: Select fewer providers

### High Memory Usage

**Solution:**
- Close other browser tabs
- Restart the browser
- Limit the number of concurrent comparisons

---

## Need More Help?

1. **Check logs:** Look at terminal output for detailed error messages
2. **Browser console:** Open DevTools (F12) and check the Console tab
3. **Network tab:** Check the Network tab in DevTools for failed requests
4. **GitHub Issues:** Open an issue with:
   - Error message
   - Steps to reproduce
   - Browser and OS version
   - Which providers you're using

---

## Emergency Reset

If nothing works, try a complete reset:

```bash
# 1. Stop the server
# Press Ctrl+C in the terminal

# 2. Clean everything
rm -rf node_modules .next package-lock.json

# 3. Reinstall
npm install

# 4. Clear browser data
# Go to DevTools → Application → Clear site data

# 5. Restart
npm run dev
```

