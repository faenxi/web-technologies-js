'use strict';

const INITIAL_LANG_CARDS = [
  { id: 'lang-js',  emoji: '🟨', name: 'JavaScript', desc: 'веб / скрипти' },
  { id: 'lang-py',  emoji: '🐍', name: 'Python',     desc: 'дані / AI' },
  { id: 'lang-java',emoji: '☕', name: 'Java',        desc: 'бекенд / ентерпрайз' },
  { id: 'lang-ts',  emoji: '💠', name: 'TypeScript',  desc: 'типізований JS' },
  { id: 'lang-rs',  emoji: '🦀', name: 'Rust',        desc: 'системи / швидкість' },
  { id: 'lang-go',  emoji: '🐭', name: 'Go',          desc: 'хмара / мікросервіси' },
  { id: 'lang-kt',  emoji: '💜', name: 'Kotlin',      desc: 'Android / JVM' },
  { id: 'lang-sw',  emoji: '🍎', name: 'Swift',       desc: 'iOS / macOS' },
  { id: 'lang-cpp', emoji: '⚡', name: 'C++',         desc: 'ігри / системи' },
  { id: 'lang-php', emoji: '🐘', name: 'PHP',         desc: 'веб / сервер' },
];

let gridState = {
  cards: loadGridCards() || [...INITIAL_LANG_CARDS],
  isEditMode: false,
  draggedId: null,
  draggedOverId: null,
};

function loadGridCards() {
  try {
    const saved = localStorage.getItem('langGridCards');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const saveGridCards = () => {
  try {
    localStorage.setItem('langGridCards', JSON.stringify(gridState.cards));
  } catch (e) {
    console.warn('Не вдалося зберегти сітку:', e);
  }
};

const renderLangCardHTML = (card) => `
  <div
    class="lang-card"
    data-id="${card.id}"
    draggable="${gridState.isEditMode}"
  >
    <button class="delete-btn" data-id="${card.id}" aria-label="Видалити ${card.name}">✕</button>
    <span class="lang-card-icon">${card.emoji}</span>
    <div class="lang-card-name">${card.name}</div>
    <div class="lang-card-desc">${card.desc}</div>
  </div>
`;

const renderGrid = () => {
  const grid = document.getElementById('lang-grid');
  if (!grid) return;

  grid.innerHTML = gridState.cards.map(renderLangCardHTML).join('');
  grid.classList.toggle('edit-mode', gridState.isEditMode);

  grid.querySelectorAll('.lang-card').forEach(card => {
    bindCardEvents(card);
  });

  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (gridState.isEditMode) deleteCard(btn.dataset.id);
    });
  });

  const hint = document.getElementById('grid-hint');
  if (hint) {
    hint.textContent = gridState.isEditMode
      ? 'Перетягуйте картки або натискайте ✕ щоб видалити'
      : 'Натисніть «Редагувати» для керування картками';
  }
};

const bindCardEvents = (cardEl) => {
  const id = cardEl.dataset.id;

  cardEl.addEventListener('dragstart', (e) => {
    if (!gridState.isEditMode) return;
    gridState.draggedId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setTimeout(() => cardEl.style.opacity = '0.4', 0);
  });

  cardEl.addEventListener('dragend', () => {
    cardEl.style.opacity = '';
    gridState.draggedId = null;
    document.querySelectorAll('.drag-placeholder').forEach(el => {
      el.classList.remove('drag-placeholder');
    });
  });

  cardEl.addEventListener('dragover', (e) => {
    if (!gridState.isEditMode || !gridState.draggedId || gridState.draggedId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.drag-placeholder').forEach(el => {
      if (el.dataset.id !== id) el.classList.remove('drag-placeholder');
    });
    cardEl.classList.add('drag-placeholder');
    gridState.draggedOverId = id;
  });

  cardEl.addEventListener('dragleave', () => {
    cardEl.classList.remove('drag-placeholder');
  });

  cardEl.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!gridState.isEditMode || !gridState.draggedId) return;

    const fromId = gridState.draggedId;
    const toId = id;

    if (fromId !== toId) {
      reorderCards(fromId, toId);
    }

    cardEl.classList.remove('drag-placeholder');
    gridState.draggedId = null;
    gridState.draggedOverId = null;
  });
};

const reorderCards = (fromId, toId) => {
  const cards = [...gridState.cards];
  const fromIndex = cards.findIndex(c => c.id === fromId);
  const toIndex = cards.findIndex(c => c.id === toId);

  if (fromIndex === -1 || toIndex === -1) return;

  const [removed] = cards.splice(fromIndex, 1);
  cards.splice(toIndex, 0, removed);

  gridState.cards = cards;
  saveGridCards();
  renderGrid();
};

const deleteCard = (id) => {
  gridState.cards = gridState.cards.filter(c => c.id !== id);
  saveGridCards();
  renderGrid();
};

const toggleEditMode = () => {
  gridState.isEditMode = !gridState.isEditMode;

  const editBtn = document.getElementById('edit-btn');
  if (editBtn) {
    editBtn.textContent = gridState.isEditMode ? 'Готово' : 'Редагувати';
    editBtn.classList.toggle('btn-primary', gridState.isEditMode);
    editBtn.classList.toggle('btn-outline', !gridState.isEditMode);
  }

  renderGrid();
};

const initEditableGrid = () => {
  renderGrid();

  const editBtn = document.getElementById('edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', toggleEditMode);
  }
};

document.addEventListener('DOMContentLoaded', initEditableGrid);
