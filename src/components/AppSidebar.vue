<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Brand / Logo Area -->
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="brand-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <div v-show="!isCollapsed" class="brand-text">
          <span class="brand-name">Didascálias</span>
          <span class="brand-badge">VR Analytics</span>
        </div>
      </div>

      <!-- Botão Animado de Recolher/Expandir Sidebar -->
      <button 
        class="toggle-sidebar-btn" 
        :title="isCollapsed ? 'Expandir menu' : 'Recolher menu'"
        @click="toggleCollapse"
      >
        <svg 
          class="collapse-icon" 
          :class="{ rotated: isCollapsed }"
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Navegação Principal com Respiro e Sem Badges Sobrepostos -->
    <nav class="sidebar-nav">
      <div v-show="!isCollapsed" class="nav-section-label">Análise de Dados</div>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'comparison' }"
        :title="isCollapsed ? 'Comparativo TEA vs TDAH' : ''"
        @click="$emit('update:tab', 'comparison')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Comparativo TEA &times; TDAH</span>
      </button>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'intents' }"
        :title="isCollapsed ? 'Detalhamento de Todas as Intents' : ''"
        @click="$emit('update:tab', 'intents')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Quais Intents foram Usadas</span>
      </button>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'profiles' }"
        :title="isCollapsed ? 'Perfil por Professor' : ''"
        @click="$emit('update:tab', 'profiles')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Perfil por Professor</span>
      </button>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'timeline' }"
        :title="isCollapsed ? 'Linha do Tempo VR' : ''"
        @click="$emit('update:tab', 'timeline')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Linha do Tempo VR</span>
      </button>

      <div v-show="!isCollapsed" class="nav-section-label" style="margin-top: 1.5rem;">Dados &amp; Governança</div>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'table' }"
        :title="isCollapsed ? 'Tabela Completa' : ''"
        @click="$emit('update:tab', 'table')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M21 9H3"/><path d="M21 15H3"/><path d="M12 3v18"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Tabela de Dados &amp; CSV</span>
      </button>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'audit' }"
        :title="isCollapsed ? 'Auditoria dos Dados' : ''"
        @click="$emit('update:tab', 'audit')"
      >
        <div class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <span v-show="!isCollapsed" class="nav-label">Auditoria &amp; Descartes</span>
      </button>
    </nav>

    <!-- Footer da Sidebar -->
    <div class="sidebar-footer">
      <div v-show="!isCollapsed" class="dataset-pill">
        <span class="live-dot"></span>
        <div class="dataset-pill-text">
          <strong>Amostra Válida</strong>
          <small class="mono">4 Professores &bull; 8 Sessões</small>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  currentTab: {
    type: String,
    default: 'comparison'
  }
});

defineEmits(['update:tab']);

const isCollapsed = ref(false);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
.sidebar-header {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.35rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  overflow: hidden;
}

.brand-logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.brand-badge {
  font-size: 0.68rem;
  font-weight: 750;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toggle-sidebar-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.45rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-sidebar-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.collapse-icon {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.nav-section-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 0.35rem 0.75rem;
  margin-bottom: 0.2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.95rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 0.885rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-primary);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 1.25rem 1rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.dataset-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.65rem 0.85rem;
  border-radius: 0.75rem;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  flex-shrink: 0;
}

.dataset-pill-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.dataset-pill-text strong {
  font-size: 0.775rem;
  color: var(--text-primary);
}

.dataset-pill-text small {
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
