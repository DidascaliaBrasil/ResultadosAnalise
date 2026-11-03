<template>
  <header class="app-header glass-card">
    <div class="header-main">
      <div class="brand">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <div>
          <div class="brand-title-row">
            <h1 class="brand-title">Didascálias Analytics</h1>
            <span class="badge badge-tea">VR Research Lab</span>
            <span class="badge badge-valid">v2.0</span>
          </div>
          <p class="brand-subtitle">
            Plataforma de Análise Científica de Simulação Pedagógica em Realidade Virtual (TEA &amp; TDAH)
          </p>
        </div>
      </div>

      <div class="header-actions no-print">
        <!-- Modo Filtro de Validação -->
        <div class="filter-toggle" :title="onlyValid ? 'Exibindo apenas sujeitos com IDs numéricos válidos' : 'Exibindo todos os dados (incluindo testes)'">
          <span class="toggle-label">Apenas IDs Numéricos</span>
          <button 
            type="button" 
            class="switch-btn" 
            :class="{ active: onlyValid }"
            @click="$emit('toggle-validity')"
          >
            <span class="switch-handle"></span>
          </button>
        </div>

        <!-- Importar novo JSON -->
        <label class="btn btn-secondary btn-sm" title="Carregar outro arquivo de resultados JSON">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Importar JSON
          <input type="file" accept=".json" @change="onFileChange" style="display: none;" />
        </label>

        <!-- Exportar CSV -->
        <button class="btn btn-primary btn-sm" @click="$emit('export-csv')" title="Exportar dados limpos para Excel/SPSS/R">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar CSV
        </button>

        <!-- Imprimir Relatório -->
        <button class="btn btn-secondary btn-sm" @click="printReport" title="Imprimir ou Salvar Relatório em PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Imprimir / PDF
        </button>

        <!-- Tema Dark / Light -->
        <button class="btn btn-secondary btn-sm" @click="$emit('toggle-theme')" :title="isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'">
          <span v-if="isLight">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  onlyValid: {
    type: Boolean,
    default: true
  },
  isLight: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-validity', 'toggle-theme', 'export-csv', 'load-custom-json']);

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

function printReport() {
  window.print();
}
</script>

<style scoped>
.app-header {
  margin-bottom: 1.75rem;
  padding: 1.25rem 1.75rem;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1.15rem;
}

.brand-icon {
  width: 52px;
  height: 52px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.brand-title-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.brand-title {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.brand-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.65rem;
}

.toggle-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.switch-btn {
  width: 38px;
  height: 22px;
  background: var(--bg-subtle);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  padding: 2px;
}

.switch-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.switch-handle {
  display: block;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.switch-btn.active .switch-handle {
  transform: translateX(16px);
}
</style>

