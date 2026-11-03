# Didascálias Analytics - Análise Pedagógica em Realidade Virtual

Plataforma analítica e científica interativa desenvolvida em **Vue.js 3 (JavaScript puro)** para análise dos resultados de simulações em Realidade Virtual (VR) do projeto **Didascálias**.

🌐 **Acesso Online (GitHub Pages):** [https://didascaliabrasil.github.io/ResultadosAnalise/](https://didascaliabrasil.github.io/ResultadosAnalise/)

---

## 🔬 Sobre a Pesquisa & Critérios de Validação

O ambiente virtual simula turmas escolares com estudantes neurotípicos e estudantes com necessidades específicas (**TEA** e **TDAH**), registrando as intervenções comportamentais e pedagógicas dos professores.

- **Filtro de Amostra Válida:** Aplicação do critério estrito de identificação por número (`/^\d+$/` no campo `nome`), isolando os 4 sujeitos reais da pesquisa: `157722`, `157730`, `327727`, `327723`.
- **Desenho Pareado:** 8 sessões válidas (cada professor realizou exatamente 1 sessão em Sala TEA e 1 sessão em Sala TDAH).
- **Intenções:** 72 ações mapeadas em 25 tipos de intents, distribuídas em 5 dimensões comportamentais (*Reforço & Suporte*, *Mediação & Conflito*, *Gestão Disciplinar*, *Dinâmica de Aula*, *Rituais Sociais*).

---

## 📊 Principais Funcionalidades

1. **Comparativo TEA vs TDAH:** Radar multidimensional e gráficos pareados por professor.
2. **Detalhamento das 25 Intents:** Tabela comparativa e filtros de exclusividade (5 exclusivas de TEA e 8 exclusivas de TDAH).
3. **Ficha Individual dos Professores:** Confronto direto das ações de cada professor nas salas TEA vs TDAH.
4. **Filtros Globais Reativos:** Filtre simultaneamente por Professor, Sala, Dimensão e Validação.
5. **Exportação Acadêmica:** Exportação em 1 clique para planilha CSV (otimizada para SPSS, R e Excel) e JSON limpo.

---

## 🚀 Como Executar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

