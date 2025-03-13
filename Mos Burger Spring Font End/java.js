// Function to load all burgers from the backend
async function loadAllBurgers() {
    try {
        const response = await fetch('http://localhost:8080/burgers/allBurger');
        const burgers = await response.json();

        const menu = document.getElementById('itemmenu');
        menu.innerHTML = ''; // Clear previous items

        burgers.forEach(burger => {
            const newItem = document.createElement('div');
            newItem.classList.add('item', 'visible', 'burger');
            newItem.innerHTML = `<div class="item visible burger">
                <p>${burger.name} - Rs.${burger.price}</p>
                <img src="${burger.image_url}" alt="${burger.name}" width="75"><br>
                <button class="add-btn" onclick="addToCart('${burger.name}', ${burger.price})">Add</button>
                <button class="delete-btn" onclick="deleteBurger(${burger.id})">Delete</button>
            </div>`;
            menu.appendChild(newItem);
        });
    } catch (error) {
        console.error('Error loading burgers:', error);
    }
}

// Function to add a new burger to the backend
async function addBurger() {
    const itemName = document.getElementById('newItemName').value;
    const itemPrice = parseFloat(document.getElementById('newItemPrice').value);
    const itemImg = document.getElementById('newItemImg').value;

    if (itemName && itemPrice && itemImg) {
        const newBurger = {
            name: itemName,
            price: itemPrice,
            image: itemImg
        };

        try {
            const response = await fetch('http://localhost:8080/burgers/addBurger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBurger)
            });

            if (response.ok) {
                alert('Burger added successfully!');
                loadAllBurgers(); // Refresh the list after adding
                closeAddItemModal();
            } else {
                alert('Failed to add burger.');
            }
        } catch (error) {
            console.error('Error adding burger:', error);
        }
    }
}

// Function to delete a burger from the backend
async function deleteBurger(burgerId) {
    try {
        const response = await fetch(`http://localhost:8080/burgers/delete/${burgerId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Burger deleted successfully!');
            loadAllBurgers();
        } else {
            alert('Failed to delete burger.');
        }
    } catch (error) {
        console.error('Error deleting burger:', error);
    }
}

// Function to update a burger
async function updateBurger(burgerId, updatedBurger) {
    try {
        const response = await fetch('http://localhost:8080/burgers/updateBurger', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBurger)
        });

        if (response.ok) {
            alert('Burger updated successfully!');
            loadAllBurgers();
        } else {
            alert('Failed to update burger.');
        }
    } catch (error) {
        console.error('Error updating burger:', error);
    }
}

// Function to search burger by ID
async function searchBurgerById(burgerId) {
    try {
        const response = await fetch(`http://localhost:8080/burgers/search-by-id/${burgerId}`);
        const burger = await response.json();
        console.log('Burger found:', burger);
    } catch (error) {
        console.error('Error searching burger by ID:', error);
    }
}

// Function to search burger by Name
async function searchBurgerByName(burgerName) {
    try {
        const response = await fetch(`http://localhost:8080/burgers/search-by-name/${burgerName}`);
        const burger = await response.json();
        console.log('Burger found:', burger);
    } catch (error) {
        console.error('Error searching burger by Name:', error);
    }
}

// Function to search burgers (filters items without reloading)
function searchItems() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemName = item.querySelector('p').textContent.toLowerCase();
        if (itemName.includes(searchInput)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Load all burgers when the page loads
window.onload = loadAllBurgers;
