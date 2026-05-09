import { useState, useCallback } from 'react'
import './App.css'

const EMOJIS = ['🍕','🎸','💎','📱','🔧','📚','🎮','👟','🕶','🧲','🪙','🏆','🎯','🧪','💡']

const SEED_ITEMS = [
  { name: 'Ouro',    emoji: '🥇', weight: 3, value: 9 },
  { name: 'Laptop',  emoji: '💻', weight: 4, value: 10 },
  { name: 'Livro',   emoji: '📚', weight: 1, value: 2 },
  { name: 'Câmera',  emoji: '📷', weight: 5, value: 7 },
  { name: 'Relógio', emoji: '⌚', weight: 2, value: 6 },
]

let nextId = 0
function makeItem(name, emoji, weight, value) {
  return { id: nextId++, name, emoji, weight, value, ratio: value / weight }
}

function greedy(items, capacity) {
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio)
  const chosen = new Set()
  const log = []
  let usedWeight = 0
  let totalValue = 0

  for (const item of sorted) {
    if (usedWeight + item.weight <= capacity) {
      chosen.add(item.id)
      usedWeight += item.weight
      totalValue += item.value
      log.push({
        id: item.id,
        msg: `Adicionado "${item.emoji} ${item.name}" (peso ${item.weight}, val ${item.value}, razão ${item.ratio.toFixed(2)})`,
        type: 'ok',
      })
    } else {
      log.push({
        id: item.id,
        msg: `Recusado "${item.emoji} ${item.name}" — peso ${item.weight} excede espaço restante (${(capacity - usedWeight).toFixed(1)})`,
        type: 'fail',
      })
    }
  }

  return { sorted, chosen, log, usedWeight, totalValue }
}

/* ── sub-components ── */

function CapacityControl({ capacity, onChange }) {
  const [val, setVal] = useState(capacity)
  return (
    <div className="card">
      <p className="card-title">⚙ Capacidade da Mochila</p>
      <div className="capacity-row">
        <input
          type="number"
          min={1}
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <button onClick={() => { const n = parseInt(val); if (n > 0) onChange(n) }}>
          Aplicar
        </button>
      </div>
    </div>
  )
}

function AddItemForm({ itemCount, onAdd }) {
  const [form, setForm] = useState({ name: '', emoji: '', weight: '', value: '' })
  const [errors, setErrors] = useState({ weight: false, value: false })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleAdd() {
    const weight = parseFloat(form.weight)
    const value  = parseFloat(form.value)
    const bad = { weight: !weight || weight <= 0, value: !value || value <= 0 }
    setErrors(bad)
    if (bad.weight || bad.value) return

    onAdd(
      form.name.trim()  || `Item ${itemCount + 1}`,
      form.emoji.trim() || EMOJIS[itemCount % EMOJIS.length],
      weight,
      value,
    )
    setForm({ name: '', emoji: '', weight: '', value: '' })
    setErrors({ weight: false, value: false })
  }

  function handleKey(e) { if (e.key === 'Enter') handleAdd() }

  return (
    <div className="card">
      <p className="card-title">➕ Adicionar Item</p>
      <div className="form-grid">
        <input placeholder="Nome"     value={form.name}   onChange={e => set('name',   e.target.value)} onKeyDown={handleKey} />
        <input placeholder="Emoji 🎁" value={form.emoji}  onChange={e => set('emoji',  e.target.value)} maxLength={4} onKeyDown={handleKey} />
        <input placeholder="Peso"  type="number" min={1} value={form.weight} onChange={e => set('weight', e.target.value)} onKeyDown={handleKey} className={errors.weight ? 'error' : ''} />
        <input placeholder="Valor" type="number" min={1} value={form.value}  onChange={e => set('value',  e.target.value)} onKeyDown={handleKey} className={errors.value  ? 'error' : ''} />
      </div>
      <button className="btn-add" onClick={handleAdd}>Adicionar Item</button>
    </div>
  )
}

function ItemList({ sorted, chosen, onRemove }) {
  if (sorted.length === 0) return (
    <div className="card" style={{ flex: 1 }}>
      <p className="card-title">📦 Itens Disponíveis</p>
      <p className="empty-hint">Nenhum item ainda.<br />Adicione acima!</p>
    </div>
  )

  return (
    <div className="card" style={{ flex: 1, overflow: 'hidden' }}>
      <p className="card-title">📦 Itens Disponíveis</p>
      <div className="item-list">
        {sorted.map(item => {
          const inBag = chosen.has(item.id)
          return (
            <div key={item.id} className={`item-card ${inBag ? 'selected' : 'rejected'}`}>
              <span className="item-emoji">{item.emoji}</span>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">Peso: {item.weight} · Valor: {item.value}</div>
                <div className="item-ratio">Razão: {item.ratio.toFixed(2)}</div>
              </div>
              <span className={`item-badge ${inBag ? 'badge-in' : 'badge-out'}`}>
                {inBag ? 'DENTRO' : 'FORA'}
              </span>
              <button className="del-btn" onClick={() => onRemove(item.id)} title="Remover">✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KnapsackVisual({ capacity, chosen, items, usedWeight, totalValue }) {
  const pct = capacity > 0 ? Math.min((usedWeight / capacity) * 100, 100) : 0
  const chosenItems = items.filter(i => chosen.has(i.id))
  const over = usedWeight > capacity

  return (
    <div className="card">
      <div className="knapsack-wrap">
        <div className="knapsack-container">
          <div className="knapsack-body">
            <span className="cap-label">Cap: {capacity}</span>
            <div className={`knapsack-fill ${over ? 'over' : ''}`} style={{ height: `${pct}%` }}>
              {chosenItems.map(i => (
                <span key={i.id} className="fill-item" title={i.name}>{i.emoji}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="knapsack-sublabel">
          {pct === 0
            ? 'Mochila vazia'
            : `${usedWeight.toFixed(1)} / ${capacity} (${pct.toFixed(0)}% cheio)`}
        </p>

        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-val">{usedWeight.toFixed(1)}</div>
            <div className="stat-lbl">Peso Usado</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{totalValue.toFixed(1)}</div>
            <div className="stat-lbl">Valor Total</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{chosen.size}</div>
            <div className="stat-lbl">Itens</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DecisionLog({ log }) {
  return (
    <div className="card">
      <p className="card-title">📋 Log de Decisões</p>
      {log.length === 0
        ? <p className="empty-hint">Aguardando itens...</p>
        : (
          <ul className="log-list">
            {log.map((e, i) => (
              <li key={i} className={`log-item ${e.type}`}>
                {e.type === 'ok' ? '✅' : '❌'} {e.msg}
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

function RatioTable({ sorted, chosen }) {
  if (sorted.length === 0) return (
    <div className="card">
      <p className="card-title">📊 Tabela de Razão Valor/Peso</p>
      <p className="empty-hint">Adicione itens para ver a tabela.</p>
    </div>
  )

  return (
    <div className="card">
      <p className="card-title">📊 Tabela de Razão Valor/Peso</p>
      <div className="table-scroll">
        <table className="ratio-table">
          <thead>
            <tr>
              <th>#</th><th>Item</th><th>Peso</th><th>Valor</th><th>Razão V/P</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const inBag = chosen.has(item.id)
              return (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.emoji} {item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.value}</td>
                  <td className={inBag ? 'chk' : 'hl'}>{item.ratio.toFixed(3)}</td>
                  <td className={inBag ? 'chk' : 'hl'}>{inBag ? '✅ Dentro' : '❌ Fora'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── App ── */

export default function App() {
  const [capacity, setCapacity] = useState(15)
  const [items, setItems] = useState(() =>
    SEED_ITEMS.map(s => makeItem(s.name, s.emoji, s.weight, s.value))
  )

  const { sorted, chosen, log, usedWeight, totalValue } = greedy(items, capacity)

  const addItem = useCallback((name, emoji, weight, value) => {
    setItems(prev => [...prev, makeItem(name, emoji, weight, value)])
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return (
    <>
      <h1 className="page-title">🎒 Knapsack Visualizer</h1>
      <p className="page-subtitle">Algoritmo Greedy — razão valor/peso · Projeto PA G32</p>

      <div className="layout">
        <div className="left-panel">
          <CapacityControl capacity={capacity} onChange={setCapacity} />
          <AddItemForm itemCount={items.length} onAdd={addItem} />
          <ItemList sorted={sorted} chosen={chosen} onRemove={removeItem} />
          <button className="btn-reset" onClick={() => setItems([])}>🗑 Limpar Tudo</button>
        </div>

        <div className="right-panel">
          <KnapsackVisual
            capacity={capacity}
            chosen={chosen}
            items={items}
            usedWeight={usedWeight}
            totalValue={totalValue}
          />
          <DecisionLog log={log} />
          <RatioTable sorted={sorted} chosen={chosen} />
        </div>
      </div>
    </>
  )
}
