import fs from 'node:fs';
import { getActiveProvider } from '../services/providers/index.js';
import * as storage from '../services/storage.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const synthesizeSpeech = asyncHandler(async (req, res) => {
  const { text, language, voice } = req.ttsInput;

  const provider = getActiveProvider();
  const { buffer, contentType, extension } = await provider.synthesize({ text, language, voice });

  const stored = storage.saveAudio({ buffer, extension, language, voice: voice.id });

  res.status(200).json({
    success: true,
    audioUrl: stored.audioUrl,
    downloadUrl: stored.downloadUrl,
    contentType,
    format: extension,
    sizeBytes: stored.sizeBytes,
    language,
    voice: voice.id,
    voiceName: voice.name,
    characterCount: text.length,
    expiresAt: stored.expiresAt,
    provider: provider.name,
  });
});

export const downloadSpeech = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!/^[a-f0-9]{24}$/.test(fileId)) {
    return res.status(404).json({
      success: false,
      error: { code: 'AUDIO_NOT_FOUND', message: 'Unknown audio file.' },
    });
  }

  const record = storage.getFile(fileId);
  if (!record) {
    return res.status(404).json({
      success: false,
      error: { code: 'AUDIO_NOT_FOUND', message: 'Audio expired or not found. Generate the speech again.' },
    });
  }

  const timestamp = new Date(record.createdAt).toISOString().replace(/[:.]/g, '-');
  const downloadName = `speech-${record.language}-${timestamp}.${record.extension}`;

  res.setHeader('Content-Type', record.contentType);
  res.setHeader('Content-Length', record.sizeBytes);
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  res.setHeader('Cache-Control', 'no-store');

  const stream = fs.createReadStream(record.filePath);
  stream.pipe(res);
});
