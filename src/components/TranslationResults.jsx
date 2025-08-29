import React from 'react';
import { copyToClipboard, downloadJSON, downloadCSV } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Display translation results.
 * @param {Object} props
 * @param {Array<{language:string,text:string,score:number}>} props.translations
 * @param {boolean} props.loading
 * @param {string|null} props.error
 * @param {Array} props.history
 */
export default function TranslationResults({ translations, loading, error, history = [] }) {
  const [favorites, setFavorites] = useLocalStorage('favoritePhrases', []);
  const speak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const exportJSON = () => downloadJSON('translations.json', translations);
  const exportCSV = () => downloadCSV('translations.csv', translations);

  const toggleFavorite = (text) => {
    setFavorites(
      favorites.includes(text)
        ? favorites.filter((t) => t !== text)
        : [...favorites, text]
    );
  };

  return (
    <div>
      {loading && <div className="my-4">Translating...</div>}
      {error && <div className="my-4 text-red-500">{error}</div>}
      <div className="space-y-4">
        {translations.map((t) => (
          <div key={t.language} className="p-3 border rounded bg-gray-100 dark:bg-gray-800">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{t.language}</h3>
              <span className="text-sm">Score: {t.score}</span>
            </div>
            <p className="whitespace-pre-wrap">{t.text}</p>
            <div className="flex gap-2 mt-2 text-sm">
              <button
                className="px-2 py-1 border rounded"
                onClick={() => copyToClipboard(t.text)}
              >
                Copy
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => speak(t.text, t.language)}
              >
                Speak
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => toggleFavorite(t.text)}
              >
                {favorites.includes(t.text) ? '★' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {translations.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button className="px-2 py-1 border rounded" onClick={exportJSON}>
            Export JSON
          </button>
          <button className="px-2 py-1 border rounded" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      )}
      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">History</h4>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {history.slice().reverse().map((h, i) => (
              <li key={i} className="border-b pb-1">{h.text}</li>
            ))}
          </ul>
        </div>
      )}
      {favorites.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Favorite Phrases</h4>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {favorites.map((f, i) => (
              <li key={i} className="border-b pb-1">{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
