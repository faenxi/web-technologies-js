// =========================================================
// kanban.js — Kanban Board з HTML5 Drag and Drop API
// =========================================================

'use strict';

// ── Початкові дані ─────────────────────────────────────────

const INITIAL_TASKS = {
  todo: [
    { id: 'task-9',  text: 'Item #9  — Написати документацію' },
    { id: 'task-3',  text: 'Item #3  — Розробити UI компонент' },
    { id: 'task-5',  text: 'Item #5  — Налаштувати CI/CD' },
    { id: 'task-4',  text: 'Item #4  — Code review' },
    { id: 'task-1',  text: 'Item #1  — Планування спринту' },
  ],
  working: [
    { id: 'task-6',  text: 'Item #6  — Реалізація API' },
    { id: 'task-8',  text: 'Item #8  — Тестування модулів' },
    { id: 'task-7',  text: 'Item #7  — Оптимізація БД' },
  ],
  done: [
    { id: 'task-11', text: 'Item #11 — Деплой на сервер' },
    { id: 'task-2',  text: 'Item #2  — Налаштування середовища' },
    { id: 'task-13', text: 'Item #13 — Огляд безпеки' },
    { id: 'task-14', text: 'Item #14 — Онбординг команди' },
  ],
};

// ── Стан дошки ────────────────────────────────────────────

let kanbanState = {
  tasks: loadKanbanState() || JSON.parse(JSON.stringify(INITIAL_TASKS)),
  draggedTaskId: null,
  draggedFromColumn: null,
};

let taskIdCounter = 100;

// ── Збереження/завантаження стану ─────────────────────────

/**
 * Завантажує стан Kanban з localStorage
 * @returns {Object|null}
 */
function loadKanbanState() {
  try {
    const saved = localStorage.getItem('kanbanState');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Зберігає стан Kanban у localStorage
 */
const saveKanbanState = () => {
  try {
    localStorage.setItem('kanbanState', JSON.stringify(kanbanState.tasks));
  } catch (e) {
    console.warn('Не вдалося зберегти стан Kanban:', e);
  }
};

// ── Рендеринг ─────────────────────────────────────────────

/**
 * Рендерить один таск у вигляді HTML-рядка
 * @param {Object} task Об'єкт таску
 * @returns {string} HTML рядок
 */
const renderTaskHTML = (task) => `
  <div
    class="kanban-item"
    draggable="true"
    data-task-id="${task.id}"
  >
    <span class="kanban-item-text">${escapeHTML(task.text)}</span>
    <button class="kanban-delete-btn" data-task-id="${task.id}" title="Видалити">✕</button>
  </div>
`;

/**
 * Екранує HTML спецсимволи
 * @param {string} str
 * @returns {string}
 */
const escapeHTML = (str) =>
  str.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;');

/**
 * Рендерить колонку завдань
 * @param {string} columnId Ідентифікатор колонки
 */
const renderColumn = (columnId) => {
  const container = document.getElementById(`items-${columnId}`);
  if (!container) return;

  const tasks = kanbanState.tasks[columnId] || [];
  container.innerHTML = tasks.map(renderTaskHTML).join('');

  // Прив'язуємо drag events до тасків
  container.querySelectorAll('.kanban-item').forEach(item => {
    bindTaskDragEvents(item, columnId);
  });

  // Прив'язуємо кнопки видалення
  container.querySelectorAll('.kanban-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(btn.dataset.taskId, columnId);
    });
  });
};

/**
 * Рендерить всі колонки
 */
const renderAllColumns = () => {
  ['todo', 'working', 'done'].forEach(renderColumn);
};

// ── Drag and Drop ─────────────────────────────────────────

/**
 * Прив'язує drag-події до елемента таску
 * @param {HTMLElement} item DOM елемент таску
 * @param {string} columnId Ідентифікатор колонки
 */
const bindTaskDragEvents = (item, columnId) => {
  item.addEventListener('dragstart', (e) => {
    kanbanState.draggedTaskId = item.dataset.taskId;
    kanbanState.draggedFromColumn = columnId;

    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.taskId);
  });

  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    // Знімаємо підсвітку з усіх колонок
    document.querySelectorAll('.kanban-items').forEach(col => {
      col.classList.remove('drop-target');
    });
  });
};

/**
 * Прив'язує drop-події до контейнера колонки
 * @param {HTMLElement} container DOM елемент контейнера колонки
 * @param {string} columnId Ідентифікатор колонки
 */
const bindColumnDropEvents = (container, columnId) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    container.classList.add('drop-target');
  });

  container.addEventListener('dragleave', (e) => {
    // Перевіряємо що виходимо за межі контейнера
    if (!container.contains(e.relatedTarget)) {
      container.classList.remove('drop-target');
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.classList.remove('drop-target');

    const taskId = kanbanState.draggedTaskId;
    const fromColumn = kanbanState.draggedFromColumn;

    if (!taskId || fromColumn === columnId) return;

    // Переміщуємо таск
    moveTask(taskId, fromColumn, columnId);
  });
};

// ── Операції над тасками ───────────────────────────────────

/**
 * Переміщує таск між колонками
 * @param {string} taskId ID таску
 * @param {string} fromColumn Колонка джерело
 * @param {string} toColumn Колонка призначення
 */
const moveTask = (taskId, fromColumn, toColumn) => {
  const task = kanbanState.tasks[fromColumn]?.find(t => t.id === taskId);
  if (!task) return;

  // Видаляємо з поточної колонки
  kanbanState.tasks[fromColumn] = kanbanState.tasks[fromColumn].filter(t => t.id !== taskId);

  // Додаємо до нової колонки
  kanbanState.tasks[toColumn] = [...(kanbanState.tasks[toColumn] || []), task];

  saveKanbanState();
  renderAllColumns();
};

/**
 * Видаляє таск
 * @param {string} taskId ID таску
 * @param {string} columnId Колонка
 */
const deleteTask = (taskId, columnId) => {
  kanbanState.tasks[columnId] = kanbanState.tasks[columnId].filter(t => t.id !== taskId);
  saveKanbanState();
  renderColumn(columnId);
};

/**
 * Додає новий таск
 * @param {string} text Текст таску
 * @param {string} columnId Колонка призначення
 */
const addTask = (text, columnId) => {
  if (!text.trim()) return;

  const newTask = {
    id: `task-${++taskIdCounter}`,
    text: text.trim(),
  };

  kanbanState.tasks[columnId] = [...(kanbanState.tasks[columnId] || []), newTask];
  saveKanbanState();
  renderColumn(columnId);
};

// ── Ініціалізація ─────────────────────────────────────────

/**
 * Ініціалізує Kanban Board
 */
const initKanban = () => {
  // Рендеримо всі колонки
  renderAllColumns();

  // Прив'язуємо drop до контейнерів колонок
  ['todo', 'working', 'done'].forEach(columnId => {
    const container = document.getElementById(`items-${columnId}`);
    if (container) bindColumnDropEvents(container, columnId);
  });

  // Кнопка додавання таску
  const addBtn = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('new-task-input');
  const columnSelect = document.getElementById('new-task-column');

  if (addBtn && taskInput && columnSelect) {
    const handleAddTask = () => {
      addTask(taskInput.value, columnSelect.value);
      taskInput.value = '';
      taskInput.focus();
    };

    addBtn.addEventListener('click', handleAddTask);

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAddTask();
    });
  }
};

document.addEventListener('DOMContentLoaded', initKanban);
