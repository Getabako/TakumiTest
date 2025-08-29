import React from 'react';

/**
 * Application header with dark mode toggle.
 * @param {{darkMode: boolean, onToggle: () => void}} props
 */
export default function Header({ darkMode, onToggle }) {
  return (
    <header className="flex items-center justify-between p-4 bg-primary text-white">
      <h1 className="text-lg font-bold">Translator</h1>
      <button
        className="bg-secondary px-3 py-1 rounded"
        onClick={onToggle}
      >
        {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </header>
  );
}
