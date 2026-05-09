# ⚡ Guia Rápido de Execução

## 🚀 Iniciar o Jogo em 30 Segundos

### 1️⃣ Instale as dependências (primeira vez apenas)
```bash
cd /home/felipe-dev/Documents/programms/G32_GREEDY_PA-26.1
npm install
```

### 2️⃣ Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 3️⃣ Abra no navegador
```
http://localhost:5174/
```

**Pronto!** O jogo está rodando! 🎮

---

## 📖 Como Jogar

1. Clique em **"⛏️ Ir à Mineração"**
2. O jogo alterna entre você e o computador
3. Veja as joias escolhidas aparecerem na mochila
4. Ao final das 5 rodadas, veja quem venceu!

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev       # Inicia servidor (http://localhost:5174/)

# Produção
npm run build     # Compila para pasta dist/
npm run preview   # Visualiza build compilado

# Validação
npm run lint      # Verifica erros de código
```

---

## 📁 Estrutura Importante

- `src/App.jsx` - Componente principal do jogo
- `src/utils/knapsackGame.js` - Lógica do algoritmo Greedy
- `src/App.css` - Estilos visuais

---

## 📚 Ler Primeiro

Para entender o jogo:
1. **GAME_GUIDE.md** - Como jogar e estratégias
2. **IMPLEMENTATION_SUMMARY.md** - O que foi implementado

---

## 🐛 Troubleshooting

### Porta 5173 já está em uso?
O Vite automaticamente tentará a porta 5174, 5175, etc.

### Não vê mudanças após editar código?
```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

### Erros de build?
```bash
# Limpe dependências e reinstale
rm -rf node_modules
npm install
npm run dev
```

---

## 🎮 Dicas de Gameplay

- **Rodadas 1-4**: É sorte! 60% de chance por item
- **Rodada 5**: Veja o computador usar algoritmo Greedy!
- **Melhor Estratégia**: Ter muitas joias de alta densidade

---

## ✨ Próximas Etapas

Para personalizar o jogo, edite:

- `src/utils/knapsackGame.js`:
  - `GEM_TYPES`: Tipos de joias
  - `BACKPACK_CAPACITY`: Capacidade da mochila
  - `MAX_MINING_ROUNDS`: Número de rodadas

---

**Divirta-se explorando o Greedy Knapsack!** 🚀
