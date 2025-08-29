import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TranslationInput from './components/TranslationInput';
import LanguageSelector from './components/LanguageSelector';
import TranslationResults from './components/TranslationResults';
import ErrorBoundary from './components/ErrorBoundary';
import useTranslation from './hooks/useTranslation';
import useLocalStorage from './hooks/useLocalStorage';
import { debounce } from './utils/helpers';

/**
 * Root application component.
 */
export default function App() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLangs, setTargetLangs] = useState(['en']);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [history, setHistory] = useLocalStorage('history', []);

  const { translations, loading, error, translate } = useTranslation();

  const translateAndSave = async () => {
    await translate(text, sourceLang, targetLangs);
    if (text.trim()) {
      setHistory([
        ...history,
        {
          text,
          sourceLang,
          targetLangs,
          translations,
          time: Date.now(),
        },
      ]);
    }
  };

  const debounced = useRef(debounce(translateAndSave, 500)).current;

  useEffect(() => {
    if (text.trim()) {
      debounced();
    }
  }, [text, sourceLang, targetLangs]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
      <ErrorBoundary>
        <main className="flex flex-1 flex-col md:flex-row">
          <div className="md:w-1/2 p-4 space-y-4">
            <LanguageSelector
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
              targetLangs={targetLangs}
              setTargetLangs={setTargetLangs}
            />
            <TranslationInput
              text={text}
              setText={setText}
              onTranslate={translateAndSave}
            />
          </div>
          <div className="md:w-1/2 p-4">
            <TranslationResults
              translations={translations}
              loading={loading}
              error={error}
              history={history}
            />
          </div>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
