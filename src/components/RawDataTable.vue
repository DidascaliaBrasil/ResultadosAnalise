<template>
  <div class="raw-data-container">
    <div class="glass-card">
      <div class="table-top-bar">
        <div>
          <h3 class="card-title">Base de Dados Tabular das Sessões</h3>
          <span class="card-subtitle">
            Mostrando {{ filteredSessions.length }} registros filtrados
          </span>
        </div>

        <div class="table-controls">
          <!-- Busca Textual -->
          <div class="search-input-wrap">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar por ID, sala, facilitador..." 
              class="search-input"
            />
          </div>

          <!-- Filtro de Condição -->
          <select v-model="conditionFilter" class="select-control">
            <option value="ALL">Todas as Condições</option>
            <option value="TEA">Apenas TEA</option>
            <option value="TDAH">Apenas TDAH</option>
          </select>

          <!-- Botões de Ação -->
          <button class="btn btn-primary btn-sm" @click="exportCSV">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar CSV
          </button>
          <button class="btn btn-secondary btn-sm" @click="exportJSON">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
            Exportar JSON
          </button>
        </div>
      </div>

      <!-- Tabela -->
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortBy('sessId')" class="sortable-th">
                Sessão <span class="sort-arrow">{{ getSortArrow('sessId') }}</span>
              </th>
              <th @click="sortBy('participantName')" class="sortable-th">
                Participante <span class="sort-arrow">{{ getSortArrow('participantName') }}</span>
              </th>
              <th @click="sortBy('condition')" class="sortable-th">
                Condição <span class="sort-arrow">{{ getSortArrow('condition') }}</span>
              </th>
              <th>Sala de Simulação</th>
              <th @click="sortBy('duracaoSegundos')" class="sortable-th text-right">
                Duração <span class="sort-arrow">{{ getSortArrow('duracaoSegundos') }}</span>
              </th>
              <th @click="sortBy('totalIntents')" class="sortable-th text-right">
                Ações <span class="sort-arrow">{{ getSortArrow('totalIntents') }}</span>
              </th>
              <th @click="sortBy('ratePerMinute')" class="sortable-th text-right">
                Taxa/min <span class="sort-arrow">{{ getSortArrow('ratePerMinute') }}</span>
              </th>
              <th>Status Validação</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="sess in filteredSessions" :key="sess.sessId + sess.roomId">
              <tr>
                <td class="mono font-bold">{{ sess.sessId }}</td>
                <td>
                  <div class="font-bold">{{ sess.participantName }}</div>
                  <div class="mono text-muted text-xs">{{ sess.participantId }}</div>
                </td>
                <td>
                  <span class="badge" :class="sess.condition === 'TEA' ? 'badge-tea' : (sess.condition === 'TDAH' ? 'badge-tdah' : 'badge-subtle')">
                    {{ sess.condition }}
                  </span>
                </td>
                <td>
                  <div>{{ sess.roomName }}</div>
                  <div class="text-muted text-xs">Facilitador: {{ sess.facilitadorNome }}</div>
                </td>
                <td class="mono text-right font-bold">{{ sess.duracaoSegundos }}s ({{ sess.duracaoMinutos }}m)</td>
                <td class="mono text-right font-bold">{{ sess.totalIntents }}</td>
                <td class="mono text-right font-bold">{{ sess.ratePerMinute }}</td>
                <td>
                  <span v-if="sess.isValid" class="badge badge-valid">Válido</span>
                  <span v-else class="badge badge-discarded" :title="sess.discardReason">Descartado</span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" @click="toggleRowDetail(sess)">
                    {{ expandedRowKey === sess.sessId + sess.roomId ? 'Ocultar' : 'Detalhes' }}
                  </button>
                </td>
              </tr>

              <!-- Linha de Detalhes Expandida -->
              <tr v-if="expandedRowKey === sess.sessId + sess.roomId" class="detail-row">
                <td colspan="9">
                  <div class="detail-expanded-box">
                    <h4 class="detail-title">Detalhamento das Ações do Professor nesta Sessão:</h4>
                    <div class="detail-grid">
                      <div class="detail-col">
                        <span class="detail-subtitle">Distribuição por Dimensão:</span>
                        <div class="dim-bars-mini">
                          <div class="dim-mini-item">Reforço: <strong class="mono">{{ sess.dimensionBreakdown.REFORCO_APOIO }}</strong></div>
                          <div class="dim-mini-item">Mediação: <strong class="mono">{{ sess.dimensionBreakdown.MEDIACAO_CONFLITO }}</strong></div>
                          <div class="dim-mini-item">Disciplina: <strong class="mono">{{ sess.dimensionBreakdown.GESTAO_DISCIPLINAR }}</strong></div>
                          <div class="dim-mini-item">Dinâmica: <strong class="mono">{{ sess.dimensionBreakdown.DINAMICA_AULA }}</strong></div>
                          <div class="dim-mini-item">Rituais: <strong class="mono">{{ sess.dimensionBreakdown.RITUAIS_SOCIAIS }}</strong></div>
                        </div>
                      </div>
                      <div class="detail-col">
                        <span class="detail-subtitle">Intenções Específicas:</span>
                        <div class="intents-mini-tags">
                          <span 
                            v-for="(count, k) in sess.intentsDetalhadas" 
                            :key="k"
                            class="intent-spec-tag"
                          >
                            {{ k }}: <strong class="mono">{{ count }}</strong>
                          </span>
                          <span v-if="Object.keys(sess.intentsDetalhadas).length === 0" class="text-muted text-xs">
                            Nenhuma intenção pedagógica registrada (0).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { exportSessionsToCSV, exportCleanedJSON } from '../utils/exportUtils.js';

const props = defineProps({
  sessions: {
    type: Array,
    required: true
  }
});

const searchTerm = ref('');
const conditionFilter = ref('ALL');
const sortKey = ref('duracaoSegundos');
const sortAsc = ref(false);
const expandedRowKey = ref(null);

function toggleRowDetail(sess) {
  const key = sess.sessId + sess.roomId;
  expandedRowKey.value = expandedRowKey.value === key ? null : key;
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

function getSortArrow(key) {
  if (sortKey.value !== key) return '↕';
  return sortAsc.value ? '↑' : '↓';
}

const filteredSessions = computed(() => {
  return props.sessions
    .filter(s => {
      // Filtro de condição
      if (conditionFilter.value !== 'ALL' && s.condition !== conditionFilter.value) {
        return false;
      }
      // Busca textual
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        const matches = 
          s.participantName.toLowerCase().includes(term) ||
          s.participantId.toLowerCase().includes(term) ||
          s.roomName.toLowerCase().includes(term) ||
          s.facilitadorNome.toLowerCase().includes(term) ||
          s.sessId.toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
});

function exportCSV() {
  exportSessionsToCSV(filteredSessions.value, 'didascalias_export_pesquisa.csv');
}

function exportJSON() {
  exportCleanedJSON(filteredSessions.value, 'didascalias_export_pesquisa.json');
}
</script>

<style scoped>
.raw-data-container {
  display: flex;
  flex-direction: column;
}

.table-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
}

.search-input {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.6rem;
  padding: 0.5rem 0.85rem 0.5rem 2.2rem;
  font-size: 0.825rem;
  color: var(--text-primary);
  outline: none;
  width: 240px;
}

.search-input:focus {
  border-color: var(--accent-primary);
}

.select-control {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.6rem;
  padding: 0.5rem 0.85rem;
  font-size: 0.825rem;
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
}

.sortable-th {
  cursor: pointer;
  user-select: none;
}

.sortable-th:hover {
  color: var(--text-primary);
}

.sort-arrow {
  font-size: 0.75rem;
  opacity: 0.6;
}

.text-right {
  text-align: right;
}

.detail-row td {
  background: rgba(15, 23, 42, 0.75);
  padding: 1.25rem 1.5rem;
}

.detail-expanded-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-title {
  font-size: 0.85rem;
  font-weight: 750;
  color: #38bdf8;
}

.detail-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.detail-col {
  flex: 1;
  min-width: 250px;
}

.detail-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.45rem;
  display: block;
}

.dim-bars-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dim-mini-item {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.dim-mini-item strong {
  color: var(--text-primary);
}

.intents-mini-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.intent-spec-tag {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.45rem;
  padding: 0.2rem 0.55rem;
  font-size: 0.75rem;
  color: var(--text-primary);
}
</style>

