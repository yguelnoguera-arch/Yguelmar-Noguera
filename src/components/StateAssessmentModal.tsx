import React, { useState } from 'react';
import { X, Check, ArrowRight, RotateCcw, TrendingUp, Sparkles, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AssessmentAnswers, AssessmentRecord } from '../types';
import { soundManager } from '../utils/sound';

interface StateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  beforeRecord: AssessmentRecord | null;
  afterRecord: AssessmentRecord | null;
  onSaveAssessment: (record: AssessmentRecord) => void;
  initialViewMode?: 'quiz' | 'compare';
}

const QUESTIONS = [
  {
    id: 'q1' as keyof AssessmentAnswers,
    label: 'Mandíbula y cuello',
    fullQuestion: '1. ¿Cómo sientes la tensión en mandíbula, cuello y hombros hoy?',
    minLabel: 'Muy tensos / apretados',
    maxLabel: 'Completamente relajados',
  },
  {
    id: 'q2' as keyof AssessmentAnswers,
    label: 'Calma mental',
    fullQuestion: '2. ¿Cuál es tu nivel de calma mental vs. agitación y rumiación?',
    minLabel: 'Mente saturada y dispersa',
    maxLabel: 'Mente clara y serena',
  },
  {
    id: 'q3' as keyof AssessmentAnswers,
    label: 'Respiración',
    fullQuestion: '3. ¿Cómo percibes el ritmo y amplitud de tu respiración cotidiana?',
    minLabel: 'Corta y superficial en pecho',
    maxLabel: 'Lenta, fluida y diafragmática',
  },
  {
    id: 'q4' as keyof AssessmentAnswers,
    label: 'Energía vital',
    fullQuestion: '4. ¿Cómo calificarías tu energía física al mediodía?',
    minLabel: 'Agotamiento y pesadez',
    maxLabel: 'Vitalidad despierta y equilibrada',
  },
  {
    id: 'q5' as keyof AssessmentAnswers,
    label: 'Frenar la prisa',
    fullQuestion: '5. ¿Qué tan fácil te resulta frenar la urgencia y desconectar?',
    minLabel: 'Imposible parar el piloto automático',
    maxLabel: 'Pauso con naturalidad y descanso',
  },
  {
    id: 'q6' as keyof AssessmentAnswers,
    label: 'Espacio en pecho',
    fullQuestion: '6. ¿Notas opresión o ligereza y desahogo en tu pecho?',
    minLabel: 'Opresión y nudo de estrés',
    maxLabel: 'Amplitud, apertura y ligereza',
  },
  {
    id: 'q7' as keyof AssessmentAnswers,
    label: 'Conexión corporal',
    fullQuestion: '7. ¿Qué tan conectado estás con las señales de tu propio cuerpo?',
    minLabel: 'Totalmente desconectado',
    maxLabel: 'Escucha atenta y presencia plena',
  },
];

export const StateAssessmentModal: React.FC<StateAssessmentModalProps> = ({
  isOpen,
  onClose,
  beforeRecord,
  afterRecord,
  onSaveAssessment,
  initialViewMode = 'quiz',
}) => {
  // If user already has a before record and opened from Week 5 or comparison, show comparison if after exists
  const [viewMode, setViewMode] = useState<'quiz' | 'compare'>(
    initialViewMode === 'compare' && beforeRecord ? 'compare' : 'quiz'
  );

  // Form answers (1 to 5)
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    q1: 2,
    q2: 2,
    q3: 3,
    q4: 2,
    q5: 2,
    q6: 2,
    q7: 3,
  });

  if (!isOpen) return null;

  const isTakingAfter = !!beforeRecord;

  const handleSelectScore = (questionKey: keyof AssessmentAnswers, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: score }));
  };

  const calculateTotal = (ans: AssessmentAnswers) => {
    return ans.q1 + ans.q2 + ans.q3 + ans.q4 + ans.q5 + ans.q6 + ans.q7;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal(answers);
    const percentage = Math.round((total / 35) * 100);

    const record: AssessmentRecord = {
      type: beforeRecord ? 'after' : 'before',
      completedAt: new Date().toISOString(),
      answers,
      totalScore: total,
      wellbeingPercentage: percentage,
    };

    onSaveAssessment(record);
    soundManager.playBowl(320, 3);
    setViewMode('compare');
  };

  // Prepare chart comparison data
  const comparisonData = QUESTIONS.map((q) => {
    const beforeVal = beforeRecord ? beforeRecord.answers[q.id] : 2;
    const afterVal = afterRecord
      ? afterRecord.answers[q.id]
      : viewMode === 'compare'
      ? answers[q.id]
      : 4;

    return {
      name: q.label,
      Antes: beforeVal,
      Después: afterVal,
    };
  });

  const beforeScore = beforeRecord?.wellbeingPercentage || 40;
  const currentOrAfterScore = afterRecord?.wellbeingPercentage || Math.round((calculateTotal(answers) / 35) * 100);
  const deltaScore = currentOrAfterScore - beforeScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#232720]/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FAF8F4] border border-[#E4DEC3] rounded-[32px] shadow-2xl p-5 sm:p-6 text-[#2C2F28] my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE6D8]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#556341] text-[#FDFCF9] flex items-center justify-center font-bold text-xs">
              7
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7A54]">
                Autodiagnóstico Somático
              </span>
              <h2 className="text-lg font-serif font-medium text-[#232720] leading-none mt-0.5">
                {viewMode === 'compare'
                  ? 'Comparativa: Antes vs. Después'
                  : beforeRecord
                  ? 'Test de Cierre (Semana 5)'
                  : 'Test de Estado Actual (7 preguntas)'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {beforeRecord && (
              <button
                onClick={() => setViewMode(viewMode === 'quiz' ? 'compare' : 'quiz')}
                className="text-xs text-[#556341] hover:underline px-2 py-1 font-medium cursor-pointer"
              >
                {viewMode === 'quiz' ? 'Ver Gráfico' : 'Responder'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#EFE9DD] hover:bg-[#E0D9CB] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar modal"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-3 pr-1">
          {viewMode === 'quiz' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#6A6E61] leading-relaxed">
                {isTakingAfter
                  ? 'Responde con honestidad cómo te sientes tras haber transitado los pilares de práctica. Compararemos tu evolución con tu evaluación inicial.'
                  : 'Califica del 1 al 5 tu estado cotidiano actual. Guardaremos esta referencia para medir tu evolución al completar las 5 semanas.'}
              </p>

              {/* 7 Questions List */}
              <div className="space-y-4">
                {QUESTIONS.map((q) => {
                  const currentVal = answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E3DC source] border-[#DFD8C7] transition-all"
                    >
                      <label className="block text-xs sm:text-sm font-serif font-medium text-[#2A2E23] mb-1.5">
                        {q.fullQuestion}
                      </label>

                      {/* 1 to 5 Touch Rating buttons */}
                      <div className="grid grid-cols-5 gap-1.5 my-2">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const isSelected = currentVal === num;
                          return (
                            <button
                              type="button"
                              key={num}
                              onClick={() => handleSelectScore(q.id, num)}
                              className={`h-11 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#556341] text-[#FDFCF9] shadow-xs scale-102 ring-2 ring-[#556341]/30'
                                  : 'bg-[#EAE2D2] text-[#4E5444] hover:bg-[#E0D8C6]'
                              }`}
                            >
                              <span className="text-sm font-mono">{num}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Min / Max Labels */}
                      <div className="flex items-center justify-between text-[10px] text-[#7A7E72] px-0.5 mt-1">
                        <span>1: {q.minLabel}</span>
                        <span>5: {q.maxLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isTakingAfter
                      ? 'Guardar evaluación y ver gráfico comparativo'
                      : 'Guardar autodiagnóstico inicial (Antes)'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* COMPARATIVE CHART VIEW (ANTES VS DESPUÉS) CON RECHARTS */
            <div className="space-y-4">
              {/* Summary Score Card */}
              <div className="bg-[#EFE9DC] border border-[#DDD5C2] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A54]">
                    Índice Global de Bienestar
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-mono font-bold text-[#2A2E23]">
                      {currentOrAfterScore}%
                    </span>
                    {deltaScore !== 0 && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                          deltaScore > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {deltaScore > 0 ? `+${deltaScore}%` : `${deltaScore}%`} evolución
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs text-[#737869]">
                  <p>Antes: <strong className="font-mono">{beforeScore}%</strong></p>
                  <p>Después: <strong className="font-mono">{currentOrAfterScore}%</strong></p>
                </div>
              </div>

              {/* Recharts Bar Chart: Antes vs Después */}
              <div className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-3">
                <h4 className="text-xs font-serif font-medium text-[#232720] mb-2 text-center">
                  Comparativa por Área Somática (Escala 1 a 5)
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 9, fill: '#6B7062' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#6B7062' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FAF8F4',
                          borderColor: '#DDD5C2',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="Antes" fill="#C5BCAE" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Después" fill="#6B7A54" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Qualitative Insight */}
              <div className="p-3.5 bg-[#E7ECE0] border border-[#CCD8C2] rounded-2xl text-xs text-[#354026] leading-relaxed flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#556341] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm font-serif">
                    {deltaScore > 0
                      ? 'Progreso somático palpable'
                      : 'Constancia e integración en marcha'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#445032]">
                    {deltaScore > 0
                      ? 'Tus niveles de autorregulación y ligereza corporal han mostrado un avance significativo desde el inicio del programa.'
                      : 'El retorno al centro es una práctica viva. Repite las prácticas ancla cuando sientas sobrecarga.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('quiz')}
                  className="flex-1 h-11 rounded-2xl bg-[#ECE6D8] hover:bg-[#DFD8C8] text-[#383C2F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir evaluación</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-2xl bg-[#556341] hover:bg-[#485437] text-[#FDFCF9] text-xs font-medium transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
