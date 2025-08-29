import React from 'react';
import { languages } from '../utils/languages';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Select source and target languages.
 * @param {Object} props
 * @param {string} props.sourceLang
 * @param {Function} props.setSourceLang
 * @param {string[]} props.targetLangs
 * @param {Function} props.setTargetLangs
 */
export default function LanguageSelector({
  sourceLang,
  setSourceLang,
  targetLangs,
  setTargetLangs,
}) {
  const [favorites, setFavorites] = useLocalStorage('favoriteLangs', []);

  const toggleFavorite = (code) => {
    setFavorites(
      favorites.includes(code)
        ? favorites.filter((c) => c !== code)
        : [...favorites, code]
    );
  };

  const handleTargetChange = (code) => {
    if (targetLangs.includes(code)) {
      setTargetLangs(targetLangs.filter((c) => c !== code));
    } else if (targetLangs.length < 5) {
      setTargetLangs([...targetLangs, code]);
    }
  };

  const sortedLanguages = [...languages.filter(l => l.code !== 'auto')].sort((a, b) => {
    const af = favorites.includes(a.code);
    const bf = favorites.includes(b.code);
    if (af === bf) return a.name.localeCompare(b.name);
    return af ? -1 : 1;
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Source Language</label>
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="mt-1 p-2 border rounded w-full dark:bg-gray-800"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Target Languages (max 5)</label>
        <div className="max-h-48 overflow-y-auto border p-2 rounded dark:bg-gray-800">
          {sortedLanguages.map((lang) => (
            <div key={lang.code} className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={targetLangs.includes(lang.code)}
                  onChange={() => handleTargetChange(lang.code)}
                  className="mr-2"
                />
                {lang.name}
              </label>
              <button
                type="button"
                onClick={() => toggleFavorite(lang.code)}
                className="text-yellow-400"
                aria-label="favorite"
              >
                {favorites.includes(lang.code) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
