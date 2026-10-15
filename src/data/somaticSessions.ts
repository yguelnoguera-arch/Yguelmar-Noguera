import { AmbientSoundId } from '../utils/sound';

export interface SomaticSessionStep {
  minute: number;
  title: string;
  instruction: string;
  cue: string;
  displayText: string;
  spokenText: string;
}

export interface SomaticSession {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  ambientSoundId: AmbientSoundId;
  ambientLabel: string;
  ambientFrequencyBadge: string;
  description: string;
  somaticFocus: string;
  durationMinutes: number;
  colorGradient: string;
  accentColor: string;
  steps: SomaticSessionStep[];
}

export const SOMATIC_SESSIONS: SomaticSession[] = [
  // 1. 🌙 Desconexión Nocturna & Sueño (Ambiente: Frecuencia 432 Hz / Lluvia)
  {
    id: 'nocturna',
    emoji: '🌙',
    title: 'Desconexión Nocturna & Sueño',
    subtitle: 'Apaga el parloteo mental y prepara tu organismo para el descanso reparador',
    ambientSoundId: 'frequency_432', // Drone 432 Hz y cuenco relajante (o gentle_rain)
    ambientLabel: 'Frecuencia 432 Hz / Lluvia suave',
    ambientFrequencyBadge: '432 Hz · Sueño',
    description: 'Suelta el control del día, relaja los globos oculares, desactiva la mandíbula y entrega el peso de tus extremidades a la cama.',
    somaticFocus: 'Soltar la mandíbula, pesadez en párpados y desconexión vagal para el sueño',
    durationMinutes: 3,
    colorGradient: 'from-[#2B303A] to-[#1E232B]',
    accentColor: '#8C9EB5',
    steps: [
      {
        minute: 1,
        title: 'Soltar la jornada',
        instruction: 'Acuéstate o reclínate cómodamente. Cierra los ojos y entrega todo el peso de tu cabeza a la almohada.',
        cue: 'El día ya terminó. No hay nada más que hacer, corregir ni responder.',
        displayText: 'El día ha concluido. Entrega la cabeza y la espalda al lecho sin retener nada.',
        spokenText: 'Minuto uno... Prepárate para el descanso... Acuéstate o reclínate con total comodidad... Cierra suavemente los ojos... El día ha terminado... Inhala profundo por la nariz... y al exhalar largo, entrega todo el peso de tu cabeza y tu espalda a la cama... No hay nada que resolver esta noche... estás a salvo.'
      },
      {
        minute: 2,
        title: 'Desactivar rostro y mandíbula',
        instruction: 'Despega la lengua del paladar, entreabre ligeramente los labios y deja caer los globos oculares hacia el fondo de las cuencas.',
        cue: 'La pesadez cálida recorre tus brazos y piernas.',
        displayText: 'Despega la lengua, afloja la mandíbula y siente cómo tus brazos y piernas pesan plácidamente.',
        spokenText: 'Minuto dos... Despega la lengua del paladar... afloja la mandíbula... y siente cómo tus párpados se vuelven pesados, tibios y suaves... Inhala aire fresco... y exhala dejando que una ola de calor placentero baje por tus brazos, tu vientre y tus piernas... Todo tu cuerpo se sumerge en el descanso.'
      },
      {
        minute: 3,
        title: 'Entrada al sueño profundo',
        instruction: 'Respira a un compás lentísimo. Deja que los sonidos de la lluvia y la frecuencia 432 Hz te arrullen.',
        cue: 'Descansa en paz. Tu cuerpo se regenera mientras duermes.',
        displayText: 'Entrégate al sueño reparador. Tu sistema nervioso se regenera en la quietud de la noche.',
        spokenText: 'Minuto tres... Siente la frecuencia serena que te envuelve... Deja que la respiración se vuelva tan suave que casi no se escuche... Inhala descanso... y exhala hacia la noche... Ríndete al sueño profundo y reparador... Buenas noches.'
      }
    ]
  },

  // 2. 🛑 Pausa de Emergencia & Alivio de Ansiedad (Ambiente: Frecuencia 396 Hz / Respiración de anclaje)
  {
    id: 'emergencia',
    emoji: '🛑',
    title: 'Pausa de Emergencia & Alivio de Ansiedad',
    subtitle: 'Apagado agudo de la amígdala ante crisis, taquicardia o sobrecarga súbita',
    ambientSoundId: 'frequency_396',
    ambientLabel: 'Frecuencia 396 Hz / Respiración de anclaje',
    ambientFrequencyBadge: '396 Hz · SOS',
    description: 'Ancla tus pies con fuerza en la tierra, coloca tus manos firmes en el pecho y alarga la exhalación para desactivar la alarma simpática.',
    somaticFocus: 'Contacto firme con el suelo, presión afectiva en esternón y exhalación en compás vagal 4-6',
    durationMinutes: 3,
    colorGradient: 'from-[#54332D] to-[#3B221E]',
    accentColor: '#D97762',
    steps: [
      {
        minute: 1,
        title: 'Aterrizaje forzoso en la tierra',
        instruction: 'Planta ambos pies descalzos o apoyados con firmeza. Mira 3 objetos fijos a tu alrededor para orientarte en el espacio.',
        cue: 'Estás aquí. Este cuerpo está a salvo en esta habitación en este segundo.',
        displayText: 'Pies firmes en la tierra. Mira 3 objetos a tu alrededor. Estás aquí y estás a salvo.',
        spokenText: 'Minuto uno... Haz una pausa total... Apoya tus pies con fuerza en el suelo... Mira tres objetos que te rodeen para orientarte en este espacio físico... Inhala por la nariz... y exhala largo soltando el aire por la boca... Recuerda: estás a salvo... esta sensación pasará.'
      },
      {
        minute: 2,
        title: 'Mano firme en el esternón',
        instruction: 'Presiona tu palma derecha con calor sobre el centro de tu pecho. Inhala en 4 y exhala en 6 como si apagaras una pequeña llama.',
        cue: 'El corazón responde inmediatamente a la presión táctil y a la exhalación prolongada.',
        displayText: 'Mano firme en el pecho. Inhala en 4 tiempos y exhala muy despacio en 6.',
        spokenText: 'Minuto dos... Coloca tu mano con firmeza en el centro del pecho... siente la calidez de tu palma... Comencemos la respiración de anclaje: inhala en uno... dos... tres... cuatro... y exhala lento en uno... dos... tres... cuatro... cinco... seis... Tu corazón desacelera su ritmo... la calma biológica regresa a ti.'
      },
      {
        minute: 3,
        title: 'Soberanía recuperada',
        instruction: 'Percibe cómo la ola de adrenalina comienza a drenar hacia la tierra. Los 90 segundos químicos de la emoción han cedido.',
        cue: 'Tu sistema nervioso autónomo tiene la capacidad infinita de regularse.',
        displayText: 'La alarma biológica ha bajado. Tu sistema nervioso retoma el control sereno.',
        spokenText: 'Minuto tres... Inhala llenándote de estabilidad y espacio... y exhala despidiendo el miedo residual... La alarma se ha apagado... Puedes continuar tu día con paso firme... estás en tu centro.'
      }
    ]
  },

  // 3. ☀️ Claridad y Presencia Matutina (Ambiente: Brisa suave)
  {
    id: 'matutina',
    emoji: '☀️',
    title: 'Claridad y Presencia Matutina',
    subtitle: 'Despierta tu sistema nervioso con lucidez equilibrada y foco sereno para empezar el día',
    ambientSoundId: 'forest_breeze',
    ambientLabel: 'Brisa suave de bosque',
    ambientFrequencyBadge: 'Eólica · Claridad',
    description: 'Apertura torácica, alineación de columna y respiración rítmica para comenzar el día sin cafeína reactiva ni prisa mental.',
    somaticFocus: 'Apertura intercostal, estiramiento axial y activación suave del tono vagal matutino',
    durationMinutes: 3,
    colorGradient: 'from-[#4D5638] to-[#394228]',
    accentColor: '#95A86D',
    steps: [
      {
        minute: 1,
        title: 'Desperezarse con consciencia',
        instruction: 'Siéntate erguido en el borde de tu cama o asiento. Inhala elevando ambos brazos al cielo y estira suavemente los costados.',
        cue: 'Dile buenos días a tu cuerpo con gentileza.',
        displayText: 'Siéntate erguido, estira tus brazos al cielo e inhala la frescura de la mañana.',
        spokenText: 'Minuto uno... Comienza este nuevo día habitando tu cuerpo... Siéntate erguido y digno... Inhala profundo elevando tus brazos suavemente hacia arriba... estirando tus costados... y al exhalar, baja los brazos con lentitud sintiendo el aire fresco llenar tu cuerpo... Buenos días.'
      },
      {
        minute: 2,
        title: 'Respiración de vitalidad limpia',
        instruction: 'Inhala por la nariz sintiendo la frescura del oxígeno matinal. Exhala largo asentando una intención clara para el día.',
        cue: 'Claridad sin agitación; energía sin ansiedad.',
        displayText: 'Inhala vitalidad límpida. Elige la calma y el enfoque con los que deseas caminar hoy.',
        spokenText: 'Minuto dos... Lleva tus manos sobre las rodillas con las palmas hacia arriba... Inhala hondo recibiendo la energía limpia de esta mañana... y exhala soltando cualquier residuo de sueño o pesadez... Establece tu intención: hoy camino con presencia y calma.'
      },
      {
        minute: 3,
        title: 'Apertura al mundo',
        instruction: 'Dibuja una sonrisa serena en el rostro. Abre los ojos suavemente con la mirada panorámica lista para actuar con maestría.',
        cue: 'Estás despierto, centrado y capaz.',
        displayText: 'Abre los ojos con mirada amplia. Tu centro viaja contigo en cada paso de hoy.',
        spokenText: 'Minuto tres... Inhala muy profundo llenándote de gratitud por esta nueva oportunidad... y exhala largo, listo para emprender tu jornada desde la solidez de tu centro... Abre tus ojos con una mirada abierta y serena.'
      }
    ]
  },

  // 4. 🌿 Alivio de Tensión y Descarga Física (Ambiente: Olas de mar / Soltar hombros y mandíbula)
  {
    id: 'descarga',
    emoji: '🌿',
    title: 'Alivio de Tensión y Descarga Física',
    subtitle: 'Disuelve la coraza muscular acumulada por estrés crónico, posturas fijas y pantallas',
    ambientSoundId: 'ocean_waves',
    ambientLabel: 'Olas de mar / Soltar hombros y mandíbula',
    ambientFrequencyBadge: 'Marea · Descompresión',
    description: 'Micro-sacudida, círculos lentos de hombros, desbloqueo de cervicales y soltura fascial al compás rítmico del mar.',
    somaticFocus: 'Rotación escapular, alivio de trapecios, aflojar maseteros y soltar el diafragma',
    durationMinutes: 3,
    colorGradient: 'from-[#3A4B40] to-[#27352D]',
    accentColor: '#7AA48A',
    steps: [
      {
        minute: 1,
        title: 'Sacudida suave de extremidades',
        instruction: 'Suelta las manos y sacúdelas como si quisieras quitarte gotas de agua. Deja caer los hombros pesados.',
        cue: 'Los mamíferos se sacuden para descargar el exceso de adrenalina.',
        displayText: 'Sacude suavemente manos y muñecas. Deja que el cansancio resbale por tus dedos.',
        spokenText: 'Minuto uno... Vamos a liberar la carga física acumulada... Sacude con suavidad tus manos, muñecas y brazos... como si te sacudieras gotas de agua... Deja colgar tus hombros pesados... Inhala profundo... y al exhalar, deja que toda la fatiga resbale hacia la tierra.'
      },
      {
        minute: 2,
        title: 'El compás de las olas en los hombros',
        instruction: 'Con cada ola del mar de fondo, eleva los hombros suavemente y al romper la ola, suéltalos de golpe con un suspiro.',
        cue: 'Entrega la armadura muscular.',
        displayText: 'Sincroniza tus hombros con el oleaje. Al romper la ola, suelta todo el peso con un suspiro.',
        spokenText: 'Minuto dos... Escucha el vaivén del océano... Inhala suavemente elevando tus hombros hacia atrás... y al escuchar romper la ola, déjalos caer de golpe suspirando por la boca... Ahhh... Repite una vez más... Siente el alivio en tus cervicales.'
      },
      {
        minute: 3,
        title: 'Espacio biológico ganado',
        instruction: 'Permanece quieto percibiendo el hormigueo cálido y la ligereza en cuello, trapecios y espalda baja.',
        cue: 'Tus células han recordado lo que significa estar libres de presión.',
        displayText: 'Disfruta de la ligereza en tu cuello y espalda. Has recuperado espacio vital.',
        spokenText: 'Minuto tres... Permanece inmóvil notando la calidez que ahora circula libremente por tu espalda... Inhala reconociendo este alivio... y exhala despacio permitiendo que tu sistema nervioso asiente esta descompresión... Tu cuerpo está libre y ligero.'
      }
    ]
  },

  // 5. 🤍 Vuelve a tu Centro & Amabilidad (Ambiente: Cuenco tibetano / Contacto mano al pecho)
  {
    id: 'amabilidad',
    emoji: '🤍',
    title: 'Vuelve a tu Centro & Amabilidad',
    subtitle: 'Reconecta con tu espacio interno de acogida incondicional y auto-compasión somática',
    ambientSoundId: 'frequency_432',
    ambientLabel: 'Cuenco tibetano / Contacto mano al pecho',
    ambientFrequencyBadge: '432 Hz · Compasión',
    description: 'Contacto táctil compasivo en el pecho, sincronización de latidos y palabras amables para sanar el cansancio del alma.',
    somaticFocus: 'Activación del sistema de apego seguro mamífero mediante presión táctil cálida y tono vagal ventral',
    durationMinutes: 3,
    colorGradient: 'from-[#4B3F4E] to-[#342B36]',
    accentColor: '#B696BA',
    steps: [
      {
        minute: 1,
        title: 'Llegada al templo del pecho',
        instruction: 'Coloca una mano sobre tu corazón y la otra sobre tu vientre. Cierra los ojos y siente la calidez viva bajo tus palmas.',
        cue: 'Estás en casa. No hay lugar más seguro que tu propio centro.',
        displayText: 'Una mano en el pecho, otra en el vientre. Reconecta con el calor de tu propio santuario.',
        spokenText: 'Minuto uno... Vuelve a tu centro... Coloca una mano con ternura sobre tu pecho y la otra en tu vientre... Cierra los ojos... Inhala sintiendo el calor reconfortante de tus palmas... y exhala permitiendo que tu cuerpo se rinda a este abrazo... Ya estás en casa.'
      },
      {
        minute: 2,
        title: 'Amabilidad celular',
        instruction: 'Observa tus sensaciones sin criticarte por sentirte cansado o vulnerable. Dite con amor: "Gracias por esforzarte tanto hoy".',
        cue: 'La amabilidad es la vibración más curativa para el cerebro.',
        displayText: 'Háblate con infinita amabilidad: "Gracias por sostenerme. Te reconozco y te cuido".',
        spokenText: 'Minuto dos... Respira con dulzura hacia el centro de tu pecho... Reconoce todo lo que tu organismo hace por ti cada segundo sin pedir nada a cambio... Inhala agradecimiento profundo... y exhala soltando cualquier exigencia o culpa... Eres suficiente tal y como estás aquí.'
      },
      {
        minute: 3,
        title: 'El santuario que permanece',
        instruction: 'Siente la vibración del cuenco tibetano resonando en tus huesos. Guarda esta sensación de plenitud.',
        cue: 'Llevas tu centro contigo dondequiera que vayas.',
        displayText: 'Guarda esta compasión en tu memoria somática. Tu centro siempre está a una respiración de distancia.',
        spokenText: 'Minuto tres... Deja que el sonido del cuenco vibre en tu interior... Inhala paz infinita... y exhala amor hacia todo tu ser... Recuerda que este espacio de paz siempre vive dentro de ti... Abre los ojos suavemente cuando estés listo.'
      }
    ]
  },

  // 6. ✨ Autosugestión Positiva: Calma, Seguridad y Confianza
  {
    id: 'autosugestion_confianza',
    emoji: '✨',
    title: 'Autosugestión Positiva: Calma, Seguridad y Confianza',
    subtitle: 'Reprogramación del diálogo interno en ondas Alfa con afirmaciones en primera persona',
    ambientSoundId: 'frequency_432',
    ambientLabel: 'Frecuencia 432 Hz / Ondas Alfa',
    ambientFrequencyBadge: 'Alfa · Confianza',
    description: 'Guía pausada en primera persona para reprogramar el diálogo interno y empezar el día o resetear la mente en serenidad inquebrantable.',
    somaticFocus: 'Reprogramación neuro-somática, anclaje en el presente y sensación visceral de autoeficacia serena',
    durationMinutes: 3,
    colorGradient: 'from-[#3E4F42] to-[#2B382F]',
    accentColor: '#8DB895',
    steps: [
      {
        minute: 1,
        title: 'Anclaje en el cuerpo y apertura Alfa',
        instruction: 'Apoya tus manos sobre las piernas o el pecho. Respira hondo y permite que estas palabras sean tu verdad biológica ahora.',
        cue: '"Mi cuerpo sabe cómo volver a la calma."',
        displayText: '"Mi cuerpo sabe cómo volver a la calma. Estoy seguro y enraizado aquí y ahora."',
        spokenText: 'Minuto uno... Cierra suavemente los ojos y deja que tu respiración se vuelva lenta y profunda... Recibe estas afirmaciones en primera persona... Mi cuerpo sabe cómo volver a la calma... En este instante exacto estoy a salvo... Suelto la necesidad de anticipar... Habito mi centro con serenidad.'
      },
      {
        minute: 2,
        title: 'Seguridad y solidez visceral',
        instruction: 'Siente la firmeza de tu columna vertebral y la apertura de tu pecho al respirar cada afirmación.',
        cue: '"Confío en mi capacidad de responder con serenidad."',
        displayText: '"Confío en mi capacidad de responder con serenidad. Soy más grande que cualquier dificultad."',
        spokenText: 'Minuto dos... Inhala profundo llenando tu pecho de aire limpio... y repite internamente conmigo... Confío en mi capacidad de responder con sosiego ante los desafíos... Tengo los recursos que necesito... Mi mente es clara, mi aliento es firme y mi corazón está en paz.'
      },
      {
        minute: 3,
        title: 'Integración celular de la confianza',
        instruction: 'Guarda esta certeza en tus músculos, tu rostro y tus manos. Camina desde tu centro.',
        cue: '"Elijo la calma como mi estado natural."',
        displayText: '"Elijo la calma como mi estado natural. Nada me arrebata mi paz interior."',
        spokenText: 'Minuto tres... Siente cómo estas afirmaciones echan raíces en cada célula de tu cuerpo... Elijo la calma como mi estado natural... Nada de afuera me arrebata mi paz interior... Inhala plenitud... y exhala con una sonrisa de confianza... Estás listo.'
      }
    ]
  },

  // 7. 🌱 Autosugestión Nocturna: Soltar el Control y Renovación
  {
    id: 'autosugestion_nocturna',
    emoji: '🌱',
    title: 'Autosugestión Nocturna: Soltar el Control y Renovación',
    subtitle: 'Afirmaciones somáticas suaves para liberar la autoexigencia antes de dormir',
    ambientSoundId: 'gentle_rain',
    ambientLabel: 'Lluvia suave continua & frecuencias nocturnas',
    ambientFrequencyBadge: 'Nocturna · Soltar',
    description: 'Afirmaciones somáticas en primera persona para entregar las responsabilidades del día, apagar la vigilia y permitir la reparación profunda.',
    somaticFocus: 'Descarga de la hipervigilancia, capitulación dulce del control y entrega al sueño regenerador',
    durationMinutes: 3,
    colorGradient: 'from-[#2B2E3D] to-[#1C1F2B]',
    accentColor: '#959EC7',
    steps: [
      {
        minute: 1,
        title: 'Capitulación del control',
        instruction: 'Acuéstate en tu cama. Suelta los brazos y repite internamente cada afirmación dejándola caer en el silencio.',
        cue: '"Suelto lo que hoy no pude controlar."',
        displayText: '"Suelto lo que hoy no pude controlar. Hice lo que pude y hoy ha sido suficiente."',
        spokenText: 'Minuto uno... Entrega todo el peso de tu cuerpo al colchón... Respira muy suave y recibe estas afirmaciones nocturnas... Suelto lo que hoy no pude controlar... Hice lo que estaba a mi alcance y hoy ha sido suficiente... Cierro el libro del día de hoy.'
      },
      {
        minute: 2,
        title: 'Permiso de descanso absoluto',
        instruction: 'Siente tus párpados pesados y tibios. Permite que la autoexigencia se disuelva en la almohada.',
        cue: '"Mi mente descansa y mi sistema nervioso se repara profundamente."',
        displayText: '"Mi mente descansa y mi sistema nervioso se repara profundamente."',
        spokenText: 'Minuto dos... Afloja la mandíbula y deja que tus ojos caigan pesados... Mi mente descansa ahora... Mi cuerpo es sabio y se regenera mientras duermo... No tengo nada que defender ni demostrar... Me doy permiso de descansar en paz.'
      },
      {
        minute: 3,
        title: 'Entrega a la noche y renovación',
        instruction: 'Deja que la respiración se vuelva casi imperceptible mientras te rindes al sueño reparador.',
        cue: '"Mañana despertaré renovado; esta noche descanso en calma."',
        displayText: '"Mañana despertaré renovado con energía limpia. Esta noche descanso en calma."',
        spokenText: 'Minuto tres... Inhala el silencio de la noche... y exhala rindiéndote al sueño reparador... Mañana será un nuevo comienzo... Esta noche descanso protegido en mi centro... Dulces sueños.'
      }
    ]
  }
];
