# 📝 Histórico de Alterações - Quartz Knapsack Game

## Versão 1.0.0 - Release Inicial (2026-05-09)

### ✨ Novas Funcionalidades

#### 1. **Modo Jogo Interativo**
- Transformado de visualizador de Knapsack em jogo completo
- Jogador vs Computador com 5 rodadas cada
- Sistema de alternância automática entre jogadores

#### 2. **Sistema de Mineração de Joias**
- 6 tipos diferentes de joias com densidades variáveis:
  - Diamante (25 valor/kg)
  - Esmeralda (18 valor/kg)
  - Rubi (15 valor/kg)
  - Safira (12 valor/kg)
  - Topázio (10 valor/kg)
  - Ametista (8 valor/kg)
- Geração aleatória de joias em cada rodada
- Pesos divisíveis para funcionar com Knapsack fracionário

#### 3. **Estratégia Progressiva**
- **Rodadas 1-4 (Sorte)**:
  - 60% de chance de cada item ser selecionado
  - Processamento em ordem aleatória
  - Demonstra impacto da aleatoriedade

- **Rodada 5 (Greedy)**:
  - Algoritmo Greedy implementado
  - Ordena itens por razão Valor/Peso
  - Fracciona último item para otimizar espaço
  - Demonstra eficiência do algoritmo

#### 4. **Nova Interface de Usuário**
- **Game Board**: Placar em tempo real, status da rodada
- **Histórico de Rodadas**: Painel lateral com resultado de cada rodada
- **Detalhes da Rodada**: Joias disponíveis, decisões tomadas, mochila visual
- **Backpack Visual**: Representação visual da mochila preenchida
- **Log de Decisões**: Mostra cada escolha tomada (✅ ✂️ ❌)

#### 5. **Sistema de Pontuação**
- Placar acumulativo por rodada
- Destaque visual do vencedor
- Banner final com resultado (Vitória/Derrota/Empate)
- Estatísticas para cada rodada

### 🔧 Melhorias Técnicas

#### 1. **Novos Arquivos**
- `src/utils/knapsackGame.js`: Lógica do algoritmo e geração de dados
  - `generateGemsForRound()`: Gera joias aleatórias
  - `greedyKnapsack()`: Algoritmo Greedy para fracionário
  - `randomChoice()`: Seleção aleatória com 60% de chance
  - `playRound()`: Executa uma rodada completa
  - `calculateTotalScore()`: Calcula pontuação total

#### 2. **Refatoração de Componentes React**
- `PlayerBackpack`: Visualização da mochila de um jogador
- `RoundResult`: Detalhes da rodada com joias e decisões
- `GameBoard`: Placar e controles principais
- `RoundsHistory`: Histórico de todas as rodadas
- `RoundDetails`: Detalhes completos da última rodada
- Removidos componentes antigos: `ItemList`, `AddItemForm`, `RatioTable`, etc.

#### 3. **Novo Sistema de Estilos**
- CSS completamente reescrito
- Design moderno com gradientes
- Tema escuro (dark mode)
- Cores consistentes com tema purple/violet
- Layout responsivo para desktop e mobile
- Animações suaves para interações

#### 4. **Constantes do Sistema**
```javascript
export const BACKPACK_CAPACITY = 20  // Capacidade em kg
export const MAX_MINING_ROUNDS = 5   // Número total de rodadas
export const GEM_TYPES = [...]       // Tipos de joias disponíveis
```

### 🎯 Mudanças na Lógica

#### Antes
- Visualizador de Knapsack com itens customizáveis
- Foco em educação do algoritmo
- Interface para adicionar/remover itens

#### Depois
- Jogo competitivo Jogador vs Computador
- Foco em demonstrar Sorte vs Algoritmo
- Interface orientada a gameplay
- Geração automática de dados

### 📊 Constantes do Jogo

| Parâmetro | Valor |
|-----------|-------|
| Capacidade da Mochila | 20 kg |
| Rodadas Totais | 5 por jogador |
| Rodadas com Sorte | 1-4 |
| Rodadas com Greedy | 5 |
| Chance de Sorte | 60% |
| Pesos de Joias | 0.5-3.5 kg |
| Tipos de Joias | 6 |

### 🐛 Correções

- Contador de rodadas agora mostra número correto
- Banner de vitória agora aparece corretamente
- Histórico de rodadas mostra apenas rodadas jogadas
- Botão muda para "Jogar Novamente" ao final do jogo

### 🎨 Melhorias Visuais

- Gradientes suaves no background
- Cards com borders coloridos
- Animações ao preencher mochila
- Cores distintas para diferentes estados (added, rejected, fractional)
- Layout responsivo
- Destaque para vencedor da rodada

### 📚 Documentação

- Adicionado `GAME_GUIDE.md` com explicação completa
- Seções sobre mecânica do jogo
- Explicação do algoritmo Greedy
- Estratégias e dicas
- Conceitos educacionais

### 🚀 Build e Deploy

- Project builds sem erros
- Output otimizado com Vite
- Tamanho final reduzido com gzip
- Pronto para deployment

```
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-CtsnbFIi.css    6.04 kB │ gzip:  1.84 kB
dist/assets/index-Rb1hhgeR.js   198.91 kB │ gzip: 62.49 kB
```

### ✅ Checklist de Requisitos Atendidos

- ✅ Demonstra algoritmo Greedy do Knapsack
- ✅ Representação tipo jogo Quartz
- ✅ Jogador vs Computador
- ✅ 5 rodadas de mineração cada
- ✅ Knapsack executado apenas na 5ª rodada
- ✅ Joias são divisíveis (fracionário)
- ✅ Mochila com capacidade de 20kg
- ✅ Interface visual clara
- ✅ Histórico de rodadas
- ✅ Resultado final com vencedor

### 🔄 Próximas Possibilidades (Futuro)

- [ ] Dificuldade ajustável
- [ ] Diferentes modos de jogo
- [ ] Leaderboard de pontuações
- [ ] Análise estatística das rodadas
- [ ] Customização de tipos de joias
- [ ] Modo multijogador online
- [ ] Replay de rodadas
- [ ] Exportação de estatísticas

---

**Data**: 2026-05-09
**Versão**: 1.0.0
**Status**: ✅ Concluído e Testado
