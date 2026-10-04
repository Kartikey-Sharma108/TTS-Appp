import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchHealth() {
  const { data } = await api.get('/health');
  return data;
}

export async function fetchVoices() {
  const { data } = await api.get('/voices');
  return data;
}

/**
 * POST /api/tts — turns text into speech.
 * @returns the API success payload with audioUrl / downloadUrl / format / ...
 */
export async function generateSpeech({ text, language, voice }) {
  const { data } = await api.post('/tts', { text, language, voice });
  return data;
}

/** Maps an axios/network error to a human-friendly message. */
export function getErrorMessage(err) {
  if (err.code === 'ECONNABORTED') {
    return 'The request timed out. The Text-to-Speech service is slow — please try again.';
  }
  if (!err.response) {
    return 'Network error: could not reach the server. Is the backend running?';
  }
  const serverMessage = err.response.data?.error?.message;
  if (serverMessage) return serverMessage;

  switch (err.response.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication failed. Check the server API key configuration.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 503:
      return 'The Text-to-Speech service is unavailable. Please try again later.';
    default:
      return `Server error (${err.response.status}). Please try again.`;
  }
}
