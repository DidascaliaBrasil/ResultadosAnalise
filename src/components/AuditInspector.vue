<template>
  <div class="audit-container">
    <!-- Banner de Metodologia de Filtragem -->
    <div class="glass-card audit-methodology-card">
      <div class="audit-badge-row">
        <span class="badge badge-valid">Critério de Rigor Metodológico</span>
        <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">Regex: /^\d+$/</span>
      </div>
      <h2 class="audit-title">Auditoria de Dados &amp; Controle de Validação</h2>
      <p class="audit-desc">
        Para garantir a validade científica da pesquisa em Realidade Virtual, foram segregados os dados reais de simulação dos registros de teste de desenvolvimento. Conforme especificado, <strong>apenas sujeitos com identificadores numéricos no campo nome</strong> (ex: <code>157722</code>, <code>157730</code>, <code>327727</code>, <code>327723</code>) constituem a amostra experimental válida.
      </p>

      <div class="audit-summary-boxes">
        <div class="audit-box success">
          <span class="box-num mono">4</span>
          <span class="box-label">Sujeitos Válidos Identificados</span>
          <span class="box-sub mono">157722, 157730, 327727, 327723</span>
        </div>
        <div class="audit-box info">
          <span class="box-num mono">8</span>
          <span class="box-label">Sessões Experimentais Pareadas</span>
          <span class="box-sub">4 TEA + 4 TDAH (72 intenções)</span>
        </div>
        <div class="audit-box warning">
          <span class="box-num mono">{{ auditUsers.filter(u => !u.isNumeric).length }}</span>
          <span class="box-label">Usuários Nominais Descartados</span>
          <span class="box-sub">Contas da equipe e desenvolvedores</span>
        </div>
        <div class="audit-box danger">
          <span class="box-num mono">{{ discardedSessions.length }}</span>
          <span class="box-label">Sessões Descartadas</span>
          <span class="box-sub">Sessões piloto / 0 intenções</span>
        </div>
      </div>
    </div>

    <div class="grid-2col">
      <!-- Tabela de Sessões Descartadas -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Sessões Descartadas (Piloto &amp; Testes)</h3>
          <span class="card-subtitle">Registros excluídos do cálculo das métricas científicas</span>
        </div>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sessão</th>
                <th>Usuário / Participante</th>
                <th>Duração</th>
                <th>Intenções</th>
                <th>Motivo do Descarte</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sess in discardedSessions" :key="sess.sessId + sess.roomId">
                <td class="mono font-bold">{{ sess.sessId }}</td>
                <td>
                  <div>{{ sess.participantName }}</div>
                  <div class="mono text-muted text-xs">{{ sess.participantId }}</div>
                </td>
                <td class="mono">{{ sess.duracaoSegundos }}s</td>
                <td class="mono">{{ sess.totalIntents }}</td>
                <td>
                  <span class="badge badge-discarded">{{ sess.discardReason }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Óculos e Dispositivos de VR Registrados -->
      <div class="glass-card">
        <div class="card-head">
          <h3 class="card-title">Hardware de VR &amp; Dispositivos Registrados</h3>
          <span class="card-subtitle">Headsets mapeados nas instituições de pesquisa</span>
        </div>
        <div class="headsets-list">
          <div class="headset-item">
            <div class="headset-icon">🥽</div>
            <div class="headset-info">
              <span class="headset-model">Meta / Oculus Quest 3</span>
              <span class="headset-id mono text-muted">ID: 11efa6eed840ae871b6ea0aeb52521dc</span>
              <span class="headset-date text-xs">Registro: 26/10/2026 - WilliamAcademy</span>
            </div>
            <span class="badge badge-tea">Quest 3</span>
          </div>

          <div class="headset-item">
            <div class="headset-icon">🥽</div>
            <div class="headset-info">
              <span class="headset-model">Meta / Oculus Quest 3</span>
              <span class="headset-id mono text-muted">ID: 1e0d1b3680fb8b3614367dc38705fd90</span>
              <span class="headset-date text-xs">Registro: 23/10/2026 - WilliamAcademy</span>
            </div>
            <span class="badge badge-tea">Quest 3</span>
          </div>

          <div class="headset-item">
            <div class="headset-icon">🥽</div>
            <div class="headset-info">
              <span class="headset-model">Meta / Oculus Quest 3</span>
              <span class="headset-id mono text-muted">ID: 6d99cb975e73120a127814c2a3ffc85e</span>
              <span class="headset-date text-xs">Registro: 05/10/2026 - WilliamAcademy</span>
            </div>
            <span class="badge badge-tea">Quest 3</span>
          </div>

          <div class="headset-item">
            <div class="headset-icon">💻</div>
            <div class="headset-info">
              <span class="headset-model">Lenovo 83F1 (Estação de Controle)</span>
              <span class="headset-id mono text-muted">ID: 4c8232942794b40c7546b02ab8f27d750ecc8569</span>
              <span class="headset-date text-xs">Registro: 09/10/2026 - WilliamAcademy</span>
            </div>
            <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">Lenovo</span>
          </div>

          <div class="headset-item">
            <div class="headset-icon">💻</div>
            <div class="headset-info">
              <span class="headset-model">Samsung 750QFG</span>
              <span class="headset-id mono text-muted">ID: 0e2bbe6dbfbe185d7e747e9eaa9ef492fdb2e10f</span>
              <span class="headset-date text-xs">Registro: 19/09/2026 - WilliamAcademy</span>
            </div>
            <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">Samsung</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Geral de Usuários e Status de Auditoria -->
    <div class="glass-card">
      <div class="card-head">
        <h3 class="card-title">Inventário Completo de Usuários Cadastrados</h3>
        <span class="card-subtitle">Auditoria de todas as 22 contas presentes no arquivo JSON</span>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID Curto</th>
              <th>Nome no Cadastro</th>
              <th>E-mail</th>
              <th>Formato</th>
              <th>Sessões Vinculadas</th>
              <th>Status na Pesquisa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in auditUsers" :key="user.id">
              <td class="mono font-bold">{{ user.id }}</td>
              <td class="font-bold">{{ user.nome || 'Não informado' }}</td>
              <td class="mono text-muted text-xs">{{ user.email }}</td>
              <td>
                <span v-if="user.isNumeric" class="badge badge-valid">Numérico</span>
                <span v-else class="badge badge-discarded">Nominal / Texto</span>
              </td>
              <td class="mono font-bold">{{ user.sessionsCount }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="user.status.includes('Válido') ? 'badge-valid' : (user.status.includes('Numérico') ? 'badge-tdah' : 'badge-discarded')"
                >
                  {{ user.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  auditUsers: {
    type: Array,
    required: true
  },
  discardedSessions: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.audit-container {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.audit-methodology-card {
  background: linear-gradient(135deg, rgba(20, 30, 51, 0.95), rgba(15, 23, 42, 0.95));
}

.audit-badge-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.audit-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
}

.audit-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 950px;
  margin: 0.5rem 0 1.5rem 0;
}

.audit-desc code {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  font-family: var(--font-mono);
}

.audit-summary-boxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.audit-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.audit-box.success { border-left: 4px solid #10b981; }
.audit-box.info { border-left: 4px solid #6366f1; }
.audit-box.warning { border-left: 4px solid #f59e0b; }
.audit-box.danger { border-left: 4px solid #ef4444; }

.box-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
}

.box-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

.box-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.headsets-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.headset-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 0.65rem;
}

.headset-icon {
  font-size: 1.5rem;
}

.headset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.headset-model {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.text-xs {
  font-size: 0.7rem;
}
</style>

