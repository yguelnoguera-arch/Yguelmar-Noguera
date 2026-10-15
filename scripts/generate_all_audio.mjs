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

// Complete Somatic Meditation Scripts for Weeks 1 to 5 + SOS Calma and Energía
const BASE_SCRIPTS = [
  // Semana 1
  {
    key: "week-1-min-1",
    text: "Minuto uno... Apoya ambos pies en el suelo... o siente con claridad la base de tu asiento... Deja que todo el peso de tu cuerpo caiga hacia la tierra... Inhala profundo y suave por la nariz... y al exhalar, suelta el peso de tus hombros y tu mandíbula... Siente cómo el suelo te sostiene firmemente aquí y ahora... Respira suave, largo y profundo a tu propio ritmo."
  },
  {
    key: "week-1-min-2",
    text: "Minuto dos... Ahora, lleva tu foco lentamente desde los tobillos... subiendo por las rodillas y la pelvis... hacia el abdomen y el pecho... Nota si hay alguna rigidez o tensión sutil... obsérvala sin juzgarla... Para abrir espacio, inhala hondo llevando el aire directamente hacia esa zona... y exhala muy despacio... permitiendo que los tejidos se ablanden y cedan... No intentes cambiar nada... solo acompaña cada sensación con tu respiración natural."
  },
  {
    key: "week-1-min-3",
    text: "Minuto tres... Despega la lengua del paladar... afloja la piel de la frente y el entrecejo... Inhala profundo sintiendo la quietud en tu coronilla... y exhala largo... permitiendo que todo tu cuerpo entre en un estado de descanso seguro y profundo... Estás habitando tu centro... Todo está bien en este instante."
  },

  // Semana 2
  {
    key: "week-2-min-1",
    text: "Minuto uno... Coloca con dulzura una mano en tu pecho y otra en tu abdomen... Inhala suave por la nariz sintiendo la frescura del aire al entrar... y exhala despacio percibiendo el aire tibio al salir... Observa el vaivén natural de tu cuerpo sin forzar nada... Respira a tu propio compás."
  },
  {
    key: "week-2-min-2",
    text: "Minuto dos... Comencemos el compás de coherencia diafragmática... Inhala profundo en uno... dos... tres... cuatro... expandiendo el vientre... y exhala suave en uno... dos... tres... cuatro... liberando todo el aire... Inhala calma... y exhala cualquier prisa... Siente cómo tu corazón acompasa este ritmo sereno."
  },
  {
    key: "week-2-min-3",
    text: "Minuto tres... Ahora, haz la exhalación un poco más larga que la inhalación... Inhala llenando tus pulmones con aire nuevo... y exhala muy lento, vaciándote por completo... Nota esa pequeña pausa de quietud absoluta al final de soltar el aire... En ese silencio breve habita tu verdadera serenidad."
  },

  // Semana 3
  {
    key: "week-3-min-1",
    text: "Minuto uno... Cierra suavemente los ojos e imagina tu mente como un cielo despejado... Cada pensamiento que cruza es solo una nube pasajera... Inhala profundo abriendo espacio en tu mente... y exhala dejando que esa nube siga su camino sin retenerla ni juzgarla... Respira con tranquilidad."
  },
  {
    key: "week-3-min-2",
    text: "Minuto dos... Lleva toda tu atención a la punta de la nariz o al roce sutil del aire sobre tu labio superior... Inhala sintiendo esa pequeña caricia fresca... y exhala despacio manteniendo tu presencia allí... Si la mente se distrae, sonríe suavemente e inhala de nuevo regresando a este punto neutro."
  },
  {
    key: "week-3-min-3",
    text: "Minuto tres... Percibe el silencio sutil que descansa por debajo de los sonidos... Inhala profundo nutriendo tu quietud interior... y exhala largo, soltando la necesidad de resolver o controlar algo ahora... En este momento no hay nada que buscar... solo descansar en tu centro."
  },

  // Semana 4
  {
    key: "week-4-min-1",
    text: "Minuto uno... Haz un giro muy lento y suave con tus hombros hacia atrás... Deja colgar tus brazos pesados a los lados... Inhala profundo llevando aire hacia tus omóplatos... y al exhalar, imagina que cualquier peso o rigidez resbala por tus brazos y cae a la tierra... Suelta y aligera."
  },
  {
    key: "week-4-min-2",
    text: "Minuto dos... Practiquemos el doble suspiro fisiológico para regular el sistema nervioso... Toma una inhalación profunda por la nariz... añade un segundo sorbo de aire corto arriba... y exhala todo por la boca con un suspiro de alivio... Ahhh... Repite una vez más... Inhala... un segundo aire... y suspira soltando todo... Siente el descanso en tu pecho."
  },
  {
    key: "week-4-min-3",
    text: "Minuto tres... Permanece inmóvil un instante notando el espacio nuevo en tus músculos... Inhala suave y profundo reconociendo esta ligereza... y exhala despacio permitiendo que tu sistema nervioso asiente esta calma biológica... Tu cuerpo sabe regularse."
  },

  // Semana 5
  {
    key: "week-5-min-1",
    text: "Minuto uno... Imagina una línea de luz suave y cálida que recorre tu columna desde el coxis hasta la coronilla... Inhala profundo sintiendo tu cuerpo erguido y digno... y exhala lento ablandando el rostro y los hombros... Firmeza serena por fuera... dulzura y espacio por dentro."
  },
  {
    key: "week-5-min-2",
    text: "Minuto dos... Lleva ambas manos sobre el centro de tu pecho... Inhala hondo sintiendo el calor y el latido de tu corazón bajo tus palmas... y exhala con gratitud hacia tu organismo por sostenerte incondicionalmente... Agradece a tu respiración que te cuida en cada segundo de tu vida."
  },
  {
    key: "week-5-min-3",
    text: "Minuto tres... Inhala muy profundo y guarda esta sensación de serenidad en tu memoria celular... Al exhalar largo, reconoce que este centro siempre vive contigo... Dondequiera que vayas, basta una respiración consciente para regresar a casa... Abre los ojos suavemente cuando estés listo."
  },

  // SOS
  {
    key: "sos-calma",
    text: "Estás a salvo... Apoya tus pies firmes en el suelo... Inhala suavemente por la nariz en cuatro segundos... uno... dos... tres... cuatro... sostén el aire un instante... y exhala muy largo por la boca en seis segundos... dejando caer los hombros y aflojando la mandíbula... Siente cómo tu ritmo cardíaco se tranquiliza con cada respiración."
  },
  {
    key: "sos-energia",
    text: "Siéntate erguido y abre el pecho... Inhala profundo y vigoroso por la nariz inflando el abdomen... y exhala con fuerza liberando todo el cansancio... Estira tu columna hacia el cielo... siente cómo el aire nuevo renueva cada fibra de tu cuerpo con energía y calma."
  }
];

// Generate track items strictly for Male Studio Voice (Fenrir)
// Prioritize SOS tracks first, then weeks 2-5
const AUDIO_ITEMS = [];

// SOS tracks first
const sosTracks = BASE_SCRIPTS.filter(s => s.key.startsWith("sos-"));
const weeklyTracks = BASE_SCRIPTS.filter(s => !s.key.startsWith("sos-"));

for (const s of [...sosTracks, ...weeklyTracks]) {
  AUDIO_ITEMS.push({
    fileName: `${s.key}.wav`,
    text: s.text,
    voiceName: "Fenrir",
    style: "Voz masculina profunda, barítono sereno, ritmo pausado y meditativo para relajación somática profunda."
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(item, maxRetries = 6) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: item.text,
                speechMetadata: {
                  style: item.style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: item.voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error(`No audio data returned for ${item.fileName}`);
      }

      return Buffer.from(base64Audio, "base64");
    } catch (err) {
      const is429 = err?.status === 429 || (err?.message && err.message.includes("429"));
      if (is429 && attempt < maxRetries) {
        console.warn(`[429 Rate limit] Waiting 25s before retry ${attempt}/${maxRetries} for ${item.fileName}...`);
        await sleep(25000);
      } else {
        throw err;
      }
    }
  }
  throw new Error(`Exceeded max retries for ${item.fileName}`);
}

async function generateAll() {
  console.log(`Starting audio generation for ${AUDIO_ITEMS.length} tracks (Male & Female)...`);

  for (let i = 0; i < AUDIO_ITEMS.length; i++) {
    const item = AUDIO_ITEMS[i];
    const targetFile = path.join(outputDir, item.fileName);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 10000) {
      console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Already exists: ${item.fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Generating ${item.voiceName}: ${item.fileName}...`);
    const buffer = await generateWithRetry(item);
    fs.writeFileSync(targetFile, buffer);
    console.log(`  -> Saved ${buffer.length} bytes to ${item.fileName}`);

    // Pacing to stay comfortably within rate limits
    await sleep(2000);
  }

  console.log("All audio tracks (male & female) generated successfully!");
}

generateAll().catch((err) => {
  console.error("Batch audio generation failed:", err);
  process.exit(1);
});
