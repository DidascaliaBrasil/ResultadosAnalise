<template>
  <div class="app-layout">
    <!-- Menu Lateral com Respiro e Sem Badges Sobrepostos -->
    <AppSidebar 
      :current-tab="activeTab"
      @update:tab="activeTab = $event"
    />

    <!-- Área Principal de Conteúdo -->
    <div class="app-main">
      <!-- TopBar com Título e Ações de Exportação -->
      <AppTopBar 
        :current-tab="activeTab"
        :is-light="isLight"
        @toggle-theme="toggleTheme"
        @export-csv="handleExportAllCSV"
        @export-json="handleExportAllJSON"
        @load-custom-json="handleCustomJson"
      />

      <!-- Viewport Principal com Espaçamento Amplo -->
      <div class="content-viewport">
        <!-- Barra de Filtros Funcional e Reativa (Professor, Sala, Dimensão, Validação) -->
        <FilterToolbar 
          v-model:participant-code="filters.participantCode"
          v-model:condition="filters.condition"
          v-model:dimension="filters.dimension"
          :only-valid="filters.onlyValid"
          @toggle-validity="filters.onlyValid = !filters.onlyValid"
          @reset-filters="resetFilters"
        />

        <!-- Cards de Métricas Principais (KPIs com barras de proporção) -->
        <KpiMetrics 
          v-if="processedData.isValid"
          :summary="processedData.summary"
          :tea-stats="processedData.teaStats"
          :tdah-stats="processedData.tdahStats"
        />

        <main>
          <transition name="fade" mode="out-in">
            <!-- Aba 1: Comparativo Experimental TEA vs TDAH -->
            <div v-if="activeTab === 'comparison'" key="comparison">
              <ComparisonTeaTdah 
                v-if="processedData.teaStats && processedData.tdahStats"
                :tea-stats="processedData.teaStats"
                :tdah-stats="processedData.tdahStats"
                :valid-participants="processedData.validParticipants"
              />
            </div>

            <!-- Aba 2: Quais Intents Foram Utilizadas (Detalhamento Completo das 25 Intents) -->
            <div v-else-if="activeTab === 'intents'" key="intents">
              <IntentsDetailedComparison 
                :intent-comparison="processedData.intentComparison"
              />
            </div>

            <!-- Aba 3: Perfil por Professor -->
            <div v-else-if="activeTab === 'profiles'" key="profiles">
              <ParticipantProfile 
                v-if="processedData.validParticipants.length > 0"
                :valid-participants="processedData.validParticipants"
              />
            </div>

            <!-- Aba 4: Linha do Tempo VR & Conflitos do Facilitador -->
            <div v-else-if="activeTab === 'timeline'" key="timeline">
              <SessionTimeline 
                :sessions="processedData.filteredSessions"
              />
            </div>

            <!-- Aba 5: Tabela de Dados Completa & Exportação CSV -->
            <div v-else-if="activeTab === 'table'" key="table">
              <RawDataTable 
                :sessions="processedData.filteredSessions"
              />
            </div>

            <!-- Aba 6: Auditoria Metodológica & Descartes -->
            <div v-else-if="activeTab === 'audit'" key="audit">
              <AuditInspector 
                :audit-users="processedData.auditUsers"
                :discarded-sessions="processedData.discardedSessions"
              />
            </div>
          </transition>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import defaultRawData from './data/defaultData.json';
import { processResearchData } from './utils/dataProcessor.js';
import { exportSessionsToCSV, exportCleanedJSON } from './utils/exportUtils.js';

import AppSidebar from './components/AppSidebar.vue';
import AppTopBar from './components/AppTopBar.vue';
import FilterToolbar from './components/FilterToolbar.vue';
import KpiMetrics from './components/KpiMetrics.vue';
import ComparisonTeaTdah from './components/ComparisonTeaTdah.vue';
import IntentsDetailedComparison from './components/IntentsDetailedComparison.vue';
import ParticipantProfile from './components/ParticipantProfile.vue';
import SessionTimeline from './components/SessionTimeline.vue';
import RawDataTable from './components/RawDataTable.vue';
import AuditInspector from './components/AuditInspector.vue';

const rawData = ref(defaultRawData);
const isLight = ref(false);
const activeTab = ref('comparison');

// Filtros Globais 100% Reativos
const filters = ref({
  condition: 'ALL',
  participantCode: 'ALL',
  dimension: 'ALL',
  onlyValid: true,
  search: ''
});

function resetFilters() {
  filters.value = {
    condition: 'ALL',
    participantCode: 'ALL',
    dimension: 'ALL',
    onlyValid: true,
    search: ''
  };
}

// Recomputação instantânea de todo o dataset ao alterar qualquer filtro
const processedData = computed(() => {
  return processResearchData(rawData.value, filters.value);
});

function toggleTheme() {
  isLight.value = !isLight.value;
  if (isLight.value) {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
}

function handleExportAllCSV() {
  exportSessionsToCSV(processedData.value.filteredSessions, 'didascalias_dados_filtrados.csv');
}

function handleExportAllJSON() {
  exportCleanedJSON(processedData.value.filteredSessions, 'didascalias_dados_filtrados.json');
}

function handleCustomJson(newJson) {
  rawData.value = newJson;
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
</style>
