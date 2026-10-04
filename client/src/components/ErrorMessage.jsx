import { useEffect, useState } from 'react';

export default function ErrorMessage({ error, onDismiss }) {
  const [leaving, setLeaving] = useState(false);

  // Reset the leaving state whenever a fresh error arrives.
  useEffect(() => setLeaving(false), [error]);

  if (!error) return null;

  const dismiss = () => {
    setLeaving(true);
    // Let the exit animation finish before notifying the parent.
    setTimeout(() => onDismiss?.(), 220);
  };

  return (
    <div className={`error-box ${leaving ? 'error-box-leaving' : ''}`} role="alert">
      <div className="error-content">
        <strong>{error.code ? `${error.code}: ` : ''}</strong>
        {error.message}
      </div>
      {onDismiss && (
        <button type="button" className="error-dismiss" aria-label="Dismiss error" onClick={dismiss}>
          ×
        </button>
      )}
    </div>
  );
}
