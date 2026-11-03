<template>
  <header class="app-topbar no-print">
    <div class="topbar-left">
      <div class="view-indicator">
        <span class="view-title">{{ viewTitle }}</span>
      </div>
    </div>

    <!-- Ações e Controles -->
    <div class="topbar-right">
      <!-- Menu de Exportação Animado (Dropdown) -->
      <div class="export-dropdown-wrapper" ref="exportDropdownRef">
        <button class="btn btn-primary btn-sm" @click="toggleExportMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar Relatório
          <svg class="chevron-mini" :class="{ open: exportMenuOpen }" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <transition name="fade">
          <div v-if="exportMenuOpen" class="dropdown-menu">
            <button class="dropdown-item" @click="selectExport('csv')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Planilha CSV (Excel &amp; SPSS)
            </button>
            <button class="dropdown-item" @click="selectExport('json')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
              Dataset Filtrado (JSON)
            </button>
            <button class="dropdown-item" @click="selectExport('pdf')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimir / PDF
            </button>
          </div>
        </transition>
      </div>

      <!-- Importar JSON -->
      <label class="btn btn-secondary btn-sm" title="Carregar outro arquivo JSON">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Upload JSON</span>
        <input type="file" accept=".json" @change="onFileChange" style="display: none;" />
      </label>

      <!-- Alternador de Tema -->
      <button class="btn-icon" :title="isLight ? 'Modo Escuro' : 'Modo Claro'" @click="$emit('toggle-theme')">
        <span v-if="isLight">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  currentTab: {
    type: String,
    required: true
  },
  isLight: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'toggle-theme',
  'export-csv',
  'export-json',
  'load-custom-json'
]);

const exportMenuOpen = ref(false);
const exportDropdownRef = ref(null);

const viewTitles = {
  comparison: 'Comparativo Experimental: Sala TEA vs TDAH',
  intents: 'Detalhamento de Todas as 25 Intenções Docentes',
  profiles: 'Perfil Pedagógico Individual por Professor',
  timeline: 'Linha do Tempo das Sessões & Conflitos do Facilitador',
  table: 'Base de Dados Tabular das Simulações',
  audit: 'Auditoria Metodológica & Descartes'
};

const viewTitle = computed(() => viewTitles[props.currentTab] || 'Didascálias Analytics');

function toggleExportMenu() {
  exportMenuOpen.value = !exportMenuOpen.value;
}

function selectExport(type) {
  exportMenuOpen.value = false;
  if (type === 'csv') emit('export-csv');
  else if (type === 'json') emit('export-json');
  else if (type === 'pdf') window.print();
}

function handleClickOutside(event) {
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target)) {
    exportMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      emit('load-custom-json', parsed);
    } catch (err) {
      alert('Erro ao interpretar o arquivo JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}
</script>

<style scoped>
.topbar-left {
  display: flex;
  align-items: center;
}

.view-indicator {
  display: flex;
  align-items: center;
}

.view-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.export-dropdown-wrapper {
  position: relative;
}

.chevron-mini {
  transition: transform 0.2s ease;
}

.chevron-mini.open {
  transform: rotate(180deg);
}
</style>
