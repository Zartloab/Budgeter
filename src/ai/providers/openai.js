const OpenAI = require('openai');

function mapError(error) {
  const msg = String(error?.message || 'OpenAI request failed.');
  if (/401|incorrect api key|invalid api key/i.test(msg)) return 'Invalid OpenAI API key.';
  if (/429|rate limit/i.test(msg)) return 'OpenAI rate limit reached. Please retry shortly.';
  if (/timeout|timed out|aborted/i.test(msg)) return 'OpenAI request timed out.';
  if (/network|fetch failed|econn|enotfound/i.test(msg)) return 'Network failure while contacting OpenAI.';
  return msg;
}

async function sendOpenAIMessage({ apiKey, model, system, input, responseFormat }) {
  try {
    const client = new OpenAI({ apiKey });
    const req = {
      model: model || 'gpt-5.2',
      instructions: system || '',
      input: input || '',
      store: false
    };

    if (responseFormat === 'json') {
      req.text = { format: { type: 'json_object' } };
    }

    const response = await client.responses.create(req);
    return {
      success: true,
      provider: 'openai',
      text: response.output_text || '',
      raw: response
    };
  } catch (error) {
    return { success: false, provider: 'openai', error: mapError(error) };
  }
}

module.exports = { sendOpenAIMessage };
