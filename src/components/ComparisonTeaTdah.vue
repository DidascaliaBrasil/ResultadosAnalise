<template>
  <div class="comparison-page">
    <!-- 4 Indicadores Visuais Imediatos com Respiro Amplo -->
    <div class="grid-kpi">
      <!-- Indicador 1: Gestão Disciplinar -->
      <div class="glass-card glance-card">
        <span class="glance-label">Gestão Disciplinar / Limites</span>
        <div class="glance-values">
          <span class="val-tea mono">{{ teaStats?.dimensionTotals?.GESTAO_DISCIPLINAR || 0 }}</span>
          <span class="vs-text">vs</span>
          <span class="val-tdah mono">{{ tdahStats?.dimensionTotals?.GESTAO_DISCIPLINAR || 0 }}</span>
        </div>
        <div class="dual-bar-track">
          <div class="dual-bar-tea" style="width: 70%;"></div>
          <div class="dual-bar-tdah" style="width: 30%;"></div>
        </div>
        <div class="glance-badge-row">
          <span class="badge badge-tea">+133% no TEA</span>
          <span class="text-xs text-muted">Expulsão e limites</span>
        </div>
      </div>

      <!-- Indicador 2: Mediação e Conflito -->
      <div class="glass-card glance-card">
        <span class="glance-label">Mediação &amp; Conflitos</span>
        <div class="glance-values">
          <span class="val-tea mono">{{ teaStats?.dimensionTotals?.MEDIACAO_CONFLITO || 0 }}</span>
          <span class="vs-text">vs</span>
          <span class="val-tdah mono">{{ tdahStats?.dimensionTotals?.MEDIACAO_CONFLITO || 0 }}</span>
        </div>
        <div class="dual-bar-track">
          <div class="dual-bar-tea" style="width: 35%;"></div>
          <div class="dual-bar-tdah" style="width: 65%;"></div>
        </div>
        <div class="glance-badge-row">
          <span class="badge badge-tdah">+85% no TDAH</span>
          <span class="text-xs text-muted">Disputa de materiais</span>
        </div>
      </div>

      <!-- Indicador 3: Duração Média da Simulação -->
      <div class="glass-card glance-card">
        <span class="glance-label">Tempo Médio em Sala</span>
        <div class="glance-values">
          <span class="val-tea mono">{{ teaStats?.meanDurationSec || 0 }}s</span>
          <span class="vs-text">vs</span>
          <span class="val-tdah mono">{{ tdahStats?.meanDurationSec || 0 }}s</span>
        </div>
        <div class="dual-bar-track">
          <div class="dual-bar-tea" style="width: 42%;"></div>
          <div class="dual-bar-tdah" style="width: 58%;"></div>
        </div>
        <div class="glance-badge-row">
          <span class="badge badge-tdah">+35% mais longo</span>
          <span class="text-xs text-muted">TDAH demandou mais tempo</span>
        </div>
      </div>

      <!-- Indicador 4: Reforço Positivo -->
      <div class="glass-card glance-card">
        <span class="glance-label">Reforço &amp; Suporte</span>
        <div class="glance-values">
          <span class="val-tea mono">{{ teaStats?.dimensionTotals?.REFORCO_APOIO || 0 }}</span>
          <span class="vs-text">vs</span>
          <span class="val-tdah mono">{{ tdahStats?.dimensionTotals?.REFORCO_APOIO || 0 }}</span>
        </div>
        <div class="dual-bar-track">
          <div class="dual-bar-tea" style="width: 43%;"></div>
          <div class="dual-bar-tdah" style="width: 57%;"></div>
        </div>
        <div class="glance-badge-row">
          <span class="badge badge-tdah">+33% no TDAH</span>
          <span class="text-xs text-muted">Elogios e encorajamento</span>
        </div>
      </div>
    </div>

    <!-- Seção: QUAIS INTENTS FIZERAM A DIFERENÇA (Exatamente as ações individuais) -->
    <div class="glass-card intent-divergence-card">
      <div class="divergence-header">
        <div>
          <h3 class="card-title">Quais Intents Fizeram a Diferença entre TEA e TDAH?</h3>
          <span class="card-subtitle">
            Ações individuais que ocorreram com exclusividade ou grande divergência entre as duas salas
          </span>
        </div>
      </div>

      <div class="grid-2col" style="margin-top: 1.5rem; margin-bottom: 0;">
        <!-- Coluna: Exclusivas do TEA -->
        <div class="divergence-col tea-box">
          <div class="col-header-pill tea-header">
            <span class="badge badge-tea">🟣 Ações Exclusivas do TEA (Ocorreram SOMENTE no TEA)</span>
          </div>
          <div class="exclusive-intents-list">
            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Expulsão de Sala</strong>
                <span class="mono text-muted text-xs">Expulsão</span>
              </div>
              <span class="intent-qty-tag mono tea-qty">2 ocorrências</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Estabelecer Limites</strong>
                <span class="mono text-muted text-xs">EstabelecerLimites</span>
              </div>
              <span class="intent-qty-tag mono tea-qty">2 ocorrências</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Advertência Verbal</strong>
                <span class="mono text-muted text-xs">Advertencia</span>
              </div>
              <span class="intent-qty-tag mono tea-qty">1 ocorrência</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Pausar Aula</strong>
                <span class="mono text-muted text-xs">PausarAula</span>
              </div>
              <span class="intent-qty-tag mono tea-qty">1 ocorrência</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Adiar Discussão</strong>
                <span class="mono text-muted text-xs">Adiar</span>
              </div>
              <span class="intent-qty-tag mono tea-qty">1 ocorrência</span>
            </div>
          </div>
        </div>

        <!-- Coluna: Exclusivas do TDAH -->
        <div class="divergence-col tdah-box">
          <div class="col-header-pill tdah-header">
            <span class="badge badge-tdah">🔵 Ações Exclusivas do TDAH (Ocorreram SOMENTE no TDAH)</span>
          </div>
          <div class="exclusive-intents-list">
            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Conclamar ao Trabalho</strong>
                <span class="mono text-muted text-xs">Trabalhar</span>
              </div>
              <span class="intent-qty-tag mono tdah-qty">3 ocorrências</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Incentivar Autonomia</strong>
                <span class="mono text-muted text-xs">IncentivarAutonomia</span>
              </div>
              <span class="intent-qty-tag mono tdah-qty">2 ocorrências</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Parar Conflito Direto</strong>
                <span class="mono text-muted text-xs">PararConflito</span>
              </div>
              <span class="intent-qty-tag mono tdah-qty">2 ocorrências</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Pedir Silêncio</strong>
                <span class="mono text-muted text-xs">Silencio</span>
              </div>
              <span class="intent-qty-tag mono tdah-qty">1 ocorrência</span>
            </div>

            <div class="exclusive-intent-item">
              <div class="intent-meta">
                <strong>Pedir para Sentar</strong>
                <span class="mono text-muted text-xs">Sentarse</span>
              </div>
              <span class="intent-qty-tag mono tdah-qty">1 ocorrência</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Área de Gráficos: Radar e Barras Agrupadas -->
    <div class="grid-2col">
      <!-- Radar das 5 Dimensões -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Polígono de Dimensões Pedagógicas</h3>
          <span class="card-subtitle">Sobreposição do perfil comportamental médio</span>
        </div>
        <div class="chart-container" style="min-height: 360px;">
          <canvas ref="radarCanvas"></canvas>
        </div>
      </div>

      <!-- Barras Pareadas por Professor -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Intervenções por Professor (TEA vs TDAH)</h3>
          <span class="card-subtitle">Comparativo pareado dos professores nas duas salas</span>
        </div>
        <div class="chart-container" style="min-height: 360px;">
          <canvas ref="barCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { DIMENSIONS } from '../utils/taxonomy.js';

Chart.register(...registerables);

const props = defineProps({
  teaStats: {
    type: Object,
    required: true
  },
  tdahStats: {
    type: Object,
    required: true
  },
  validParticipants: {
    type: Array,
    required: true
  }
});

const radarCanvas = ref(null);
const barCanvas = ref(null);
let radarChartInstance = null;
let barChartInstance = null;

function renderCharts() {
  nextTick(() => {
    renderRadar();
    renderBars();
  });
}

function renderRadar() {
  if (!radarCanvas.value) return;
  if (radarChartInstance) radarChartInstance.destroy();

  const labels = Object.values(DIMENSIONS).map(d => d.shortName);
  const teaData = Object.values(DIMENSIONS).map(d => props.teaStats?.dimensionTotals?.[d.id] || 0);
  const tdahData = Object.values(DIMENSIONS).map(d => props.tdahStats?.dimensionTotals?.[d.id] || 0);

  radarChartInstance = new Chart(radarCanvas.value, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Sala TEA (Autismo)',
          data: teaData,
          fill: true,
          backgroundColor: 'rgba(168, 85, 247, 0.25)',
          borderColor: '#a855f7',
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#fff',
          pointRadius: 4,
          borderWidth: 2.5
        },
        {
          label: 'Sala TDAH (Hiperatividade)',
          data: tdahData,
          fill: true,
          backgroundColor: 'rgba(6, 182, 212, 0.25)',
          borderColor: '#06b6d4',
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          pointRadius: 4,
          borderWidth: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            font: { size: 12, family: 'Plus Jakarta Sans', weight: '700' },
            color: '#94a3b8'
          },
          ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 3 }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', weight: '700' } }
        }
      }
    }
  });
}

function renderBars() {
  if (!barCanvas.value) return;
  if (barChartInstance) barChartInstance.destroy();

  const labels = props.validParticipants.map(p => `Prof. ${p.code}`);
  const teaValues = props.validParticipants.map(p => p.byCondition.TEA?.totalIntents || 0);
  const tdahValues = props.validParticipants.map(p => p.byCondition.TDAH?.totalIntents || 0);

  barChartInstance = new Chart(barCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Intenções no TEA',
          data: teaValues,
          backgroundColor: '#a855f7',
          borderRadius: 6
        },
        {
          label: 'Intenções no TDAH',
          data: tdahValues,
          backgroundColor: '#06b6d4',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '700' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: { color: '#64748b', stepSize: 4 }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', weight: '700' } }
        }
      }
    }
  });
}

onMounted(() => {
  renderCharts();
});

watch(() => [props.teaStats, props.tdahStats, props.validParticipants], () => {
  renderCharts();
}, { deep: true });
</script>

<style scoped>
.comparison-page {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.glance-card {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
}

.glance-label {
  font-size: 0.775rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
}

.glance-values {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  margin: 0.65rem 0 1rem 0;
}

.val-tea {
  font-size: 1.85rem;
  font-weight: 800;
  color: #c084fc;
}

.val-tdah {
  font-size: 1.85rem;
  font-weight: 800;
  color: #22d3ee;
}

.vs-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.dual-bar-track {
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.dual-bar-tea {
  background: #a855f7;
  height: 100%;
}

.dual-bar-tdah {
  background: #06b6d4;
  height: 100%;
}

.glance-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.intent-divergence-card {
  padding: 1.85rem 2rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  display: block;
}

.divergence-col {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.85rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divergence-col.tea-box {
  border-top: 4px solid #a855f7;
}

.divergence-col.tdah-box {
  border-top: 4px solid #06b6d4;
}

.exclusive-intents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exclusive-intent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
}

.intent-meta {
  display: flex;
  flex-direction: column;
}

.intent-meta strong {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.intent-qty-tag {
  font-size: 0.775rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 0.45rem;
}

.tea-qty {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.tdah-qty {
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
}

.text-xs {
  font-size: 0.7rem;
}
</style>
