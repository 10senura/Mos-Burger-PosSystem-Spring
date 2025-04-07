// In your java.js file
function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.id === item.id);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartElement = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    
    if(cart.length === 0) {
        cartElement.innerHTML = '<p>No items in the cart.</p>';
        totalElement.textContent = 'Total: Rs.0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>Rs.${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
    });
    
    cartElement.innerHTML = html;
    totalElement.textContent = `Total: Rs.${total.toFixed(2)}`;
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
}