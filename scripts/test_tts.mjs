import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const outputDir = path.resolve("./public/audio/voice");
fs.mkdirSync(outputDir, { recursive: true });

// Test test clip
async function testGen() {
  console.log("Testing generation with gemini-3.8-flash-lite-tts and Fenrir voice...");
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash-lite-tts",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Apoya ambos pies en el suelo... siente la calma... inhala profundo... y exhala.",
            speechMetadata: {
              style: "Voz masculina profunda, muy serena, cálida y pausada para meditación y relajación somática",
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Fenrir" },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio returned in response");
  }
  const buffer = Buffer.from(base64Audio, "base64");
  const testPath = path.join(outputDir, "test.wav");
  fs.writeFileSync(testPath, buffer);
  console.log(`Success! Written ${buffer.length} bytes to ${testPath}`);
}

testGen().catch(err => {
  console.error("Generation error:", err);
  process.exit(1);
});
