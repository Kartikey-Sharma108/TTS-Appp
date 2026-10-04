import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/text.js';

/** Custom audio player: play/pause, seek, time display, volume, mute. */
export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // Reset when a new audio source arrives.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  if (!src) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => setPlaying(false));
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const value = Number(e.target.value);
    setCurrent(value);
    if (audio) audio.currentTime = value;
  };

  const changeVolume = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    setMuted(value === 0);
    if (audioRef.current) {
      audioRef.current.volume = value;
      audioRef.current.muted = value === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (audio) audio.muted = next;
  };

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.target.currentTime)}
        onDurationChange={(e) => setDuration(e.target.duration || 0)}
        onLoadedMetadata={(e) => setDuration(e.target.duration || 0)}
      />

      <button type="button" className="player-button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <span className="player-time">{formatTime(current)}</span>

      <input
        type="range"
        className="seek-slider"
        min="0"
        max={duration || 0}
        step="0.1"
        value={Math.min(current, duration || 0)}
        onChange={seek}
        aria-label="Seek"
      />

      <span className="player-time">{formatTime(duration)}</span>

      <button type="button" className="player-button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          {muted || volume === 0 ? (
            <path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" strokeWidth="2" fill="none" />
          ) : (
            <path d="M16 8a4 4 0 010 8M18.5 5.5a8 8 0 010 13" stroke="currentColor" strokeWidth="2" fill="none" />
          )}
        </svg>
      </button>

      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.05"
        value={muted ? 0 : volume}
        onChange={changeVolume}
        aria-label="Volume"
      />
    </div>
  );
}
