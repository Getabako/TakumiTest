const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Translate text using Google Gemini API.
 * @param {string} text
 * @param {string} sourceLang
 * @param {string} targetLang
 * @returns {Promise<{translation: string, score: number}>}
 */
export async function translateText(text, sourceLang, targetLang) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.\nProvide only the translation without any explanations.\nMaintain the original formatting and tone.\n\nText: ${text}`;

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Translation failed');
  }
  const data = await res.json();
  const translation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  const score = data.candidates?.[0]?.safetyRatings?.[0]?.probability || 1;
  return { translation, score };
}
