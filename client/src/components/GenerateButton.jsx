export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      className="primary-button"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {loading ? 'Generating…' : 'Generate Speech'}
    </button>
  );
}
