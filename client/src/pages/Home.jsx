import { useEffect, useMemo, useState } from 'react';
import TextInput from '../components/TextInput.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import VoiceSelector from '../components/VoiceSelector.jsx';
import GenerateButton from '../components/GenerateButton.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { fetchHealth, fetchVoices, generateSpeech, getErrorMessage } from '../services/api.js';

export default function Home() {
  const [text, setText] = useState(
    'Hello! Welcome to the Text-to-Speech App. Type or paste your text, choose a language and voice, then generate speech.',
  );
  const [languages, setLanguages] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [provider, setProvider] = useState('edge');
  const [language, setLanguage] = useState('en-US');
  const [voice, setVoice] = useState('');
  const [maxLength, setMaxLength] = useState(500);

  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

  // Load languages, voices, and limits once on mount.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [voicesData, healthData] = await Promise.all([fetchVoices(), fetchHealth()]);
        if (cancelled) return;
        setLanguages(voicesData.languages || []);
        setAllVoices(voicesData.voices || []);
        setProvider(voicesData.provider || 'edge');
        setMaxLength(healthData.limits?.maxTextLength ?? 500);
        const first = (voicesData.voices || []).find((v) => v.language === 'en-US');
        setVoice(first ? first.id : voicesData.voices?.[0]?.id ?? '');
      } catch (err) {
        if (!cancelled) {
          setError({ message: 'Could not load voices and settings. Is the backend running on port 5000?' });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const voicesForLanguage = useMemo(
    () => allVoices.filter((v) => v.language === language),
    [allVoices, language],
  );

  const handleLanguageChange = (code) => {
    setLanguage(code);
    const firstInLang = allVoices.find((v) => v.language === code);
    setVoice((current) => (allVoices.find((v) => v.id === current)?.language === code ? current : firstInLang?.id ?? ''));
  };

  const canGenerate = !loading && text.trim().length > 0 && text.length <= maxLength && language && voice;

  const handleGenerate = async () => {
    setError(null);

    if (!text.trim()) {
      setError({ code: 'EMPTY_TEXT', message: 'Please enter some text before generating speech.' });
      return;
    }
    if (text.length > maxLength) {
      setError({
        code: 'TEXT_TOO_LONG',
        message: `Text exceeds the maximum of ${maxLength} characters (currently ${text.length}).`,
      });
      return;
    }

    setLoading(true);
    setAudio(null);
    try {
      const result = await generateSpeech({ text, language, voice });
      setAudio(result);
    } catch (err) {
      setError({ message: getErrorMessage(err), code: err.response?.data?.error?.code });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <h1>TEXT TO SPEECH</h1>
        <span className="provider-badge" title="Active TTS provider">
          Provider: {provider}
        </span>
      </header>

      <main className="card">
        <TextInput
          value={text}
          onChange={setText}
          onClear={() => setText('')}
          maxLength={maxLength}
          disabled={loading}
        />

        <div className="selects-row">
          <LanguageSelector
            languages={languages}
            value={language}
            onChange={handleLanguageChange}
            disabled={loading}
          />
          <VoiceSelector voices={voicesForLanguage} value={voice} onChange={setVoice} disabled={loading} />
        </div>

        <GenerateButton onClick={handleGenerate} loading={loading} disabled={!canGenerate} />

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        {audio && (
          <section className="result" aria-live="polite">
            <h2>Generated Audio</h2>
            <p className="result-meta">
              {audio.voiceName} · {audio.language} · {audio.format?.toUpperCase()} ·{' '}
              {(audio.sizeBytes / 1024).toFixed(0)} KB
            </p>
            <AudioPlayer src={audio.audioUrl} />
            <div className="result-actions">
              <DownloadButton href={audio.downloadUrl} fileName={`speech-${audio.language}.${audio.format || 'mp3'}`} />
              <button type="button" className="link-button" onClick={() => setAudio(null)}>
                Remove
              </button>
            </div>
            <p className="hint">Audio is stored temporarily and expires automatically (see server settings).</p>
          </section>
        )}
      </main>
    </>
  );
}
