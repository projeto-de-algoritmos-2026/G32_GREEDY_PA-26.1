# ⛏️ Quartz Knapsack Game - Guia do Jogo

## 🎮 Visão Geral

**Quartz Knapsack Game** é uma representação interativa do algoritmo **Greedy Knapsack** (Mochila Gulosa) combinado com mecânicas de sorte e estratégia, inspirado no jogo de tabuleiro Quartz.

### Objetivo

- **Jogador vs O ganancioso (Computador)**: Compete para sair com a mochila mais valiosa
- **5 Rodadas de Mineração**: Cada jogador minera até 5 vezes
- **Estratégia Progressiva**: Sorte nas 4 primeiras rodadas, Algoritmo Greedy na 5ª rodada
- **Capacidade Limitada**: Mochila com limite de 20kg

---

## 🎯 Como Jogar

### Mecânica Básica

1. **Clique em "⛏️ Ir à Mineração"** para começar uma rodada
2. **Alternância**: Jogador e O ganancioso (Computador) alternam rodadas
3. **5 Rodadas Totais**: Após 5 rodadas de cada, o jogo termina

### Fases do Jogo

#### **Rodadas 1-4: 🎲 Fase de Sorte**

- Itens são **escolhidos aleatoriamente** (60% de chance de pegar cada item)
- Mistura sorte com pequenas escolhas
- Sem algoritmo: apenas estratégia intuitiva

#### **Rodada 5: 👾 Algoritmo Greedy**

- O ganancioso (Computador) usa **Algoritmo Greedy Knapsack**
- Escolhe itens pela **melhor razão Valor/Peso**
- Demonstra a eficiência do algoritmo vs. sorte

---

## 💎 Sistema de Joias

### Tipos de Joias Disponíveis

| Joia      | Densidade (valor/kg) |
| --------- | -------------------- |
| Diamante  | 25                   |
| Esmeralda | 18                   |
| Rubi      | 15                   |
| Safira    | 12                   |
| Topázio   | 10                   |
| Ametista  | 8                    |

### Características

- **Divisíveis**: Joias podem ser fracionadas
- **Pesos Variados**: 0.5kg a 3.5kg por joia
- **Valores Dinâmicos**: Valor = Peso × Densidade

---

## 📊 Placar e Histórico

### Pontuação Total

- Soma de todas as 5 rodadas
- Mostra em tempo real no topo do jogo
- Vencedor é quem tiver **maior valor total**

### Histórico de Rodadas

- Painel lateral mostra desempenho em cada rodada
- Rodada 5 está marcada com 👾 Greedy
- Realça o placar vencedor de cada rodada em **azul**

---

## 👾 Algoritmo Greedy Knapsack

### Como Funciona (Rodada 5)

1. **Ordena** itens por razão Valor/Peso (do maior para o menor)
2. **Seleciona** itens na ordem até a mochila ficar cheia
3. **Fracciona** o último item para aproveitar totalmente o espaço

### Log de Decisões

O jogo mostra cada decisão:

| Símbolo | Significado      | Exemplo                                     |
| ------- | ---------------- | ------------------------------------------- |
| ✅      | Item selecionado | Diamante escolhido (2kg, 50 valor)          |
| ❌      | Item rejeitado   | Rubi rejeitado (sem espaço)                 |
| ✂️      | Item fracionado  | Parte da Esmeralda utilizada (0.5kg de 2kg) |

---

## 🎲 Estratégia de Sorte (Rodadas 1-4)

- **60% de Chance**: Cada item tem 60% de ser selecionado aleatoriamente
- **Sem Ordem**: Itens são processados em ordem aleatória
- **Resultado Variável**: Pontuações podem ser muito diferentes

### Por que misturar sorte com algoritmo?

Esta implementação demonstra:

- ✨ **Diferentes enfoques** para problema de otimização
- 🎯 **Eficiência do Greedy**: Rodada 5 geralmente supera rounde aleatórias
- 🎲 **Impacto da aleatoriedade**: Sorte pode vencer em algumas rodadas

---

## 🏆 Resultado Final

### Tela de Vitória

Ao final das 5 rodadas:

- **Placar Final** é exibido em grande destaque
- **Banner de Vitória** indica o vencedor:
  - 🎉 **Você Venceu!** - Jogador tem mais valor
  - 👾 **O ganancioso (Computador) Venceu!** - O ganancioso (Computador) tem mais valor
  - 🤝 **Empate!** - Ambos tem o mesmo valor

### Replay

- Clique em **"🔄 Jogar Novamente"** para uma nova partida
- Cada partida gera valores e joias diferentes

---

## 📚 Conceitos Educacionais

### Algoritmo Greedy (Guloso)

O algoritmo Greedy para o Knapsack fracionário:

- **Abordagem**: Sempre escolhe a melhor opção local
- **Implementação**: Ordena por Valor/Peso e preenche a mochila
- **Otimalidade**: É ÓTIMO para Knapsack fracionário
- **Complexidade**: O(n log n) para ordenação

### Por que Knapsack Fracionário?

- Itens **divisíveis** (joias podem ser fracionadas)
- Algoritmo Greedy garante solução **ótima**
- Diferente do 0/1 Knapsack (NP-Hard)

---

## 🔧 Tecnologia

### Stack

- **React 19**: Componentes interativos
- **Vite**: Build tool de alta performance
- **JavaScript ES6+**: Lógica do algoritmo
- **CSS3**: Design responsivo com gradientes

### Arquitetura

```
src/
├── App.jsx              # Componente principal do jogo
├── App.css              # Estilos do jogo
├── utils/
│   └── knapsackGame.js  # Lógica do algoritmo Greedy
└── main.jsx             # Entrada da aplicação
```

---

## 💡 Dicas para Maximizar Pontuação

### Estratégia Ideal na Rodada 5 (Greedy)

1. Procure por itens com **alta densidade** (Diamante, Esmeralda)
2. O algoritmo irá **automaticamente** ordenar e preencher
3. Você será recompensado por ter boas joias disponíveis

### Sorte nas Rodadas 1-4

- Não há estratégia fixa - é aleatória!
- Diversas joias = mais chances de boa seleção
- Estatisticamente, ~60% de chance por item

---

## 📈 Estatísticas

### Capacidade da Mochila

- **20kg** de limite total
- Usar todo o espaço é ideal
- Frações são permitidas e incentivadas

### Rodadas

- **5 rodadas totais** (alternando jogador/O ganancioso (Computador))
- **Fase de Sorte**: Rodadas 1-4
- **Fase Greedy**: Rodada 5

---

## 🎓 Conclusão

Este jogo demonstra como:

- ✅ **Algoritmos gulosos** podem ser muito eficientes
- 📊 **Visualização** torna conceitos abstratos compreensíveis
- 🎮 **Gamificação** engaja aprendizado
- ⚖️ **Comparação** entre estratégias é educacional

Divirta-se explorando o poder do Greedy Knapsack! 🚀

---

**Projeto**: PA G32 - Greedy Algorithm Knapsack Visualization
**Versão**: 1.0.0
**Autor**: Felipe
**Data**: 2026
