import { listProviders } from '../services/providers/index.js';
import { storageStats } from '../services/storage.js';

const startedAt = Date.now();

export function healthCheck(_req, res) {
  const activeName = (process.env.TTS_PROVIDER || 'edge').toLowerCase();
  const active = listProviders().find((p) => p.name === activeName);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    environment: process.env.NODE_ENV || 'development',
    provider: activeName,
    providerConfigured: active ? active.configured : false,
    providers: listProviders(),
    limits: {
      maxTextLength: Number(process.env.MAX_TEXT_LENGTH) > 0 ? Number(process.env.MAX_TEXT_LENGTH) : 500,
    },
    storage: storageStats(),
  });
}
