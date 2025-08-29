import { useState, useRef } from 'react';
import { translateText } from '../services/geminiApi';

/**
 * Hook to translate text using Gemini API with caching.
 * @returns {Object}
 */
export default function useTranslation() {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef({});

  /**
   * Translate text into multiple languages.
   * @param {string} text
   * @param {string} sourceLang
   * @param {string[]} targetLangs
   */
  const translate = async (text, sourceLang, targetLangs) => {
    if (!text || !targetLangs.length) return;
    const key = `${text}|${sourceLang}|${targetLangs.join(',')}`;
    if (cache.current[key]) {
      setTranslations(cache.current[key]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        targetLangs.map(async (lang) => {
          const res = await translateText(text, sourceLang, lang);
          return { language: lang, text: res.translation, score: res.score };
        })
      );
      setTranslations(results);
      cache.current[key] = results;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { translations, loading, error, translate };
}
