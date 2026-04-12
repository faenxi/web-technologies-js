'use strict';

// ============================================================
// СТАН ДОДАТКУ
// ============================================================

let tasks = [
  {
    id: 't001',
    text: 'Купити молоко',
    done: false,
    createdAt: new Date('2024-04-01').getTime(),
    updatedAt: new Date('2024-04-01').getTime(),
  },
  {
    id: 't002',
    text: 'Зробити домашнє завдання',
    done: true,
    createdAt: new Date('2024-04-02').getTime(),
    updatedAt: new Date('2024-04-03').getTime(),
  }
];

let currentSort = null;

// ============================================================
// ЧИСТІ ФУНКЦІЇ (PURE FUNCTIONS) — ЛОГІКА
// ============================================================

const generateId = () => 't' + Date.now() + Math.floor(Math.random() * 1000);
const getCurrentDate = () => Date.now();

const addTaskPure = (allTasks, text) => {
  return [...allTasks, {
    id: generateId(),
    text,
    done: false,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  }];
};

const toggleTaskPure = (allTasks, id) => {
  return allTasks.map(t => 
    t.id === id ? { ...t, done: !t.done, updatedAt: getCurrentDate() } : t
  );
};

const deleteTaskPure = (allTasks, id) => {
  return allTasks.filter(t => t.id !== id);
};

const updateTaskTextPure = (allTasks, id, newText) => {
  return allTasks.map(t => 
    t.id === id ? { ...t, text: newText, updatedAt: getCurrentDate() } : t
  );
};

// ============================================================
// DOM ЕЛЕМЕНТИ ТА ВІДОБРАЖЕННЯ (SIDE EFFECTS)
// ============================================================

const jsTaskList    = document.getElementById('js-task-list');
const jsInputTask   = document.getElementById('js-input-task');
const jsAddForm    = document.getElementById('js-add-form');
const jsDoneCount   = document.getElementById('js-done-count');
const jsTotalCount  = document.getElementById('js-total-count');

const refreshTaskList = () => {
  let displayTasks = [...tasks];

  if (currentSort) {
    displayTasks.sort((a, b) => {
      if (currentSort === 'done') return a.done - b.done;
      return b[currentSort] - a[currentSort];
    });
  }

  jsTaskList.innerHTML = '';

  displayTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : ''}`;
    li.dataset.id = task.id;

    // Створюємо структуру через змінні для надійності обробників
    li.innerHTML = `
      <div class="task-main">
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <input type="text" class="task-edit-input" style="display:none" value="${task.text}">
      </div>
      <div class="task-actions">
        <button class="btn-edit" title="Редагувати">✏️</button>
        <button class="btn-save" style="display:none" title="Зберегти">💾</button>
        <button class="btn-delete" title="Видалити">🗑️</button>
      </div>
    `;

    // Знаходимо елементи всередині створеного li
    const checkbox  = li.querySelector('.task-checkbox');
    const textSpan  = li.querySelector('.task-text');
    const editInput = li.querySelector('.task-edit-input');
    const editBtn   = li.querySelector('.btn-edit');
    const saveBtn   = li.querySelector('.btn-save');
    const deleteBtn = li.querySelector('.btn-delete');

    // --- Обробники подій ---

    checkbox.onchange = () => {
      tasks = toggleTaskPure(tasks, task.id);
      refreshTaskList();
    };

    const startEdit = () => {
      li.classList.add('editing');
      textSpan.style.display = 'none';
      editInput.style.display = 'block';
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
      editInput.focus();
      editInput.select();
    };

    const saveEdit = () => {
      const newText = editInput.value.trim();
      if (newText.length >= 2) {
        tasks = updateTaskTextPure(tasks, task.id, newText);
        refreshTaskList();
      } else {
        editInput.classList.add('invalid');
      }
    };

    editBtn.onclick = startEdit;
    textSpan.ondblclick = startEdit;
    saveBtn.onclick = saveEdit;
    
    editInput.onkeydown = (e) => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') refreshTaskList();
    };

    deleteBtn.onclick = () => {
      li.classList.add('removing');
      setTimeout(() => {
        tasks = deleteTaskPure(tasks, task.id);
        refreshTaskList();
      }, 300);
    };

    jsTaskList.appendChild(li);
  });

  // Оновлення статистики
  jsDoneCount.textContent = tasks.filter(t => t.done).length;
  jsTotalCount.textContent = tasks.length;
};

// ============================================================
// ГЛОБАЛЬНІ ОБРОБНИКИ (SIDE EFFECTS)
// ============================================================

jsAddForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = jsInputTask.value.trim();
  if (text.length >= 2) {
    tasks = addTaskPure(tasks, text);
    jsInputTask.value = '';
    refreshTaskList();
  }
});

window.handleSort = (type) => {
  currentSort = type;
  refreshTaskList();
};

window.resetSort = () => {
  currentSort = null;
  refreshTaskList();
};

// Початкове рендеринг
refreshTaskList();