import { countWords } from '../utils/text.js';

export default function TextInput({ value, onChange, onClear, maxLength, disabled }) {
  const overLimit = value.length > maxLength;
  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor="tts-text">Enter your text:</label>
        {value.length > 0 && (
          <button type="button" className="link-button" onClick={onClear} disabled={disabled}>
            Clear
          </button>
        )}
      </div>
      <textarea
        id="tts-text"
        className={`text-area ${overLimit ? 'text-area-error' : ''}`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste text here, then press Generate Speech…"
        rows={6}
        spellCheck="false"
      />
      <div className="counter-row">
        <span className={overLimit ? 'counter counter-error' : 'counter'}>
          Characters: {value.length}/{maxLength}
        </span>
        <span className="counter">Words: {countWords(value)}</span>
      </div>
    </div>
  );
}
