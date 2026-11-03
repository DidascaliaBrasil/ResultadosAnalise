import { INTENT_DEFINITIONS } from './taxonomy.js';

/**
 * Converte as sessões para o formato CSV formatado para Excel/SPSS/R.
 */
export function exportSessionsToCSV(sessions, filename = 'didascalias_sessoes_pesquisa.csv') {
  if (!sessions || sessions.length === 0) return;

  const allIntentKeys = Object.keys(INTENT_DEFINITIONS);

  const headers = [
    'Sessao_ID',
    'Condicao_Experimental',
    'Participante_Codigo',
    'Participante_ID',
    'Email',
    'Duracao_Segundos',
    'Duracao_Minutos',
    'Total_Intencoes',
    'Taxa_Intencoes_Minuto',
    'Sala_Nome',
    'Facilitador',
    'Data_Inicio',
    'Dim_Reforco_Apoio',
    'Dim_Mediacao_Conflito',
    'Dim_Gestao_Disciplinar',
    'Dim_Dinamica_Aula',
    'Dim_Rituais_Sociais',
    ...allIntentKeys.map(k => `Intent_${k}`)
  ];

  const rows = sessions.map(s => {
    const intentCols = allIntentKeys.map(k => s.intentsDetalhadas?.[k] || 0);

    const values = [
      `"${s.sessId}"`,
      `"${s.condition}"`,
      `"${s.participantName}"`,
      `"${s.participantId}"`,
      `"${s.participantEmail || ''}"`,
      s.duracaoSegundos,
      s.duracaoMinutos,
      s.totalIntents,
      s.ratePerMinute,
      `"${s.roomName.replace(/"/g, '""')}"`,
      `"${s.facilitadorNome.replace(/"/g, '""')}"`,
      `"${s.dataInicio || ''}"`,
      s.dimensionBreakdown.REFORCO_APOIO || 0,
      s.dimensionBreakdown.MEDIACAO_CONFLITO || 0,
      s.dimensionBreakdown.GESTAO_DISCIPLINAR || 0,
      s.dimensionBreakdown.DINAMICA_AULA || 0,
      s.dimensionBreakdown.RITUAIS_SOCIAIS || 0,
      ...intentCols
    ];

    return values.join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta o JSON limpo e estruturado.
 */
export function exportCleanedJSON(data, filename = 'didascalias_dados_filtrados.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

