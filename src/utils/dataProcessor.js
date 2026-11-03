import { DIMENSIONS, INTENT_DEFINITIONS, getDimensionForIntent } from './taxonomy.js';

export function isNumericUser(nome) {
  if (!nome || typeof nome !== 'string') return false;
  return /^\d+$/.test(nome.trim());
}

/**
 * Motor central de processamento e filtragem reativa dos dados de pesquisa do Didascálias.
 */
export function processResearchData(rawData, filters = {}) {
  if (!rawData) {
    return { isValid: false, error: 'Nenhum dado fornecido' };
  }

  const {
    condition = 'ALL',         // 'ALL' | 'TEA' | 'TDAH'
    participantCode = 'ALL',   // 'ALL' | '157722' | '157730' | '327727' | '327723'
    onlyValid = true,          // true: apenas usuários com nome numérico
    dimension = 'ALL',         // 'ALL' | 'REFORCO_APOIO' | etc.
    search = ''                // busca textual
  } = filters;

  const usuarios = rawData.usuarios || {};
  const classroomConfigs = rawData.classroom_configs || {};
  const instituicoes = rawData.instituicoes || {};

  // Mapear grupos
  const groupMap = {};
  for (const [instId, inst] of Object.entries(instituicoes)) {
    for (const [gId, g] of Object.entries(inst.grupos || {})) {
      groupMap[gId] = {
        id: gId,
        nome: g.nome,
        facilitadorNome: g.facilitadorNome,
        facilitadorId: g.facilitadorId,
        instituicaoId: instId,
        participantes: g.participantes || []
      };
    }
  }

  const allProcessedSessions = [];
  const rawSessionsList = [];

  // Mapear todas as salas e sessões
  for (const [roomId, room] of Object.entries(classroomConfigs)) {
    const roomName = room.roomName || 'Sala sem nome';
    const targetId = room.targetId || 'N/A';
    const facilitadorId = room.facilitadorId || 'N/A';
    const facilitadorUser = usuarios[facilitadorId];
    const facilitadorNome = facilitadorUser ? facilitadorUser.nome : (groupMap[targetId]?.facilitadorNome || 'Não informado');

    let roomCondition = 'Outro';
    let conditionLabel = 'Outro';
    if (room.numTEA > 0 || roomName.toUpperCase().includes('TEA')) {
      roomCondition = 'TEA';
      conditionLabel = 'Sala TEA (Autismo)';
    } else if (room.numADHD > 0 || roomName.toUpperCase().includes('TDAH') || roomName.toUpperCase().includes('ADHD')) {
      roomCondition = 'TDAH';
      conditionLabel = 'Sala TDAH (Déficit de Atenção)';
    }

    const comandosFacilitador = [];
    if (room.comando_facilitador) {
      for (const [cmdId, cmd] of Object.entries(room.comando_facilitador)) {
        comandosFacilitador.push({
          id: cmdId,
          timestamp: cmd.timestamp,
          tipoConflito: cmd.tipo_conflito,
          alunoAlvo: cmd.aluno_alvo || 'Todos'
        });
      }
    }
    comandosFacilitador.sort((a, b) => a.timestamp - b.timestamp);

    const resultados = room.Resultados || {};
    for (const [sessId, sess] of Object.entries(resultados)) {
      const participantId = sess.activeParticipantId;
      const user = usuarios[participantId];
      const participantName = user ? (user.nome || '').trim() : 'Desconhecido';
      const participantEmail = user ? user.email : '';
      const isValid = isNumericUser(participantName);

      const duracaoSegundos = Number(sess.duracaoSegundos || 0);
      const totalIntents = Number(sess.totalIntents || 0);
      const intentsDetalhadas = sess.intentsDetalhadas || {};

      const ratePerMinute = duracaoSegundos > 0 ? (totalIntents / duracaoSegundos) * 60 : 0;

      const dimensionBreakdown = {
        REFORCO_APOIO: 0,
        MEDIACAO_CONFLITO: 0,
        GESTAO_DISCIPLINAR: 0,
        DINAMICA_AULA: 0,
        RITUAIS_SOCIAIS: 0
      };

      for (const [intentKey, count] of Object.entries(intentsDetalhadas)) {
        const dim = getDimensionForIntent(intentKey);
        if (dimensionBreakdown[dim.id] !== undefined) {
          dimensionBreakdown[dim.id] += count;
        }
      }

      const sessionObj = {
        roomId,
        roomName,
        condition: roomCondition,
        conditionLabel,
        sessId,
        participantId,
        participantName,
        participantEmail,
        facilitadorId,
        facilitadorNome,
        isValid,
        discardReason: !isValid ? (duracaoSegundos > 0 && totalIntents === 0 ? 'Sessão de teste (0 intenções) com desenvolvedor' : 'Usuário nominal (não-numérico)') : null,
        dataInicio: sess.dataInicio || null,
        duracaoSegundos,
        duracaoMinutos: duracaoSegundos > 0 ? (duracaoSegundos / 60).toFixed(2) : '0.00',
        totalIntents,
        ratePerMinute: Number(ratePerMinute.toFixed(2)),
        intentsDetalhadas,
        dimensionBreakdown,
        comandosFacilitador,
        numBoys: room.numBoys || 0,
        numGirls: room.numGirls || 0,
        numDesks: room.numDesks || 0
      };

      rawSessionsList.push(sessionObj);
    }
  }

  // Filtragem Dinâmica
  const filteredSessions = rawSessionsList.filter(s => {
    // Filtro de Validação
    if (onlyValid && !s.isValid) return false;

    // Filtro de Condição
    if (condition !== 'ALL' && s.condition !== condition) return false;

    // Filtro de Participante
    if (participantCode !== 'ALL' && s.participantName !== participantCode) return false;

    // Filtro de Dimensão
    if (dimension !== 'ALL') {
      const dimCount = s.dimensionBreakdown[dimension] || 0;
      if (dimCount === 0) return false;
    }

    // Busca Textual
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      const match = 
        s.participantName.toLowerCase().includes(q) ||
        s.roomName.toLowerCase().includes(q) ||
        s.facilitadorNome.toLowerCase().includes(q) ||
        s.sessId.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const validSessions = rawSessionsList.filter(s => s.isValid);
  const discardedSessions = rawSessionsList.filter(s => !s.isValid);

  // Mapeamento dos Sujeitos Válidos
  const validParticipantsMap = {};
  for (const sess of (onlyValid ? filteredSessions : validSessions)) {
    if (!sess.isValid) continue;
    if (!validParticipantsMap[sess.participantName]) {
      validParticipantsMap[sess.participantName] = {
        code: sess.participantName,
        id: sess.participantId,
        email: sess.participantEmail,
        sessionsCount: 0,
        totalDurationSec: 0,
        totalIntents: 0,
        sessions: [],
        byCondition: { TEA: null, TDAH: null }
      };
    }
    const p = validParticipantsMap[sess.participantName];
    p.sessionsCount += 1;
    p.totalDurationSec += sess.duracaoSegundos;
    p.totalIntents += sess.totalIntents;
    p.sessions.push(sess);
    if (sess.condition === 'TEA' || sess.condition === 'TDAH') {
      p.byCondition[sess.condition] = sess;
    }
  }
  const validParticipants = Object.values(validParticipantsMap);

  // Função auxiliar de estatísticas por condição
  function computeConditionStats(condKey) {
    const list = filteredSessions.filter(s => s.condition === condKey);
    const n = list.length;
    if (n === 0) {
      return {
        sessionCount: 0,
        totalDurationSec: 0,
        totalDurationMin: '0.0',
        meanDurationSec: 0,
        stdDevDurationSec: 0,
        totalIntents: 0,
        meanIntents: 0,
        stdDevIntents: 0,
        meanRatePerMinute: 0,
        dimensionTotals: { REFORCO_APOIO: 0, MEDIACAO_CONFLITO: 0, GESTAO_DISCIPLINAR: 0, DINAMICA_AULA: 0, RITUAIS_SOCIAIS: 0 },
        intentFrequency: {}
      };
    }

    const durations = list.map(s => s.duracaoSegundos);
    const intents = list.map(s => s.totalIntents);
    const rates = list.map(s => s.ratePerMinute);

    const totalDuration = durations.reduce((a, b) => a + b, 0);
    const totalIntents = intents.reduce((a, b) => a + b, 0);
    const meanDuration = totalDuration / n;
    const meanIntents = totalIntents / n;
    const meanRate = rates.reduce((a, b) => a + b, 0) / n;

    const varianceDur = durations.reduce((acc, v) => acc + Math.pow(v - meanDuration, 2), 0) / n;
    const stdDevDur = Math.sqrt(varianceDur);

    const varianceInt = intents.reduce((acc, v) => acc + Math.pow(v - meanIntents, 2), 0) / n;
    const stdDevInt = Math.sqrt(varianceInt);

    const dimensionTotals = {
      REFORCO_APOIO: 0,
      MEDIACAO_CONFLITO: 0,
      GESTAO_DISCIPLINAR: 0,
      DINAMICA_AULA: 0,
      RITUAIS_SOCIAIS: 0
    };
    const intentFrequency = {};

    for (const s of list) {
      for (const [dimKey, count] of Object.entries(s.dimensionBreakdown)) {
        dimensionTotals[dimKey] += count;
      }
      for (const [intentKey, count] of Object.entries(s.intentsDetalhadas)) {
        intentFrequency[intentKey] = (intentFrequency[intentKey] || 0) + count;
      }
    }

    return {
      sessionCount: n,
      totalDurationSec: totalDuration,
      totalDurationMin: (totalDuration / 60).toFixed(1),
      meanDurationSec: Number(meanDuration.toFixed(1)),
      stdDevDurationSec: Number(stdDevDur.toFixed(1)),
      totalIntents,
      meanIntents: Number(meanIntents.toFixed(1)),
      stdDevIntents: Number(stdDevInt.toFixed(1)),
      meanRatePerMinute: Number(meanRate.toFixed(2)),
      dimensionTotals,
      intentFrequency
    };
  }

  const teaStats = computeConditionStats('TEA');
  const tdahStats = computeConditionStats('TDAH');

  // TABELA COMPLETA COMPARATIVA DAS 25 INTENTS EXATAS
  const allIntentKeys = Object.keys(INTENT_DEFINITIONS);
  const intentComparison = allIntentKeys.map(key => {
    const def = INTENT_DEFINITIONS[key] || { label: key, dimension: 'OUTROS', desc: '' };
    const dim = DIMENSIONS[def.dimension] || { shortName: 'Outros', color: '#94a3b8' };
    const teaCount = teaStats.intentFrequency[key] || 0;
    const tdahCount = tdahStats.intentFrequency[key] || 0;
    const totalCount = teaCount + tdahCount;
    const delta = tdahCount - teaCount;

    let presenceCategory = 'Ambas as Salas';
    let badgeClass = 'badge-subtle';
    if (teaCount > 0 && tdahCount === 0) {
      presenceCategory = 'Apenas TEA';
      badgeClass = 'badge-tea';
    } else if (tdahCount > 0 && teaCount === 0) {
      presenceCategory = 'Apenas TDAH';
      badgeClass = 'badge-tdah';
    } else if (teaCount === 0 && tdahCount === 0) {
      presenceCategory = 'Não Utilizada';
      badgeClass = 'badge-discarded';
    }

    return {
      key,
      label: def.label,
      dimensionId: def.dimension,
      dimensionName: dim.shortName,
      dimensionColor: dim.color,
      description: def.desc,
      teaCount,
      tdahCount,
      totalCount,
      delta,
      presenceCategory,
      badgeClass,
      isExclusiveTea: teaCount > 0 && tdahCount === 0,
      isExclusiveTdah: tdahCount > 0 && teaCount === 0
    };
  }).sort((a, b) => b.totalCount - a.totalCount);

  // Usuários para auditoria
  const auditUsers = [];
  for (const [uId, u] of Object.entries(usuarios)) {
    const nome = (u.nome || '').trim();
    const isNum = isNumericUser(nome);
    const userSessions = rawSessionsList.filter(s => s.participantId === uId);
    auditUsers.push({
      id: uId,
      nome: u.nome,
      email: u.email,
      tipoCadastro: u.tipoCadastro,
      criadoEm: u.criadoEm,
      isNumeric: isNum,
      sessionsCount: userSessions.length,
      status: isNum 
        ? (userSessions.length > 0 ? 'Válido (Com Sessões)' : 'Numérico (Sem Sessão)')
        : 'Descartado (Usuário Nominal/Teste)'
    });
  }

  return {
    isValid: true,
    summary: {
      totalFilteredSessions: filteredSessions.length,
      totalAllSessions: rawSessionsList.length,
      totalValidSessions: validSessions.length,
      totalDiscardedSessions: discardedSessions.length,
      totalValidParticipants: validParticipants.length,
      totalValidDurationSec: filteredSessions.reduce((acc, s) => acc + s.duracaoSegundos, 0),
      totalValidIntents: filteredSessions.reduce((acc, s) => acc + s.totalIntents, 0),
      overallMeanRatePerMinute: filteredSessions.length > 0
        ? Number((filteredSessions.reduce((acc, s) => acc + s.ratePerMinute, 0) / filteredSessions.length).toFixed(2))
        : 0
    },
    teaStats,
    tdahStats,
    intentComparison,
    filteredSessions,
    validSessions,
    discardedSessions,
    allSessions: rawSessionsList,
    validParticipants,
    auditUsers
  };
}
