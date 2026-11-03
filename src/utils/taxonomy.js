// Taxonomia Pedagógica das Intervenções Docentes em VR - Didascálias

export const DIMENSIONS = {
  REFORCO_APOIO: {
    id: 'REFORCO_APOIO',
    name: 'Reforço & Suporte Pedagógico',
    shortName: 'Reforço & Suporte',
    color: '#3b82f6', // blue-500
    colorLight: 'rgba(59, 130, 246, 0.15)',
    description: 'Intervenções de encorajamento, validação e suporte cognitivo/pedagógico.',
    intents: ['ElogioPositivo', 'DarApoio', 'IncentivarAutonomia', 'ExplicarNovamente', 'Perguntar']
  },
  MEDIACAO_CONFLITO: {
    id: 'MEDIACAO_CONFLITO',
    name: 'Mediação & Socioemocional',
    shortName: 'Mediação Socioemocional',
    color: '#10b981', // emerald-500
    colorLight: 'rgba(16, 185, 129, 0.15)',
    description: 'Resolução não-punitiva de conflitos, desescalada e regulação emocional.',
    intents: ['PegarMaterial', 'PararConflito', 'Acalmar', 'RegularEmocao', 'PromoverRespeito']
  },
  GESTAO_DISCIPLINAR: {
    id: 'GESTAO_DISCIPLINAR',
    name: 'Gestão Disciplinar & Limites',
    shortName: 'Gestão Disciplinar',
    color: '#ef4444', // red-500
    colorLight: 'rgba(239, 68, 68, 0.15)',
    description: 'Controle normativo, definição de limites claros, advertências e penalidades.',
    intents: ['EstabelecerLimites', 'Advertencia', 'Castigo', 'Expulsão', 'Sentarse', 'Silencio', 'PausarAula', 'Adiar']
  },
  DINAMICA_AULA: {
    id: 'DINAMICA_AULA',
    name: 'Dinâmica & Organização da Aula',
    shortName: 'Dinâmica de Aula',
    color: '#f59e0b', // amber-500
    colorLight: 'rgba(245, 158, 11, 0.15)',
    description: 'Direcionamento de atenção, movimentação de alunos e gestão do tempo de atividade.',
    intents: ['ChamarAluno', 'MoverAluno', 'TrocarAluno', 'TrocarAtividade', 'Trabalhar']
  },
  RITUAIS_SOCIAIS: {
    id: 'RITUAIS_SOCIAIS',
    name: 'Rituais Sociais & Acolhimento',
    shortName: 'Rituais Sociais',
    color: '#8b5cf6', // purple-500
    colorLight: 'rgba(139, 92, 246, 0.15)',
    description: 'Acolhida inicial, cumprimentos formais e encerramento de convivência.',
    intents: ['Saudações', 'Despedida']
  }
};

export const INTENT_DEFINITIONS = {
  ElogioPositivo: { label: 'Elogio Positivo', dimension: 'REFORCO_APOIO', desc: 'Elogiar postura ou acerto do aluno.' },
  DarApoio: { label: 'Dar Apoio', dimension: 'REFORCO_APOIO', desc: 'Oferecer suporte individual e acolhimento.' },
  IncentivarAutonomia: { label: 'Incentivar Autonomia', dimension: 'REFORCO_APOIO', desc: 'Estimular resolução independente pelo aluno.' },
  ExplicarNovamente: { label: 'Explicar Novamente', dimension: 'REFORCO_APOIO', desc: 'Reformular instruções pedagógicas.' },
  Perguntar: { label: 'Perguntar', dimension: 'REFORCO_APOIO', desc: 'Indagar sentimentos, dúvidas ou motivações.' },

  PegarMaterial: { label: 'Pegar Material', dimension: 'MEDIACAO_CONFLITO', desc: 'Intervir na disputa ou recolhimento de materiais.' },
  PararConflito: { label: 'Parar Conflito', dimension: 'MEDIACAO_CONFLITO', desc: 'Interromper atrito direto entre estudantes.' },
  Acalmar: { label: 'Acalmar', dimension: 'MEDIACAO_CONFLITO', desc: 'De-escalar tensão ou ansiedade no ambiente.' },
  RegularEmocao: { label: 'Regular Emoção', dimension: 'MEDIACAO_CONFLITO', desc: 'Ajudar aluno a reconhecer e modular emoções.' },
  PromoverRespeito: { label: 'Promover Respeito', dimension: 'MEDIACAO_CONFLITO', desc: 'Reforçar cooperação e respeito mútuo.' },

  EstabelecerLimites: { label: 'Estabelecer Limites', dimension: 'GESTAO_DISCIPLINAR', desc: 'Delimitar regras comportamentais firmes.' },
  Advertencia: { label: 'Advertência', dimension: 'GESTAO_DISCIPLINAR', desc: 'Aviso formal sobre comportamento inaceitável.' },
  Castigo: { label: 'Castigo', dimension: 'GESTAO_DISCIPLINAR', desc: 'Aplicação de consequência punitiva.' },
  Expulsão: { label: 'Expulsão de Sala', dimension: 'GESTAO_DISCIPLINAR', desc: 'Remoção temporária do aluno da sala de aula.' },
  Sentarse: { label: 'Pedir para Sentar', dimension: 'GESTAO_DISCIPLINAR', desc: 'Comando direto para retorno à carteira.' },
  Silencio: { label: 'Pedir Silêncio', dimension: 'GESTAO_DISCIPLINAR', desc: 'Comando para cessar ruído excessivo.' },
  PausarAula: { label: 'Pausar Aula', dimension: 'GESTAO_DISCIPLINAR', desc: 'Interromper a aula para conter desordem.' },
  Adiar: { label: 'Adiar Discussão', dimension: 'GESTAO_DISCIPLINAR', desc: 'Postergar resolução do conflito para momento posterior.' },

  ChamarAluno: { label: 'Chamar Aluno', dimension: 'DINAMICA_AULA', desc: 'Chamar pelo nome para recuperar atenção.' },
  MoverAluno: { label: 'Mover Aluno de Lugar', dimension: 'DINAMICA_AULA', desc: 'Trocar o aluno de carteira ou posição.' },
  TrocarAluno: { label: 'Trocar Aluno em Foco', dimension: 'DINAMICA_AULA', desc: 'Alternar a fala ou atenção para outro estudante.' },
  TrocarAtividade: { label: 'Trocar Atividade', dimension: 'DINAMICA_AULA', desc: 'Alterar a tarefa proposta.' },
  Trabalhar: { label: 'Conclamar ao Trabalho', dimension: 'DINAMICA_AULA', desc: 'Orientar foco nas tarefas pedagógicas.' },

  Saudações: { label: 'Saudações', dimension: 'RITUAlS_SOCIAIS', dimension: 'RITUAIS_SOCIAIS', desc: 'Acolhimento no início da aula.' },
  Despedida: { label: 'Despedida', dimension: 'RITUAIS_SOCIAIS', desc: 'Encerramento da sessão com a turma.' }
};

export function getDimensionForIntent(intentKey) {
  const item = INTENT_DEFINITIONS[intentKey];
  if (item && DIMENSIONS[item.dimension]) {
    return DIMENSIONS[item.dimension];
  }
  // Fallback search
  for (const dim of Object.values(DIMENSIONS)) {
    if (dim.intents.includes(intentKey)) return dim;
  }
  return {
    id: 'OUTROS',
    name: 'Outros',
    shortName: 'Outros',
    color: '#94a3b8',
    colorLight: 'rgba(148, 163, 184, 0.15)',
    description: 'Outras ações',
    intents: []
  };
}

