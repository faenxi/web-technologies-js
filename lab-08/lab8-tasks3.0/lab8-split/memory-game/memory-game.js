// =========================================================
// memory-game.js — Гра Memory Pair Game
// Функціональний стиль, pure functions, ES6+
// =========================================================

'use strict';

// ── Константи ──────────────────────────────────────────────
const DIFFICULTY_TIMES = {
  easy:   3 * 60,  // 3 хвилини в секундах
  normal: 2 * 60,  // 2 хвилини
  hard:   1 * 60,  // 1 хвилина
};

// Набір карток (emoji + мітка)
const CARD_POOL = [
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🐻', label: 'Bear' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐺', label: 'Wolf' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🦜', label: 'Parrot' },
  { emoji: '🦩', label: 'Flamingo' },
  { emoji: '🦭', label: 'Seal' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🦑', label: 'Squid' },
  { emoji: '🐬', label: 'Dolphin' },
  { emoji: '🦈', label: 'Shark' },
  { emoji: '🐳', label: 'Whale' },
  { emoji: '🦕', label: 'Dino' },
  { emoji: '🦖', label: 'Rex' },
  { emoji: '🐲', label: 'Dragon' },
];

// ── Pure functions ─────────────────────────────────────────

/**
 * Створює початковий стан гри
 * @returns {Object} Початковий стан
 */
const createInitialState = () => ({
  settings: {
    players: 1,
    playerNames: ['Гравець 1', 'Гравець 2'],
    boardSize: '4x6',
    difficulty: 'easy',
    rounds: 1,
  },
  round: 1,
  currentPlayer: 0,
  cards: [],
  flippedCards: [],
  moves: [0, 0],
  scores: [0, 0], // знайдені пари
  timerRemaining: DIFFICULTY_TIMES.easy,
  timerInterval: null,
  roundResults: [],
  isLocked: false,
});

// ── Стан гри (мутабельний об'єкт, але функції — pure) ──────
let gameState = createInitialState();

/**
 * Перемішує масив алгоритмом Fisher-Yates (pure, повертає новий масив)
 * @param {Array} arr Масив для перемішування
 * @returns {Array} Новий перемішаний масив
 */
const shuffleArray = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Генерує масив карток для ігрового поля
 * @param {string} boardSize Розмір поля ('4x4', '4x6', '6x6')
 * @returns {Array} Масив карток з унікальними id
 */
const generateCards = (boardSize) => {
  const [rows, cols] = boardSize.split('x').map(Number);
  const totalCards = rows * cols;
  const pairsNeeded = totalCards / 2;

  const selectedPool = shuffleArray(CARD_POOL).slice(0, pairsNeeded);

  // Дублюємо кожну картку (пари)
  const pairs = [...selectedPool, ...selectedPool];

  // Перемішуємо пари і додаємо id
  return shuffleArray(pairs).map((card, index) => ({
    ...card,
    id: index,
    isFlipped: false,
    isMatched: false,
  }));
};

/**
 * Парсить розмір поля в рядки та стовпці
 * @param {string} boardSize '4x4' | '4x6' | '6x6'
 * @returns {{ rows: number, cols: number }}
 */
const parseBoardSize = (boardSize) => {
  const [rows, cols] = boardSize.split('x').map(Number);
  return { rows, cols };
};

/**
 * Форматує секунди у рядок MM:SS
 * @param {number} seconds Кількість секунд
 * @returns {string} Рядок часу
 */
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Перевіряє, чи дві картки є парою
 * @param {Object} card1 Перша картка
 * @param {Object} card2 Друга картка
 * @returns {boolean}
 */
const isMatch = (card1, card2) => card1.emoji === card2.emoji;

/**
 * Перевіряє, чи завершена гра (всі картки відкриті)
 * @param {Array} cards Масив карток
 * @returns {boolean}
 */
const isGameComplete = (cards) => cards.every(card => card.isMatched);

/**
 * Зчитує збережені рекорди з localStorage
 * @returns {Array}
 */
const loadBestScores = () => {
  try {
    return JSON.parse(localStorage.getItem('memoryBestScores') || '[]');
  } catch {
    return [];
  }
};

/**
 * Зберігає рекорд у localStorage
 * @param {Object} record Запис рекорду
 */
const saveBestScore = (record) => {
  const scores = loadBestScores();
  scores.unshift(record);
  const top10 = scores.slice(0, 10);
  localStorage.setItem('memoryBestScores', JSON.stringify(top10));
};

// ── DOM Helpers ────────────────────────────────────────────

/**
 * Безпечно отримує елемент DOM
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getEl = (id) => document.getElementById(id);

/**
 * Оновлює текстовий вміст елемента
 * @param {string} id
 * @param {string} text
 */
const setText = (id, text) => {
  const el = getEl(id);
  if (el) el.textContent = text;
};

/**
 * Показує/ховає елемент
 * @param {string} id
 * @param {boolean} visible
 */
const setVisible = (id, visible) => {
  const el = getEl(id);
  if (el) el.style.display = visible ? '' : 'none';
};

// ── Рендеринг ─────────────────────────────────────────────

/**
 * Рендерить одну картку у вигляді HTML-рядка
 * @param {Object} card Об'єкт картки
 * @param {number} animationDelay Затримка появи
 * @returns {string} HTML рядок
 */
const renderCardHTML = (card, animationDelay) => `
  <div
    class="memory-card${card.isFlipped ? ' flipped' : ''}${card.isMatched ? ' matched' : ''}"
    data-id="${card.id}"
    style="animation-delay: ${animationDelay}ms;"
  >
    <div class="card-inner">
      <div class="card-back">
        <div class="card-back-pattern">JS</div>
      </div>
      <div class="card-front">
        <span class="card-emoji">${card.emoji}</span>
        <span class="card-label">${card.label}</span>
      </div>
    </div>
  </div>
`;

/**
 * Рендерить ігрове поле
 * @param {Array} cards Масив карток
 * @param {string} boardSize Розмір поля
 */
const renderBoard = (cards, boardSize) => {
  const board = getEl('game-board');
  if (!board) return;

  const { cols } = parseBoardSize(boardSize);

  // CSS клас для сітки
  board.className = `game-board board-${boardSize}`;

  // Рендеримо картки з затримкою появи
  board.innerHTML = cards.map((card, idx) =>
    renderCardHTML(card, idx * 30)
  ).join('');

  // Прив'язуємо обробники кліків
  board.querySelectorAll('.memory-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => handleCardClick(parseInt(cardEl.dataset.id)));
  });
};

/**
 * Оновлює відображення однієї картки в DOM
 * @param {Object} card
 */
const updateCardDOM = (card) => {
  const cardEl = document.querySelector(`.memory-card[data-id="${card.id}"]`);
  if (!cardEl) return;

  cardEl.classList.toggle('flipped', card.isFlipped);
  cardEl.classList.toggle('matched', card.isMatched);
};

/**
 * Оновлює інформаційну панель
 */
const updateGameInfo = () => {
  const { settings, round, currentPlayer, moves, timerRemaining } = gameState;

  setText('current-round', `${round}/${settings.rounds}`);
  setText('current-player-name', settings.playerNames[currentPlayer]);
  setText('move-counter', moves[currentPlayer]);
  setText('timer-display', formatTime(timerRemaining));
};

// ── Логіка гри ────────────────────────────────────────────

/**
 * Обробник кліку по картці
 * @param {number} cardId ID картки
 */
const handleCardClick = (cardId) => {
  if (gameState.isLocked) return;

  const card = gameState.cards.find(c => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return;

  // Відкриваємо картку
  gameState.cards = gameState.cards.map(c =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );
  updateCardDOM(gameState.cards.find(c => c.id === cardId));

  gameState.flippedCards = [...gameState.flippedCards, cardId];

  // Якщо відкрита друга картка
  if (gameState.flippedCards.length === 2) {
    gameState.isLocked = true;
    const [id1, id2] = gameState.flippedCards;
    const card1 = gameState.cards.find(c => c.id === id1);
    const card2 = gameState.cards.find(c => c.id === id2);

    // Збільшуємо лічильник ходів поточного гравця
    gameState.moves = gameState.moves.map((m, i) =>
      i === gameState.currentPlayer ? m + 1 : m
    );
    updateGameInfo();

    if (isMatch(card1, card2)) {
      // Пара знайдена
      setTimeout(() => {
        gameState.cards = gameState.cards.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
        );
        updateCardDOM(gameState.cards.find(c => c.id === id1));
        updateCardDOM(gameState.cards.find(c => c.id === id2));

        gameState.scores = gameState.scores.map((s, i) =>
          i === gameState.currentPlayer ? s + 1 : s
        );

        gameState.flippedCards = [];
        gameState.isLocked = false;

        // Перевіряємо чи завершена гра
        if (isGameComplete(gameState.cards)) {
          finishRound();
        }
      }, 300);
    } else {
      // Не пара — тряска і закриваємо
      setTimeout(() => {
        // Додаємо клас тряски
        [id1, id2].forEach(id => {
          const el = document.querySelector(`.memory-card[data-id="${id}"]`);
          if (el) {
            el.classList.add('shake');
            setTimeout(() => el.classList.remove('shake'), 500);
          }
        });
      }, 200);

      setTimeout(() => {
        gameState.cards = gameState.cards.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
        );
        updateCardDOM(gameState.cards.find(c => c.id === id1));
        updateCardDOM(gameState.cards.find(c => c.id === id2));

        gameState.flippedCards = [];
        gameState.isLocked = false;

        // При 2 гравцях — міняємо хід після невдалого вибору
        if (gameState.settings.players === 2) {
          gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
          updateGameInfo();
        }
      }, 900);
    }
  }
};

// ── Таймер ────────────────────────────────────────────────

/**
 * Запускає таймер зворотного відліку
 */
const startTimer = () => {
  clearInterval(gameState.timerInterval);

  gameState.timerInterval = setInterval(() => {
    gameState.timerRemaining -= 1;
    updateGameInfo();

    if (gameState.timerRemaining <= 0) {
      clearInterval(gameState.timerInterval);
      handleTimeOut();
    }
  }, 1000);
};

/**
 * Зупиняє таймер
 */
const stopTimer = () => {
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = null;
};

/**
 * Обробник закінчення часу
 */
const handleTimeOut = () => {
  gameState.isLocked = true;
  finishRound(true);
};

// ── Раунди та результати ──────────────────────────────────

/**
 * Завершує поточний раунд
 * @param {boolean} timeOut Чи закінчився час
 */
const finishRound = (timeOut = false) => {
  stopTimer();

  const elapsedSeconds = DIFFICULTY_TIMES[gameState.settings.difficulty] - gameState.timerRemaining;

  // Зберігаємо результат раунду
  const roundResult = {
    round: gameState.round,
    timeOut,
    elapsedSeconds,
    playerData: gameState.settings.playerNames.slice(0, gameState.settings.players).map((name, i) => ({
      name,
      moves: gameState.moves[i],
      score: gameState.scores[i],
    })),
  };
  gameState.roundResults = [...gameState.roundResults, roundResult];

  if (gameState.round < gameState.settings.rounds) {
    // Наступний раунд
    gameState.round += 1;
    startRound();
  } else {
    // Гра завершена
    showResults();
  }
};

/**
 * Стартує новий раунд (або перший)
 */
const startRound = () => {
  gameState.cards = generateCards(gameState.settings.boardSize);
  gameState.flippedCards = [];
  gameState.moves = [0, 0];
  gameState.scores = [0, 0];
  gameState.currentPlayer = 0;
  gameState.timerRemaining = DIFFICULTY_TIMES[gameState.settings.difficulty];
  gameState.isLocked = false;

  renderBoard(gameState.cards, gameState.settings.boardSize);
  updateGameInfo();
  startTimer();
};

/**
 * Показує екран результатів
 */
const showResults = () => {
  setVisible('game-screen', false);
  setVisible('results-screen', true);

  // Визначаємо переможця (для 2 гравців)
  const totalScores = gameState.settings.playerNames.slice(0, gameState.settings.players).map((name, i) => {
    const total = gameState.roundResults.reduce((sum, r) =>
      sum + (r.playerData[i]?.score || 0), 0
    );
    return { name, total, i };
  });

  let winnerTitle = '';
  if (gameState.settings.players === 1) {
    winnerTitle = `🎉 ${totalScores[0].name} завершив гру!`;
  } else {
    const winner = totalScores.reduce((a, b) => a.total > b.total ? a : b);
    const loser = totalScores.find(p => p.i !== winner.i);
    if (winner.total === loser.total) {
      winnerTitle = '🤝 Нічия!';
    } else {
      winnerTitle = `🏆 Переміг ${winner.name}!`;
    }
  }
  setText('winner-title', winnerTitle);

  // Таблиця результатів
  const resultsTable = getEl('results-table');
  if (resultsTable) {
    const headers = gameState.settings.players === 2
      ? `<tr>
           <th>Раунд</th>
           <th>${gameState.settings.playerNames[0]}: Ходи / Пари</th>
           <th>${gameState.settings.playerNames[1]}: Ходи / Пари</th>
           <th>Час</th>
         </tr>`
      : `<tr>
           <th>Раунд</th>
           <th>Ходи</th>
           <th>Пари</th>
           <th>Час</th>
         </tr>`;

    const rows = gameState.roundResults.map(r => {
      if (gameState.settings.players === 2) {
        return `<tr>
          <td>Раунд ${r.round}</td>
          <td>${r.playerData[0]?.moves || 0} / ${r.playerData[0]?.score || 0}</td>
          <td>${r.playerData[1]?.moves || 0} / ${r.playerData[1]?.score || 0}</td>
          <td>${r.timeOut ? '⏰ Час!' : formatTime(r.elapsedSeconds)}</td>
        </tr>`;
      }
      return `<tr>
        <td>Раунд ${r.round}</td>
        <td>${r.playerData[0]?.moves || 0}</td>
        <td>${r.playerData[0]?.score || 0}</td>
        <td>${r.timeOut ? '⏰ Час!' : formatTime(r.elapsedSeconds)}</td>
      </tr>`;
    }).join('');

    resultsTable.innerHTML = `<table>${headers}${rows}</table>`;
  }

  // Зберігаємо рекорд
  const record = {
    date: new Date().toLocaleDateString('uk-UA'),
    players: gameState.settings.players,
    difficulty: gameState.settings.difficulty,
    rounds: gameState.settings.rounds,
    results: gameState.roundResults,
  };
  saveBestScore(record);
};

// ── Налаштування ──────────────────────────────────────────

/**
 * Зчитує поточні налаштування з форми
 * @returns {Object} Об'єкт налаштувань
 */
const readSettings = () => {
  const playersRadio = document.querySelector('input[name="players"]:checked');
  const players = playersRadio ? parseInt(playersRadio.value) : 1;

  return {
    players,
    playerNames: [
      (getEl('player1-name')?.value?.trim() || 'Гравець 1'),
      (getEl('player2-name')?.value?.trim() || 'Гравець 2'),
    ],
    boardSize: getEl('board-size')?.value || '4x6',
    difficulty: getEl('difficulty')?.value || 'easy',
    rounds: parseInt(getEl('rounds-count')?.value || '1'),
  };
};

/**
 * Скидає налаштування до дефолтних
 */
const resetSettingsToDefault = () => {
  const defaultRadio = document.querySelector('input[name="players"][value="1"]');
  if (defaultRadio) defaultRadio.checked = true;

  const p1 = getEl('player1-name');
  const p2 = getEl('player2-name');
  const p2group = getEl('player2-name-group');
  if (p1) p1.value = 'Гравець 1';
  if (p2) p2.value = 'Гравець 2';
  if (p2group) p2group.style.display = 'none';

  const boardSize = getEl('board-size');
  if (boardSize) boardSize.value = '4x6';

  const difficulty = getEl('difficulty');
  if (difficulty) difficulty.value = 'easy';

  const rounds = getEl('rounds-count');
  if (rounds) rounds.value = '1';
};

/**
 * Починає нову гру з поточними налаштуваннями
 */
const startNewGame = () => {
  const settings = readSettings();

  // Скидаємо стан
  gameState = createInitialState();
  gameState.settings = settings;
  gameState.round = 1;
  gameState.roundResults = [];

  // Перемикаємо екрани
  setVisible('settings-screen', false);
  setVisible('game-screen', true);
  setVisible('results-screen', false);

  startRound();
};

/**
 * Рестартує поточну гру (ті самі налаштування)
 */
const restartGame = () => {
  stopTimer();

  const currentSettings = { ...gameState.settings };
  gameState = createInitialState();
  gameState.settings = currentSettings;
  gameState.round = 1;
  gameState.roundResults = [];

  setVisible('settings-screen', false);
  setVisible('game-screen', true);
  setVisible('results-screen', false);

  startRound();
};

/**
 * Повертається до екрану налаштувань
 */
const goToSettings = () => {
  stopTimer();
  setVisible('settings-screen', true);
  setVisible('game-screen', false);
  setVisible('results-screen', false);
};

// ── Ініціалізація ─────────────────────────────────────────

/**
 * Ініціалізує компонент Memory Game
 */
const initMemoryGame = () => {
  // Кнопки налаштувань
  getEl('start-game-btn')?.addEventListener('click', startNewGame);
  getEl('reset-settings-btn')?.addEventListener('click', resetSettingsToDefault);

  // Кнопки під час гри
  getEl('restart-btn')?.addEventListener('click', restartGame);
  getEl('new-settings-btn')?.addEventListener('click', goToSettings);

  // Кнопки результатів
  getEl('play-again-btn')?.addEventListener('click', restartGame);
  getEl('new-game-btn')?.addEventListener('click', goToSettings);

  // Перемикач кількості гравців
  document.querySelectorAll('input[name="players"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const p2group = getEl('player2-name-group');
      if (p2group) {
        p2group.style.display = e.target.value === '2' ? 'block' : 'none';
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', initMemoryGame);
