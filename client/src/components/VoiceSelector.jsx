export default function VoiceSelector({ voices, value, onChange, disabled }) {
  return (
    <div className="field">
      <label htmlFor="tts-voice">Voice:</label>
      <select
        id="tts-voice"
        className="select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} · {voice.gender} · {voice.style}
          </option>
        ))}
      </select>
    </div>
  );
}
