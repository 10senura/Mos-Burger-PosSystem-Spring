// Add this code to your existing JavaScript
const API_ENDPOINTS = {
    burger: 'http://localhost:8080/burgers/allBurger',
    pasta: 'http://localhost:8080/pasta/allPasta',
    Fries: 'http://localhost:8080/fries/allFries',
    submarine: 'http://localhost:8080/submarines/allSubmarine',
    Chiken: 'http://localhost:8080/chikens/allChiken',
    Bevarages: 'http://localhost:8080/bevarages/allBevarages'
  };
  
  // Fetch data from API and populate items
  async function loadMenuItems() {
    const itemsContainer = document.getElementById('itemmenu');
    
    for (const [category, endpoint] of Object.entries(API_ENDPOINTS)) {
      try {
        const response = await fetch(endpoint);
        const items = await response.json();
        
        items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = `item ${category}`;
          itemDiv.dataset.category = category;
          
          itemDiv.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <p>${item.name} - Rs.${item.price}</p>
            <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">Add</button>
          `;
          
          itemsContainer.appendChild(itemDiv);
        });
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
      }
    }
  }
  
  // Modified showItems function
  function showItems(category) {
    document.getElementById('itemaddarea').style.display = 'none';
    const allItems = document.querySelectorAll('.item');
    
    allItems.forEach(item => {
      if (category === 'list' || item.dataset.category === category) {
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
      }
    });
  }
  
  // Update search function
  function searchItems() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
      const itemName = item.querySelector('p').textContent.toLowerCase();
      item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
    });
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems().then(() => showItems('burger'));
  });



  /////////////////////////////////////////////////////

  let currentItem = null;

function showQuantityModal(name, price, image) {
    currentItem = { name, price, image };
    document.getElementById('modalItemImage').src = image;
    document.getElementById('modalItemName').textContent = name;
    document.getElementById('modalItemPrice').textContent = `Rs.${price}`;
    document.getElementById('itemQty').value = 1;
    document.getElementById('quantityModal').style.display = 'block';
}

function closeQuantityModal() {
    document.getElementById('quantityModal').style.display = 'none';
    currentItem = null;
}

function adjustModalQty(change) {
    const qtyInput = document.getElementById('itemQty');
    let newVal = parseInt(qtyInput.value) + change;
    if(newVal < 1) newVal = 1;
    qtyInput.value = newVal;
}

function confirmAddToCart() {
    if(currentItem) {
        const quantity = parseInt(document.getElementById('itemQty').value);
        addToCart(currentItem.name, currentItem.price, quantity, currentItem.image);
        closeQuantityModal();
    }
}

// Modified addToCart function
function addToCart(itemName, price, quantity = 1, image) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if(existingItem) {
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

// Modified updateCart function
function updateCart() {
    const cartContainer = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    cartContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Rs.${item.price} x ${item.quantity}</p>
                <div class="item-controls">
                    <button onclick="adjustCartQty(${index}, -1)">-</button>
                    <button onclick="adjustCartQty(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        
        cartContainer.appendChild(itemElement);
    });
    
    totalElement.textContent = `Total: Rs.${total}`;
}

function adjustCartQty(index, change) {
    cart[index].quantity += change;
    if(cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    updateCart();
}