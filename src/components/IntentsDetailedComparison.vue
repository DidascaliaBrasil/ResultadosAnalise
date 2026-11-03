<template>
  <div class="intents-detail-page">
    <!-- Banner de Resumo da Exclusividade das Intents -->
    <div class="glass-card header-banner">
      <div class="header-banner-text">
        <h2 class="section-title">Detalhamento Completo das 25 Intenções Docentes</h2>
        <p class="section-desc">
          Comparação quantitativa direta de cada ação pedagógica executada nas simulações em Realidade Virtual.
        </p>
      </div>

      <!-- 4 Cards Rápidos com Respiro -->
      <div class="intent-stat-cards">
        <div class="stat-card" :class="{ active: filterType === 'ALL' }" @click="filterType = 'ALL'">
          <span class="card-num mono">25</span>
          <span class="card-txt">Todas as Ações</span>
          <span class="card-sub mono">72 ocorrências</span>
        </div>

        <div class="stat-card tea" :class="{ active: filterType === 'TEA_ONLY' }" @click="filterType = 'TEA_ONLY'">
          <span class="card-num mono" style="color: #c084fc;">5</span>
          <span class="card-txt">Exclusivas de TEA</span>
          <span class="card-sub">Expulsão, Limites, etc.</span>
        </div>

        <div class="stat-card tdah" :class="{ active: filterType === 'TDAH_ONLY' }" @click="filterType = 'TDAH_ONLY'">
          <span class="card-num mono" style="color: #22d3ee;">8</span>
          <span class="card-txt">Exclusivas de TDAH</span>
          <span class="card-sub">Trabalhar, Autonomia, etc.</span>
        </div>

        <div class="stat-card both" :class="{ active: filterType === 'BOTH' }" @click="filterType = 'BOTH'">
          <span class="card-num mono" style="color: #34d399;">12</span>
          <span class="card-txt">Presentes em Ambas</span>
          <span class="card-sub">Elogios, Materiais, etc.</span>
        </div>
      </div>
    </div>

    <!-- Tabela Comparativa de Todas as Intents Exatas -->
    <div class="glass-card">
      <div class="table-controls-row">
        <h3 class="card-title">
          Tabela Comparativa Intent a Intent
          <span class="badge badge-subtle mono">{{ filteredIntentList.length }} ações listadas</span>
        </h3>

        <div class="search-wrap">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Filtrar por nome de intent..."
            class="filter-select"
            style="width: 250px;"
          />
        </div>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ação / Intent Docente</th>
              <th>Dimensão Comportamental</th>
              <th style="width: 260px;">Distribuição Visual (TEA vs TDAH)</th>
              <th style="color: #c084fc;" class="mono text-right">Qtd TEA</th>
              <th style="color: #22d3ee;" class="mono text-right">Qtd TDAH</th>
              <th class="mono text-right">Total</th>
              <th>Classificação na Pesquisa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="intent in filteredIntentList" :key="intent.key">
              <td>
                <div class="intent-title-cell">
                  <strong>{{ intent.label }}</strong>
                  <span class="mono text-muted text-xs">({{ intent.key }})</span>
                </div>
                <div class="intent-desc-small text-muted">{{ intent.description }}</div>
              </td>
              <td>
                <span class="badge" :style="{ background: intent.dimensionColor + '22', color: intent.dimensionColor }">
                  {{ intent.dimensionName }}
                </span>
              </td>
              <td>
                <!-- Barra Visual Dupla com Respiro -->
                <div class="dual-prog-track">
                  <div 
                    class="dual-prog-tea" 
                    :style="{ width: ((intent.teaCount / (intent.totalCount || 1)) * 100) + '%' }"
                    :title="`TEA: ${intent.teaCount}`"
                  ></div>
                  <div 
                    class="dual-prog-tdah" 
                    :style="{ width: ((intent.tdahCount / (intent.totalCount || 1)) * 100) + '%' }"
                    :title="`TDAH: ${intent.tdahCount}`"
                  ></div>
                </div>
              </td>
              <td class="mono font-bold text-right" style="color: #c084fc;">{{ intent.teaCount }}</td>
              <td class="mono font-bold text-right" style="color: #22d3ee;">{{ intent.tdahCount }}</td>
              <td class="mono font-bold text-right">{{ intent.totalCount }}</td>
              <td>
                <span v-if="intent.isExclusiveTea" class="badge badge-tea">🟣 Apenas no TEA</span>
                <span v-else-if="intent.isExclusiveTdah" class="badge badge-tdah">🔵 Apenas no TDAH</span>
                <span v-else-if="intent.totalCount > 0" class="badge badge-valid">Presente em Ambas</span>
                <span v-else class="badge badge-discarded">Não Utilizada</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  intentComparison: {
    type: Array,
    required: true
  }
});

const filterType = ref('ALL');
const searchTerm = ref('');

const filteredIntentList = computed(() => {
  return props.intentComparison.filter(i => {
    // Filtro por exclusividade
    if (filterType.value === 'TEA_ONLY' && !i.isExclusiveTea) return false;
    if (filterType.value === 'TDAH_ONLY' && !i.isExclusiveTdah) return false;
    if (filterType.value === 'BOTH' && (i.isExclusiveTea || i.isExclusiveTdah || i.totalCount === 0)) return false;

    // Busca textual
    if (searchTerm.value && searchTerm.value.trim() !== '') {
      const q = searchTerm.value.toLowerCase().trim();
      const match = 
        i.label.toLowerCase().includes(q) ||
        i.key.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.dimensionName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
});
</script>

<style scoped>
.intents-detail-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-banner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
}

.section-desc {
  font-size: 0.885rem;
  color: var(--text-secondary);
  margin-top: 0.35rem;
}

.intent-stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.85rem;
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.stat-card.active {
  border-color: var(--accent-primary);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.stat-card.tea.active {
  border-color: #a855f7;
  box-shadow: 0 4px 14px rgba(168, 85, 247, 0.35);
}

.stat-card.tdah.active {
  border-color: #06b6d4;
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
}

.card-num {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.card-txt {
  font-size: 0.85rem;
  font-weight: 750;
  color: var(--text-primary);
}

.card-sub {
  font-size: 0.725rem;
  color: var(--text-muted);
}

.table-controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.intent-title-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.intent-desc-small {
  font-size: 0.75rem;
  margin-top: 0.2rem;
  max-width: 380px;
}

.dual-prog-track {
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.dual-prog-tea {
  background: #a855f7;
  height: 100%;
}

.dual-prog-tdah {
  background: #06b6d4;
  height: 100%;
}

.text-right {
  text-align: right;
}

.text-xs {
  font-size: 0.7rem;
}
</style>

