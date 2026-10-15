import { AmbientSoundId } from '../utils/sound';

export interface ProgramStep {
  minute: number;
  title: string;
  instruction: string;
  cue: string;
  displayText: string;
  spokenText: string;
}

export interface ProgramDay {
  id: string;              // e.g. 'day-1'
  dayNumber: number;       // 1 to 14
  weekNumber: number;      // 1 or 2
  dayInWeek: number;       // 1 to 7
  title: string;
  subtitle: string;
  focus: string;
  pillar: string;
  durationMinutes: number; // 3
  ambientSoundId: AmbientSoundId;
  steps: ProgramStep[];
}

export const PROGRAM_DAYS: ProgramDay[] = [
  // =========================================================================
  // SEMANA 1: ENRAIZAMIENTO & REGULACIÓN BÁSICA (Días 1 a 7)
  // =========================================================================
  {
    id: 'day-1',
    dayNumber: 1,
    weekNumber: 1,
    dayInWeek: 1,
    title: 'Día 1: Contacto y Gravedad',
    subtitle: 'Aterriza tu atención en los pies y entrega el peso a la tierra',
    focus: 'Sentir el soporte de la superficie y aflojar la tensión de base',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'rain_forest',
    steps: [
      {
        minute: 1,
        title: 'Contacto con el suelo',
        instruction: 'Apoya ambos pies descalzos o con calzado firme. Siente la textura del piso y deja que la gravedad haga todo el trabajo.',
        cue: 'Inhala notando la firmeza; exhala entregando el peso que no necesitas sostener.',
        displayText: 'Apoya ambos pies en el suelo. Siente la firmeza del asiento y deja caer el peso de tu cuerpo.',
        spokenText: 'Minuto uno... Apoya ambos pies en el suelo, o siente con claridad la base de tu asiento... Deja que el peso de tu cuerpo caiga hacia la tierra... Inhala profundo por la nariz... y al exhalar, suelta el peso de tus hombros y tu mandíbula... Siente cómo el suelo te sostiene aquí y ahora... Respira suave y profundo a tu propio ritmo.'
      },
      {
        minute: 2,
        title: 'Sensación de peso',
        instruction: 'Nota los puntos de apoyo de tus muslos y tu pelvis. Permite que cada músculo reconozca que no hay peligro.',
        cue: 'No empujes el suelo: solo descansa en él.',
        displayText: 'Reconoce la solidez bajo tu cuerpo. Cada exhalación profundiza tu enraizamiento.',
        spokenText: 'Minuto dos... Ahora, lleva tu foco lentamente hacia la pelvis y los muslos... Nota cómo tu cuerpo descansa plenamente apoyado... Inhala abriendo espacio en tu vientre... y exhala dejando que la tensión residual resbale hacia el suelo... Tu cuerpo está seguro aquí.'
      },
      {
        minute: 3,
        title: 'Quietud segura',
        instruction: 'Permanece en silencio percibiendo la estabilidad ganada. Tu organismo reconoce la seguridad física.',
        cue: 'Estás sostenido. No tienes que hacer ningún esfuerzo.',
        displayText: 'Descansa en la quietud. Guarda en tu memoria corporal la certeza de estar a salvo.',
        spokenText: 'Minuto tres... Despega la lengua del paladar... afloja la piel de la frente... Inhala profundo sintiendo la quietud en tu coronilla... y exhala largo, permitiendo que todo tu cuerpo entre en un estado de descanso seguro... Estás habitando tu centro.'
      }
    ]
  },
  {
    id: 'day-2',
    dayNumber: 2,
    weekNumber: 1,
    dayInWeek: 2,
    title: 'Día 2: Escaneo Somático Ascendente',
    subtitle: 'Recorre tu anatomía reconociendo zonas de rigidez sin intentar cambiarlas',
    focus: 'Mapeo somático de tobillos, pelvis, diafragma y hombros',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'rain_forest',
    steps: [
      {
        minute: 1,
        title: 'De pies a rodillas',
        instruction: 'Lleva tu atención al contacto de tus plantas con el calzado. Sube lentamente por pantorrillas y rodillas.',
        cue: 'Observa la temperatura y el hormigueo sutil.',
        displayText: 'Observa la temperatura en tus pies y rodillas sin emitir juicios.',
        spokenText: 'Minuto uno... Inicia el recorrido en tus pies y pantorrillas... Nota la temperatura y el contacto con la tela o el aire... Inhala suave abriendo espacio... y exhala aflojando las rodillas y las piernas.'
      },
      {
        minute: 2,
        title: 'Pelvis y abdomen',
        instruction: 'Percibe si hay rigidez en el bajo vientre o en las caderas. Permite que el vientre se infle libremente.',
        cue: 'Suelta la faja muscular abdominal.',
        displayText: 'Afloja el abdomen bajo. Deja que tu vientre respire con total naturalidad.',
        spokenText: 'Minuto dos... Lleva tu atención hacia la pelvis y el abdomen... Desactiva cualquier necesidad de apretar el vientre... Inhala hondo sintiendo cómo se expande suavemente... y exhala liberando cualquier nudo interno.'
      },
      {
        minute: 3,
        title: 'Pecho y clavículas',
        instruction: 'Observa el ascenso y descenso suave de tus costillas al compás del aliento.',
        cue: 'Tu corazón late protegido en el centro del pecho.',
        displayText: 'Siente el balanceo natural de tus costillas. Reconoce la amplitud ganada.',
        spokenText: 'Minuto tres... Lleva la atención al centro del pecho... Inhala notando la apertura suave de tus costillas... y exhala soltando la pesadez en el esternón... Todo tu eje corporal se armoniza.'
      }
    ]
  },
  {
    id: 'day-3',
    dayNumber: 3,
    weekNumber: 1,
    dayInWeek: 3,
    title: 'Día 3: Liberación de Mandíbula y Rostro',
    subtitle: 'Desbloquea los músculos maseteros y la coraza ocular',
    focus: 'Despegar lengua del paladar, abrir entrecejo y aflojar dientes',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'gentle_rain',
    steps: [
      {
        minute: 1,
        title: 'Espacio entre los dientes',
        instruction: 'Entreabre ligeramente los labios. Separa los molares superiores de los inferiores por un milímetro.',
        cue: 'La mandíbula es el guardián del estrés: dale permiso de descansar.',
        displayText: 'Separa los dientes superiores de los inferiores. Suelta la mordida.',
        spokenText: 'Minuto uno... Entreabre ligeramente tus labios... Despega la lengua del paladar y separa tus dientes... Inhala suave por la nariz... y exhala sintiendo cómo la mandíbula cuelga relajada y ligera.'
      },
      {
        minute: 2,
        title: 'Suavizar entrecejo y sienes',
        instruction: 'Imagina una caricia tibia que alisa la piel de tu frente y tus sienes.',
        cue: 'Deja caer los párpados sin apretarlos.',
        displayText: 'Alisa la piel de la frente. Deja descansar los globos oculares.',
        spokenText: 'Minuto dos... Lleva tu atención al entrecejo y a los ojos... Imagina que una brisa tibia alisa tu frente... Inhala frescura... y exhala dejando que tus ojos descansen profundamente hacia adentro.'
      },
      {
        minute: 3,
        title: 'Micro-sonrisa interior',
        instruction: 'Dibuja una micro-expresión de alivio en las comisuras de los labios. Nota cómo tu nervio vago recibe la señal de seguridad.',
        cue: 'Tu rostro es el espejo de tu sistema nervioso autónomo.',
        displayText: 'Una suave sonrisa interna envía un mensaje biológico de paz a todo tu cuerpo.',
        spokenText: 'Minuto tres... Esboza una suave sonrisa interior en la comisura de tus labios... Inhala profundo asimilando esta dulzura... y exhala largo sintiendo cómo todo tu rostro descansa en completa armonía.'
      }
    ]
  },
  {
    id: 'day-4',
    dayNumber: 4,
    weekNumber: 1,
    dayInWeek: 4,
    title: 'Día 4: Respiración Diafragmática 4-4',
    subtitle: 'Activa la coherencia cardíaca con inhalación y exhalación equilibradas',
    focus: 'Compás de 4 segundos que sincroniza el ritmo cardíaco con las ondas cerebrales',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'forest_breeze',
    steps: [
      {
        minute: 1,
        title: 'Colocación de manos',
        instruction: 'Una mano en el centro del pecho y la otra en el ombligo. Percibe cuál mano se eleva primero.',
        cue: 'Permite que la mano del vientre tome el liderazgo.',
        displayText: 'Una mano en el pecho, otra en el ombligo. Percibe el vaivén natural.',
        spokenText: 'Minuto uno... Coloca con dulzura una mano en tu pecho y otra en tu abdomen... Inhala suave por la nariz sintiendo la frescura del aire al entrar... y exhala despacio percibiendo el aire tibio al salir... Respira a tu propio compás.'
      },
      {
        minute: 2,
        title: 'Compás 4 en 4',
        instruction: 'Inhala en 1, 2, 3, 4 inflando el vientre. Exhala en 1, 2, 3, 4 desinflando suavemente.',
        cue: 'Un compás suave como las olas mansas.',
        displayText: 'Inhala en 4 tiempos; exhala en 4 tiempos con total fluidez.',
        spokenText: 'Minuto dos... Comencemos el compás diafragmático... Inhala en uno... dos... tres... cuatro... expandiendo el vientre... y exhala suave en uno... dos... tres... cuatro... liberando el aire... Inhala calma... y exhala prisa.'
      },
      {
        minute: 3,
        title: 'Sincronía orgánica',
        instruction: 'Deja que el cuerpo continúe este ritmo sin contarlo ya numéricamente.',
        cue: 'Tu corazón acompasa esta danza biológica.',
        displayText: 'Deja que el ritmo fluya por sí mismo. Siente la estabilidad de tus latidos.',
        spokenText: 'Minuto tres... Mantén este compás suave sin esfuerzo... Inhala llenándote de aire limpio... y exhala sintiendo la calma que se expande hacia cada célula de tu cuerpo... Estás en coherencia.'
      }
    ]
  },
  {
    id: 'day-5',
    dayNumber: 5,
    weekNumber: 1,
    dayInWeek: 5,
    title: 'Día 5: Exhalación Lenta y Vacío Sereno',
    subtitle: 'Alarga la fase de salida del aire para encender el freno parasimpático',
    focus: 'Ralentización del pulso cardíaco y pausa de quietud al final del aliento',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'ocean_waves',
    steps: [
      {
        minute: 1,
        title: 'Inhalar 3, exhalar 6',
        instruction: 'Toma aire en 3 segundos y suéltalo muy lentamente por la boca en 6 segundos con un soplido suave.',
        cue: 'El alargue de la exhalación activa el nervio vago ventral.',
        displayText: 'Inhala en 3 tiempos; exhala muy lento en 6 tiempos como soplando una vela sin apagarla.',
        spokenText: 'Minuto uno... Inhala suave en uno, dos, tres... y exhala muy despacio por la boca en uno, dos, tres, cuatro, cinco, seis... Como si soplaras suavemente una vela sin querer apagar su llama... Siente cómo tus hombros caen.'
      },
      {
        minute: 2,
        title: 'Notar el micro-vacío',
        instruction: 'Al terminar de exhalar, percibe la fracción de segundo de quietud absoluta antes de que el cuerpo pida aire de nuevo.',
        cue: 'En ese vacío reside el descanso más puro.',
        displayText: 'Observa la pequeña pausa natural de silencio al final de cada exhalación.',
        spokenText: 'Minuto dos... Continúa exhalando largo... y nota esa pequeña pausa de silencio absoluto al final de soltar el aire... En ese vacío breve habita tu descanso... El cuerpo se repara en la quietud.'
      },
      {
        minute: 3,
        title: 'Descanso en el lecho',
        instruction: 'Permite que la respiración vuelva a su ritmo espontáneo, ahora más lenta y reposada.',
        cue: 'Tu sistema biológico ha bajado un peldaño en su nivel de alerta.',
        displayText: 'Disfruta de la ligereza ganada. Tu ritmo interno está en calma profunda.',
        spokenText: 'Minuto tres... Deja que el aire entre y salga solo... Inhala paz... y exhala cualquier tensión residual... Tu sistema nervioso asienta esta serenidad biológica.'
      }
    ]
  },
  {
    id: 'day-6',
    dayNumber: 6,
    weekNumber: 1,
    dayInWeek: 6,
    title: 'Día 6: Suspiro Fisiológico de Descompresión',
    subtitle: 'Dos inhalaciones nasales y un suspiro bucal para colapsar los alvéolos sobre-inflados',
    focus: 'El mecanismo neurobiológico más rápido descubierto por la ciencia para resetear el estrés agudo',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'frequency_396',
    steps: [
      {
        minute: 1,
        title: 'Primeras 3 rondas guiadas',
        instruction: 'Inhala hondo por la nariz, añade un segundo sorbo corto arriba y suspira por la boca con sonido audible: Ahhh.',
        cue: 'Siente el colapso inmediato de la tensión en el pecho.',
        displayText: 'Inhalación nasal profunda + segundo sorbo de aire + exhalación sonora por la boca.',
        spokenText: 'Minuto uno... Practiquemos el doble suspiro fisiológico... Inhala profundo por la nariz... añade un segundo sorbo corto de aire arriba... y exhala todo por la boca con un suspiro audible... Ahhh... Repite una vez más... Inhala... segundo sorbo... y suspira soltando todo... Siente el alivio en tu pecho.'
      },
      {
        minute: 2,
        title: 'Asentar la química corporal',
        instruction: 'Permanece con los ojos cerrados percibiendo cómo el dióxido de carbono se reequilibra en tu torrente sanguíneo.',
        cue: 'Tu frecuencia cardíaca desciende automáticamente.',
        displayText: 'Nota cómo el pulso se ralentiza y el pecho recupera su espacio blando.',
        spokenText: 'Minuto dos... Respira con suavidad y nota el cambio químico en tu pecho... El latido de tu corazón se apacigua... Inhala calma... y exhala entregando cualquier rigidez.'
      },
      {
        minute: 3,
        title: 'Suspiro de integración',
        instruction: 'Realiza un último suspiro voluntario y quédate en la sensación de desahogo y ligereza.',
        cue: 'Tienes la llave biológica para reiniciar tu calma en cualquier momento.',
        displayText: 'Un último suspiro de gratitud. Has liberado la sobrecarga acumulada.',
        spokenText: 'Minuto tres... Toma un último suspiro profundo a tu ritmo... Inhala... segundo aire... y suelta todo con deleite... Guarda esta herramienta en tu memoria somática... Tu cuerpo sabe regresar al centro.'
      }
    ]
  },
  {
    id: 'day-7',
    dayNumber: 7,
    weekNumber: 1,
    dayInWeek: 7,
    title: 'Día 7: Integración y Santuario del Cuerpo',
    subtitle: 'Reúne las prácticas de la semana y reconoce tu cuerpo como un refugio seguro',
    focus: 'Consolidación del Pilar 1 y celebración del primer ciclo completado',
    pillar: 'Semana 1 · Enraizamiento Somático',
    durationMinutes: 3,
    ambientSoundId: 'frequency_432',
    steps: [
      {
        minute: 1,
        title: 'Reconocimiento de la totalidad',
        instruction: 'Siente tu cuerpo desde los pies hasta la cabeza en una sola mirada atenta y amorosa.',
        cue: 'Has cuidado de tu organismo durante 7 días consecutivos.',
        displayText: 'Habita tu cuerpo como un hogar. Siente la base, el centro y la coronilla integrados.',
        spokenText: 'Minuto uno... Cierra suavemente los ojos y contempla tu cuerpo completo como un territorio seguro... Has completado los primeros siete días de práctica... Inhala reconociendo tu perseverancia... y exhala regalándote este instante de paz.'
      },
      {
        minute: 2,
        title: 'Contacto en el corazón',
        instruction: 'Lleva tus manos al centro del pecho y agradece a tu organismo por sostenerte día tras día.',
        cue: 'Gracias a este cuerpo que siente, respira y me acompaña.',
        displayText: 'Manos al pecho. Conecta con el latido sereno de tu corazón.',
        spokenText: 'Minuto dos... Coloca tus palmas sobre el corazón... Siente su latido fiel y constante... Inhala calidez hacia tus manos... y exhala con gratitud hacia tu biología por cuidarte siempre.'
      },
      {
        minute: 3,
        title: 'Puerta abierta a la Semana 2',
        instruction: 'Respira hondo con la certeza de haber desbloqueado una mayor capacidad de autorregulación somática.',
        cue: 'La Semana 2 profundizará en tu soberanía somática.',
        displayText: '¡Semana 1 completada! Has afianzado tus cimientos somáticos.',
        spokenText: 'Minuto tres... Inhala muy hondo llenándote de vitalidad clara... y exhala largo asentando esta victoria somática... Tu base está firme... Estás listo para profundizar en la Semana dos.'
      }
    ]
  },

  // =========================================================================
  // SEMANA 2: PROFUNDIZACIÓN SOMÁTICA & SOBERANÍA (Días 8 a 14)
  // =========================================================================
  {
    id: 'day-8',
    dayNumber: 8,
    weekNumber: 2,
    dayInWeek: 1,
    title: 'Día 8: Eje Vertical y Postura Soberana',
    subtitle: 'Alinea la columna vertebral desde el sacro hasta la coronilla con dignidad y soltura',
    focus: 'Firmeza por fuera, gentileza y espacio blando por dentro',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'forest_breeze',
    steps: [
      {
        minute: 1,
        title: 'Alineación del eje',
        instruction: 'Imagina una plomada de luz que cuelga desde tu coronilla hasta tu coxis. Crece un centímetro hacia arriba.',
        cue: 'Sin rigidez militar: una postura erguida, noble y descansada.',
        displayText: 'Columna erguida y ligera. Conecta la tierra con el cielo a través de tu eje.',
        spokenText: 'Minuto uno... Imagina una línea de luz suave y cálida que recorre tu columna desde el coxis hasta la coronilla... Inhala profundo sintiendo tu cuerpo erguido y digno... y exhala lento ablandando el rostro y los hombros... Firmeza serena por fuera... dulzura por dentro.'
      },
      {
        minute: 2,
        title: 'Apertura intercostal',
        instruction: 'Inhala expandiendo las costillas laterales como un acordeón. Exhala manteniendo la altura de la columna.',
        cue: 'Crea espacio entre tus vértebras.',
        displayText: 'Expande las costillas hacia los costados. Gana espacio vital para tus pulmones.',
        spokenText: 'Minuto dos... Inhala expandiendo tus costillas hacia los lados... como un acordeón que se abre con gentileza... y exhala dejando caer los hombros sin perder la altura de tu columna... Respira con dignidad.'
      },
      {
        minute: 3,
        title: 'Presencia soberana',
        instruction: 'Descansa en tu postura. Ocupa tu espacio en el mundo sin pedir disculpas ni encogerte.',
        cue: 'Tu postura le dice a tu mente que estás al mando de tu vida.',
        displayText: 'Habita tu soberanía somática. Firmeza y sosiego en tu propio centro.',
        spokenText: 'Minuto tres... Permanece en esta postura erguida y serena... Inhala llenando tu pecho de seguridad... y exhala sintiendo la fuerza tranquila de tu centro... Tu sistema nervioso está despierto y en paz.'
      }
    ]
  },
  {
    id: 'day-9',
    dayNumber: 9,
    weekNumber: 2,
    dayInWeek: 2,
    title: 'Día 9: Liberación de Coraza Escapular',
    subtitle: 'Disuelve la carga dorsal acumulada en omóplatos, trapecios y cuello',
    focus: 'Micro-rotaciones lentas y soltar las cargas que no te corresponden',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'ocean_waves',
    steps: [
      {
        minute: 1,
        title: 'Círculos lentos de hombros',
        instruction: 'Eleva los hombros suavemente hacia las orejas, llévalos hacia atrás abriendo el pecho y déjalos caer pesados.',
        cue: 'Repite 3 veces al ritmo del aliento.',
        displayText: 'Eleva hombros suavemente, rota hacia atrás y deja caer todo el peso hacia el suelo.',
        spokenText: 'Minuto uno... Haz un giro muy lento y suave con tus hombros hacia atrás... Deja colgar tus brazos pesados a los lados... Inhala profundo llevando aire hacia tus omóplatos... y al exhalar, imagina que cualquier carga resbala por tus brazos y cae a la tierra.'
      },
      {
        minute: 2,
        title: 'El peso que no es tuyo',
        instruction: 'Pregúntate: "¿Qué responsabilidad o prisa ajena estoy cargando sobre mis espaldas?".',
        cue: 'Exhala entregándolo simbólicamente.',
        displayText: 'Suelta las cargas ajenas. Tus hombros no tienen que cargar el mundo.',
        spokenText: 'Minuto dos... Con cada exhalación, permite que tus trapecios se ablanden... Inhala espacio fresco... y exhala despidiéndote de las exigencias que no son tuyas... Aligera tu espalda.'
      },
      {
        minute: 3,
        title: 'Espacio en las clavículas',
        instruction: 'Nota cómo el cuello se alarga y los brazos cuelgan con total soltura como cuerdas húmedas.',
        cue: 'Tus músculos dorsales respiran aliviados.',
        displayText: 'Siente la amplitud en tu cuello y clavículas. Tus brazos cuelgan livianos.',
        spokenText: 'Minuto tres... Permanece inmóvil notando el espacio nuevo en tu espalda... Inhala suave reconociendo esta ligereza... y exhala despacio permitiendo que tu sistema nervioso asiente esta descompresión.'
      }
    ]
  },
  {
    id: 'day-10',
    dayNumber: 10,
    weekNumber: 2,
    dayInWeek: 3,
    title: 'Día 10: Vaciado Mental y Nubes Pasajeras',
    subtitle: 'Observa el tráfico de pensamientos sin subirte a ningún vehículo mental',
    focus: 'Desaceleración cognitiva y desidentificación con el diálogo interno',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'forest_breeze',
    steps: [
      {
        minute: 1,
        title: 'El firmamento despejado',
        instruction: 'Imagina que tu mente es el cielo azul. Cada pensamiento o pendiente es solo una nube que cruza el campo visual.',
        cue: 'Tú no eres la nube: tú eres el cielo que la contiene.',
        displayText: 'Visualiza tu mente como un cielo azul. Deja que los pensamientos crucen sin retenerlos.',
        spokenText: 'Minuto uno... Cierra suavemente los ojos e imagina tu mente como un cielo despejado... Cada pensamiento que cruza es solo una nube pasajera... Inhala profundo abriendo espacio... y exhala dejando que esa nube siga su curso sin juzgarla... Respira con tranquilidad.'
      },
      {
        minute: 2,
        title: 'Nombrar sin reaccionar',
        instruction: 'Si surge una idea, di en voz baja mentalmente: "pensamiento... pensamiento". Y vuelve al aire fresco.',
        cue: 'Sin forcejeo ni frustración: sólo amabilidad paciente.',
        displayText: 'Etiqueta suavemente: "pensamiento". Vuelve al compás de tu aliento en la nariz.',
        spokenText: 'Minuto dos... Si aparece una preocupación o un recuerdo, nómbralo con ternura... y déjalo seguir de largo... Inhala presencia... y exhala desapego... No tienes nada que resolver ahora mismo.'
      },
      {
        minute: 3,
        title: 'Descanso en el silencio subyacente',
        instruction: 'Percibe el fondo de quietud que permanece intacto detrás de cualquier ruido.',
        cue: 'Tu verdadera naturaleza es calma.',
        displayText: 'Descansa en el silencio detrás de las palabras. Nada te perturba en tu centro.',
        spokenText: 'Minuto tres... Percibe el silencio sutil que descansa por debajo de los pensamientos... Inhala profundo nutriendo tu quietud... y exhala largo, descansando en tu centro intocable.'
      }
    ]
  },
  {
    id: 'day-11',
    dayNumber: 11,
    weekNumber: 2,
    dayInWeek: 4,
    title: 'Día 11: Anclaje del Punto Neutro',
    subtitle: 'Focaliza la atención en el roce milimétrico del aire sobre el labio superior',
    focus: 'Agudeza atencional y anclaje somático portátil e invisible',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'gentle_rain',
    steps: [
      {
        minute: 1,
        title: 'Localización de la diana sensorial',
        instruction: 'Lleva tu atención al triángulo formado entre la punta de la nariz y el labio superior.',
        cue: 'Percibe el frío milimétrico al inhalar y el calor suave al exhalar.',
        displayText: 'Centra toda tu atención en el roce sutil del aire sobre el labio superior.',
        spokenText: 'Minuto uno... Lleva toda tu atención a la punta de la nariz o al roce sutil del aire sobre tu labio superior... Inhala sintiendo esa pequeña caricia fresca... y exhala despacio manteniendo tu presencia allí.'
      },
      {
        minute: 2,
        title: 'Estabilización del foco',
        instruction: 'Cuando la mente se disperse, sonríe interiormente y regresa con dulzura milimétrica a ese punto táctil.',
        cue: 'La maestría de la mente no es no distraerse, sino regresar sin enojo.',
        displayText: 'Cada vez que la mente vuele, regresa con ternura al roce del aire en el labio.',
        spokenText: 'Minuto dos... Si la mente se distrae, sonríe suavemente e inhala de nuevo regresando a este punto neutro... Este anclaje viaja contigo en cualquier reunión, trayecto o momento difícil.'
      },
      {
        minute: 3,
        title: 'Calma concentrada',
        instruction: 'Nota cómo la agitación mental se disuelve cuando la atención se apoya en un solo estímulo real.',
        cue: 'Tu mente se vuelve un lago transparente.',
        displayText: 'Siente la nitidez de tu mente despejada. La simplicidad del aliento te sostiene.',
        spokenText: 'Minuto tres... Disfruta de la quietud en este punto neutro... Inhala claridad... y exhala serenidad... Tu mente está lúcida, enfocada y tranquila.'
      }
    ]
  },
  {
    id: 'day-12',
    dayNumber: 12,
    weekNumber: 2,
    dayInWeek: 5,
    title: 'Día 12: Tacto Compasivo (Mano al Pecho)',
    subtitle: 'Estimula el sistema de calma mamífero mediante calor y presión táctil afectuosa',
    focus: 'Liberación de oxitocina endógena y desconexión de la autocrítica',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'frequency_432',
    steps: [
      {
        minute: 1,
        title: 'Contacto de palmas cálidas',
        instruction: 'Coloca una o ambas manos sobre el centro de tu pecho. Siente el calor que atraviesa tu ropa.',
        cue: 'Tu propio contacto es medicina inmediata para el sistema nervioso.',
        displayText: 'Ambas manos al pecho. Siente el calor de tus palmas reconfortando tu corazón.',
        spokenText: 'Minuto uno... Lleva ambas manos sobre el centro de tu pecho... Inhala hondo sintiendo el calor y el latido de tu corazón bajo tus palmas... y exhala permitiendo que ese calor penetre hacia tus órganos internos.'
      },
      {
        minute: 2,
        title: 'Voz interna amable',
        instruction: 'Dite a ti mismo con compasión genuina: "Estoy aquí para ti. Este momento es difícil, pero estamos a salvo juntos".',
        cue: 'Sustituye la voz del juez interior por un amigo leal.',
        displayText: 'Háblate con ternura: "Estoy aquí conmigo. Todo está bien en este instante".',
        spokenText: 'Minuto dos... Háblate con la misma ternura que le ofrecerías a tu mejor amigo... Inhala aceptación incondicional... y exhala cualquier reproche o autocrítica... Estás a salvo en tu propia compañía.'
      },
      {
        minute: 3,
        title: 'Oxitocina y latido calmo',
        instruction: 'Siente cómo tu organismo afloja cualquier escudo interno y se rinde a este abrazo somático.',
        cue: 'Eres tu propio santuario de paz.',
        displayText: 'Descansa en el calor de tu pecho. Tu corazón late en un espacio de bondad plena.',
        spokenText: 'Minuto tres... Permanece con las manos en el pecho... Inhala gratitud... y exhala amor hacia tu cuerpo... Guarda este abrazo somático siempre que lo necesites.'
      }
    ]
  },
  {
    id: 'day-13',
    dayNumber: 13,
    weekNumber: 2,
    dayInWeek: 6,
    title: 'Día 13: Descompresión de la Urgencia y Prisa',
    subtitle: 'Apaga la falsa alarma biológica de premura constante generada por el entorno moderno',
    focus: 'Ralentización deliberada y discernimiento entre lo urgente y lo vital',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'ocean_waves',
    steps: [
      {
        minute: 1,
        title: 'Frenar el motor interno',
        instruction: 'Reconoce si sientes una marcha acelerada en tu pecho o estómago. No aceleres la respiración.',
        cue: 'Casi nada es una emergencia de vida o muerte para tu organismo.',
        displayText: 'Reconoce la sensación de prisa artificial y dale permiso a tu motor de desacelerar.',
        spokenText: 'Minuto uno... Cierra suavemente los ojos y percibe si hay un motor acelerado dentro de ti... Inhala profundo deteniendo el reloj... y al exhalar, di internamente: "No hay ninguna emergencia aquí y ahora".'
      },
      {
        minute: 2,
        title: 'El ritmo de la naturaleza',
        instruction: 'Conéctate con la cadencia de las olas o de un árbol centenario. La naturaleza no tiene prisa y todo florece.',
        cue: 'Vuelve a la velocidad orgánica de tu respiración.',
        displayText: 'Sincronízate con la lentitud fértil de la naturaleza. Todo llega a su debido tiempo.',
        spokenText: 'Minuto dos... Conéctate con el ritmo de las olas del mar... Inhala despacio sintiendo el oleaje... y exhala vaciando cualquier impaciencia... Trabajas y vives mejor desde la calma serena.'
      },
      {
        minute: 3,
        title: 'Soberanía del tiempo',
        instruction: 'Elige qué ritmo quieres imprimirle a lo que queda de tu día: serenidad y presencia plena.',
        cue: 'Tú eres el guardián de tu paz mental.',
        displayText: 'Recupera el control de tu tiempo. Camina desde tu centro sin dejarte arrastrar.',
        spokenText: 'Minuto tres... Inhala llenándote de soberanía y tiempo sereno... y exhala soltando la urgencia prestada... Estás en tu propio tiempo.'
      }
    ]
  },
  {
    id: 'day-14',
    dayNumber: 14,
    weekNumber: 2,
    dayInWeek: 7,
    title: 'Día 14: Tu Centro Portátil Permanente',
    subtitle: 'Consolidación de las 2 semanas: tu santuario interior viaja contigo dondequiera que vayas',
    focus: 'Graduación del programa inicial de 14 días y autonomía somática para la vida cotidiana',
    pillar: 'Semana 2 · Profundización y Soberanía',
    durationMinutes: 3,
    ambientSoundId: 'frequency_432',
    steps: [
      {
        minute: 1,
        title: 'Recapitulación de las herramientas',
        instruction: 'Recuerda tus pies en el suelo, tu exhalación larga, tu suspiro fisiológico y tu mano en el pecho.',
        cue: 'Todas estas llaves viven dentro de tu propia biología.',
        displayText: 'Tus pies firmes, tu aliento largo y tu mano al pecho: tus anclas somáticas ya son tuyas.',
        spokenText: 'Minuto uno... Inhala profundo recordando el camino recorrido a lo largo de estos catorce días... Tus pies en la tierra... tu exhalación larga... tu suspiro fisiológico... y tu mano en el pecho... Todas estas herramientas son ya parte de tu memoria celular.'
      },
      {
        minute: 2,
        title: 'El ancla invisible',
        instruction: 'Toca suavemente la yema de tu pulgar con tu dedo índice. Guarda este gesto como anclaje neuromuscular.',
        cue: 'Cada vez que repitas este gesto en tu día a día, tu cuerpo recordará esta serenidad.',
        displayText: 'Junta suavemente el pulgar y el índice. Sella en tu memoria somática este estado de equilibrio.',
        spokenText: 'Minuto dos... Junta suavemente la yema de tu pulgar y tu índice... Inhala sellando esta sensación de bienestar y estabilidad... y exhala sabiendo que en cualquier momento del día puedes volver aquí en solo un segundo.'
      },
      {
        minute: 3,
        title: 'Soberanía e integración definitiva',
        instruction: 'Abre los ojos despacio cuando sientas el impulso, llevando este centro sereno a tu vida cotidiana.',
        cue: '¡Felicidades por completar el programa de 14 días! Has transformado tu relación con tu sistema nervioso.',
        displayText: '¡Programa de 14 Días completado con éxito! Tu santuario interior está contigo siempre.',
        spokenText: 'Minuto tres... Inhala muy profundo celebrando tu compromiso y tu constancia... y exhala largo descansando en la certeza de que tu centro siempre viaja contigo... Gracias por cuidar de tu cuerpo y de tu vida.'
      }
    ]
  }
];
