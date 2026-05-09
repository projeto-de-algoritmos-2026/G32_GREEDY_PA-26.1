import { useState, useCallback } from 'react'
import './App.css'
import {
  MAX_MINING_ROUNDS,
  BACKPACK_CAPACITY,
  ALL_GEM_TYPES,
  generateGemsForRound,
  playRound,
  manualKnapsackSelection,
  calculateTotalScore,
} from './utils/knapsackGame'

// ── Components ──

function PlayerBackpack({ gems, title, totalValue, usedWeight }) {
  const percentage = (usedWeight / BACKPACK_CAPACITY) * 100

  return (
    <div className="player-backpack">
      <h3>{title}</h3>
      <div className="backpack-visual">
        <div className="backpack-container">
          <div className="backpack-box">
            <div className="capacity-label">Cap: {BACKPACK_CAPACITY}kg</div>
            <div className="backpack-fill" style={{ height: `${Math.min(percentage, 100)}%` }}>
              {gems.map((gem) => (
                <div key={gem.id} className="gem-item" title={`${gem.name}: ${gem.selectedWeight}kg`}>
                  <img src={gem.image} alt={gem.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="backpack-stats">
          <div className="stat">
            <span className="stat-label">Peso:</span>
            <span className="stat-value">{usedWeight.toFixed(2)}kg / {BACKPACK_CAPACITY}kg</span>
          </div>
          <div className="stat">
            <span className="stat-label">Valor:</span>
            <span className="stat-value">💰 {totalValue.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Itens:</span>
            <span className="stat-value">{gems.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MinedGemSelector({ gems, roundNumber, onConfirm, onCancel }) {
  const [selectedWeights, setSelectedWeights] = useState({})

  const usedWeight = Object.values(selectedWeights).reduce((sum, value) => sum + Number(value || 0), 0)
  const remainingCapacity = Math.max(0, BACKPACK_CAPACITY - usedWeight)
  const totalValue = gems.reduce((sum, gem) => {
    const weight = Number(selectedWeights[gem.id] || 0)
    return sum + weight * gem.ratio
  }, 0)
  const isOverCapacity = usedWeight > BACKPACK_CAPACITY

  const updateWeight = (gem, value) => {
    const numericValue = Number(value)
    const safeValue = Number.isNaN(numericValue)
      ? 0
      : Math.max(0, Math.min(numericValue, gem.weight))

    setSelectedWeights(prev => ({
      ...prev,
      [gem.id]: parseFloat(safeValue.toFixed(2)),
    }))
  }

  const fillRemaining = (gem) => {
    const currentWeight = Number(selectedWeights[gem.id] || 0)
    const availableForGem = BACKPACK_CAPACITY - (usedWeight - currentWeight)
    updateWeight(gem, Math.min(gem.weight, availableForGem))
  }

  const handleConfirm = () => {
    if (usedWeight <= 0) {
      alert('Escolha pelo menos uma pedra para colocar na mochila!')
      return
    }

    if (isOverCapacity) {
      alert(`A mochila suporta apenas ${BACKPACK_CAPACITY}kg.`)
      return
    }

    onConfirm(selectedWeights)
  }

  return (
    <div className="gem-selector-overlay">
      <div className="mined-selector">
        <h2>⛏️ Pedras Mineradas</h2>
        <p className="gem-selector-subtitle">
          Rodada {roundNumber}: escolha quais pedras e quantos kg de cada uma vão para a mochila.
        </p>

        <div className="capacity-summary">
          <div>
            <span className="stat-label">Peso escolhido</span>
            <strong className={isOverCapacity ? 'over-capacity' : ''}>
              {usedWeight.toFixed(2)}kg / {BACKPACK_CAPACITY}kg
            </strong>
          </div>
          <div>
            <span className="stat-label">Espaço livre</span>
            <strong>{remainingCapacity.toFixed(2)}kg</strong>
          </div>
          <div>
            <span className="stat-label">Valor estimado</span>
            <strong>💰 {totalValue.toFixed(2)}</strong>
          </div>
        </div>

        <div className="mined-gems-list">
          {gems.map((gem) => {
            const selectedWeight = Number(selectedWeights[gem.id] || 0)
            const selectedValue = selectedWeight * gem.ratio

            return (
              <div key={gem.id} className={`mined-gem-item ${selectedWeight > 0 ? 'selected' : ''}`}>
                <div className="gem-option-image">
                  <img src={gem.image} alt={gem.name} />
                </div>
                <div className="mined-gem-info">
                  <div className="gem-name">{gem.name}</div>
                  <div className="gem-stats">
                    Minerado: {gem.weight.toFixed(1)}kg • valor/kg: {gem.ratio.toFixed(2)} • total: {gem.value.toFixed(2)}
                  </div>
                  <div className="selected-gem-value">
                    Na mochila: {selectedValue.toFixed(2)} valor
                  </div>
                </div>
                <div className="gem-weight-control">
                  <input
                    type="number"
                    min="0"
                    max={gem.weight}
                    step="0.1"
                    value={selectedWeights[gem.id] ?? ''}
                    placeholder="0"
                    onChange={(event) => updateWeight(gem, event.target.value)}
                    aria-label={`Quantidade de ${gem.name} em kg`}
                  />
                  <span>kg</span>
                  <button type="button" className="btn-small" onClick={() => fillRemaining(gem)}>
                    Máx.
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="gem-selector-actions">
          <button onClick={onCancel} className="btn-cancel-selector">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="btn-start-game" disabled={isOverCapacity}>
            🎒 Guardar na Mochila
          </button>
        </div>
      </div>
    </div>
  )
}

function RoundResult({ round }) {
  const strategyLabel = round.strategy === 'greedy'
    ? '🤖 Algoritmo Greedy'
    : round.strategy === 'manual'
      ? '🎒 Escolha do Jogador'
      : '🎲 Sorte'

  return (
    <div className="round-result">
      <div className="round-header">
        <h4>Rodada {round.round} {strategyLabel}</h4>
      </div>

      <div className="gems-offered">
        <p className="gems-title">💎 Joias Disponíveis:</p>
        <div className="gems-list">
          {round.gems.map((gem) => (
            <div key={gem.id} className="gem-option">
              <div className="gem-option-image">
                <img src={gem.image} alt={gem.name} />
              </div>
              <div className="gem-info">
                <div className="gem-name">{gem.name}</div>
                <div className="gem-stats">{gem.weight.toFixed(1)}kg • {gem.value.toFixed(2)} valor • razão: {gem.ratio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="decision-log">
        <p className="log-title">📋 Decisões:</p>
        <ul>
          {round.log.map((entry, i) => (
            <li key={i} className={`log-entry log-${entry.type}`}>
              {entry.type === 'added' && '✅'}
              {entry.type === 'rejected' && '❌'}
              {entry.type === 'skipped' && '⏭️'}
              {entry.type === 'fractional' && '✂️'}
              {' '}
              {entry.msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function GameBoard({ gameState, onPlayRound }) {
  const playerTotal = calculateTotalScore(gameState.playerRounds)
  const computerTotal = calculateTotalScore(gameState.computerRounds)
  const isGameOver = gameState.playerRounds.length >= MAX_MINING_ROUNDS && gameState.computerRounds.length >= MAX_MINING_ROUNDS
  const currentRoundNum = Math.min(Math.max(gameState.playerRounds.length, gameState.computerRounds.length), MAX_MINING_ROUNDS)

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>⛏️ Quartz Knapsack Game</h1>
        <p className="subtitle">Jogador vs Computador • Greedy Knapsack</p>
      </div>

      <div className="game-status">
        <div className="round-counter">
          Rodada: {currentRoundNum} / {MAX_MINING_ROUNDS}
        </div>
        <div className="strategy-info">
          {isGameOver
            ? '✨ Jogo Finalizado!'
            : currentRoundNum < MAX_MINING_ROUNDS
              ? '🎲 Fase de Sorte'
              : '🤖 Rodada Greedy!'}
        </div>
      </div>

      <div className="scoreboard">
        <div className={`score-card ${playerTotal > computerTotal && isGameOver ? 'winner' : ''}`}>
          <h3>👤 Jogador</h3>
          <div className="score-value">{playerTotal.toFixed(2)}</div>
          <div className="score-subtitle">Pontuação Total</div>
        </div>

        <div className={`score-card ${computerTotal > playerTotal && isGameOver ? 'winner' : ''}`}>
          <h3>🤖 Computador</h3>
          <div className="score-value">{computerTotal.toFixed(2)}</div>
          <div className="score-subtitle">Pontuação Total</div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="actions">
          <button onClick={onPlayRound} className="btn-play">
            ⛏️ Ir à Mineração
          </button>
        </div>
      ) : (
        <div className="game-over">
          <div className="winner-banner">
            {playerTotal > computerTotal
              ? '🎉 VOCÊ VENCEU!'
              : playerTotal === computerTotal
                ? '🤝 EMPATE!'
                : '🤖 COMPUTADOR VENCEU!'}
          </div>
          <button onClick={() => window.location.reload()} className="btn-restart">
            🔄 Jogar Novamente
          </button>
        </div>
      )}
    </div>
  )
}

function RoundsHistory({ playerRounds, computerRounds }) {
  return (
    <div className="rounds-history">
      <h3>📊 Histórico de Rodadas</h3>
      <div className="history-grid">
        {Array.from({ length: MAX_MINING_ROUNDS }).map((_, i) => {
          const playerRound = playerRounds[i]
          const computerRound = computerRounds[i]
          const playerScore = playerRound?.totalValue || 0
          const computerScore = computerRound?.totalValue || 0

          return (
            <div key={i} className="history-round">
              <div className="round-number">Rodada {i + 1}</div>
              <div className="round-scores">
                <div className={`score ${playerScore >= computerScore ? 'higher' : ''}`}>
                  👤 {playerScore.toFixed(1)}
                </div>
                <div className={`score ${computerScore > playerScore ? 'higher' : ''}`}>
                  🤖 {computerScore.toFixed(1)}
                </div>
              </div>
              {i === MAX_MINING_ROUNDS - 1 && (
                <div className="greedy-badge">🤖 Greedy</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RoundDetails({ round }) {
  if (!round) return null

  return (
    <div className="round-details">
      <h3>🔍 Detalhes da Rodada {round.round}</h3>
      <RoundResult round={round} />
      <PlayerBackpack
        gems={round.selected}
        title={round.isComputerTurn ? '🤖 Computador' : '👤 Você'}
        totalValue={round.totalValue}
        usedWeight={round.usedWeight}
      />
    </div>
  )
}

// ── Main App ──

export default function App() {
  const [pendingPlayerMining, setPendingPlayerMining] = useState(null)
  const [gameState, setGameState] = useState({
    playerRounds: [],
    computerRounds: [],
    lastPlayerRound: null,
    lastComputerRound: null,
  })

  const isPlayerTurn = gameState.playerRounds.length <= gameState.computerRounds.length

  const handlePlayerRoundWithSelection = useCallback((selectedWeights) => {
    if (!pendingPlayerMining) return

    const roundNumber = gameState.playerRounds.length + 1
    const result = manualKnapsackSelection(
      pendingPlayerMining.gems,
      selectedWeights,
      BACKPACK_CAPACITY,
    )
    const round = {
      round: roundNumber,
      strategy: 'manual',
      gems: pendingPlayerMining.gems,
      selected: result.selected,
      usedWeight: result.usedWeight,
      totalValue: result.totalValue,
      log: result.log,
      isComputerTurn: false,
    }

    setPendingPlayerMining(null)
    setGameState(prev => ({
      ...prev,
      playerRounds: [...prev.playerRounds, round],
      lastPlayerRound: round,
    }))
  }, [gameState.playerRounds.length, pendingPlayerMining])

  const handlePlayRound = useCallback(() => {
    if (isPlayerTurn) {
      const roundNumber = gameState.playerRounds.length + 1
      setPendingPlayerMining({
        roundNumber,
        gems: generateGemsForRound(ALL_GEM_TYPES),
      })
      return
    }

    const roundNumber = gameState.computerRounds.length + 1
    const computerSelectionIds = roundNumber === MAX_MINING_ROUNDS
      ? [...ALL_GEM_TYPES]
        .sort((a, b) => b.density - a.density)
        .slice(0, 3)
        .map((gem) => gem.id)
      : ALL_GEM_TYPES.map((gem) => gem.id)

    const availableGems = ALL_GEM_TYPES.filter(gem => computerSelectionIds.includes(gem.id))
    const round = playRound(roundNumber, true, availableGems)

    setGameState(prev => ({
      ...prev,
      computerRounds: [...prev.computerRounds, round],
      lastComputerRound: round,
    }))
  }, [gameState.computerRounds.length, gameState.playerRounds.length, isPlayerTurn])

  const currentRound = gameState.playerRounds.length > gameState.computerRounds.length
    ? gameState.lastPlayerRound
    : gameState.lastComputerRound || gameState.lastPlayerRound
  const hasGameStarted = gameState.playerRounds.length > 0 || gameState.computerRounds.length > 0

  return (
    <div className="app-container">
      {pendingPlayerMining && (
        <MinedGemSelector
          gems={pendingPlayerMining.gems}
          roundNumber={pendingPlayerMining.roundNumber}
          onConfirm={handlePlayerRoundWithSelection}
          onCancel={() => setPendingPlayerMining(null)}
        />
      )}

      <GameBoard
        gameState={gameState}
        onPlayRound={handlePlayRound}
      />

      {hasGameStarted && (
        <div className="game-content">
          <div className="main-panel">
            {currentRound && <RoundDetails round={currentRound} />}
          </div>

          <div className="side-panel">
            <RoundsHistory
              playerRounds={gameState.playerRounds}
              computerRounds={gameState.computerRounds}
            />
          </div>
        </div>
      )}
    </div>
  )
}
