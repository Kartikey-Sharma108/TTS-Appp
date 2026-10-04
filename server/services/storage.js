import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { logger } from '../utils/logger.js';

const serverDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const AUDIO_DIR = process.env.AUDIO_DIR
  ? path.resolve(process.env.AUDIO_DIR)
  : path.join(serverDir, 'storage', 'audio');

export const CONTENT_TYPES = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  opus: 'audio/ogg',
  webm: 'audio/webm',
};

/** In-memory index of generated files: fileId -> metadata */
const files = new Map();

fs.mkdirSync(AUDIO_DIR, { recursive: true });

export function getAudioDir() {
  return AUDIO_DIR;
}

/**
 * Persists generated audio to disk and indexes it.
 * Returns the public URLs and metadata for the API response.
 */
export function saveAudio({ buffer, extension, language, voice }) {
  const fileId = crypto.randomBytes(12).toString('hex');
  const fileName = `${fileId}.${extension}`;
  const filePath = path.join(AUDIO_DIR, fileName);

  fs.writeFileSync(filePath, buffer);

  const ttlMs = getTtlMs();
  const record = {
    fileId,
    fileName,
    filePath,
    contentType: CONTENT_TYPES[extension] ?? 'application/octet-stream',
    sizeBytes: buffer.length,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
    language,
    voice,
    extension,
  };
  files.set(fileId, record);

  return {
    fileId,
    audioUrl: `/audio/${fileName}`,
    downloadUrl: `/api/tts/download/${fileId}`,
    contentType: record.contentType,
    sizeBytes: record.sizeBytes,
    expiresAt: new Date(record.expiresAt).toISOString(),
  };
}

export function getFile(fileId) {
  const record = files.get(fileId);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    removeFile(record);
    return null;
  }
  if (!fs.existsSync(record.filePath)) {
    files.delete(fileId);
    return null;
  }
  return record;
}

function removeFile(record) {
  try {
    fs.unlinkSync(record.filePath);
  } catch {
    /* already gone */
  }
  files.delete(record.fileId);
}

export function getTtlMs() {
  const minutes = Number(process.env.AUDIO_TTL_MINUTES);
  return (Number.isFinite(minutes) && minutes > 0 ? minutes : 15) * 60 * 1000;
}

/** Deletes expired files. Runs on an interval from server.js. */
export function cleanupExpired() {
  const now = Date.now();
  let removed = 0;
  for (const record of [...files.values()]) {
    if (now > record.expiresAt || !fs.existsSync(record.filePath)) {
      removeFile(record);
      removed += 1;
    }
  }
  if (removed > 0) logger.info(`Audio cleanup removed ${removed} expired file(s).`);
  return removed;
}

export function storageStats() {
  return { audioDir: AUDIO_DIR, storedFiles: files.size, ttlMinutes: getTtlMs() / 60000 };
}
