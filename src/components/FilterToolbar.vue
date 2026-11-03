<template>
  <div class="filter-toolbar no-print">
    <!-- Filtro de Professor -->
    <div class="filter-group-item">
      <span class="filter-label-text">Professor:</span>
      <select 
        :value="participantCode" 
        class="filter-select"
        @change="$emit('update:participantCode', $event.target.value)"
      >
        <option value="ALL">Todos os Professores (4)</option>
        <option value="157722">Professor 157722 (29 ações)</option>
        <option value="157730">Professor 157730 (15 ações)</option>
        <option value="327727">Professor 327727 (17 ações)</option>
        <option value="327723">Professor 327723 (11 ações)</option>
      </select>
    </div>

    <!-- Filtro de Sala / Condição -->
    <div class="filter-group-item">
      <span class="filter-label-text">Condição:</span>
      <div class="condition-chips">
        <button 
          class="cond-chip" 
          :class="{ active: condition === 'ALL' }"
          @click="$emit('update:condition', 'ALL')"
        >
          Todas
        </button>
        <button 
          class="cond-chip tea" 
          :class="{ active: condition === 'TEA' }"
          @click="$emit('update:condition', 'TEA')"
        >
          <span class="dot-tea"></span> TEA
        </button>
        <button 
          class="cond-chip tdah" 
          :class="{ active: condition === 'TDAH' }"
          @click="$emit('update:condition', 'TDAH')"
        >
          <span class="dot-tdah"></span> TDAH
        </button>
      </div>
    </div>

    <!-- Filtro de Dimensão Pedagógica -->
    <div class="filter-group-item">
      <span class="filter-label-text">Dimensão:</span>
      <select 
        :value="dimension" 
        class="filter-select"
        @change="$emit('update:dimension', $event.target.value)"
      >
        <option value="ALL">Todas as Dimensões</option>
        <option value="REFORCO_APOIO">Reforço &amp; Suporte Pedagógico</option>
        <option value="MEDIACAO_CONFLITO">Mediação &amp; Conflitos</option>
        <option value="GESTAO_DISCIPLINAR">Gestão Disciplinar &amp; Limites</option>
        <option value="DINAMICA_AULA">Dinâmica &amp; Organização</option>
        <option value="RITUAIS_SOCIAIS">Rituais Sociais</option>
      </select>
    </div>

    <!-- Interruptor de Validação Estrita -->
    <div class="filter-group-item validity-toggle-item" @click="$emit('toggle-validity')">
      <span class="filter-label-text">Apenas IDs Numéricos:</span>
      <button type="button" class="anim-switch" :class="{ on: onlyValid }">
        <span class="anim-knob"></span>
      </button>
    </div>

    <!-- Botão Limpar Filtros -->
    <div v-if="hasActiveFilters" class="clear-filters-wrap">
      <button class="btn btn-secondary btn-sm" @click="$emit('reset-filters')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Limpar Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  participantCode: {
    type: String,
    default: 'ALL'
  },
  condition: {
    type: String,
    default: 'ALL'
  },
  dimension: {
    type: String,
    default: 'ALL'
  },
  onlyValid: {
    type: Boolean,
    default: true
  }
});

defineEmits([
  'update:participantCode',
  'update:condition',
  'update:dimension',
  'toggle-validity',
  'reset-filters'
]);

const hasActiveFilters = computed(() => {
  return props.participantCode !== 'ALL' || props.condition !== 'ALL' || props.dimension !== 'ALL' || !props.onlyValid;
});
</script>

<style scoped>
.filter-toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.15rem 1.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.filter-group-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.filter-label-text {
  font-size: 0.775rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.filter-select {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.65rem;
  padding: 0.5rem 0.95rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: var(--accent-primary);
}

.condition-chips {
  display: flex;
  gap: 0.35rem;
  background: var(--bg-subtle);
  padding: 0.25rem;
  border-radius: 0.65rem;
  border: 1px solid var(--border-color);
}

.cond-chip {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s ease;
}

.cond-chip:hover {
  color: var(--text-primary);
}

.cond-chip.active {
  background: var(--accent-primary);
  color: white;
}

.cond-chip.tea.active {
  background: #a855f7;
  color: white;
}

.cond-chip.tdah.active {
  background: #06b6d4;
  color: white;
}

.dot-tea {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a855f7;
}

.dot-tdah {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #06b6d4;
}

.validity-toggle-item {
  cursor: pointer;
  user-select: none;
}

.anim-switch {
  width: 36px;
  height: 20px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 2px;
  pointer-events: none;
}

.anim-switch.on {
  background: #10b981;
  border-color: #10b981;
}

.anim-knob {
  display: block;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.anim-switch.on .anim-knob {
  transform: translateX(16px);
}

.clear-filters-wrap {
  margin-left: auto;
}
</style>

