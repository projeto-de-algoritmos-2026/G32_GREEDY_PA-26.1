// Tipos de joias disponíveis (divisíveis)
export const ALL_GEM_TYPES = [
  { id: 'diamond', name: 'Diamante', image: '/src/assets/diamond.png', density: 25 },
  { id: 'emerald', name: 'Esmeralda', image: '/src/assets/emerald.png', density: 18 },
  { id: 'ruby', name: 'Rubi', image: '/src/assets/ruby.png', density: 15 },
  { id: 'sapphire', name: 'Safira', image: '/src/assets/sapphire.png', density: 12 },
  { id: 'topaz', name: 'Topázio', image: '/src/assets/topaz.png', density: 10 },
  { id: 'amethyst', name: 'Ametista', image: '/src/assets/amethyst.png', density: 8 },
]

// Função para obter tipos de gemas selecionados
export function getSelectedGemTypes(selectedIds) {
  if (!selectedIds || selectedIds.length === 0) {
    return ALL_GEM_TYPES // Se nenhum selecionado, usa todos
  }
  return ALL_GEM_TYPES.filter(gem => selectedIds.includes(gem.id))
}

export const GEM_TYPES = ALL_GEM_TYPES

// Capacidade da mochila em kg
export const BACKPACK_CAPACITY = 20

// Máximo de minerações por jogador
export const MAX_MINING_ROUNDS = 5

/**
 * Gera joias aleatórias para uma rodada de mineração
 * Cada joia é divisível
 */
export function generateGemsForRound(availableGemTypes = GEM_TYPES) {
  const gems = []
  const numGems = Math.floor(Math.random() * 3) + 3 // 3-5 joias por rodada

  for (let i = 0; i < numGems; i++) {
    const gemType = availableGemTypes[Math.floor(Math.random() * availableGemTypes.length)]
    const weight = parseFloat((Math.random() * 3 + 0.5).toFixed(1)) // 0.5-3.5 kg
    const value = parseFloat((weight * gemType.density).toFixed(2))

    gems.push({
      id: `${Date.now()}-${Math.random()}`,
      gemTypeId: gemType.id,
      name: gemType.name,
      image: gemType.image,
      weight,
      value,
      ratio: parseFloat((value / weight).toFixed(2)),
    })
  }

  return gems
}

/**
 * Algoritmo Greedy para Knapsack fracionário
 * Seleciona itens pela melhor razão valor/peso
 */
export function greedyKnapsack(items, capacity) {
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio)
  const selected = []
  let usedWeight = 0
  let totalValue = 0
  const log = []

  for (const item of sorted) {
    const remaining = capacity - usedWeight

    if (remaining <= 0) {
      log.push({
        id: item.id,
        msg: `Rejeitado "${item.name}" — mochila cheia`,
        type: 'rejected',
      })
      continue
    }

    if (item.weight <= remaining) {
      // Item cabe completamente
      selected.push({
        ...item,
        selectedWeight: item.weight,
        selectedValue: item.value,
      })
      usedWeight += item.weight
      totalValue += item.value
      log.push({
        id: item.id,
        msg: `Selecionado "${item.name}" (${item.weight}kg, ${item.value.toFixed(2)} valor)`,
        type: 'added',
      })
    } else {
      // Pega apenas uma fração do item
      const fraction = remaining / item.weight
      const selectedWeight = parseFloat((item.weight * fraction).toFixed(2))
      const selectedValue = parseFloat((item.value * fraction).toFixed(2))

      selected.push({
        ...item,
        selectedWeight,
        selectedValue,
        isFractional: true,
      })
      usedWeight = capacity
      totalValue += selectedValue
      log.push({
        id: item.id,
        msg: `Fracionado "${item.name}" — ${selectedWeight.toFixed(2)}kg de ${item.weight}kg (${selectedValue.toFixed(2)} valor)`,
        type: 'fractional',
      })
      break // Mochila ficou cheia
    }
  }

  return {
    selected,
    usedWeight: parseFloat(usedWeight.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    log,
  }
}

/**
 * Escolha aleatória de itens (para as primeiras 4 rodadas)
 */
export function randomChoice(items, capacity) {
  const selected = []
  let usedWeight = 0
  let totalValue = 0
  const log = []

  // Embaralha itens
  const shuffled = [...items].sort(() => Math.random() - 0.5)

  for (const item of shuffled) {
    const remaining = capacity - usedWeight

    if (remaining <= 0) {
      log.push({
        id: item.id,
        msg: `Pulado (sorte) "${item.name}" — sem espaço`,
        type: 'skipped',
      })
      continue
    }

    // 60% de chance de escolher o item
    if (Math.random() < 0.6) {
      if (item.weight <= remaining) {
        selected.push({
          ...item,
          selectedWeight: item.weight,
          selectedValue: item.value,
        })
        usedWeight += item.weight
        totalValue += item.value
        log.push({
          id: item.id,
          msg: `Escolhido (sorte) "${item.name}"`,
          type: 'added',
        })
      } else {
        log.push({
          id: item.id,
          msg: `Não coube (sorte) "${item.name}"`,
          type: 'rejected',
        })
      }
    } else {
      log.push({
        id: item.id,
        msg: `Recusado (sorte) "${item.name}"`,
        type: 'rejected',
      })
    }
  }

  return {
    selected,
    usedWeight: parseFloat(usedWeight.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    log,
  }
}

/**
 * Monta a mochila a partir das quantidades escolhidas pelo jogador.
 */
export function manualKnapsackSelection(items, selections, capacity, initialWeight = 0) {
  const selected = []
  let totalWeight = initialWeight
  let addedWeight = 0
  let totalValue = 0
  const log = []

  for (const item of items) {
    const requestedWeight = Number(selections[item.id] || 0)
    const remaining = parseFloat((capacity - totalWeight).toFixed(2))
    const selectedWeight = Math.max(0, Math.min(requestedWeight, item.weight, remaining))

    if (selectedWeight > 0) {
      const selectedValue = parseFloat((selectedWeight * item.ratio).toFixed(2))

      selected.push({
        ...item,
        selectedWeight,
        selectedValue,
        isFractional: selectedWeight < item.weight,
      })
      totalWeight += selectedWeight
      addedWeight += selectedWeight
      totalValue += selectedValue
      log.push({
        id: item.id,
        msg: `Você colocou "${item.name}" na mochila (${selectedWeight.toFixed(2)}kg de ${item.weight.toFixed(1)}kg, ${selectedValue.toFixed(2)} valor)`,
        type: selectedWeight < item.weight ? 'fractional' : 'added',
      })
    } else {
      log.push({
        id: item.id,
        msg: `Você deixou "${item.name}" fora da mochila`,
        type: 'rejected',
      })
    }
  }

  return {
    selected,
    usedWeight: parseFloat(addedWeight.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    log,
  }
}

/**
 * Simula uma rodada completa para um jogador
 */
export function playRound(roundNumber, isComputerTurn, availableGemTypes = GEM_TYPES, capacity = BACKPACK_CAPACITY) {
  const gems = generateGemsForRound(availableGemTypes)
  const isGreedyRound = roundNumber === MAX_MINING_ROUNDS
  const strategy = isGreedyRound ? 'greedy' : 'random'

  const result = isGreedyRound
    ? greedyKnapsack(gems, capacity)
    : randomChoice(gems, capacity)

  return {
    round: roundNumber,
    strategy,
    gems,
    selected: result.selected,
    usedWeight: result.usedWeight,
    totalValue: result.totalValue,
    log: result.log,
    isComputerTurn,
  }
}

/**
 * Calcula pontuação total de todas as rodadas
 */
export function calculateTotalScore(rounds) {
  return rounds.reduce((sum, round) => sum + round.totalValue, 0)
}

/**
 * Calcula o peso acumulado na mochila ao longo das rodadas.
 */
export function calculateTotalWeight(rounds) {
  return rounds.reduce((sum, round) => sum + round.usedWeight, 0)
}

/**
 * Retorna todos os itens que continuam na mesma mochila.
 */
export function getBackpackItems(rounds) {
  return rounds.flatMap(round => round.selected)
}
