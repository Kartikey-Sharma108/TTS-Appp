export default function DownloadButton({ href, fileName }) {
  if (!href) return null;
  return (
    <a className="secondary-button" href={href} download={fileName || 'speech.mp3'}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16v-2H4v2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Download Audio
    </a>
  );
}
