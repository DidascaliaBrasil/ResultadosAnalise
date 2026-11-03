<template>
  <div class="participant-page">
    <!-- Seletor Espaçoso dos Professores com Respiro Amplo -->
    <div class="glass-card teacher-selector-card">
      <span class="selector-heading">Selecione o Professor para Visualização Individual:</span>
      <div class="teacher-pill-grid">
        <button 
          v-for="p in validParticipants" 
          :key="p.code"
          class="teacher-select-btn"
          :class="{ active: currentParticipant?.code === p.code }"
          @click="selectedCode = p.code"
        >
          <div class="teacher-avatar">
            <span>{{ p.code.substring(0, 2) }}</span>
          </div>
          <div class="teacher-info-text">
            <span class="teacher-id-label">Professor {{ p.code }}</span>
            <span class="teacher-sub-meta mono">{{ p.totalIntents }} ações &bull; {{ (p.totalDurationSec/60).toFixed(1) }} min</span>
          </div>
          <div v-if="currentParticipant?.code === p.code" class="active-dot"></div>
        </button>
      </div>
    </div>

    <!-- Perfil Visual do Professor Selecionado -->
    <div v-if="currentParticipant" class="profile-layout">
      <!-- Barra Rápida com Respiro -->
      <div class="glass-card summary-metrics-bar">
        <div class="summary-meta-left">
          <div class="avatar-big">👨‍🏫</div>
          <div>
            <div class="teacher-title-row">
              <h2 class="teacher-name">Professor {{ currentParticipant.code }}</h2>
              <span class="badge badge-valid">Sujeito Válido da Pesquisa</span>
              <span class="badge" :style="{ background: archetypeInfo.badgeBg, color: archetypeInfo.badgeColor }">
                {{ archetypeInfo.shortTitle }}
              </span>
            </div>
            <p class="teacher-facilitator text-xs text-muted">
              Facilitador: {{ currentParticipant.sessions[0]?.facilitadorNome }} | E-mail: {{ currentParticipant.email }}
            </p>
          </div>
        </div>

        <div class="summary-kpis-right">
          <div class="sum-kpi">
            <span class="sum-label">Total de Ações</span>
            <span class="sum-val mono">{{ currentParticipant.totalIntents }}</span>
          </div>
          <div class="sum-kpi">
            <span class="sum-label">Tempo Imersivo</span>
            <span class="sum-val mono">{{ (currentParticipant.totalDurationSec/60).toFixed(1) }}m</span>
          </div>
          <div class="sum-kpi">
            <span class="sum-label">Cadência Média</span>
            <span class="sum-val mono">{{ averageCadence }}/min</span>
          </div>
        </div>
      </div>

      <!-- Resumo Lado a Lado: TEA vs TDAH -->
      <div class="grid-2col">
        <!-- Coluna TEA -->
        <div class="glass-card session-box tea-border">
          <div class="session-box-header">
            <div>
              <span class="badge badge-tea">🟣 Sessão em Sala TEA</span>
              <h3 class="session-box-title">{{ currentParticipant.byCondition.TEA?.roomName }}</h3>
            </div>
            <div class="session-time-pill mono">
              {{ currentParticipant.byCondition.TEA?.duracaoSegundos }}s 
              <small>({{ currentParticipant.byCondition.TEA?.duracaoMinutos }}m)</small>
            </div>
          </div>

          <!-- Métricas Chave em Números Grandes -->
          <div class="session-big-stats">
            <div class="stat-pill-box">
              <span class="stat-pill-num mono">{{ currentParticipant.byCondition.TEA?.totalIntents || 0 }}</span>
              <span class="stat-pill-label">Ações no TEA</span>
            </div>
            <div class="stat-pill-box">
              <span class="stat-pill-num mono">{{ currentParticipant.byCondition.TEA?.ratePerMinute || 0 }}</span>
              <span class="stat-pill-label">Ações / Minuto</span>
            </div>
          </div>

          <div class="intents-summary-list">
            <span class="stack-label">Ações Utilizadas nesta Sala ({{ Object.keys(currentParticipant.byCondition.TEA?.intentsDetalhadas || {}).length }} tipos):</span>
            <div class="chips-flex">
              <span 
                v-for="(count, intent) in currentParticipant.byCondition.TEA?.intentsDetalhadas" 
                :key="intent"
                class="intent-badge-pill"
              >
                {{ intent }} <strong class="mono">&times;{{ count }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Coluna TDAH -->
        <div class="glass-card session-box tdah-border">
          <div class="session-box-header">
            <div>
              <span class="badge badge-tdah">🔵 Sessão em Sala TDAH</span>
              <h3 class="session-box-title">{{ currentParticipant.byCondition.TDAH?.roomName }}</h3>
            </div>
            <div class="session-time-pill mono">
              {{ currentParticipant.byCondition.TDAH?.duracaoSegundos }}s 
              <small>({{ currentParticipant.byCondition.TDAH?.duracaoMinutos }}m)</small>
            </div>
          </div>

          <!-- Métricas Chave em Números Grandes -->
          <div class="session-big-stats">
            <div class="stat-pill-box">
              <span class="stat-pill-num mono">{{ currentParticipant.byCondition.TDAH?.totalIntents || 0 }}</span>
              <span class="stat-pill-label">Ações no TDAH</span>
            </div>
            <div class="stat-pill-box">
              <span class="stat-pill-num mono">{{ currentParticipant.byCondition.TDAH?.ratePerMinute || 0 }}</span>
              <span class="stat-pill-label">Ações / Minuto</span>
            </div>
          </div>

          <div class="intents-summary-list">
            <span class="stack-label">Ações Utilizadas nesta Sala ({{ Object.keys(currentParticipant.byCondition.TDAH?.intentsDetalhadas || {}).length }} tipos):</span>
            <div class="chips-flex">
              <span 
                v-for="(count, intent) in currentParticipant.byCondition.TDAH?.intentsDetalhadas" 
                :key="intent"
                class="intent-badge-pill"
              >
                {{ intent }} <strong class="mono">&times;{{ count }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- TABELA COMPARATIVA DE TODAS AS INTENTS DESTE PROFESSOR ESPECÍFICO -->
      <div class="glass-card teacher-intents-table-card">
        <div class="card-head">
          <h3 class="card-title">Comparação Direta: Quais Intents o Professor {{ currentParticipant.code }} Utilizou?</h3>
          <span class="card-subtitle">
            Tabela de confronto direto entre as ações tomadas na Sala TEA vs Sala TDAH por este professor
          </span>
        </div>

        <div class="data-table-wrapper" style="margin-top: 1.25rem;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ação / Intent</th>
                <th style="color: #c084fc;" class="text-right">Na Sala TEA</th>
                <th style="color: #22d3ee;" class="text-right">Na Sala TDAH</th>
                <th class="text-right">Total</th>
                <th>Diferença Comportamental</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in teacherIntentComparison" :key="item.intent">
                <td class="font-bold">
                  {{ item.label }}
                  <span class="mono text-muted text-xs">({{ item.intent }})</span>
                </td>
                <td class="mono font-bold text-right" style="color: #c084fc;">{{ item.teaCount }}</td>
                <td class="mono font-bold text-right" style="color: #22d3ee;">{{ item.tdahCount }}</td>
                <td class="mono font-bold text-right">{{ item.total }}</td>
                <td>
                  <span v-if="item.teaCount > 0 && item.tdahCount === 0" class="badge badge-tea">
                    🟣 Exclusivo TEA (+{{ item.teaCount }})
                  </span>
                  <span v-else-if="item.tdahCount > 0 && item.teaCount === 0" class="badge badge-tdah">
                    🔵 Exclusivo TDAH (+{{ item.tdahCount }})
                  </span>
                  <span v-else-if="item.teaCount === item.tdahCount" class="badge badge-subtle">
                    Equilibrado ({{ item.teaCount }})
                  </span>
                  <span v-else-if="item.teaCount > item.tdahCount" class="badge badge-tea">
                    +{{ item.teaCount - item.tdahCount }} no TEA
                  </span>
                  <span v-else class="badge badge-tdah">
                    +{{ item.tdahCount - item.teaCount }} no TDAH
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { INTENT_DEFINITIONS } from '../utils/taxonomy.js';

const props = defineProps({
  validParticipants: {
    type: Array,
    required: true
  }
});

const selectedCode = ref(props.validParticipants[0]?.code || '157722');

const currentParticipant = computed(() => {
  return props.validParticipants.find(p => p.code === selectedCode.value) || props.validParticipants[0];
});

const averageCadence = computed(() => {
  if (!currentParticipant.value) return '0.00';
  const sessions = currentParticipant.value.sessions || [];
  if (sessions.length === 0) return '0.00';
  const total = sessions.reduce((acc, s) => acc + s.ratePerMinute, 0);
  return (total / sessions.length).toFixed(2);
});

// Comparativo de todas as intents utilizadas por este professor específico
const teacherIntentComparison = computed(() => {
  if (!currentParticipant.value) return [];
  const teaIntents = currentParticipant.value.byCondition.TEA?.intentsDetalhadas || {};
  const tdahIntents = currentParticipant.value.byCondition.TDAH?.intentsDetalhadas || {};

  const allKeys = new Set([...Object.keys(teaIntents), ...Object.keys(tdahIntents)]);
  const result = [];

  for (const key of allKeys) {
    const teaCount = teaIntents[key] || 0;
    const tdahCount = tdahIntents[key] || 0;
    const def = INTENT_DEFINITIONS[key] || { label: key };
    result.push({
      intent: key,
      label: def.label,
      teaCount,
      tdahCount,
      total: teaCount + tdahCount
    });
  }

  return result.sort((a, b) => b.total - a.total);
});

const ARCHETYPES = {
  '157722': {
    shortTitle: 'Estilo: Alta Intervenção & Diretivo',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeColor: '#f87171'
  },
  '157730': {
    shortTitle: 'Estilo: Estruturante & Limites Firmes',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeColor: '#c084fc'
  },
  '327727': {
    shortTitle: 'Estilo: Adaptativo Situacional',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#fbbf24'
  },
  '327723': {
    shortTitle: 'Estilo: Observador & Intervenção Pontual',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeColor: '#22d3ee'
  }
};

const archetypeInfo = computed(() => {
  const code = currentParticipant.value?.code;
  return ARCHETYPES[code] || {
    shortTitle: 'Sujeito da Pesquisa',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: '#818cf8'
  };
});
</script>

<style scoped>
.participant-page {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.teacher-selector-card {
  padding: 1.5rem 2rem;
}

.selector-heading {
  font-size: 0.775rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 1rem;
  letter-spacing: 0.03em;
}

.teacher-pill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.teacher-select-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.25rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.85rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  position: relative;
}

.teacher-select-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.teacher-select-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
}

.teacher-avatar {
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.teacher-info-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.teacher-id-label {
  font-size: 0.95rem;
  font-weight: 800;
  color: white;
}

.teacher-sub-meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}

.active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-metrics-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.75rem 2rem;
}

.summary-meta-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-big {
  font-size: 2.75rem;
}

.teacher-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.teacher-name {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-primary);
}

.summary-kpis-right {
  display: flex;
  gap: 1.5rem;
}

.sum-kpi {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.85rem 1.35rem;
  border-radius: 0.75rem;
  text-align: center;
}

.sum-label {
  font-size: 0.7rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
}

.sum-val {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  display: block;
  margin-top: 0.2rem;
}

.session-box {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.85rem 2rem;
}

.session-box.tea-border { border-top: 4px solid #a855f7; }
.session-box.tdah-border { border-top: 4px solid #06b6d4; }

.session-box-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.session-box-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-top: 0.35rem;
}

.session-time-pill {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.session-big-stats {
  display: flex;
  gap: 1.25rem;
}

.stat-pill-box {
  flex: 1;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.stat-pill-num {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-primary);
  display: block;
}

.stat-pill-label {
  font-size: 0.775rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.stack-label {
  font-size: 0.775rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  display: block;
}

.chips-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.intent-badge-pill {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.75rem;
  border-radius: 0.55rem;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.text-right {
  text-align: right;
}

.text-xs {
  font-size: 0.7rem;
}
</style>
