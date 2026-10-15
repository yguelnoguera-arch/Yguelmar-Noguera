import { AmbientSoundId } from '../utils/sound';

export interface PracticeStep {
  minute: number;
  title: string;
  instruction: string;
  cue: string;
  displayText: string;
  spokenText: string;
}

export interface ProgramPractice {
  id: string;               // e.g. 'w1-p1'
  weekNumber: number;       // 1 to 5
  practiceOrder: number;    // 1 to 4
  title: string;
  subtitle: string;
  focus: string;
  durationMinutes: number;  // 3
  ambientSoundId: AmbientSoundId;
  hasMeasurement?: boolean;
  measurementLabel?: string;
  measurementMin?: number;
  measurementMax?: number;
  measurementPrompts?: {
    before: string;
    after: string;
  };
  steps: PracticeStep[];
}

export interface ProgramWeek {
  weekNumber: number;
  name: string;
  theme: string;
  subtitle: string;
  pillar: string;
  colorTone: string;
  practices: ProgramPractice[];
}

export const PROGRAM_WEEKS: ProgramWeek[] = [
  // =========================================================================
  // SEMANA 1: PRESENCIA
  // =========================================================================
  {
    weekNumber: 1,
    name: 'Semana 1: Presencia',
    theme: 'Presencia',
    subtitle: 'Aterriza tu atención en el cuerpo físico, habita el instante presente y libera la sobrecarga cervical',
    pillar: 'Etapa 1 · Presencia y Enraizamiento',
    colorTone: '#6B7A54',
    practices: [
      {
        id: 'w1-p1',
        weekNumber: 1,
        practiceOrder: 1,
        title: '1. Pausa de 3 (Inhala 4, Exhala 6)',
        subtitle: 'Desaceleración autónoma rápida con ratio parasimpático 4:6',
        focus: 'Ralentización del pulso cardíaco y entrega del peso a la gravedad',
        durationMinutes: 3,
        ambientSoundId: 'rain_forest',
        steps: [
          {
            minute: 1,
            title: 'Contacto y gravedad',
            instruction: 'Apoya ambos pies en el suelo o siente la base firme de tu asiento. Cierra suavemente los ojos y deja caer los hombros.',
            cue: 'Inhala notando tus raíces; exhala entregando el peso que no necesitas cargar.',
            displayText: 'Pies firmes en el suelo. Inhala en 4 tiempos y exhala suave en 6.',
            spokenText: 'Minuto uno... Apoya ambos pies en el suelo... deja que todo el peso de tu cuerpo caiga hacia la tierra... Inhala suave por la nariz contando mentalmente uno, dos, tres, cuatro... y exhala despacio por la boca en uno, dos, tres, cuatro, cinco, seis... Siente cómo el suelo te sostiene con firmeza.'
          },
          {
            minute: 2,
            title: 'Compás continuo',
            instruction: 'Mantén el flujo suave: 4 tiempos al entrar el aire fresco, 6 tiempos al salir el aire tibio.',
            cue: 'Alarga la salida del aire sin forzar los pulmones.',
            displayText: 'Inhala 4, exhala 6. Tu corazón acompasa este ritmo sereno.',
            spokenText: 'Minuto dos... Continuemos el compás... Inhala en cuatro tiempos inflando suavemente el vientre... y exhala en seis tiempos soltando cualquier prisa... Con cada respiración, tu sistema nervioso recibe la señal biológica de que estás a salvo.'
          },
          {
            minute: 3,
            title: 'Integración del silencio',
            instruction: 'Permanece en silencio percibiendo la quietud ganada al final de cada aliento.',
            cue: 'Estás habitando tu hogar corporal.',
            displayText: 'Descansa en la quietud. Todo tu eje corporal entra en reposo.',
            spokenText: 'Minuto tres... Despega la lengua del paladar... afloja la piel de la frente... Inhala profundo sintiendo la quietud en tu coronilla... y exhala largo descansando en tu propio centro... Estás presente aquí y ahora.'
          }
        ]
      },
      {
        id: 'w1-p2',
        weekNumber: 1,
        practiceOrder: 2,
        title: '2. Escaneo Corporal Somático',
        subtitle: 'Mapeo atencional sin juicio desde los pies hasta la coronilla',
        focus: 'Reconocimiento de puntos de agarre o rigidez muscular para devolverles espacio',
        durationMinutes: 3,
        ambientSoundId: 'gentle_rain',
        steps: [
          {
            minute: 1,
            title: 'De pies a pelvis',
            instruction: 'Recorre con tu foco desde las plantas de los pies y los tobillos, subiendo por rodillas hacia la pelvis y bajo vientre.',
            cue: 'Observa la temperatura y el contacto sin intentar cambiar nada.',
            displayText: 'Escaneo ascendente: plantas, tobillos, rodillas y pelvis. Suelta la faja abdominal.',
            spokenText: 'Minuto uno... Inicia el recorrido de presencia en las plantas de tus pies... sube despacio por las pantorrillas y las rodillas hacia la pelvis... Nota si hay tensión contenida... Inhala llevando aire cálido hacia esa zona... y exhala ablandando los tejidos.'
          },
          {
            minute: 2,
            title: 'Diafragma y pecho',
            instruction: 'Lleva la atención al esternón y a las costillas. Percibe la elevación y descenso natural de la respiración.',
            cue: 'Tu corazón late protegido en el centro del pecho.',
            displayText: 'Atención al pecho y al diafragma. Abre espacio entre tus costillas.',
            spokenText: 'Minuto dos... Sube lentamente hacia el abdomen y el pecho... Siente cómo tus costillas se abren al inhalar... y se desinflan suaves al exhalar... No fuerces nada, solo acompaña el balanceo natural de tu aliento.'
          },
          {
            minute: 3,
            title: 'Cuello, rostro y coronilla',
            instruction: 'Despega los dientes, alisa la frente y siente la totalidad del cuerpo como un santuario seguro.',
            cue: 'Has devuelto presencia a cada rincón de tu biología.',
            displayText: 'Suelta la mandíbula y entrecejo. Habita la totalidad de tu cuerpo en paz.',
            spokenText: 'Minuto tres... Lleva tu foco hacia el cuello, la mandíbula y el entrecejo... Separa los dientes superiores de los inferiores... Inhala serenidad... y exhala sintiendo la ligereza en todo tu rostro... Tu cuerpo está descansado y despierto.'
          }
        ]
      },
      {
        id: 'w1-p3',
        weekNumber: 1,
        practiceOrder: 3,
        title: '3. Termómetro Emocional (1–10) y Soltar el Cuello',
        subtitle: 'Medición de tensión antes y después con descompresión cervical activa',
        focus: 'Registro neurobiológico de la autorregulación somática en hombros y nuca',
        durationMinutes: 3,
        ambientSoundId: 'ocean_waves',
        hasMeasurement: true,
        measurementLabel: 'Nivel de Tensión en Cuello y Hombros',
        measurementMin: 1,
        measurementMax: 10,
        measurementPrompts: {
          before: '¿Cuál es tu nivel de rigidez o sobrecarga en cuello y hombros antes de empezar? (1: Relajado | 10: Tensión máxima)',
          after: '¿A qué nivel ha descendido la tensión en tu cuello y hombros ahora? (1: Relajado | 10: Tensión máxima)'
        },
        steps: [
          {
            minute: 1,
            title: 'Toma de consciencia cervical',
            instruction: 'Registra tu nivel en la escala. Lleva la oreja derecha hacia el hombro derecho muy despacio sin forzar.',
            cue: 'Siente el estiramiento dulce del trapecio izquierdo.',
            displayText: 'Inclina suavemente la cabeza a la derecha. Respira abriendo el lateral del cuello.',
            spokenText: 'Minuto uno... Registra tu nivel en el termómetro emocional... Ahora, inclina muy suavemente tu oreja derecha hacia tu hombro derecho... sin forzar... Inhala profundo sintiendo el espacio que se abre en el lateral de tu cuello... y exhala soltando el peso del hombro opuesto hacia la tierra.'
          },
          {
            minute: 2,
            title: 'Inclinación lateral izquierda',
            instruction: 'Vuelve al centro con lentitud e inclina la oreja izquierda hacia el hombro izquierdo.',
            cue: 'Imagina que el cansancio resbala por tus omóplatos.',
            displayText: 'Regresa al centro e inclina a la izquierda. Suelta la carga de tus hombros.',
            spokenText: 'Minuto dos... Regresa despacio al centro... y lleva ahora la oreja izquierda hacia el hombro izquierdo... Inhala calidez hacia la base de tu cráneo... y exhala dejando que la tensión acumulada resbale por tus brazos... Aligera tu espalda.'
          },
          {
            minute: 3,
            title: 'Rotación y medición final',
            instruction: 'Haz un medio círculo lento de barbilla al pecho. Quédate inmóvil y registra el cambio en el termómetro.',
            cue: 'Tu sistema nervioso puede autorregularse.',
            displayText: 'Barbilla al pecho en medio círculo sereno. Comprueba tu nivel final en el termómetro.',
            spokenText: 'Minuto tres... Dibuja un medio círculo muy lento con tu barbilla cerca del pecho... Siente el calor circulando por tu nuca... Inhala alivio... y exhala reconociendo la ligereza ganada... Comprueba ahora cómo ha descendido tu nivel de tensión.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SEMANA 2: REGULACIÓN
  // =========================================================================
  {
    weekNumber: 2,
    name: 'Semana 2: Regulación',
    theme: 'Regulación',
    subtitle: 'Domina los interruptores fisiológicos del freno vagal para modular la sobreexcitación simpática',
    pillar: 'Etapa 2 · Freno Vagal y Coherencia Fisiológica',
    colorTone: '#556341',
    practices: [
      {
        id: 'w2-p1',
        weekNumber: 2,
        practiceOrder: 1,
        title: '1. Respiración Vagal (4-2-6)',
        subtitle: 'El compás de activación del nervio vago ventral',
        focus: 'Inhalación en 4s, retención serena en 2s y exhalación extendida en 6s',
        durationMinutes: 3,
        ambientSoundId: 'frequency_396',
        steps: [
          {
            minute: 1,
            title: 'Inicia el pacer vagal',
            instruction: 'Sigue el ritmo: Inhala en 4 segundos, sostén suavemente 2 segundos y exhala muy lento en 6 segundos.',
            cue: 'La exhalación larga enciende la respuesta de relajación.',
            displayText: 'Inhala (4s) · Sostén (2s) · Exhala lento (6s).',
            spokenText: 'Minuto uno... Comencemos la respiración vagal... Inhala en uno, dos, tres, cuatro... sostén con suavidad dos segundos... y exhala lento por la boca en uno, dos, tres, cuatro, cinco, seis... Como soplando suavemente una pluma en el aire.'
          },
          {
            minute: 2,
            title: 'Sincronía diafragmática',
            instruction: 'Coloca una mano en el abdomen. Siente cómo se eleva en los 4 segundos y cómo se vacía despacio en los 6.',
            cue: 'Sincroniza tus latidos con el vaivén del aliento.',
            displayText: 'Una mano en el vientre. Deja que la exhalación de 6 segundos calme tu pulso.',
            spokenText: 'Minuto dos... Coloca una mano en tu abdomen... Inhala cuatro segundos expandiendo el vientre... retén dos segundos en quietud... y exhala seis segundos vaciando todo el aire... Tu ritmo cardíaco se acompasa con esta cadencia.'
          },
          {
            minute: 3,
            title: 'Quietud parasimpática',
            instruction: 'Disfruta de la ligereza corporal. El freno vagal está plenamente activo.',
            cue: 'Has desactivado la urgencia interna.',
            displayText: 'Descansa en el efecto del pacer. Tu cuerpo opera en tono de descanso y reparación.',
            spokenText: 'Minuto tres... Mantén el ritmo natural que te pide el cuerpo... Inhala paz... y exhala serenidad... Tu sistema biológico ha pasado al modo de descanso y reparación profunda.'
          }
        ]
      },
      {
        id: 'w2-p2',
        weekNumber: 2,
        practiceOrder: 2,
        title: '2. Suspiro Fisiológico (con medición 1–10)',
        subtitle: 'El reseteo agudo más potente: dos inhalaciones nasales y un suspiro bucal',
        focus: 'Reapertura alveolar y balance instantáneo de dióxido de carbono',
        durationMinutes: 3,
        ambientSoundId: 'frequency_396',
        hasMeasurement: true,
        measurementLabel: 'Nivel de Ansiedad o Agitación Mental',
        measurementMin: 1,
        measurementMax: 10,
        measurementPrompts: {
          before: '¿Cuál es tu nivel de agitación o estrés ahora antes de iniciar? (1: En calma | 10: Muy agitado)',
          after: '¿A qué nivel se encuentra tu agitación tras los suspiros fisiológicos? (1: En calma | 10: Muy agitado)'
        },
        steps: [
          {
            minute: 1,
            title: 'Primera ronda de 3 suspiros',
            instruction: 'Toma una inhalación profunda por la nariz, añade un segundo sorbo corto arriba y suspira por la boca: ¡Ahhh!',
            cue: 'Siente el colapso suave y seguro de tus hombros.',
            displayText: 'Doble inhalación nasal (profunda + sorbo) y suspiro audible por la boca.',
            spokenText: 'Minuto uno... Registra tu nivel en la escala... Practiquemos el doble suspiro fisiológico: inhala hondo por la nariz... toma un segundo sorbo de aire corto arriba... y suspira con sonido por la boca... ¡Ahhh!... Repite una vez más... Inhala... segundo aire... y suspira soltando todo el peso... Siente el alivio en tu pecho.'
          },
          {
            minute: 2,
            title: 'Asentamiento biológico',
            instruction: 'Permanece con los ojos cerrados notando cómo el corazón baja su velocidad de forma instantánea.',
            cue: 'Tus alvéolos pulmonares se han desinflado de golpe.',
            displayText: 'Nota la desaceleración del latido cardíaco y la amplitud en los pulmones.',
            spokenText: 'Minuto dos... Respira con suavidad y observa el cambio químico inmediato... El latido del corazón desciende... Inhala frescura... y exhala cualquier tensión residual.'
          },
          {
            minute: 3,
            title: 'Suspiro final y medición',
            instruction: 'Toma un último suspiro voluntario y registra tu nuevo nivel en el termómetro.',
            cue: 'Tu organismo sabe autorregularse en menos de un minuto.',
            displayText: 'Último suspiro de desahogo. Comprueba la caída de tu nivel de estrés en la escala.',
            spokenText: 'Minuto tres... Toma un último suspiro profundo a tu ritmo... Inhala... segundo aire... y suspira con deleite... Comprueba ahora cómo ha descendido tu nivel de agitación.'
          }
        ]
      },
      {
        id: 'w2-p3',
        weekNumber: 2,
        practiceOrder: 3,
        title: '3. Anclaje Sensorial 5-4-3-2-1',
        subtitle: 'Protocolo de reorientación somática para desconectar el secuestro de la amígdala',
        focus: '5 estímulos visuales, 4 táctiles, 3 auditivos, 2 olfativos y 1 gustativo',
        durationMinutes: 3,
        ambientSoundId: 'forest_breeze',
        steps: [
          {
            minute: 1,
            title: '5 cosas que ves & 4 que tocas',
            instruction: 'Mira a tu alrededor y nombra mentalmente 5 objetos. Luego toca 4 texturas cercanas (tu ropa, la mesa, tu piel, el suelo).',
            cue: 'Trae tu mente al entorno físico exacto donde estás.',
            displayText: 'Observa 5 cosas reales en tu entorno. Siente 4 texturas al tacto.',
            spokenText: 'Minuto uno... Orientemos tu sistema nervioso en el presente... Mira a tu alrededor y nombra mentalmente cinco cosas que puedas ver con claridad... Ahora toca cuatro texturas distintas: la tela de tu ropa, la madera, tus manos, el suelo... Estás aquí en este espacio real.'
          },
          {
            minute: 2,
            title: '3 sonidos que escuchas',
            instruction: 'Cierra los ojos y distingue 3 sonidos en el entorno (el audio ambiental, ruidos lejanos, tu respiración).',
            cue: 'Escuchar el espacio exterior activa la corteza prefrontal.',
            displayText: 'Identifica 3 sonidos: los más lejanos, los cercanos y el sonido de tu respiración.',
            spokenText: 'Minuto dos... Cierra suavemente los ojos e identifica tres sonidos distintos... el sonido ambiental de la app... sonidos del exterior... y el roce del aire entrando en tu nariz... Tu mente sale del túnel de la preocupación.'
          },
          {
            minute: 3,
            title: '2 olores & 1 sabor de presencia',
            instruction: 'Percibe el aroma del ambiente o de tu piel. Nota el sabor en tu boca y siente tus pies firmes.',
            cue: 'Todos tus sentidos confirman: no hay peligro real en este segundo.',
            displayText: 'Nota aromas y el sabor presente. Tus 5 sentidos te anclan a salvo en el presente.',
            spokenText: 'Minuto tres... Percibe el aroma del aire y el sabor en tu boca... Abre tus ojos con una mirada amplia... Tus cinco sentidos confirman a tu biología que este momento es seguro... Estás completamente anclado en tu centro.'
          }
        ]
      },
      {
        id: 'w2-p4',
        weekNumber: 2,
        practiceOrder: 4,
        title: '4. El Experimento de 90 Segundos (con medición antes y después)',
        subtitle: 'Surfea la ola neuroquímica de la emoción sin luchar contra ella',
        focus: 'La química de la emoción dura exactamente 90 segundos en el torrente sanguíneo',
        durationMinutes: 3,
        ambientSoundId: 'ocean_waves',
        hasMeasurement: true,
        measurementLabel: 'Intensidad de la Emoción o Incomodidad',
        measurementMin: 1,
        measurementMax: 10,
        measurementPrompts: {
          before: '¿Cuál es la intensidad de tu malestar o emoción en este momento? (1: Mínimo | 10: Máximo)',
          after: 'Pasados los 90 segundos, ¿cuál es la intensidad de la emoción ahora? (1: Mínimo | 10: Máximo)'
        },
        steps: [
          {
            minute: 1,
            title: 'Identificar y medir la emoción',
            instruction: 'Registra tu nivel en la escala. Ponle nombre a la emoción (ansiedad, frustración, tristeza) sin juzgarla.',
            cue: 'No la rechaces: dale permiso de estar presente durante 90 segundos.',
            displayText: 'Registra el nivel inicial. Nombra la sensación y prepárate para surfear la ola sin luchar.',
            spokenText: 'Minuto uno... Registra tu nivel en la escala... Identifica la sensación en el cuerpo... La neurociencia nos enseña que la química de una emoción solo dura 90 segundos en la sangre... Si no alimentas la historia mental, la ola sube, alcanza su cresta y rompe suavemente.'
          },
          {
            minute: 2,
            title: 'La ola de 90 segundos',
            instruction: 'Acompaña la sensación física como si fueras un testigo curioso. Siente la respiración fluyendo alrededor.',
            cue: 'La emoción es solo energía en movimiento.',
            displayText: 'Acompaña la sensación física. Respira hacia el nudo sin empujarlo. La química está cediendo.',
            spokenText: 'Minuto dos... Respira con tranquilidad hacia donde sientes la molestia... no intentes cambiarla, solo acompáñala... Siente cómo la ola comienza a descender... Tu cuerpo metaboliza la adrenalina de forma natural.'
          },
          {
            minute: 3,
            title: 'Medición de salida',
            instruction: 'La ola ha pasado. Registra de nuevo tu nivel en el termómetro y comprueba cómo ha cambiado.',
            cue: 'Has demostrado a tu cerebro que puedes tolerar la ola sin colapsar.',
            displayText: 'Comprueba el nuevo nivel en el termómetro. Tu sistema nervioso ha completado el ciclo.',
            spokenText: 'Minuto tres... Inhala muy hondo llenándote de calma... y exhala largo soltando el remanente de la ola... Comprueba ahora en el termómetro cómo tu organismo ha disuelto la emoción... Tienes la maestría para surfear cualquier ola.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SEMANA 3: COMPRENSIÓN (LA VOZ CRÍTICA)
  // =========================================================================
  {
    weekNumber: 3,
    name: 'Semana 3: Comprensión',
    theme: 'Comprensión (La Voz Crítica)',
    subtitle: 'Desactiva la autoflagelación mental, haz tapping de descarga y cultiva la voz del amigo compasivo',
    pillar: 'Etapa 3 · Desactivación de la Autocrítica y Compasión Somática',
    colorTone: '#7D5A44',
    practices: [
      {
        id: 'w3-p1',
        weekNumber: 3,
        practiceOrder: 1,
        title: '1. Observar el pensamiento desde afuera ("Estoy teniendo el pensamiento de...")',
        subtitle: 'Defusión cognitiva somática: pasar de ser el pensamiento a ser el testigo',
        focus: 'Crear una distancia biológica de seguridad entre tu consciencia y el parloteo crítico',
        durationMinutes: 3,
        ambientSoundId: 'forest_breeze',
        steps: [
          {
            minute: 1,
            title: 'Identificar el juicio automático',
            instruction: 'Nota qué pensamiento crítico recurrente ha estado rondando: "no soy capaz", "debería hacer más", "voy tarde".',
            cue: 'No luches con la frase: sólo nótala.',
            displayText: 'Reconoce la frase de la voz crítica sin creértela ciegamente.',
            spokenText: 'Minuto uno... Cierra suavemente los ojos... Observa qué frase suele repetir tu voz crítica... "No soy suficiente", "voy retrasado", "lo estoy haciendo mal"... Reconoce esa frase como un sonido que cruza tu mente, no como una verdad absoluta.'
          },
          {
            minute: 2,
            title: 'Aplicar el prefijo de defusión',
            instruction: 'Repite mentalmente anteponiendo: "Noto que estoy teniendo el pensamiento de que..." y siente el espacio ganado.',
            cue: 'Tú no eres el pensamiento; eres quien se da cuenta.',
            displayText: 'Dite internamente: "Noto que estoy teniendo el pensamiento de que...". Observa la distancia.',
            spokenText: 'Minuto dos... Ahora, reformula esa frase anteponiendo con calma: "Me doy cuenta de que estoy teniendo el pensamiento de que..."... Siente cómo se abre un espacio de respiración entre tú y las palabras... El pensamiento está en la mente, pero tú eres el cielo que lo observa.'
          },
          {
            minute: 3,
            title: 'Descanso en el testigo sereno',
            instruction: 'Permanece en silencio. Los pensamientos pasan como nubes; tu centro permanece intocado.',
            cue: 'La voz crítica es un mecanismo de defensa antiguo, no tu identidad.',
            displayText: 'Descansa en el espacio libre de juicios. Tu paz interior es más grande que cualquier idea.',
            spokenText: 'Minuto tres... Inhala reconociendo tu libertad interior... y exhala despidiendo la exigencia... No tienes que obedecer a esa voz... puedes elegir tratarte con gentileza.'
          }
        ]
      },
      {
        id: 'w3-p2',
        weekNumber: 3,
        practiceOrder: 2,
        title: '2. Guía de Tapping de descarga sobre la voz crítica (con medición 0–10)',
        subtitle: 'Estimulación de puntos acupunturales para desarmar la carga de la autoexigencia',
        focus: 'Golpecitos suaves en punto kárate, ceja, sienes, bajo ojo, clavícula y coronilla',
        durationMinutes: 3,
        ambientSoundId: 'rain_forest',
        hasMeasurement: true,
        measurementLabel: 'Carga de Autoexigencia o Culpa',
        measurementMin: 0,
        measurementMax: 10,
        measurementPrompts: {
          before: '¿Cuál es el peso de tu voz crítica o autoexigencia ahora? (0: Ninguna | 10: Máxima exigencia)',
          after: '¿A qué nivel ha descendido la carga tras la ronda de tapping? (0: Ninguna | 10: Máxima exigencia)'
        },
        steps: [
          {
            minute: 1,
            title: 'Punto kárate y frase de aceptación',
            instruction: 'Golpetea con dos dedos el lateral de tu mano (punto kárate). Di: "Aunque me exijo demasiado, acepto mi cuerpo y me doy permiso de aflojar".',
            cue: 'La vibración táctil envía señales de seguridad a la amígdala.',
            displayText: 'Tapping en el lateral de la mano. Dite: "Aunque siento autoexigencia, me acepto en este momento".',
            spokenText: 'Minuto uno... Registra tu nivel en la escala de 0 a 10... Con las yemas de tus dedos, da golpecitos suaves en el lateral de tu otra mano, en el punto kárate... Y dite con dulzura: "Aunque siento esta voz crítica, me acepto plenamente y elijo soltar la presión".'
          },
          {
            minute: 2,
            title: 'Ronda facial y clavícula',
            instruction: 'Golpecitos en: inicio de la ceja, lateral del ojo, bajo la nariz, bajo el labio y bajo la clavícula.',
            cue: 'Suelta con un suspiro en cada punto.',
            displayText: 'Tapping suave: ceja, sien, bajo la nariz y clavículas. Libera la coraza.',
            spokenText: 'Minuto dos... Ahora golpetea suavemente en el inicio de tus cejas... respira hondo... luego en las sienes... bajo la nariz... y en las clavículas... En cada punto, suelta un suspiro de alivio... Deja que el cuerpo descargue la necesidad de ser perfecto.'
          },
          {
            minute: 3,
            title: 'Coronilla, manos al pecho y medición',
            instruction: 'Tapping en la coronilla, luego apoya ambas manos sobre el pecho. Respira hondo y registra el resultado.',
            cue: 'La vibración somática resetea los patrones de rumiación.',
            displayText: 'Tapping en la coronilla. Manos al pecho. Comprueba la caída de la carga en la escala.',
            spokenText: 'Minuto tres... Termina con unos toques en la coronilla... Y ahora detén el movimiento y apoya tus dos palmas abiertas sobre el pecho... Inhala muy hondo sintiendo el calor... y exhala largo... Registra tu nuevo nivel en el termómetro.'
          }
        ]
      },
      {
        id: 'w3-p3',
        weekNumber: 3,
        practiceOrder: 3,
        title: '3. La Voz del Amigo (Compasión Somática)',
        subtitle: 'Activa el tono vagal ventral mediante palabras afectuosas y contacto cálido',
        focus: 'Transformar el crítico interno en un aliado incondicional para momentos difíciles',
        durationMinutes: 3,
        ambientSoundId: 'frequency_432',
        steps: [
          {
            minute: 1,
            title: 'Gesto de ternura somática',
            instruction: 'Coloca una mano sobre tu corazón y la otra sobre tu mejilla o abdomen. Siente la calidez táctil de tu propia piel.',
            cue: 'Tu propio contacto libera oxitocina endógena.',
            displayText: 'Mano al corazón y mano a la mejilla o vientre. Conecta con el calor de tu piel.',
            spokenText: 'Minuto uno... Lleva una mano sobre tu corazón y la otra con dulzura a tu mejilla o tu vientre... Cierra los ojos y siente el calor reconfortante de tus palmas... Respira hacia ese contacto... Tu cuerpo reconoce tu presencia afectuosa.'
          },
          {
            minute: 2,
            title: '¿Qué le dirías a tu mejor amigo?',
            instruction: 'Si la persona que más amas estuviera pasando por tu momento, ¿qué palabras le dirías? Ofrécetelas a ti mismo.',
            cue: '"Sé que estás cansado, pero lo estás haciendo bien. Estoy aquí contigo".',
            displayText: 'Háblate con la misma devoción y paciencia que le darías a tu mejor amigo.',
            spokenText: 'Minuto dos... Imagina qué le dirías a tu mejor amigo si estuviera pasando por esto... Dite a ti mismo en voz baja: "Sé que ha sido difícil... te veo esforzarte... y estoy aquí contigo, pase lo que pase"... Deja que esas palabras penetren en tus células.'
          },
          {
            minute: 3,
            title: 'Anclaje de la compasión',
            instruction: 'Quédate en el abrazo somático. Siente cómo tu organismo se siente amado, cuidado y a salvo.',
            cue: 'Eres tu propio santuario de paz.',
            displayText: 'Descansa en el abrazo somático. Tu corazón late en un espacio de bondad incondicional.',
            spokenText: 'Minuto tres... Permanece unos segundos en este abrazo... Inhala gratitud... y exhala confianza... Guarda esta voz amiga en tu corazón... La compasión es tu mayor escudo.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SEMANA 4: DIRECCIÓN
  // =========================================================================
  {
    weekNumber: 4,
    name: 'Semana 4: Dirección',
    theme: 'Dirección',
    subtitle: 'Clarifica tu brújula interior, alinea tus decisiones con tus valores y domina el Punto de Elección',
    pillar: 'Etapa 4 · Claridad y Dirección Consciente',
    colorTone: '#4E5A36',
    practices: [
      {
        id: 'w4-p1',
        weekNumber: 4,
        practiceOrder: 1,
        title: '1. Pausa de Claridad: ¿Desde dónde decido?',
        subtitle: 'Distingue si tus acciones nacen del miedo reactivo o de tu centro consciente',
        focus: 'Discernimiento somático visceral: contracción (miedo) vs. expansión (propósito)',
        durationMinutes: 3,
        ambientSoundId: 'forest_breeze',
        steps: [
          {
            minute: 1,
            title: 'Conectar con la decisión pendiente',
            instruction: 'Piensa en un dilema, conversación o tarea que tengas que resolver hoy. Siéntate erguido.',
            cue: 'No busques la respuesta lógica todavía: solo percibe tu cuerpo.',
            displayText: 'Trae a tu mente la decisión o tarea pendiente. Nota qué siente tu estómago y tu pecho.',
            spokenText: 'Minuto uno... Siéntate erguido y piensa en una decisión o situación que tengas que afrontar... Inhala profundo... y observa qué sucede en tu cuerpo... ¿Sientes tensión y apuro en el estómago... o una amplitud serena en el pecho?'
          },
          {
            minute: 2,
            title: '¿Miedo o valores?',
            instruction: 'Pregúntate: "¿Esta respuesta nace del miedo a equivocarme, o nace de lo que verdaderamente me importa?".',
            cue: 'El miedo contrae y apresura; el centro expande y pacifica.',
            displayText: 'Pregúntate con honestidad: ¿Estoy actuando por evitar el conflicto o por avanzar en lo que valoro?',
            spokenText: 'Minuto dos... Hazte esta pregunta clave: "¿Desde dónde estoy decidiendo esto?... ¿Desde el miedo a quedar mal o fallar... o desde mis valores más profundos?"... Inhala abriendo espacio... y exhala soltando la necesidad de complacer.'
          },
          {
            minute: 3,
            title: 'La respuesta desde el centro',
            instruction: 'Permite que la decisión más sabia emerja desde la calma, no desde la urgencia.',
            cue: 'Tus mejores decisiones se toman con el sistema nervioso regulado.',
            displayText: 'Elige dar el siguiente paso desde la firmeza tranquila de tu centro.',
            spokenText: 'Minuto tres... Inhala llenándote de claridad y dirección... y exhala sintiendo la certeza en tu eje... Cuando estás en tu centro, sabes exactamente qué paso dar.'
          }
        ]
      },
      {
        id: 'w4-p2',
        weekNumber: 4,
        practiceOrder: 2,
        title: '2. Conexión con mis 3 Valores y El Gap (0–10)',
        subtitle: 'Medición de congruencia entre lo que valoras y cómo estás viviendo hoy',
        focus: 'Identificar tus 3 valores cardinales (ej: Paz, Autenticidad, Salud) y cerrar la brecha',
        durationMinutes: 3,
        ambientSoundId: 'frequency_432',
        hasMeasurement: true,
        measurementLabel: 'Nivel de Congruencia con mis Valores (El Gap)',
        measurementMin: 0,
        measurementMax: 10,
        measurementPrompts: {
          before: '¿Qué tan alineado sientes tu día a día con tus valores más importantes? (0: Desconectado | 10: Plenamente alineado)',
          after: 'Tras clarificar tu foco, ¿cuál es tu nivel de compromiso para honrarlos hoy? (0: Sin claridad | 10: Total claridad)'
        },
        steps: [
          {
            minute: 1,
            title: 'Nombrar tus 3 valores',
            instruction: 'Registra tu nivel en la escala. Elige 3 palabras faro para esta etapa de tu vida: Paz, Familia, Salud, Creatividad, Coraje.',
            cue: 'Tus valores son tu brújula, no una lista de tareas.',
            displayText: 'Elige tus 3 valores clave. Nómbralos internamente sintiendo su eco en el pecho.',
            spokenText: 'Minuto uno... Registra tu nivel en la escala de congruencia... Ahora nombra internamente tus tres valores esenciales en esta etapa de tu vida... Quizás la paz interior... la salud... la presencia con los tuyos... Inhala sintiendo cómo resuenan en tu pecho.'
          },
          {
            minute: 2,
            title: 'Identificar "El Gap" (La brecha)',
            instruction: 'Observa dónde te has alejado de ellos por el torbellino de la rutina. Sin culpas: solo como observador.',
            cue: 'Reconocer la brecha es el primer paso para cerrarla.',
            displayText: 'Observa la brecha sin juzgarte: ¿En qué micro-acción diaria puedes honrar ese valor hoy?',
            spokenText: 'Minuto dos... Observa con bondad dónde se ha producido la brecha en estos días... Quizás dijiste que sí a cosas que te robaron la calma... Inhala perdón y espacio... y exhala la culpa... Cada instante es una oportunidad para recalibrar.'
          },
          {
            minute: 3,
            title: 'Un micro-paso de alineación y medición',
            instruction: 'Elige una sola micro-acción para hoy que honre ese valor. Registra tu nuevo nivel de claridad.',
            cue: 'Un paso pequeño y real vale más que un plan gigantesco nunca ejecutado.',
            displayText: 'Define un micro-paso para hoy. Comprueba tu claridad final en el termómetro.',
            spokenText: 'Minuto tres... Elige una micro-acción para hoy... Una sola decisión sencilla que honre tu paz o tu salud... Inhala compromiso sereno... y exhala con determinación... Registra tu nivel de alineación.'
          }
        ]
      },
      {
        id: 'w4-p3',
        weekNumber: 4,
        practiceOrder: 3,
        title: '3. El Punto de Elección (Choice Point)',
        subtitle: 'La bifurcación consciente ante cualquier detonante o situación difícil',
        focus: 'Movimientos hacia tus valores (Towards) vs. Movimientos que te alejan (Away)',
        durationMinutes: 3,
        ambientSoundId: 'ocean_waves',
        steps: [
          {
            minute: 1,
            title: 'Visualizar la bifurcación',
            instruction: 'Imagina que ante cada problema estás frente a una Y en el camino: a la izquierda, la reacción automática; a la derecha, tu respuesta consciente.',
            cue: 'Entre el estímulo y tu respuesta hay un espacio: en ese espacio reside tu libertad.',
            displayText: 'Imagina el Punto de Elección: ¿Hacia dónde te mueve tu próxima conducta?',
            spokenText: 'Minuto uno... Cierra suavemente los ojos e imagina que estás ante una bifurcación en el camino... Cuando aparece un problema o frustración, tienes dos caminos: reaccionar en automático gritando o encerrándote... o respirar y elegir cómo quieres responder.'
          },
          {
            minute: 2,
            title: 'Reconocer los "ganchos" de alejamiento',
            instruction: 'Nota los impulsos que te alejan de tu bienestar: comer por ansiedad, contestar con aspereza, posponer lo importante.',
            cue: 'Nombra el anzuelo: "ahí está el impulso de pelear/huir".',
            displayText: 'Reconoce el anzuelo automático. Desengánchate con una respiración consciente.',
            spokenText: 'Minuto dos... Reconoce el anzuelo que suele atraparte... la impaciencia, la reactividad... Inhala hondo diciendo mentalmente: "Suelto el anzuelo"... y exhala sintiendo tus pies en la tierra... Eres libre de no morder el cebo.'
          },
          {
            minute: 3,
            title: 'Elegir el movimiento hacia tus valores',
            instruction: 'Elige deliberadamente el camino de la derecha: firmeza, respeto y presencia.',
            cue: 'Has conquistado la maestría de responder en lugar de reaccionar.',
            displayText: 'Elige conscientemente la respuesta que te acerque a la persona que deseas ser.',
            spokenText: 'Minuto tres... Inhala llenándote de soberanía... y exhala eligiendo actuar con dignidad y sosiego... Tú decides tu conducta... Estás en tu propio Punto de Elección.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SEMANA 5: INTEGRACIÓN
  // =========================================================================
  {
    weekNumber: 5,
    name: 'Semana 5: Integración',
    theme: 'Integración',
    subtitle: 'Consolida tu protocolo de retorno permanente, tu sistema de 3 partes y conecta con tu Yo del Futuro',
    pillar: 'Etapa 5 · Maestría Somática y Centro Permanente',
    colorTone: '#3F4832',
    practices: [
      {
        id: 'w5-p1',
        weekNumber: 5,
        practiceOrder: 1,
        title: '1. Protocolo de Retorno (Notar, Parar, Volver)',
        subtitle: 'La secuencia somática de 3 pasos para volver a tu centro en menos de 60 segundos',
        focus: '1. Notar (Darse cuenta) · 2. Parar (Soltar el control) · 3. Volver (Respirar y anclar)',
        durationMinutes: 3,
        ambientSoundId: 'frequency_432',
        steps: [
          {
            minute: 1,
            title: 'Paso 1: Notar (Darse cuenta)',
            instruction: 'Entrena la alarma somática: en el momento en que sientas el cuello rígido o la respiración superficial, di internamente: "Noto la prisa".',
            cue: 'El primer paso de la libertad es darse cuenta.',
            displayText: 'Paso 1: NOTAR. Reconoce de inmediato cuando tu cuerpo se ha tensado o acelerado.',
            spokenText: 'Minuto uno... Practiquemos el Protocolo de Retorno... El primer paso es NOTAR... En cuanto sientas que la mente corre o el cuerpo se aprieta, nómbralo sin reproche: "Noto que me estoy acelerando"... Ese simple acto devuelve el control a tu corteza cerebral.'
          },
          {
            minute: 2,
            title: 'Paso 2: Parar (Micro-pausa fisiológica)',
            instruction: 'Detén el movimiento de tus manos. Despega los pies del acelerador. Toma un suspiro fisiológico.',
            cue: 'Un segundo de pausa interrumpe el bucle de adrenalina.',
            displayText: 'Paso 2: PARAR. Detén el movimiento físico durante 5 segundos y suspira.',
            spokenText: 'Minuto dos... El segundo paso es PARAR... Detén tus dedos, afloja tus hombros... Inhala por la nariz y suelta un suspiro de alivio... Deja de remar contra la corriente por unos segundos... Nada es tan urgente.'
          },
          {
            minute: 3,
            title: 'Paso 3: Volver (Habitar el centro)',
            instruction: 'Coloca tu mano en el pecho, siente tus pies en la tierra y retoma tu actividad con ritmo sereno.',
            cue: 'Has regresado a casa. Ya estás en tu centro.',
            displayText: 'Paso 3: VOLVER. Mano al pecho, pies en el suelo y regreso consciente a tu día.',
            spokenText: 'Minuto tres... El tercer paso es VOLVER... Siente tus pies firmes, tu mano en el pecho... y reanuda lo que estabas haciendo con una cadencia tranquila... Has vuelto a tu centro... Este protocolo siempre está contigo.'
          }
        ]
      },
      {
        id: 'w5-p2',
        weekNumber: 5,
        practiceOrder: 2,
        title: '2. Mi Sistema Personal de 3 Partes',
        subtitle: 'Estructuración de tus tres anclas somáticas para la vida cotidiana',
        focus: 'Tu disparador corporal (gatillo), tu respiración ancla y tu frase somática de poder',
        durationMinutes: 3,
        ambientSoundId: 'rain_forest',
        steps: [
          {
            minute: 1,
            title: 'Parte 1: Mi anclaje táctil (Gatillo)',
            instruction: 'Junta suavemente la yema de tu pulgar con el índice o apoya tu mano en el esternón. Guarda este contacto.',
            cue: 'Tu cerebro asocia este gesto físico con calma biológica inmediata.',
            displayText: 'Parte 1: Elige tu anclaje táctil (pulgar e índice o mano al pecho). Sella la sensación.',
            spokenText: 'Minuto uno... Vamos a consolidar tu sistema personal de tres partes... La primera parte es tu anclaje táctil: junta suavemente la yema de tu pulgar y tu índice... Siente esa presión sutil... Inhala hondo sellando en tus nervios que este gesto significa seguridad y quietud.'
          },
          {
            minute: 2,
            title: 'Parte 2: Mi respiración ancla',
            instruction: 'Elige tu favorita entre las practicadas: ¿Pausa de 3 (4-6), Vagal (4-2-6) o Doble Suspiro?',
            cue: 'Esta es tu herramienta de rescate preferida.',
            displayText: 'Parte 2: Activa tu respiración ancla favorita. Respira a tu ritmo predilecto.',
            spokenText: 'Minuto dos... La segunda parte es tu respiración ancla favorita... Ya sea el compás de exhalación larga en seis segundos, o el suspiro fisiológico... Respírala ahora con placer... Esta es tu medicina de bolsillo permanente.'
          },
          {
            minute: 3,
            title: 'Parte 3: Mi frase de poder somático',
            instruction: 'Elige tu mantra somático: "Estoy a salvo en mi cuerpo", "Puedo con esto paso a paso", "Vuelvo a mi centro".',
            cue: 'Repite tu frase y respira en plenitud.',
            displayText: 'Parte 3: Afirma tu frase somática de poder. Tu sistema de 3 partes está consolidado.',
            spokenText: 'Minuto tres... La tercera parte es tu frase de poder somático... Elige una frase corta: "Estoy en mi centro... todo está bien en este instante"... Dila internamente con absoluta convicción... Tu sistema personal de tres partes está listo para acompañarte siempre.'
          }
        ]
      },
      {
        id: 'w5-p3',
        weekNumber: 5,
        practiceOrder: 3,
        title: '3. Visualización: Conexión con el Yo del Futuro',
        subtitle: 'Encuentro con tu versión sabia, sosegada y regulada dentro de un año',
        focus: 'Consolidación de la identidad somática serena y cierre del programa de 5 semanas',
        durationMinutes: 3,
        ambientSoundId: 'frequency_432',
        steps: [
          {
            minute: 1,
            title: 'Visualizar a tu Yo del Futuro',
            instruction: 'Imagina que caminas hacia un jardín o mirador de calma y ves a tu versión de dentro de un año: erguida, luminosa, en paz.',
            cue: 'Esa persona ya atravesó las dificultades que hoy te preocupan.',
            displayText: 'Visualiza a tu Yo del Futuro dentro de un año: sereno, regulado, seguro de sí mismo.',
            spokenText: 'Minuto uno... Cierra suavemente los ojos e imagina un lugar luminoso y en paz... A lo lejos ves a tu versión de dentro de un año... Mírala con atención: su postura es erguida y descansada, sus ojos brillan con serenidad... Esa persona ha superado todo lo que hoy te inquieta.'
          },
          {
            minute: 2,
            title: 'El consejo y la transmisión de calma',
            instruction: 'Acércate a ella. Escucha qué consejo de una sola frase te transmite. Siente su mano en tu hombro.',
            cue: '"No te preocupes tanto: aprende a confiar en tu centro".',
            displayText: 'Escucha el mensaje de tu Yo del Futuro y recibe su serenidad ganada.',
            spokenText: 'Minuto dos... Acércate y siente su presencia tranquila... Pon atención a sus palabras... Te dice con una sonrisa cálida: "Confía en tu cuerpo... no tienes que correr... lo estás haciendo muy bien"... Siente cómo esa paz futura se transfiere a tu pecho ahora mismo.'
          },
          {
            minute: 3,
            title: 'Graduación e integración definitiva',
            instruction: 'Agradece el camino de estas 5 semanas. Abre los ojos suavemente con la certeza de haber transformado tu biología.',
            cue: '¡Felicidades por culminar el programa de 5 semanas! Eres el guardián de tu propio centro.',
            displayText: '¡Programa de 5 Semanas completado! Tu santuario interior vive en ti para siempre.',
            spokenText: 'Minuto tres... Inhala muy profundo celebrando tu dedicación y tu valentía a lo largo de estas cinco semanas... Al exhalar largo, reconoce que esa versión sabia ya vive dentro de ti... Gracias por cuidar de tu cuerpo, de tu mente y de tu vida... Estás en tu centro.'
          }
        ]
      }
    ]
  }
];
