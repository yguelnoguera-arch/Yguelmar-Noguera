export interface ReflectionEntry {
  id: string;
  weekNumber: number; // 1 to 5
  weekTitle: string;
  dayInWeek?: number; // 1 to 7
  createdAt: string; // ISO date string
  sensations: string[]; // ['Mandíbula', 'Cuello/Hombros', 'Pecho', 'Espalda', 'En calma']
  whatToRelease: string; // "¿Qué sueltas hoy?"
  reflectionText?: string;
  wellbeingScore?: number; // 1-10 calculated score based on state
}

export interface WeekStep {
  minute: number;
  title: string;
  instruction: string;
  cue: string;
  displayText?: string;
  spokenText?: string;
}

export interface WeekProgram {
  weekNumber: number;
  title: string;
  subtitle: string;
  pillar: string;
  durationMinutes: number; // 3
  focus: string;
  anchorPracticeTitle: string;
  steps: WeekStep[];
}

export interface AssessmentAnswers {
  q1: number; // Tensión en mandíbula, cuello y hombros (1-5)
  q2: number; // Agitación o rumiación mental (1-5)
  q3: number; // Respiración corta o superficial en el pecho (1-5)
  q4: number; // Fatiga o pesadez física (1-5)
  q5: number; // Dificultad para desconectar del ritmo acelerado (1-5)
  q6: number; // Sensación de prisa o urgencia constante (1-5)
  q7: number; // Desconexión con las señales de mi propio cuerpo (1-5)
}

export interface AssessmentRecord {
  type: 'before' | 'after';
  completedAt: string;
  answers: AssessmentAnswers;
  totalScore: number; // max 35 (higher means more tension/overload, or transformed to wellbeing)
  wellbeingPercentage: number; // 0-100%
}
