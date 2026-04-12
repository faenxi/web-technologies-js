'use strict';

// ============================================================
// СТАН ДОДАТКУ
// ============================================================

let products = [
  {
    id: 'p001',
    name: 'Смартфон Samsung Galaxy',
    price: 12999,
    category: 'Електроніка',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    createdAt: new Date('2024-01-10').getTime(),
    updatedAt: new Date('2024-01-10').getTime(),
  },
  {
    id: 'p002',
    name: 'Куртка зимова',
    price: 2500,
    category: 'Одяг',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=400&q=80',
    createdAt: new Date('2024-02-05').getTime(),
    updatedAt: new Date('2024-03-01').getTime(),
  },
  {
    id: 'p003',
    name: 'Оливкова олія',
    price: 180,
    category: 'Продукти',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    createdAt: new Date('2024-03-15').getTime(),
    updatedAt: new Date('2024-03-15').getTime(),
  }
];

let currentFilter = null; 
let currentSort = null;

// ============================================================
// ЧИСТІ ФУНКЦІЇ (PURE FUNCTIONS)
// ============================================================

const generateId = () => 'p' + Date.now() + Math.floor(Math.random() * 1000);
const getCurrentDate = () => Date.now();

const addProductPure = (allProducts, newData) => {
  const newProduct = {
    id: generateId(),
    name: newData.name,
    price: Number(newData.price),
    category: newData.category,
    image: newData.image,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
  };
  return [...allProducts, newProduct];
};

const updateProductPure = (allProducts, productId, newData) => {
  return allProducts.map(product => 
    product.id === productId 
      ? { 
          ...product, 
          ...newData, 
          price: Number(newData.price), 
          updatedAt: getCurrentDate() 
        }
      : product
  );
};

const deleteProductPure = (allProducts, productId) => {
  return allProducts.filter(p => p.id !== productId);
};

const calculateTotalPure = (allProducts) => {
  return allProducts.reduce((sum, p) => sum + Number(p.price), 0);
};

// ============================================================
// DOM ЕЛЕМЕНТИ
// ============================================================

const jsProductList    = document.getElementById('js-product-list');
const jsEmptyMessage   = document.getElementById('js-empty-message');
const jsTotalPrice     = document.getElementById('js-total-price');
const jsFilterButtons  = document.getElementById('js-filter-buttons');
const jsModal          = document.getElementById('js-modal');
const jsModalTitle     = document.getElementById('js-modal-title');
const jsProductForm    = document.getElementById('js-product-form');
const jsEditId         = document.getElementById('js-edit-id');
const jsSnackbar       = document.getElementById('js-snackbar');

const jsInputName      = document.getElementById('js-input-name');
const jsInputPrice     = document.getElementById('js-input-price');
const jsInputCategory  = document.getElementById('js-input-category');
const jsInputImage     = document.getElementById('js-input-image');

// ============================================================
// ЛОГІКА ВІДОБРАЖЕННЯ
// ============================================================

const refreshProductList = () => {
  // Фільтрація
  let displayList = currentFilter 
    ? products.filter(p => p.category === currentFilter) 
    : products;

  // Сортування
  if (currentSort) {
    displayList = [...displayList].sort((a, b) => {
      if (currentSort === 'price') return a.price - b.price;
      return b[currentSort] - a[currentSort];
    });
  }

  // Повідомлення про пустий список [cite: 23]
  jsEmptyMessage.style.display = products.length === 0 ? 'block' : 'none';
  jsProductList.innerHTML = '';

  displayList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Картка товару згідно вимог 
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-id">ID: ${product.id}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${product.price} грн</div>
        <div class="product-category">${product.category}</div>
        <div class="product-actions">
          <button class="edit-btn">Редагувати</button>
          <button class="delete-btn">Видалити</button>
        </div>
      </div>
    `;

    card.querySelector('.edit-btn').onclick = () => openEditModal(product.id);
    card.querySelector('.delete-btn').onclick = () => deleteWithAnimation(product.id);
    
    jsProductList.appendChild(card);
  });

  jsTotalPrice.textContent = `${calculateTotalPure(products)} грн`;
  updateFilterButtons();
};

const updateFilterButtons = () => {
  const categories = ['Електроніка', 'Одяг', 'Продукти', 'Меблі'];
  let html = `<button class="filter-btn ${!currentFilter ? 'active' : ''}" onclick="resetFilter()">Усі</button>`;
  
  categories.forEach(cat => {
    html += `<button class="filter-btn ${currentFilter === cat ? 'active' : ''}" onclick="handleFilter('${cat}')">${cat}</button>`;
  });
  jsFilterButtons.innerHTML = html;
};

// ============================================================
// ОБРОБНИКИ
// ============================================================

window.handleFilter = (cat) => { currentFilter = cat; refreshProductList(); };
window.resetFilter = () => { currentFilter = null; refreshProductList(); };
window.handleSort = (type) => { currentSort = type; refreshProductList(); };
window.resetSort = () => { currentSort = null; refreshProductList(); };

const deleteWithAnimation = (id) => {
  const card = jsProductList.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add('removing');
    setTimeout(() => {
      const deletedProduct = products.find(p => p.id === id);
      products = deleteProductPure(products, id);
      showSnackbar(`✅ Видалено: ${deletedProduct.name}`); // [cite: 32]
      refreshProductList();
    }, 300);
  }
};

window.openAddModal = () => {
  jsModalTitle.textContent = 'Додати товар';
  jsEditId.value = '';
  jsProductForm.reset();
  jsModal.style.display = 'flex';
};

const openEditModal = (id) => {
  const p = products.find(item => item.id === id);
  jsModalTitle.textContent = 'Редагувати товар';
  jsEditId.value = p.id;
  jsInputName.value = p.name;
  jsInputPrice.value = p.price;
  jsInputCategory.value = p.category;
  jsInputImage.value = p.image;
  jsModal.style.display = 'flex';
};

window.closeModal = () => jsModal.style.display = 'none';

jsProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: jsInputName.value.trim(),
    price: jsInputPrice.value,
    category: jsInputCategory.value,
    image: jsInputImage.value.trim()
  };

  if (jsEditId.value) {
    products = updateProductPure(products, jsEditId.value, data);
    showSnackbar(`✏️ Оновлено: [${jsEditId.value}] ${data.name}`); // 
  } else {
    products = addProductPure(products, data);
    showSnackbar(`➕ Додано: ${data.name}`);
  }
  closeModal();
  refreshProductList();
});

const showSnackbar = (msg) => {
  jsSnackbar.textContent = msg;
  jsSnackbar.classList.add('show');
  setTimeout(() => jsSnackbar.classList.remove('show'), 3000);
};

refreshProductList();