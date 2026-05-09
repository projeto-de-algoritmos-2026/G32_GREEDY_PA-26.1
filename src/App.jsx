import { useState, useCallback } from "react";
import "./App.css";
import {
  MAX_MINING_ROUNDS,
  BACKPACK_CAPACITY,
  ALL_GEM_TYPES,
  generateGemsForRound,
  greedyKnapsack,
  manualKnapsackSelection,
  calculateTotalScore,
  calculateTotalWeight,
  getBackpackItems,
} from "./utils/knapsackGame";

// ── Components ──

function PlayerBackpack({ gems, title, totalValue, usedWeight }) {
  const percentage = (usedWeight / BACKPACK_CAPACITY) * 100;

  return (
    <div className="player-backpack">
      <h3>{title}</h3>
      <div className="backpack-visual">
        <div className="backpack-container">
          <div className="backpack-box">
            <div className="capacity-label">Cap: {BACKPACK_CAPACITY}kg</div>
            <div
              className="backpack-fill"
              style={{ height: `${Math.min(percentage, 100)}%` }}
            >
              {gems.map((gem) => (
                <div
                  key={gem.id}
                  className="gem-item"
                  title={`${gem.name}: ${gem.selectedWeight}kg`}
                >
                  <img src={gem.image} alt={gem.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="backpack-stats">
          <div className="stat">
            <span className="stat-label">Peso:</span>
            <span className="stat-value">
              {usedWeight.toFixed(2)}kg / {BACKPACK_CAPACITY}kg
            </span>
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
  );
}

function MinedGemSelector({
  gems,
  roundNumber,
  currentBackpackWeight,
  onConfirm,
  onCancel,
}) {
  const [selectedWeights, setSelectedWeights] = useState({});

  const usedWeight = Object.values(selectedWeights).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const totalBackpackWeight = currentBackpackWeight + usedWeight;
  const remainingCapacity = Math.max(
    0,
    BACKPACK_CAPACITY - totalBackpackWeight,
  );
  const totalValue = gems.reduce((sum, gem) => {
    const weight = Number(selectedWeights[gem.id] || 0);
    return sum + weight * gem.ratio;
  }, 0);
  const isOverCapacity = totalBackpackWeight > BACKPACK_CAPACITY;

  const updateWeight = (gem, value) => {
    const numericValue = Number(value);
    const safeValue = Number.isNaN(numericValue)
      ? 0
      : Math.max(0, Math.min(numericValue, gem.weight));

    setSelectedWeights((prev) => ({
      ...prev,
      [gem.id]: parseFloat(safeValue.toFixed(2)),
    }));
  };

  const fillRemaining = (gem) => {
    const currentWeight = Number(selectedWeights[gem.id] || 0);
    const maxWeightForGem = Math.min(
      gem.weight,
      currentWeight + remainingCapacity,
    );
    updateWeight(gem, maxWeightForGem);
  };

  const handleConfirm = () => {
    if (currentBackpackWeight >= BACKPACK_CAPACITY) {
      onConfirm(selectedWeights);
      return;
    }

    if (usedWeight <= 0) {
      alert("Escolha pelo menos uma pedra para colocar na mochila!");
      return;
    }

    if (isOverCapacity) {
      alert(`A mochila suporta no máximo ${BACKPACK_CAPACITY}kg no total.`);
      return;
    }

    onConfirm(selectedWeights);
  };

  return (
    <div className="gem-selector-overlay">
      <div className="mined-selector">
        <h2>⛏️ Pedras Mineradas</h2>
        <p className="gem-selector-subtitle">
          Rodada {roundNumber}: escolha quais pedras e quantos kg de cada uma
          entram no espaço livre da mochila.
        </p>

        <div className="capacity-summary">
          <div>
            <span className="stat-label">Já na mochila</span>
            <strong>
              {currentBackpackWeight.toFixed(2)}kg / {BACKPACK_CAPACITY}kg
            </strong>
          </div>
          <div>
            <span className="stat-label">Peso escolhido</span>
            <strong className={isOverCapacity ? "over-capacity" : ""}>
              +{usedWeight.toFixed(2)}kg
            </strong>
          </div>
          <div>
            <span className="stat-label">Total após guardar</span>
            <strong className={isOverCapacity ? "over-capacity" : ""}>
              {totalBackpackWeight.toFixed(2)}kg / {BACKPACK_CAPACITY}kg
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
            const selectedWeight = Number(selectedWeights[gem.id] || 0);
            const selectedValue = selectedWeight * gem.ratio;

            return (
              <div
                key={gem.id}
                className={`mined-gem-item ${selectedWeight > 0 ? "selected" : ""}`}
              >
                <div className="gem-option-image">
                  <img src={gem.image} alt={gem.name} />
                </div>
                <div className="mined-gem-info">
                  <div className="gem-name">{gem.name}</div>
                  <div className="gem-stats">
                    Minerado: {gem.weight.toFixed(1)}kg • valor/kg:{" "}
                    {gem.ratio.toFixed(2)} • total: {gem.value.toFixed(2)}
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
                    disabled={currentBackpackWeight >= BACKPACK_CAPACITY}
                    value={selectedWeights[gem.id] ?? ""}
                    placeholder="0"
                    onChange={(event) => updateWeight(gem, event.target.value)}
                    aria-label={`Quantidade de ${gem.name} em kg`}
                  />
                  <span>kg</span>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => fillRemaining(gem)}
                    disabled={currentBackpackWeight >= BACKPACK_CAPACITY}
                  >
                    Máx.
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="gem-selector-actions">
          <button onClick={onCancel} className="btn-cancel-selector">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="btn-start-game"
            disabled={isOverCapacity}
          >
            {currentBackpackWeight >= BACKPACK_CAPACITY
              ? "Mochila Cheia"
              : "🎒 Guardar na Mochila"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoundResult({ round }) {
  const strategyLabel =
    round.strategy === "greedy"
      ? "👾 Algoritmo Greedy"
      : round.strategy === "manual"
        ? "🎒 Escolha do Jogador"
        : round.strategy === "collecting"
          ? "⛏️ Acumulando Mineração"
          : "🎲 Sorte";

  return (
    <div className="round-result">
      <div className="round-header">
        <h4>
          Rodada {round.round} {strategyLabel}
        </h4>
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
                <div className="gem-stats">
                  {gem.weight.toFixed(1)}kg • {gem.value.toFixed(2)} valor •
                  razão: {gem.ratio}
                </div>
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
              {entry.type === "added" && "✅"}
              {entry.type === "rejected" && "❌"}
              {entry.type === "skipped" && "⏭️"}
              {entry.type === "fractional" && "✂️"} {entry.msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GameBoard({ gameState, onPlayRound }) {
  const playerTotal = calculateTotalScore(gameState.playerRounds);
  const computerTotal = calculateTotalScore(gameState.computerRounds);
  const playerWeight = calculateTotalWeight(gameState.playerRounds);
  const computerWeight = calculateTotalWeight(gameState.computerRounds);
  const isGameOver =
    gameState.playerRounds.length >= MAX_MINING_ROUNDS &&
    gameState.computerRounds.length >= MAX_MINING_ROUNDS;
  const currentRoundNum = Math.min(
    Math.max(gameState.playerRounds.length, gameState.computerRounds.length),
    MAX_MINING_ROUNDS,
  );
  const nextRoundNumber = gameState.playerRounds.length + 1;
  const playButtonLabel =
    gameState.playerRounds.length === 0
      ? "⛏️ Ir à Mineração"
      : nextRoundNumber === MAX_MINING_ROUNDS
        ? "🏁 Finalizar o dia"
        : "➡️ Próxima rodada";

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>⛏️ Quartz Knapsack Game</h1>
        <p className="subtitle">Jogador vs O Ganancioso • Greedy Knapsack</p>
      </div>

      <div className="game-status">
        <div className="round-counter">
          Rodada: {currentRoundNum} / {MAX_MINING_ROUNDS}
        </div>
        <div className="strategy-info">
          {isGameOver
            ? "✨ Jogo Finalizado!"
            : currentRoundNum < MAX_MINING_ROUNDS
              ? "🎲 Fase de Sorte"
              : "👾 Rodada Greedy!"}
        </div>
      </div>

      <div className="scoreboard">
        <div
          className={`score-card ${playerTotal > computerTotal && isGameOver ? "winner" : ""}`}
        >
          <h3>👤 Jogador</h3>
          <div className="score-value">{playerTotal.toFixed(2)}</div>
          <div className="score-subtitle">
            Valor na Mochila • {playerWeight.toFixed(2)}kg
          </div>
        </div>

        <div
          className={`score-card ${computerTotal > playerTotal && isGameOver ? "winner" : ""}`}
        >
          <h3>👾 O Ganancioso</h3>
          <div className="score-value">{computerTotal.toFixed(2)}</div>
          <div className="score-subtitle">
            Valor na Mochila • {computerWeight.toFixed(2)}kg
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="actions">
          <button onClick={onPlayRound} className="btn-play">
            {playButtonLabel}
          </button>
        </div>
      ) : (
        <div className="game-over">
          <div className="winner-banner">
            {playerTotal > computerTotal
              ? "🎉 VOCÊ VENCEU!"
              : playerTotal === computerTotal
                ? "🤝 EMPATE!"
                : "👾 O Ganancioso VENCEU!"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-restart"
          >
            🔄 Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}

function RoundsHistory({ playerRounds, computerRounds }) {
  return (
    <div className="rounds-history">
      <h3>📊 Histórico de Rodadas</h3>
      <div className="history-grid">
        {Array.from({ length: MAX_MINING_ROUNDS }).map((_, i) => {
          const playerScore = calculateTotalScore(playerRounds.slice(0, i + 1));
          const computerScore = calculateTotalScore(
            computerRounds.slice(0, i + 1),
          );

          return (
            <div key={i} className="history-round">
              <div className="round-number">Rodada {i + 1}</div>
              <div className="round-scores">
                <div
                  className={`score ${playerScore >= computerScore ? "higher" : ""}`}
                >
                  👤 {playerScore.toFixed(1)}
                </div>
                <div
                  className={`score ${computerScore > playerScore ? "higher" : ""}`}
                >
                  👾 {computerScore.toFixed(1)}
                </div>
              </div>
              {i === MAX_MINING_ROUNDS - 1 && (
                <div className="greedy-badge">👾 Greedy</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoundPairDetails({
  playerRound,
  computerRound,
  playerBackpackItems,
  computerBackpackItems,
  playerTotalValue,
  computerTotalValue,
  playerUsedWeight,
  computerUsedWeight,
}) {
  if (!playerRound && !computerRound) return null;

  const roundNumber = playerRound?.round || computerRound?.round;

  return (
    <div className="round-details">
      <h3>🔍 Detalhes da Rodada {roundNumber}</h3>
      <div className="round-comparison">
        <div className="round-column">
          <h4 className="round-owner">👤 Suas decisões</h4>
          {playerRound && <RoundResult round={playerRound} />}
          <PlayerBackpack
            gems={playerBackpackItems}
            title="👤 Sua Mochila"
            totalValue={playerTotalValue}
            usedWeight={playerUsedWeight}
          />
        </div>

        <div className="round-column">
          <h4 className="round-owner">👾 Decisões do Robô</h4>
          {computerRound && <RoundResult round={computerRound} />}
          <PlayerBackpack
            gems={computerBackpackItems}
            title="👾 Mochila do O Ganancioso"
            totalValue={computerTotalValue}
            usedWeight={computerUsedWeight}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main App ──

export default function App() {
  const [pendingPlayerMining, setPendingPlayerMining] = useState(null);
  const [gameState, setGameState] = useState({
    playerRounds: [],
    computerRounds: [],
    computerMinedGems: [],
    lastPlayerRound: null,
    lastComputerRound: null,
  });

  const playerBackpackWeight = calculateTotalWeight(gameState.playerRounds);

  const handlePlayerRoundWithSelection = useCallback(
    (selectedWeights) => {
      if (!pendingPlayerMining) return;

      const roundNumber = pendingPlayerMining.roundNumber;
      const result = manualKnapsackSelection(
        pendingPlayerMining.gems,
        selectedWeights,
        BACKPACK_CAPACITY,
        playerBackpackWeight,
      );
      const round = {
        round: roundNumber,
        strategy: "manual",
        gems: pendingPlayerMining.gems,
        selected: result.selected,
        usedWeight: result.usedWeight,
        totalValue: result.totalValue,
        log: result.log,
        isComputerTurn: false,
      };

      setPendingPlayerMining(null);
      setGameState((prev) => {
        const minedThisRound = generateGemsForRound(ALL_GEM_TYPES);
        const accumulatedGems = [...prev.computerMinedGems, ...minedThisRound];
        const isFinalRound = roundNumber === MAX_MINING_ROUNDS;
        const computerResult = isFinalRound
          ? greedyKnapsack(accumulatedGems, BACKPACK_CAPACITY)
          : {
              selected: [],
              usedWeight: 0,
              totalValue: 0,
              log: [
                {
                  id: `computer-wait-${roundNumber}`,
                  msg: "O robô guardou essa mineração para decidir tudo no fim do dia.",
                  type: "skipped",
                },
              ],
            };
        const computerRound = {
          round: roundNumber,
          strategy: isFinalRound ? "greedy" : "collecting",
          gems: isFinalRound ? accumulatedGems : minedThisRound,
          selected: computerResult.selected,
          usedWeight: computerResult.usedWeight,
          totalValue: computerResult.totalValue,
          log: computerResult.log,
          isComputerTurn: true,
        };

        return {
          ...prev,
          playerRounds: [...prev.playerRounds, round],
          computerMinedGems: accumulatedGems,
          computerRounds: [...prev.computerRounds, computerRound],
          lastPlayerRound: round,
          lastComputerRound: computerRound,
        };
      });
    },
    [pendingPlayerMining, playerBackpackWeight],
  );

  const handlePlayRound = useCallback(() => {
    if (gameState.playerRounds.length >= MAX_MINING_ROUNDS) {
      return;
    }

    const roundNumber = gameState.playerRounds.length + 1;
    setPendingPlayerMining({
      roundNumber,
      gems: generateGemsForRound(ALL_GEM_TYPES),
      currentBackpackWeight: playerBackpackWeight,
    });
  }, [gameState.playerRounds.length, playerBackpackWeight]);

  const playerBackpackItems = getBackpackItems(gameState.playerRounds);
  const computerBackpackItems = getBackpackItems(gameState.computerRounds);
  const playerBackpackValue = calculateTotalScore(gameState.playerRounds);
  const computerBackpackValue = calculateTotalScore(gameState.computerRounds);
  const computerBackpackWeight = calculateTotalWeight(gameState.computerRounds);
  const hasGameStarted =
    gameState.playerRounds.length > 0 || gameState.computerRounds.length > 0;

  return (
    <div className="app-container">
      {pendingPlayerMining && (
        <MinedGemSelector
          gems={pendingPlayerMining.gems}
          roundNumber={pendingPlayerMining.roundNumber}
          currentBackpackWeight={pendingPlayerMining.currentBackpackWeight}
          onConfirm={handlePlayerRoundWithSelection}
          onCancel={() => setPendingPlayerMining(null)}
        />
      )}

      <GameBoard gameState={gameState} onPlayRound={handlePlayRound} />

      {hasGameStarted && (
        <div className="game-content">
          <div className="main-panel">
            {(gameState.lastPlayerRound || gameState.lastComputerRound) && (
              <RoundPairDetails
                playerRound={gameState.lastPlayerRound}
                computerRound={gameState.lastComputerRound}
                playerBackpackItems={playerBackpackItems}
                computerBackpackItems={computerBackpackItems}
                playerTotalValue={playerBackpackValue}
                computerTotalValue={computerBackpackValue}
                playerUsedWeight={playerBackpackWeight}
                computerUsedWeight={computerBackpackWeight}
              />
            )}
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
  );
}
