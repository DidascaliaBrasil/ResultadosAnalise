import assert from 'node:assert';
import fs from 'node:fs';
import { processResearchData, isNumericUser } from './src/utils/dataProcessor.js';
import { DIMENSIONS, INTENT_DEFINITIONS } from './src/utils/taxonomy.js';

console.log('--- Executando Testes Automatizados de Validação dos Dados ---');

// 1. Teste da função isNumericUser
assert.strictEqual(isNumericUser('157722'), true, '157722 deve ser numérico');
assert.strictEqual(isNumericUser('157730'), true, '157730 deve ser numérico');
assert.strictEqual(isNumericUser('327727'), true, '327727 deve ser numérico');
assert.strictEqual(isNumericUser('327723'), true, '327723 deve ser numérico');
assert.strictEqual(isNumericUser('Leonardo Gonçalves Viana'), false, 'Nome textual deve ser falso');
assert.strictEqual(isNumericUser('JOAO PEDRO FERREIRA ALVES'), false, 'Facilitador textual deve ser falso');
assert.strictEqual(isNumericUser('Fabiane Proba'), false, 'Nome textual deve ser falso');
console.log('✓ Teste 1: Regra regex isNumericUser validada com sucesso.');

// 2. Carregamento do JSON
const rawData = JSON.parse(fs.readFileSync('Didascalias_RESULTADOS_PESQUISA.json', 'utf8'));
const processed = processResearchData(rawData);

assert.strictEqual(processed.isValid, true, 'Dataset deve ser válido');
console.log('✓ Teste 2: Parser do JSON processou o arquivo sem erros.');

// 3. Verificação dos sujeitos válidos da pesquisa
const validCodes = processed.validParticipants.map(p => p.code).sort();
assert.deepStrictEqual(validCodes, ['157722', '157730', '327723', '327727'], 'Devem ser exatamente os 4 sujeitos válidos');
assert.strictEqual(processed.summary.totalValidParticipants, 4, 'Total de participantes válidos deve ser 4');
console.log('✓ Teste 3: Sujeitos válidos isolados com precisão (157722, 157730, 327723, 327727).');

// 4. Verificação das sessões pareadas (TEA e TDAH)
assert.strictEqual(processed.summary.totalValidSessions, 8, 'Devem ser 8 sessões válidas (4 TEA + 4 TDAH)');
assert.strictEqual(processed.teaStats.sessionCount, 4, 'Devem ser 4 sessões no TEA');
assert.strictEqual(processed.tdahStats.sessionCount, 4, 'Devem ser 4 sessões no TDAH');
console.log('✓ Teste 4: Desenho experimental pareado 4xTEA e 4xTDAH validado.');

// 5. Verificação das intenções
assert.strictEqual(processed.summary.totalValidIntents, 72, 'Total de intenções válidas deve ser 72');
assert.strictEqual(processed.teaStats.totalIntents, 32, 'Intenções no TEA devem totalizar 32');
assert.strictEqual(processed.tdahStats.totalIntents, 40, 'Intenções no TDAH devem totalizar 40');
console.log('✓ Teste 5: Contagem exata de intenções confirmada (32 em TEA + 40 em TDAH = 72 total).');

// 6. Verificação do filtro por Professor
const profFiltered = processResearchData(rawData, { participantCode: '157722', onlyValid: true });
assert.strictEqual(profFiltered.filteredSessions.length, 2, 'Professor 157722 deve ter exatamente 2 sessões');
assert.strictEqual(profFiltered.summary.totalValidIntents, 29, 'Professor 157722 deve ter exatamente 29 intenções');
console.log('✓ Teste 6: Filtro por Professor funciona reativamente (157722 com 2 sessões e 29 intenções).');

// 7. Verificação das Intents Exclusivas
const exclusiveTea = processed.intentComparison.filter(i => i.isExclusiveTea);
const exclusiveTdah = processed.intentComparison.filter(i => i.isExclusiveTdah);
assert.strictEqual(exclusiveTea.length, 5, 'Devem ser 5 intents exclusivas do TEA');
assert.strictEqual(exclusiveTdah.length, 8, 'Devem ser 8 intents exclusivas do TDAH');
console.log('✓ Teste 7: Intents exclusivas verificadas (5 exclusivas no TEA e 8 exclusivas no TDAH).');

console.log('\n=============================================');
console.log('TODOS OS TESTES AUTOMATIZADOS PASSARAM COM 100% DE SUCESSO!');
console.log('=============================================\n');
