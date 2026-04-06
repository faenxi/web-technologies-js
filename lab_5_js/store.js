const inventory = new Map();
const categorySet = new Set(['Електроніка', 'Продукти', 'Одяг']);
const modificationHistory = new WeakMap();

let productCounter = 1;

const refreshSelects = () => {
    const catSelect = document.getElementById('prod-category');
    const orderSelect = document.getElementById('order-select');
    
    catSelect.innerHTML = '<option value="">-- Оберіть категорію --</option>';
    categorySet.forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    orderSelect.innerHTML = '<option value="">-- Оберіть товар --</option>';
    inventory.forEach((p, id) => {
        if (p.qty > 0) {
            orderSelect.innerHTML += `<option value="${id}">${p.name} (${p.price} грн)</option>`;
        }
    });
};

function addNewCategory() {
    const name = document.getElementById('new-cat-name').value.trim();
    if (!name) return;
    categorySet.add(name);
    document.getElementById('new-cat-name').value = '';
    refreshSelects();
    renderCatalog();
}

function addProduct() {
    const name = document.getElementById('prod-name').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const qty = parseInt(document.getElementById('prod-qty').value);
    const category = document.getElementById('prod-category').value;

    if (!name || isNaN(price) || isNaN(qty) || !category) {
        alert('Будь ласка, заповніть всі поля, включаючи категорію!');
        return;
    }

    const newProduct = { id: productCounter++, name, price, qty, category };
    inventory.set(newProduct.id, newProduct);
    
    modificationHistory.set(newProduct, [`Створено ${new Date().toLocaleDateString()}`]);

    refreshSelects();
    renderCatalog();
    
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-qty').value = '';
}

function updateProduct(id) {
    const product = inventory.get(id);
    if (!product) return;

    const newPrice = prompt(`Введіть нову ціну для "${product.name}":`, product.price);
    const newQty = prompt(`Введіть нову кількість для "${product.name}":`, product.qty);

    const p = parseFloat(newPrice);
    const q = parseInt(newQty);

    if (isNaN(p) || isNaN(q) || p < 0 || q < 0) {
        alert("Некоректні дані!");
        return;
    }

    product.price = p;
    product.qty = q;

    const history = modificationHistory.get(product) || [];
    history.push(`Оновлено: ${p} грн, ${q} шт (${new Date().toLocaleTimeString()})`);
    modificationHistory.set(product, history);

    refreshSelects();
    renderCatalog();
    alert("Товар успішно оновлено!");
}

function updateOrderPreview() {
    const id = parseInt(document.getElementById('order-select').value);
    const qty = parseInt(document.getElementById('order-qty').value);
    const summaryBox = document.getElementById('order-summary');
    
    const product = inventory.get(id);
    if (product && qty > 0) {
        const total = product.price * qty;
        document.getElementById('summary-text').innerHTML = 
            `${product.name} x ${qty} = <strong>${total.toFixed(2)} грн</strong> 
             <br><small>(Залишок на складі: ${product.qty} шт)</small>`;
        summaryBox.style.display = 'block';
    } else {
        summaryBox.style.display = 'none';
    }
}

function confirmOrder() {
    const id = parseInt(document.getElementById('order-select').value);
    const qty = parseInt(document.getElementById('order-qty').value);
    const product = inventory.get(id);

    if (product.qty < qty) {
        alert('Недостатньо товару на складі!');
        return;
    }

    product.qty -= qty;
    alert(`Замовлення на суму ${(product.price * qty).toFixed(2)} грн успішно оформлено!`);
    
    refreshSelects();
    renderCatalog();
    updateOrderPreview();
}

function renderCatalog() {
    const root = document.getElementById('catalog-table-root');
    if (inventory.size === 0) {
        root.innerHTML = '<p>Склад порожній...</p>';
        return;
    }

    let html = `<table>
        <tr><th>ID</th><th>Товар</th><th>Категорія</th><th>Ціна</th><th>Кількість</th><th>Дії</th></tr>`;
    
    inventory.forEach((p, id) => {
        html += `<tr>
            <td>#${id}</td>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge">${p.category}</span></td>
            <td>${p.price} грн</td>
            <td>${p.qty > 0 ? p.qty + ' шт' : '<span style="color:red">Немає в наявності</span>'}</td>
            <td>
                <button class="btn-action" style="padding: 5px 10px; font-size: 12px;" onclick="updateProduct(${id})">✏️ Редагувати</button>
            </td>
        </tr>`;
    });
    
    html += '</table>';
    root.innerHTML = html;
}

refreshSelects();
renderCatalog();