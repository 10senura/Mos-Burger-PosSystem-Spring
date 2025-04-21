let cart = [];
let currentItem = null;

// API endpoints
const API_ENDPOINTS = {
    burger: 'http://localhost:8080/burgers/allBurger',
    pasta: 'http://localhost:8080/pasta/allPasta',
    Fries: 'http://localhost:8080/fries/allFries',
    submarine: 'http://localhost:8080/submarines/allSubmarine',
    Chiken: 'http://localhost:8080/chikens/allChiken',
    Bevarages: 'http://localhost:8080/bevarages/allBevarages',
    orders: 'http://localhost:8080/orders/addOrder'
};

// Load menu items from API
async function loadMenuItems() {
    const itemsContainer = document.getElementById('itemmenu');
    itemsContainer.innerHTML = '';
    
    try {
        // Load all categories
        for (const [category, endpoint] of Object.entries(API_ENDPOINTS)) {
            if (category === 'orders') continue;
            
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Failed to load ${category}`);
            
            const items = await response.json();
            
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `item ${category}`;
                itemDiv.dataset.category = category;
                
                itemDiv.innerHTML = `
                    <img src="${item.image_url || 'img/default-food.png'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Rs.${item.price.toFixed(2)}</p>
                    <p class="text-muted">${item.description || ''}</p>
                    <button class="add-btn" onclick="showQuantityModal('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.image_url || 'img/default-food.png'}')">
                        Add to Order
                    </button>
                `;
                
                itemsContainer.appendChild(itemDiv);
            });
        }
        
        // Show burgers by default
        showItems('burger');
    } catch (error) {
        console.error('Error loading menu items:', error);
        alert('Failed to load menu items. Please try again.');
    }
}

// Show items by category
function showItems(category) {
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === category.toLowerCase());
    });
    
    // Show/hide items
    document.querySelectorAll('.item').forEach(item => {
        item.style.display = item.dataset.category === category ? 'block' : 'none';
    });
}

// Search items
function searchItems() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    
    document.querySelectorAll('.item').forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const shouldShow = itemName.includes(searchTerm);
        item.style.display = shouldShow ? 'block' : 'none';
    });
}

// Quantity modal functions
function showQuantityModal(name, price, image) {
    currentItem = { name, price, image };
    document.getElementById('modalItemImage').src = image;
    document.getElementById('modalItemName').textContent = name;
    document.getElementById('modalItemPrice').textContent = `Rs.${price.toFixed(2)}`;
    document.getElementById('itemQty').value = 1;
    document.getElementById('quantityModal').style.display = 'flex';
}

function closeQuantityModal() {
    document.getElementById('quantityModal').style.display = 'none';
    currentItem = null;
}

function adjustModalQty(change) {
    const qtyInput = document.getElementById('itemQty');
    let newVal = parseInt(qtyInput.value) + change;
    if (newVal < 1) newVal = 1;
    qtyInput.value = newVal;
}

function confirmAddToCart() {
    if (currentItem) {
        const quantity = parseInt(document.getElementById('itemQty').value);
        addToCart(currentItem.name, currentItem.price, quantity, currentItem.image);
        closeQuantityModal();
    }
}

// Cart functions
function addToCart(itemName, price, quantity = 1, image) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: quantity,
            image: image
        });
    }
    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>No items in the cart.</p>';
        totalElement.textContent = 'Total: Rs.0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Rs.${item.price.toFixed(2)} x ${item.quantity}</p>
                <div class="item-controls">
                    <button onclick="adjustCartQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="adjustCartQty(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        
        cartContainer.appendChild(itemElement);
    });
    
    totalElement.textContent = `Total: Rs.${total.toFixed(2)}`;
}

function adjustCartQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    if (cart.length === 0 || confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCart();
    }
}

// Order functions
function showOrderModal() {
    if (cart.length === 0) {
        alert('Please add items to cart first!');
        return;
    }
    document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

async function submitOrder() {
    const customerName = document.getElementById('customerName').value;
    if (!customerName) {
        alert('Please enter customer name!');
        return;
    }

    const orderData = {
        customer: customerName,
        phone: document.getElementById('customerPhone').value,
        notes: document.getElementById('orderNotes').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'Pending'
    };

    try {
        const response = await fetch(API_ENDPOINTS.orders, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        const result = await response.json();
        alert('Order placed successfully!');
        clearCart();
        closeOrderModal();
        window.location.href = 'orderManage.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to place order. Please try again.');
    }
}

// Navigation
function openTablePage() {
    window.location.href = 'FoodItemmanage.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.className === 'modal') {
            closeOrderModal();
            closeQuantityModal();
        }
    });
});

async function submitOrder() {
    const customerName = document.getElementById('customerName').value;
    const orderDate = document.getElementById('orderDate').value;
    const orderStatus = document.getElementById('orderStatus').value;
    
    if (!customerName) {
        alert('Please enter customer name!');
        return;
    }

    // Create order data for each item in cart
    const orderPromises = cart.map(async (item) => {
        const orderData = {
            c_name: customerName,
            order_date: orderDate,
            order_status: orderStatus,
            quantity: item.quantity,
            burger_id: await getBurgerIdByName(item.name) 
        };

        try {
            const response = await fetch(API_ENDPOINTS.orders, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    });

    try {
        const results = await Promise.all(orderPromises);
        alert('Order placed successfully!');
        clearCart();
        closeOrderModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to place order. Please try again.');
    }
}

async function getBurgerIdByName(burgerName) {
    try {
        const response = await fetch(API_ENDPOINTS.burger);
        const burgers = await response.json();
        const burger = burgers.find(b => b.name === burgerName);
        return burger ? burger.id : null;
    } catch (error) {
        console.error('Error fetching burgers:', error);
        return null;
    }
}

function createBurgerRain() {
    let container = document.querySelector('.burger-rain-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'burger-rain-container';
        document.body.appendChild(container);
    }
    
    const numberOfDrops = 20; 
    
    for (let i = 0; i < numberOfDrops; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'burger-drop';
            
            const size = Math.random() * 20 + 20; 
            drop.style.width = size + 'px';
            drop.style.height = size + 'px';
            drop.style.left = Math.random() * 100 + '%';
            
            const duration = Math.random() * 3 + 2; 
            drop.style.animationDuration = duration + 's';
            
            container.appendChild(drop);
            
            setTimeout(() => {
                drop.remove();
            }, duration * 1000);
        }, i * 200); 
    }
}

function triggerBurgerRain() {
    createBurgerRain();
}

function logout(redirectUrl = '/login') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
    
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      window.location.href = redirectUrl;
    })
    .catch(error => {
      console.error('Logout error:', error);
      window.location.href = redirectUrl;
    });
  }
  
  
