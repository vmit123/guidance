const config = require('./config');

const buildGeminiUrl = () => {
  const model = config.geminiModel || 'gemini-2.5-flash';
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
};

const getGeminiAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'x-goog-api-key': config.geminiApiKey
});

const buildPrompt = (prompt, conversationHistory = []) => {
  const historyText = (conversationHistory || [])
    .map(entry => entry.isBot ? `Assistant: ${entry.text}` : `User: ${entry.text}`)
    .join('\n');

  return `${historyText}\nUser: ${prompt}\nAssistant:`.trim();
};

const generateGeminiResponse = async (prompt, conversationHistory = []) => {
  if (!config.geminiApiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const url = buildGeminiUrl();
  const textPrompt = buildPrompt(prompt, conversationHistory);
  const body = {
    contents: [
      {
        parts: [
          { text: textPrompt }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: getGeminiAuthHeaders(),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  const text = 
    data?.candidates?.[0]?.content ||
    data?.output?.[0]?.content ||
    data?.response?.content ||
    data?.outputs?.[0]?.content?.text ||
    (Array.isArray(data?.outputs?.[0]?.content) ? data.outputs[0].content.map((item) => item.text || '').join(' ') : '') ||
    '';

  return (typeof text === 'string' ? text : JSON.stringify(text)).trim();
};

module.exports = {
  generateGeminiResponse
};
