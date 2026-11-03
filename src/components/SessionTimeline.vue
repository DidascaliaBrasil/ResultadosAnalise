<template>
  <div class="timeline-container">
    <div class="glass-card">
      <div class="card-head">
        <h3 class="card-title">Linha do Tempo das Sessões &amp; Eventos de Conflito</h3>
        <span class="card-subtitle">
          Mapeamento cronológico das sessões experimentais e gatilhos disparados pelo Facilitador (ex: disputas de materiais e conflitos de alunos)
        </span>
      </div>

      <div class="timeline-tree">
        <div 
          v-for="sess in sortedSessions" 
          :key="sess.sessId + sess.roomId"
          class="timeline-node"
        >
          <div class="node-marker" :class="sess.condition === 'TEA' ? 'tea-marker' : 'tdah-marker'">
            <span class="node-icon">VR</span>
          </div>

          <div class="node-body glass-card">
            <div class="node-header">
              <div class="node-title-group">
                <span class="badge" :class="sess.condition === 'TEA' ? 'badge-tea' : 'badge-tdah'">
                  {{ sess.conditionLabel }}
                </span>
                <span class="node-room-title">{{ sess.roomName }} &bull; {{ sess.sessId }}</span>
                <span class="badge badge-valid">Prof. {{ sess.participantName }}</span>
              </div>
              <div class="node-time mono">
                {{ formatDateTime(sess.dataInicio) }}
              </div>
            </div>

            <div class="node-metrics-bar">
              <span class="metric-tag">
                ⏱ Duração: <strong>{{ sess.duracaoSegundos }}s</strong> ({{ sess.duracaoMinutos }} min)
              </span>
              <span class="metric-tag">
                🎯 Total de Intenções: <strong>{{ sess.totalIntents }}</strong>
              </span>
              <span class="metric-tag">
                ⚡ Cadência: <strong>{{ sess.ratePerMinute }} ações/min</strong>
              </span>
              <span class="metric-tag">
                👨‍🏫 Facilitador: <strong>{{ sess.facilitadorNome }}</strong>
              </span>
            </div>

            <!-- Comandos de Conflito Disparados na Sala pelo Facilitador -->
            <div v-if="sess.comandosFacilitador.length > 0" class="facilitator-events-block">
              <span class="events-title">
                ⚡ Gatilhos &amp; Comandos Disparados pelo Facilitador nesta Sala ({{ sess.comandosFacilitador.length }}):
              </span>
              <div class="events-pill-list">
                <div 
                  v-for="cmd in sess.comandosFacilitador" 
                  :key="cmd.id"
                  class="cmd-pill"
                >
                  <span class="cmd-type">{{ formatConflictType(cmd.tipoConflito) }}</span>
                  <span v-if="cmd.alunoAlvo !== 'Todos'" class="cmd-target">Aluno: {{ cmd.alunoAlvo }}</span>
                </div>
              </div>
            </div>

            <!-- Resumo das Intenções Aplicadas -->
            <div class="intents-applied-row">
              <span class="intents-applied-label">Ações do Professor:</span>
              <div class="intent-minitags">
                <span 
                  v-for="(count, intent) in sess.intentsDetalhadas" 
                  :key="intent"
                  class="minitag"
                >
                  {{ intent }} <strong class="mono">&times;{{ count }}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  sessions: {
    type: Array,
    required: true
  }
});

const sortedSessions = computed(() => {
  return [...props.sessions].sort((a, b) => {
    const timeA = a.dataInicio ? new Date(a.dataInicio).getTime() : 0;
    const timeB = b.dataInicio ? new Date(b.dataInicio).getTime() : 0;
    return timeA - timeB;
  });
});

function formatDateTime(isoString) {
  if (!isoString) return 'Data não informada';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return isoString;
  }
}

function formatConflictType(type) {
  const map = {
    StartRoom: 'Início da Sessão (StartRoom)',
    EndRoom: 'Fim da Sessão (EndRoom)',
    TakeMaterialAll: 'Gatilho: Aluno Tomando Material de Todos (Disputa)',
    StandUpConflict: 'Gatilho: Aluno Levantando / Confronto em Pé',
    ResetSingleStudent: 'Reset Comportamental do Aluno',
    TextToSpeech: 'Comunicação Facilitador (TTS)'
  };
  return map[type] || type;
}
</script>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
}

.timeline-tree {
  position: relative;
  margin-top: 1.5rem;
  padding-left: 2.5rem;
}

.timeline-tree::before {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 17px;
  width: 2px;
  background: var(--border-color);
}

.timeline-node {
  position: relative;
  margin-bottom: 2rem;
}

.node-marker {
  position: absolute;
  left: -2.5rem;
  top: 1.25rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: var(--shadow-sm);
}

.node-icon {
  font-size: 0.7rem;
  font-weight: 800;
  font-family: var(--font-mono);
}

.tea-marker {
  border-color: #8b5cf6;
  color: #c084fc;
}

.tdah-marker {
  border-color: #06b6d4;
  color: #22d3ee;
}

.node-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.node-title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.node-room-title {
  font-size: 1rem;
  font-weight: 750;
  color: var(--text-primary);
}

.node-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.node-metrics-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.825rem;
  color: var(--text-secondary);
}

.metric-tag strong {
  color: var(--text-primary);
}

.facilitator-events-block {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 0.65rem;
  padding: 0.75rem 1rem;
}

.events-title {
  font-size: 0.75rem;
  font-weight: 750;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.45rem;
  display: block;
}

.events-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.cmd-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-card);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.25rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.75rem;
}

.cmd-type {
  font-weight: 600;
  color: var(--text-primary);
}

.cmd-target {
  font-size: 0.7rem;
  color: #f59e0b;
}

.intents-applied-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.intents-applied-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.intent-minitags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.minitag {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-primary);
}
</style>

