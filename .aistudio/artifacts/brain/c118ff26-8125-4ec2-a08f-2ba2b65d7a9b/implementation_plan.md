# Plan de Implementación: Corrección Integral del Programa Somático y Diario de Gratitud

Este plan formaliza la transición del prototipo hacia la estructura definitiva requerida: adopción del **Programa de 5 Semanas** con sus prácticas clave específicas, uso exclusivo de la **voz masculina natural**, restauración del **selector de sonido ambiental** en tiempo real, ampliación del **Pack a 7 sesiones somáticas** con autosugestión positiva, y la creación del **Diario de Gratitud** sincronizado con Firebase Firestore.

---

## 1. Alcance y Objetivos de la Corrección

1. **Voz Masculina Natural Exclusiva**:
   * Desactivar y remover definitivamente cualquier selector o voz femenina sintética en toda la plataforma (`speechSynthesisService`, `voiceGuide`, modales y pantallas).
   * Estandarizar la locución exclusivamente en la voz masculina barítono cálida y reposada de estudio (Gemini TTS Fenrir / perfil optimizado de cadencia meditativa).

2. **Restaurar el Selector de Sonido Ambiental en el Reproductor**:
   * Incorporar un botón visible y desplegable `"Cambiar Ambiente"` en el reproductor somático (`SomaticPlayerModal`).
   * Permitir alternar de inmediato entre las 5 ambientaciones sin reiniciar la práctica:
     1. *Lluvia en el Bosque* (Gotas sobre hojas húmedas)
     2. *Lluvia Suave Continua* (Cortina sedosa envolvente)
     3. *Brisa de Bosque* (Susurros eólicos entre coníferas)
     4. *Olas de Mar Calmas* (Oleaje profundo y resaca espumosa)
     5. *Frecuencia 432 Hz / 396 Hz & Cuenco* (Armónicos de relajación y anclaje)

3. **Reestructuración al Programa de 5 Semanas**:
   * Reemplazar la denominación y barra de progreso de "14 Días" por `"Programa 5 Semanas (Semana X de 5)"`.
   * Estructurar únicamente las prácticas clave solicitadas (sin contenido de relleno):
     * **Semana 1: Presencia** (Pausa de 3 [4-6], Escaneo Corporal Somático, Termómetro Emocional 1–10 y Soltar Cuello con antes/después).
     * **Semana 2: Regulación** (Respiración Vagal 4-2-6, Suspiro Fisiológico con 1–10 antes/después, Anclaje Sensorial 5-4-3-2-1, El Experimento de 90s con antes/después).
     * **Semana 3: Comprensión (La Voz Crítica)** (Observar el pensamiento desde afuera "Estoy teniendo el pensamiento de...", Guía de Tapping de descarga con 0–10 antes/después, La Voz del Amigo compasivo).
     * **Semana 4: Dirección** (Pausa de Claridad: ¿Desde dónde decido?, Conexión con mis 3 Valores y El Gap 0–10, El Punto de Elección Choice Point).
     * **Semana 5: Integración** (Protocolo de Retorno Notar-Parar-Volver, Mi Sistema Personal de 3 Partes, Visualización Conexión con el Yo del Futuro).
   * **Desbloqueo progresivo por etapas**: completar las prácticas de una semana desbloquea la siguiente semana; los ejercicios futuros permanecen atenuados con candado 🔒.

4. **Ampliación del Pack a 7 Sesiones Somáticas**:
   * Mantener las 5 actuales (Nocturna, Emergencia, Matutina, Tensión/Descarga, Vuelve a tu Centro).
   * Agregar las 2 nuevas sesiones de autosugestión positiva:
     * ✨ **6. Autosugestión Positiva: Calma, Seguridad y Confianza** (Afirmaciones pausadas en primera persona, 3 minutos, ondas alfa).
     * 🌱 **7. Autosugestión Nocturna: Soltar el Control y Renovación** (Liberación de autoexigencia y reparación del sistema nervioso antes de dormir).

5. **Conservar Intacto el Botiquín Somático y SOS**:
   * Mantener las pestañas superiores "Mi Práctica" y "Botiquín Somático".
   * Mantener el doble botón fijo de cabecera: SOS Calma (60s) y SOS Energía (60s).

6. **Diario de Gratitud en el Perfil de Usuario**:
   * Pestaña dedicada dentro del modal de perfil (`UserAuthModal`).
   * Selector de estados de ánimo con iconos claros: 😌 *Calma*, ✨ *Gratitud*, 🌿 *Serenidad*, ☀️ *Energía*, 🤍 *Paz*.
   * Campo para redactar la entrada de gratitud diaria.
   * Almacenamiento seguro en Firestore bajo `/users/{userId}/gratitude/{entryId}` (con fallback offline en `localStorage`).
   * Historial cronológico de notas de gratitud con fechas y estados de ánimo registrados.

---

## 2. Arquitectura de Archivos y Componentes

| Componente / Archivo | Responsabilidad |
|---|---|
| `src/data/programWeeksData.ts` | Definición de las 5 semanas, con sus prácticas clave específicas, instrucciones paso a paso, mediciones (1-10 antes/después) y guiones en voz masculina. |
| `src/data/somaticSessions.ts` | Actualización de 5 a 7 sesiones sumando las dos meditaciones de autosugestión afirmativa. |
| `src/utils/voiceGuide.ts` | Depuración total de cualquier referencia femenina; anclaje rígido a la voz masculina natural de estudio. |
| `src/services/speechSynthesisService.ts` | Forzado estricto del perfil masculino barítono en caso de síntesis directa. |
| `src/components/SomaticPlayerModal.tsx` | Integración del selector desplegable de ambiente (`Cambiar Ambiente`), medición de termómetros antes/después donde aplique, y voz masculina. |
| `src/components/ProgramWeeksView.tsx` | Selector y visualizador de las 5 semanas con candados 🔒 por etapas completadas. |
| `src/components/ProgramProgressBanner.tsx` | Barra de progreso general calibrada para "Semana X de 5" y porcentaje global de avance. |
| `src/components/UserAuthModal.tsx` | Nueva pestaña o sección "Diario de Gratitud" con selector de ánimo, formulario de entrada e historial de entradas. |
| `src/lib/firebase.ts` | Funciones `saveGratitudeEntry(userId, entry)` y `getGratitudeEntries(userId)`. |
| `firestore.rules` | Regla para la subcolección `/users/{userId}/gratitude/{gratitudeId}` validando id, userId, mood, note y fecha. |

---

## 3. Estrategia de Datos y Seguridad en Firestore

1. **Subcolección `/users/{userId}/gratitude/{gratitudeId}`**:
   * Campos: `id` (string), `userId` (string), `mood` (string: calma, gratitud, serenidad, energia, paz), `note` (string max 500), `createdAt` (timestamp).
   * Regla de validación: sólo el usuario autenticado puede leer, crear y listar sus propias entradas de gratitud.
2. **Actualización de Perfil**:
   * Guardar `semanasCompletadas`, `semanaActual` (1 a 5) y `completedPracticeIds`.

---

## 4. Plan de Verificación

* **Compilación y Linteo**:
  * Ejecutar `lint_applet` (`tsc --noEmit`) para garantizar cero errores de tipos.
  * Ejecutar `compile_applet` para validar el empaquetado de Vite.
* **Prueba de Audio y Ambiente**:
  * Verificar en el reproductor que el botón "Cambiar Ambiente" cambie el fondo de audio en tiempo real entre los 5 paisajes sonoros.
  * Verificar que no exista ningún toggle o rastro de voz femenina, confirmando la reproducción de la voz masculina natural.
* **Prueba de Desbloqueo de 5 Semanas**:
  * Verificar que la Semana 1 muestre sus 3 prácticas clave.
  * Completar las prácticas de la Semana 1 y verificar que se desbloquee la Semana 2, manteniendo bloqueadas las semanas 3, 4 y 5.
* **Prueba de Diario de Gratitud**:
  * Abrir el perfil de usuario, seleccionar un icono de estado de ánimo, escribir una nota de agradecimiento y guardar.
  * Confirmar que se agregue de inmediato a la lista y se sincronice con Firestore.
