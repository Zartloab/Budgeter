const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

function mapError(message, status) {
  const msg = String(message || 'Claude request failed.');
  if (status === 401 || /invalid.*api.*key/i.test(msg)) return 'Invalid Claude API key.';
  if (status === 429 || /rate limit/i.test(msg)) return 'Claude rate limit reached. Please retry shortly.';
  if (/timeout|timed out|aborted/i.test(msg)) return 'Claude request timed out.';
  if (/network|fetch failed|econn|enotfound/i.test(msg)) return 'Network failure while contacting Claude.';
  return msg;
}

async function sendClaudeMessage({ apiKey, model, system, input }) {
  try {
    const res = await fetch(CLAUDE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 700,
        system: system || '',
        messages: [{ role: 'user', content: String(input || '') }]
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, provider: 'claude', error: mapError(json?.error?.message, res.status) };
    }

    const text = Array.isArray(json.content)
      ? json.content.filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim()
      : '';

    return { success: true, provider: 'claude', text: text || 'No text response returned.', raw: json };
  } catch (error) {
    return { success: false, provider: 'claude', error: mapError(error.message) };
  }
}

module.exports = { sendClaudeMessage };
