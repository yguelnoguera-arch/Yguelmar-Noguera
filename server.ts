import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Ensure audio cache directory exists in public
const audioCacheDir = path.resolve(__dirname, 'public/audio/cache');
fs.mkdirSync(audioCacheDir, { recursive: true });

// Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('[Server] Warning: GEMINI_API_KEY is not defined. TTS will rely on cached tracks.');
}

// In-memory cache for instant access
const memoryAudioCache = new Map<string, string>();

/**
 * Hash helper for audio cache
 */
function getHash(text: string, voice: string = 'Fenrir'): string {
  return crypto.createHash('sha256').update(`${voice}:${text.trim()}`).digest('hex').slice(0, 24);
}

// =========================================================================
// API Routes
// =========================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(ai),
    timestamp: new Date().toISOString()
  });
});

// Gemini TTS Generation with Fenrir voice and caching
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Fenrir' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const cleanText = text.trim();
    const hash = getHash(cleanText, voice);
    const fileName = `${hash}.wav`;
    const filePath = path.join(audioCacheDir, fileName);
    const publicUrl = `/audio/cache/${fileName}`;

    // 1. Check in-memory / disk cache first
    if (fs.existsSync(filePath)) {
      return res.json({
        success: true,
        cached: true,
        audioUrl: publicUrl,
        hash
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server',
        fallbackNeeded: true
      });
    }

    // 2. Call Gemini TTS with Fenrir voice (warm masculine baritone for somatic meditation)
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Voz masculina profunda, reposada, cálida y pausada para meditación somática, compás lento'
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Fenrir' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS');
    }

    // Save generated WAV buffer to disk
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(filePath, audioBuffer);
    memoryAudioCache.set(hash, publicUrl);

    console.log(`[TTS] Generated Fenrir audio (${audioBuffer.length} bytes) for: "${cleanText.slice(0, 45)}..." -> ${fileName}`);

    return res.json({
      success: true,
      cached: false,
      audioUrl: publicUrl,
      base64Audio,
      hash
    });
  } catch (err: any) {
    console.error('[TTS Error]', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'Error generating TTS audio',
      fallbackNeeded: true
    });
  }
});

// Static audio files
app.use('/audio', express.static(path.resolve(__dirname, 'public/audio')));

// =========================================================================
// Vite Dev Middleware or Production Static Serving
// =========================================================================
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Server] Vuelve a tu Centro running on http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Server Failed to Start]', err);
  process.exit(1);
});
