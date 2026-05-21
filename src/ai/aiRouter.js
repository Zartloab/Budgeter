const { sendOpenAIMessage } = require('./providers/openai');
const { sendClaudeMessage } = require('./providers/claude');

const PROVIDERS = ['openai', 'claude'];

function parseMaybeJson(text) {
  try {
    return { parsed: JSON.parse(text), parseError: null };
  } catch (error) {
    return { parsed: null, parseError: `Malformed JSON response: ${error.message}` };
  }
}

async function routeAIMessage(payload) {
  const provider = (payload.provider || 'openai').toLowerCase();
  if (!PROVIDERS.includes(provider)) {
    return { success: false, provider, error: 'Provider unavailable. Choose OpenAI or Claude.' };
  }

  if (provider === 'openai') {
    if (!payload.openaiApiKey) return { success: false, provider, error: 'Missing OpenAI API key. Add it in Settings.' };
    const result = await sendOpenAIMessage({
      apiKey: payload.openaiApiKey,
      model: payload.model || 'gpt-5.2',
      system: payload.system,
      input: payload.input,
      responseFormat: payload.responseFormat
    });
    if (!result.success) return result;
    if (payload.responseFormat === 'json') {
      const { parsed, parseError } = parseMaybeJson(result.text);
      return { ...result, parsed, parseError };
    }
    return result;
  }

  if (!payload.claudeApiKey) return { success: false, provider, error: 'Missing Claude API key. Add it in Settings.' };
  const result = await sendClaudeMessage({
    apiKey: payload.claudeApiKey,
    model: payload.model || 'claude-sonnet-4-20250514',
    system: payload.system,
    input: payload.input
  });
  if (!result.success) return result;
  if (payload.responseFormat === 'json') {
    const { parsed, parseError } = parseMaybeJson(result.text);
    return { ...result, parsed, parseError };
  }
  return result;
}

module.exports = { routeAIMessage, PROVIDERS };
