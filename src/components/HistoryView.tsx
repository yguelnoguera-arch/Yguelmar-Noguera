import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Trash2,
  Copy,
  Check,
  TrendingUp,
  Activity,
  BarChart3,
  List,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ReflectionEntry } from '../types';

interface HistoryViewProps {
  reflections: ReflectionEntry[];
  onDeleteReflection: (id: string) => void;
  onGoToWeek: (weekNumber: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  reflections,
  onDeleteReflection,
  onGoToWeek,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'entries'>('analytics');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute Weekly Usage Frequency Data for Recharts BarChart
  const weeklyUsageData = [1, 2, 3, 4, 5].map((wNum) => {
    const count = reflections.filter((r) => r.weekNumber === wNum).length;
    return {
      name: `Sem ${wNum}`,
      fullWeek: `Semana ${wNum}`,
      registros: count,
    };
  });

  // Compute Wellbeing Evolution Data for Recharts AreaChart
  // Wellbeing is derived from the reflections' sensation tags:
  // 'En calma' increases wellbeing score; releasing tensions shows progress
  const wellbeingEvolutionData = [1, 2, 3, 4, 5].map((wNum) => {
    const weekEntries = reflections.filter((r) => r.weekNumber === wNum);
    let avgScore = 60; // baseline

    if (weekEntries.length > 0) {
      const scores = weekEntries.map((e) => {
        if (e.wellbeingScore) return e.wellbeingScore * 10;
        let s = 65;
        if (e.sensations?.includes('En calma')) s += 25;
        if (e.sensations?.length === 1 && !e.sensations?.includes('En calma')) s += 10;
        if (e.sensations?.length >= 3) s -= 10;
        return Math.min(100, Math.max(30, s));
      });
      avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    } else {
      // Natural progression curve projection for preview
      avgScore = 55 + (wNum - 1) * 8;
    }

    return {
      semana: `Sem ${wNum}`,
      bienestar: avgScore,
      calma: Math.min(100, avgScore + 5),
    };
  });

  const filteredReflections = reflections.filter((entry) => {
    if (selectedWeekFilter === 'all') return true;
    return entry.weekNumber === selectedWeekFilter;
  });

  const handleCopy = (entry: ReflectionEntry) => {
    const textToCopy = `[Vuelve a tu Centro - Semana ${entry.weekNumber}: ${entry.weekTitle}]\nFecha: ${new Date(
      entry.createdAt
    ).toLocaleDateString('es-ES')}\nZonas: ${entry.sensations?.join(', ')}\n¿Qué sueltas hoy?: ${entry.whatToRelease || entry.reflectionText}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-full pb-24 pt-2 px-4 sm:px-6 max-w-lg mx-auto text-[#2C2F28]">
      {/* Header */}
      <div className="mb-5 pt-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7A54] uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Historial & Analítica Somática</span>
        </div>
        <h1 className="text-3xl font-serif text-[#232720] font-normal leading-tight">
          Evolución & Registros
        </h1>
        <p className="text-sm text-[#666B5E] mt-1 leading-relaxed font-light">
          Visualiza tu frecuencia semanal de prácticas y el avance de tu bienestar corporal.
        </p>
      </div>

      {/* Segmented Control: Gráficos vs. Lista de Reflexiones */}
      <div className="flex items-center p-1 bg-[#ECE5D8] rounded-2xl mb-6 shadow-2xs">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
              : 'text-[#6C7063] hover:text-[#2C2F28]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#556341]" />
          <span>Visualización de Datos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('entries')}
          className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'entries'
              ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
              : 'text-[#6C7063] hover:text-[#2C2F28]'
          }`}
        >
          <List className="w-4 h-4 text-[#556341]" />
          <span>Reflexiones ({reflections.length})</span>
        </button>
      </div>

      {/* TAB 1: VISUALIZACIÓN DE DATOS CON RECHARTS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* GRÁFICO 1: EVOLUCIÓN DEL BIENESTAR BASADA EN REFLEXIONES GUARDADAS */}
          <section className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#556341]/15 text-[#556341] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium text-[#232720] leading-none">
                    Evolución del Bienestar
                  </h3>
                  <span className="text-[11px] text-[#7A7E72]">
                    Índice de calma somática (0 - 100%)
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#556341] bg-[#EDE7D9] px-2.5 py-1 rounded-full">
                {wellbeingEvolutionData[wellbeingEvolutionData.length - 1].bienestar}% actual
              </span>
            </div>

            <p className="text-xs text-[#6B7062] mb-4 leading-relaxed">
              Curva de desahogo y ligereza calculada según las zonas corporales registradas y la frecuencia de pausas conscientes.
            </p>

            {/* Recharts AreaChart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={wellbeingEvolutionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="wellbeingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6B7A54" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6B7A54" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D3" />
                  <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#6B7062' }} />
                  <YAxis domain={[30, 100]} ticks={[40, 60, 80, 100]} tick={{ fontSize: 10, fill: '#6B7062' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF8F4',
                      borderColor: '#DDD5C2',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val) => [`${val ?? 0}%`, 'Bienestar']}
                  />
                  <Area
                    type="monotone"
                    dataKey="bienestar"
                    stroke="#556341"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#wellbeingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A7E72] mt-3 pt-2.5 border-t border-[#ECE5D8]">
              <span>Base inicial: Semana 1</span>
              <span className="text-[#556341] font-semibold">Progresión positiva hacia la calma</span>
            </div>
          </section>

          {/* GRÁFICO 2: FRECUENCIA DE USO SEMANAL CON RECHARTS */}
          <section className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#556341]/15 text-[#556341] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium text-[#232720] leading-none">
                    Frecuencia de Uso Semanal
                  </h3>
                  <span className="text-[11px] text-[#7A7E72]">
                    Número de prácticas y registros completados
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4B533E] bg-[#EDE7D9] px-2.5 py-1 rounded-full">
                {reflections.length} total
              </span>
            </div>

            <p className="text-xs text-[#6B7062] mb-4 leading-relaxed">
              Consistencia y constancia de tus pausas ancla a lo largo de las 5 semanas.
            </p>

            {/* Recharts BarChart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyUsageData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7062' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#6B7062' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF8F4',
                      borderColor: '#DDD5C2',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val) => [`${val ?? 0} registros`, 'Frecuencia']}
                  />
                  <Bar
                    dataKey="registros"
                    fill="#6B7A54"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A7E72] mt-3 pt-2.5 border-t border-[#ECE5D8]">
              <span>Semana activa actual: Semana 1</span>
              <span>Meta diaria: 1 práctica</span>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: LISTA DE REFLEXIONES GUARDADAS */}
      {activeSubTab === 'entries' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Week Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#ECE6D9] rounded-2xl overflow-x-auto">
            <button
              onClick={() => setSelectedWeekFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedWeekFilter === 'all'
                  ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                  : 'text-[#6C7063] hover:text-[#2C2F28]'
              }`}
            >
              Todas ({reflections.length})
            </button>
            {[1, 2, 3, 4, 5].map((wNum) => {
              const count = reflections.filter((r) => r.weekNumber === wNum).length;
              return (
                <button
                  key={wNum}
                  onClick={() => setSelectedWeekFilter(wNum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedWeekFilter === wNum
                      ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                      : 'text-[#6C7063] hover:text-[#2C2F28]'
                  }`}
                >
                  Semana {wNum} ({count})
                </button>
              );
            })}
          </div>

          {filteredReflections.length === 0 ? (
            <div className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-3xl p-8 text-center my-4">
              <div className="w-14 h-14 rounded-full bg-[#EAE3D3] text-[#6B7A54] flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#232720] mb-1">
                Aún no hay reflexiones guardadas
              </h3>
              <p className="text-xs text-[#6B7062] max-w-xs mx-auto leading-relaxed mb-5">
                Realiza la práctica ancla de 3 minutos y registra en la bitácora rápida qué sueltas hoy.
              </p>
              <button
                onClick={() => onGoToWeek(selectedWeekFilter === 'all' ? 1 : (selectedWeekFilter as number))}
                className="h-11 px-5 rounded-2xl bg-[#556341] hover:bg-[#485437] text-[#FDFCF9] text-xs font-medium inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Ir a la Semana {selectedWeekFilter === 'all' ? 1 : selectedWeekFilter}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReflections.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-3xl p-4 sm:p-5 shadow-xs transition-all hover:border-[#D5CEBC]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-[#EBE5D8] pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#6B7A54] font-bold uppercase tracking-wider">
                        <span>Semana {entry.weekNumber}</span>
                        <span>·</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs">{entry.weekTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#7A7E72] mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(entry.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(entry)}
                        className="w-8 h-8 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD2] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
                        title="Copiar registro"
                        aria-label="Copiar"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Deseas eliminar este registro de tu dispositivo?')) {
                            onDeleteReflection(entry.id);
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-[#EFEAE0] hover:bg-rose-100/60 text-[#7A7E72] hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Eliminar registro"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Sensation Quick Buttons Tagged */}
                  {entry.sensations && entry.sensations.length > 0 && (
                    <div className="mb-2.5">
                      <div className="flex flex-wrap gap-1">
                        {entry.sensations.map((sens, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] bg-[#EDE7DA] text-[#454B3B] font-semibold px-2.5 py-0.5 rounded-lg"
                          >
                            [{sens}]
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What to release text */}
                  {(entry.whatToRelease || entry.reflectionText) && (
                    <div className="text-sm text-[#383C2F] leading-relaxed bg-[#FDFCF9] p-3 rounded-2xl border border-[#ECE5D8]">
                      <span className="text-[10px] font-bold text-[#6B7A54] uppercase tracking-wider block mb-0.5">
                        ¿Qué sueltas hoy?
                      </span>
                      "{entry.whatToRelease || entry.reflectionText}"
                    </div>
                  )}

                  {/* Bottom week link */}
                  <div className="mt-3 pt-2 flex justify-end">
                    <button
                      onClick={() => onGoToWeek(entry.weekNumber)}
                      className="text-[11px] font-semibold text-[#6B7A54] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Práctica ancla Semana {entry.weekNumber}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
