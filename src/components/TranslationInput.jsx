import React from 'react';

/**
 * Text area for input with counters and actions.
 * @param {Object} props
 * @param {string} props.text
 * @param {Function} props.setText
 * @param {Function} props.onTranslate
 */
export default function TranslationInput({ text, setText, onTranslate }) {
  const max = 5000;
  const handleChange = (e) => {
    if (e.target.value.length <= max) {
      setText(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onTranslate();
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full h-40 p-2 border rounded resize-none dark:bg-gray-800"
        placeholder="Enter text to translate..."
      />
      <div className="flex justify-between items-center text-sm">
        <span>{text.length}/{max}</span>
        <div className="space-x-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setText('')}
          >
            Clear
          </button>
          <button
            className="px-2 py-1 bg-primary text-white rounded"
            onClick={onTranslate}
          >
            Translate
          </button>
        </div>
      </div>
    </div>
  );
}
