import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';
import edge from './edge.provider.js';
import google from './google.provider.js';
import azure from './azure.provider.js';
import elevenlabs from './elevenlabs.provider.js';

const providers = { edge, google, azure, elevenlabs };

export function listProviders() {
  return Object.entries(providers).map(([name, p]) => ({
    name,
    displayName: p.displayName,
    configured: p.isConfigured(),
  }));
}

/** Returns the active provider: the one named by TTS_PROVIDER (default "edge"). */
export function getActiveProvider() {
  const requested = (process.env.TTS_PROVIDER || 'edge').trim().toLowerCase();
  const provider = providers[requested];
  if (!provider) {
    throw ApiError.internal(`Unknown TTS_PROVIDER "${requested}". Expected one of: ${Object.keys(providers).join(', ')}.`);
  }
  if (!provider.isConfigured()) {
    throw ApiError.unauthorized(
      'PROVIDER_NOT_CONFIGURED',
      `The "${requested}" TTS provider is missing credentials. Set TTS_API_KEY (and TTS_REGION for azure) in the server .env file.`,
    );
  }
  logger.debug(`Using TTS provider: ${provider.name}`);
  return provider;
}
