/**
 * Central catalog of supported languages and voices.
 *
 * Every voice knows how to reach it on each provider (providerVoices),
 * so the API surface stays provider-agnostic.
 */

export const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
];

/**
 * Voice shape:
 * {
 *   id: unique id sent as `voice` in POST /api/tts,
 *   name: display name,
 *   language: language code from LANGUAGES,
 *   gender: 'Female' | 'Male',
 *   style: speaking style hint,
 *   providerVoices: { edge, google, azure, elevenlabs }
 * }
 */
export const VOICES = [
  // ---------------- English (US) ----------------
  {
    id: 'en-us-ava',
    name: 'Ava',
    language: 'en-US',
    gender: 'Female',
    style: 'Natural & conversational',
    providerVoices: {
      edge: 'en-US-AvaNeural',
      google: 'en-US-Neural2-C',
      azure: 'en-US-AvaNeural',
      elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    },
  },
  {
    id: 'en-us-aria',
    name: 'Aria',
    language: 'en-US',
    gender: 'Female',
    style: 'Bright & expressive',
    providerVoices: {
      edge: 'en-US-AriaNeural',
      google: 'en-US-Neural2-F',
      azure: 'en-US-AriaNeural',
      elevenlabs: 'EXAVITQu4vr4xnSDxMaL',
    },
  },
  {
    id: 'en-us-andrew',
    name: 'Andrew',
    language: 'en-US',
    gender: 'Male',
    style: 'Calm & natural',
    providerVoices: {
      edge: 'en-US-AndrewNeural',
      google: 'en-US-Neural2-A',
      azure: 'en-US-AndrewNeural',
      elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    },
  },
  {
    id: 'en-us-christopher',
    name: 'Christopher',
    language: 'en-US',
    gender: 'Male',
    style: 'Deep & authoritative',
    providerVoices: {
      edge: 'en-US-ChristopherNeural',
      google: 'en-US-Neural2-D',
      azure: 'en-US-ChristopherNeural',
      elevenlabs: 'TxGEqnHWrfWFTfGW9XjX',
    },
  },

  // ---------------- Hindi ----------------
  {
    id: 'hi-in-swara',
    name: 'Swara',
    language: 'hi-IN',
    gender: 'Female',
    style: 'Natural & clear',
    providerVoices: {
      edge: 'hi-IN-SwaraNeural',
      google: 'hi-IN-Neural2-A',
      azure: 'hi-IN-SwaraNeural',
      elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    },
  },
  {
    id: 'hi-in-madhur',
    name: 'Madhur',
    language: 'hi-IN',
    gender: 'Male',
    style: 'Warm & steady',
    providerVoices: {
      edge: 'hi-IN-MadhurNeural',
      google: 'hi-IN-Neural2-B',
      azure: 'hi-IN-MadhurNeural',
      elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    },
  },

  // ---------------- Gujarati ----------------
  {
    id: 'gu-in-dhwani',
    name: 'Dhwani',
    language: 'gu-IN',
    gender: 'Female',
    style: 'Natural & clear',
    providerVoices: {
      edge: 'gu-IN-DhwaniNeural',
      google: 'gu-IN-Wavenet-A',
      azure: 'gu-IN-DhwaniNeural',
      elevenlabs: 'EXAVITQu4vr4xnSDxMaL',
    },
  },
  {
    id: 'gu-in-niranjan',
    name: 'Niranjan',
    language: 'gu-IN',
    gender: 'Male',
    style: 'Natural & steady',
    providerVoices: {
      edge: 'gu-IN-NiranjanNeural',
      google: 'gu-IN-Wavenet-B',
      azure: 'gu-IN-NiranjanNeural',
      elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    },
  },

  // ---------------- Marathi ----------------
  {
    id: 'mr-in-aarohi',
    name: 'Aarohi',
    language: 'mr-IN',
    gender: 'Female',
    style: 'Natural & clear',
    providerVoices: {
      edge: 'mr-IN-AarohiDhrNeural',
      google: 'mr-IN-Wavenet-A',
      azure: 'mr-IN-AarohiDhrNeural',
      elevenlabs: 'EXAVITQu4vr4xnSDxMaL',
    },
  },
  {
    id: 'mr-in-manohar',
    name: 'Manohar',
    language: 'mr-IN',
    gender: 'Male',
    style: 'Natural & steady',
    providerVoices: {
      edge: 'mr-IN-ManoharDhrNeural',
      google: 'mr-IN-Wavenet-B',
      azure: 'mr-IN-ManoharDhrNeural',
      elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    },
  },

  // ---------------- Spanish ----------------
  {
    id: 'es-es-elvira',
    name: 'Elvira',
    language: 'es-ES',
    gender: 'Female',
    style: 'Natural & friendly',
    providerVoices: {
      edge: 'es-ES-ElviraNeural',
      google: 'es-ES-Neural2-B',
      azure: 'es-ES-ElviraNeural',
      elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    },
  },
  {
    id: 'es-es-alvaro',
    name: 'Alvaro',
    language: 'es-ES',
    gender: 'Male',
    style: 'Clear & professional',
    providerVoices: {
      edge: 'es-ES-AlvaroNeural',
      google: 'es-ES-Neural2-A',
      azure: 'es-ES-AlvaroNeural',
      elevenlabs: 'TxGEqnHWrfWFTfGW9XjX',
    },
  },

  // ---------------- French ----------------
  {
    id: 'fr-fr-denise',
    name: 'Denise',
    language: 'fr-FR',
    gender: 'Female',
    style: 'Natural & soft',
    providerVoices: {
      edge: 'fr-FR-DeniseNeural',
      google: 'fr-FR-Neural2-A',
      azure: 'fr-FR-DeniseNeural',
      elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    },
  },
  {
    id: 'fr-fr-henri',
    name: 'Henri',
    language: 'fr-FR',
    gender: 'Male',
    style: 'Clear & calm',
    providerVoices: {
      edge: 'fr-FR-HenriNeural',
      google: 'fr-FR-Neural2-B',
      azure: 'fr-FR-HenriNeural',
      elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    },
  },

  // ---------------- German ----------------
  {
    id: 'de-de-katja',
    name: 'Katja',
    language: 'de-DE',
    gender: 'Female',
    style: 'Natural & warm',
    providerVoices: {
      edge: 'de-DE-KatjaNeural',
      google: 'de-DE-Neural2-B',
      azure: 'de-DE-KatjaNeural',
      elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    },
  },
  {
    id: 'de-de-conrad',
    name: 'Conrad',
    language: 'de-DE',
    gender: 'Male',
    style: 'Deep & professional',
    providerVoices: {
      edge: 'de-DE-ConradNeural',
      google: 'de-DE-Neural2-C',
      azure: 'de-DE-ConradNeural',
      elevenlabs: 'TxGEqnHWrfWFTfGW9XjX',
    },
  },
];

const languageName = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.name]));

export function getSupportedLanguages() {
  return LANGUAGES.map((l) => ({ ...l }));
}

export function isSupportedLanguage(code) {
  return LANGUAGES.some((l) => l.code === code);
}

export function findVoice(id) {
  return VOICES.find((v) => v.id === id);
}

export function voicesForLanguage(language) {
  return VOICES.filter((v) => v.language === language);
}

/** Public voice shape sent to the frontend. */
export function serializeVoice(voice) {
  return {
    id: voice.id,
    name: voice.name,
    language: voice.language,
    languageName: languageName[voice.language],
    gender: voice.gender,
    style: voice.style,
    label: `${voice.name} · ${languageName[voice.language]} · ${voice.gender}`,
  };
}
