export default function LanguageSelector({ languages, value, onChange, disabled }) {
  return (
    <div className="field">
      <label htmlFor="tts-language">Language:</label>
      <select
        id="tts-language"
        className="select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
