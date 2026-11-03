<template>
  <section class="grid-kpi">
    <!-- Card 1: Sujeitos Válidos -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Sujeitos Válidos</span>
        <div class="kpi-icon-pill" style="color: #818cf8; background: rgba(99, 102, 241, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ summary.totalValidParticipants }}</div>
      <!-- Barra Visual dos Sujeitos -->
      <div class="visual-progress-track">
        <div class="visual-progress-fill" style="width: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div>
      </div>
      <div class="kpi-bottom-tags">
        <span class="micro-tag mono">157722</span>
        <span class="micro-tag mono">157730</span>
        <span class="micro-tag mono">327727</span>
        <span class="micro-tag mono">327723</span>
      </div>
    </div>

    <!-- Card 2: Sessões Pareadas -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Sessões em VR</span>
        <div class="kpi-icon-pill" style="color: #c084fc; background: rgba(139, 92, 246, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ summary.totalValidSessions }}</div>
      <!-- Barra Visual Pareada 50% TEA / 50% TDAH -->
      <div class="visual-progress-track split">
        <div class="visual-progress-fill" style="width: 50%; background: #a855f7;"></div>
        <div class="visual-progress-fill" style="width: 50%; background: #06b6d4;"></div>
      </div>
      <div class="kpi-bottom-tags space-between">
        <span class="badge badge-tea">4 TEA</span>
        <span class="badge badge-tdah">4 TDAH</span>
      </div>
    </div>

    <!-- Card 3: Ações Docentes Registradas -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Ações Pedagógicas</span>
        <div class="kpi-icon-pill" style="color: #34d399; background: rgba(16, 185, 129, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ summary.totalValidIntents }}</div>
      <!-- Barra Visual de Proporção de Ações: TEA 44% / TDAH 56% -->
      <div class="visual-progress-track split">
        <div class="visual-progress-fill" :style="{ width: teaPercentage + '%', background: '#a855f7' }"></div>
        <div class="visual-progress-fill" :style="{ width: tdahPercentage + '%', background: '#06b6d4' }"></div>
      </div>
      <div class="kpi-bottom-tags space-between">
        <span class="text-xs font-bold" style="color: #c084fc;">TEA: {{ teaStats?.totalIntents || 0 }} ({{ teaPercentage }}%)</span>
        <span class="text-xs font-bold" style="color: #22d3ee;">TDAH: {{ tdahStats?.totalIntents || 0 }} ({{ tdahPercentage }}%)</span>
      </div>
    </div>

    <!-- Card 4: Tempo Imersivo em VR -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Tempo em Simulação</span>
        <div class="kpi-icon-pill" style="color: #22d3ee; background: rgba(6, 182, 212, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ totalMinutesFormatted }}</div>
      <div class="visual-progress-track">
        <div class="visual-progress-fill" style="width: 100%; background: linear-gradient(90deg, #06b6d4, #10b981);"></div>
      </div>
      <div class="kpi-bottom-tags space-between">
        <span class="text-xs text-muted">Média: {{ meanSessionMinutes }} min / sessão</span>
        <span class="micro-tag mono">{{ summary.totalValidDurationSec }}s</span>
      </div>
    </div>

    <!-- Card 5: Cadência Média -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Cadência de Ações</span>
        <div class="kpi-icon-pill" style="color: #fbbf24; background: rgba(245, 158, 11, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ summary.overallMeanRatePerMinute }} <small class="text-xs text-muted">/min</small></div>
      <div class="visual-progress-track">
        <div class="visual-progress-fill" style="width: 65%; background: #f59e0b;"></div>
      </div>
      <div class="kpi-bottom-tags space-between">
        <span class="text-xs font-bold" style="color: #c084fc;">TEA: {{ teaStats?.meanRatePerMinute || 0 }}/m</span>
        <span class="text-xs font-bold" style="color: #22d3ee;">TDAH: {{ tdahStats?.meanRatePerMinute || 0 }}/m</span>
      </div>
    </div>

    <!-- Card 6: Integridade do Filtro -->
    <div class="glass-card kpi-card">
      <div class="kpi-top-row">
        <span class="kpi-label">Amostra Limpa</span>
        <div class="kpi-icon-pill" style="color: #34d399; background: rgba(16, 185, 129, 0.15);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
      </div>
      <div class="kpi-main-val mono">{{ validPercentage }}%</div>
      <div class="visual-progress-track">
        <div class="visual-progress-fill" :style="{ width: validPercentage + '%', background: '#10b981' }"></div>
      </div>
      <div class="kpi-bottom-tags space-between">
        <span class="badge badge-valid">8 Válidas</span>
        <span class="badge badge-discarded">{{ summary.totalDiscardedSessions }} Descartadas</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  summary: {
    type: Object,
    required: true
  },
  teaStats: {
    type: Object,
    default: null
  },
  tdahStats: {
    type: Object,
    default: null
  }
});

const totalMinutesFormatted = computed(() => {
  const min = (props.summary.totalValidDurationSec / 60).toFixed(1);
  return `${min} min`;
});

const meanSessionMinutes = computed(() => {
  if (!props.summary.totalValidSessions) return '0.0';
  const avgSec = props.summary.totalValidDurationSec / props.summary.totalValidSessions;
  return (avgSec / 60).toFixed(1);
});

const validPercentage = computed(() => {
  if (!props.summary.totalAllSessions) return 0;
  return Math.round((props.summary.totalValidSessions / props.summary.totalAllSessions) * 100);
});

const teaPercentage = computed(() => {
  const total = props.summary.totalValidIntents || 1;
  const tea = props.teaStats?.totalIntents || 0;
  return Math.round((tea / total) * 100);
});

const tdahPercentage = computed(() => {
  return 100 - teaPercentage.value;
});
</script>

<style scoped>
.kpi-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.35rem;
  background: var(--bg-card);
  position: relative;
  overflow: hidden;
}

.kpi-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-label {
  font-size: 0.75rem;
  font-weight: 750;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kpi-icon-pill {
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-main-val {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.4rem 0 0.5rem 0;
  line-height: 1;
}

.visual-progress-track {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-subtle);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.visual-progress-track.split {
  display: flex;
}

.visual-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.kpi-bottom-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.kpi-bottom-tags.space-between {
  justify-content: space-between;
}

.micro-tag {
  background: var(--bg-subtle);
  color: var(--text-primary);
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
}

.text-xs {
  font-size: 0.725rem;
}

.font-bold {
  font-weight: 700;
}
</style>
