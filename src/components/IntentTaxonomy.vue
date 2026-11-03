<template>
  <div class="taxonomy-page">
    <!-- Seletor Interativo das 5 Dimensões com Contadores Visuais -->
    <div class="dimension-chips-grid">
      <button 
        class="dim-chip-btn"
        :class="{ active: selectedDimension === null }"
        @click="selectedDimension = null"
      >
        <span class="dim-chip-title">Todas as Ações</span>
        <span class="dim-chip-count mono">72 total</span>
        <div class="dim-chip-bar" style="background: #6366f1;"></div>
      </button>

      <button 
        v-for="dim in dimensionSummary" 
        :key="dim.id"
        class="dim-chip-btn"
        :class="{ active: selectedDimension === dim.id }"
        @click="selectedDimension = selectedDimension === dim.id ? null : dim.id"
      >
        <span class="dim-chip-title">{{ dim.shortName }}</span>
        <span class="dim-chip-count mono">{{ dim.count }} <small>({{ dim.percentage }}%)</small></span>
        <div class="dim-chip-bar" :style="{ background: dim.color }"></div>
      </button>
    </div>

    <!-- Gráficos Visuais Principais -->
    <div class="grid-2col">
      <!-- Donut Proporcional -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Proporção das Dimensões</h3>
          <span class="card-subtitle">Balanço comportamental global</span>
        </div>
        <div class="chart-container" style="min-height: 280px;">
          <canvas ref="donutCanvas"></canvas>
        </div>
      </div>

      <!-- Ranking Visual por Intenção -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Top Intenções Docentes</h3>
          <span class="card-subtitle">Segregado por Sala TEA e TDAH</span>
        </div>
        <div class="chart-container" style="min-height: 280px;">
          <canvas ref="barCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Lista Filtrável de Ações com Acordeão Interativo -->
    <div class="glass-card">
      <div class="list-head-row">
        <div>
          <h3 class="card-title">Catálogo Interativo de Ações</h3>
          <span class="card-subtitle">
            Mostrando <strong>{{ filteredIntents.length }}</strong> ações
            <span v-if="selectedDimension"> filtradas por dimensão</span>
          </span>
        </div>
        <div class="condition-legend-small">
          <span class="badge badge-tea">🟣 TEA</span>
          <span class="badge badge-tdah">🔵 TDAH</span>
        </div>
      </div>

      <div class="intent-cards-grid">
        <div 
          v-for="intent in filteredIntents" 
          :key="intent.key"
          class="intent-item-card"
        >
          <div class="intent-item-header">
            <div>
              <span class="intent-main-name">{{ intent.label }}</span>
              <span class="badge" :style="{ background: intent.dimensionColor + '20', color: intent.dimensionColor }">
                {{ intent.dimensionName }}
              </span>
            </div>
            <div class="intent-count-box mono">
              {{ intent.count }} <small>ações</small>
            </div>
          </div>

          <!-- Barra Visual de Divisão TEA vs TDAH -->
          <div class="intent-split-bar">
            <div 
              class="intent-bar-tea" 
              :style="{ width: ((intent.teaCount / intent.count) * 100) + '%' }"
              :title="`TEA: ${intent.teaCount}`"
            ></div>
            <div 
              class="intent-bar-tdah" 
              :style="{ width: ((intent.tdahCount / intent.count) * 100) + '%' }"
              :title="`TDAH: ${intent.tdahCount}`"
            ></div>
          </div>

          <div class="intent-item-footer">
            <span class="intent-desc-text">{{ intent.description }}</span>
            <div class="intent-counts-tag mono">
              <span style="color: #c084fc;">TEA: {{ intent.teaCount }}</span>
              <span style="color: #22d3ee;">TDAH: {{ intent.tdahCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { DIMENSIONS } from '../utils/taxonomy.js';

Chart.register(...registerables);

const props = defineProps({
  sortedIntents: {
    type: Array,
    required: true
  },
  teaStats: {
    type: Object,
    required: true
  },
  tdahStats: {
    type: Object,
    required: true
  }
});

const selectedDimension = ref(null);
const donutCanvas = ref(null);
const barCanvas = ref(null);
let donutChartInstance = null;
let barChartInstance = null;

const dimensionSummary = computed(() => {
  const total = (props.teaStats?.totalIntents || 0) + (props.tdahStats?.totalIntents || 0) || 1;
  return Object.values(DIMENSIONS).map(dim => {
    const tea = props.teaStats?.dimensionTotals[dim.id] || 0;
    const tdah = props.tdahStats?.dimensionTotals[dim.id] || 0;
    const count = tea + tdah;
    const percentage = Math.round((count / total) * 100);
    return {
      ...dim,
      count,
      percentage
    };
  });
});

const filteredIntents = computed(() => {
  if (!selectedDimension.value) return props.sortedIntents;
  return props.sortedIntents.filter(i => i.dimensionId === selectedDimension.value);
});

function initCharts() {
  nextTick(() => {
    renderDonutChart();
    renderBarChart();
  });
}

function renderDonutChart() {
  if (!donutCanvas.value) return;
  if (donutChartInstance) donutChartInstance.destroy();

  const labels = Object.values(DIMENSIONS).map(d => d.shortName);
  const data = Object.values(DIMENSIONS).map(d => {
    const tea = props.teaStats?.dimensionTotals[d.id] || 0;
    const tdah = props.tdahStats?.dimensionTotals[d.id] || 0;
    return tea + tdah;
  });
  const backgroundColors = Object.values(DIMENSIONS).map(d => d.color);

  donutChartInstance = new Chart(donutCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#131b2e'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', size: 11, weight: '700' } }
        }
      },
      cutout: '70%'
    }
  });
}

function renderBarChart() {
  if (!barCanvas.value) return;
  if (barChartInstance) barChartInstance.destroy();

  const topIntents = filteredIntents.value.slice(0, 8);
  const labels = topIntents.map(i => i.label);
  const teaData = topIntents.map(i => i.teaCount);
  const tdahData = topIntents.map(i => i.tdahCount);

  barChartInstance = new Chart(barCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'TEA',
          data: teaData,
          backgroundColor: '#a855f7',
          borderRadius: 4
        },
        {
          label: 'TDAH',
          data: tdahData,
          backgroundColor: '#06b6d4',
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: { color: '#64748b' }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
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
  initCharts();
});

watch([selectedDimension, () => props.sortedIntents], () => {
  initCharts();
});
</script>

<style scoped>
.taxonomy-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dimension-chips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
}

.dim-chip-btn {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.dim-chip-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.dim-chip-btn.active {
  border-color: var(--accent-primary);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.dim-chip-title {
  font-size: 0.8rem;
  font-weight: 750;
  color: var(--text-primary);
}

.dim-chip-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.dim-chip-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.list-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.condition-legend-small {
  display: flex;
  gap: 0.5rem;
}

.intent-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.85rem;
}

.intent-item-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.9rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: all 0.2s ease;
}

.intent-item-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.intent-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.intent-main-name {
  font-size: 0.875rem;
  font-weight: 750;
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.intent-count-box {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.intent-split-bar {
  height: 5px;
  background: var(--bg-card);
  border-radius: 2.5px;
  display: flex;
  overflow: hidden;
}

.intent-bar-tea {
  background: #a855f7;
  height: 100%;
}

.intent-bar-tdah {
  background: #06b6d4;
  height: 100%;
}

.intent-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.intent-desc-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

.intent-counts-tag {
  font-size: 0.725rem;
  font-weight: 700;
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}
</style>
