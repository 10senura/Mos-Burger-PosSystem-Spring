const baseURL = 'http://localhost:8080/pasta';

// Function to load all pasta from the backend
async function loadAllPasta() {
    try {
        const response = await fetch(`${baseURL}/allPasta`);
        const pastas = await response.json();

        const menu = document.getElementById('itemmenu');
        menu.innerHTML = ''; // Clear previous items

        // Add Burger Button
        const burgerButton = document.createElement('button');
        burgerButton.textContent = 'Burger';
        burgerButton.onclick = () => window.location.href = '/burger.html';
        menu.appendChild(burgerButton);

        pastas.forEach(pasta => {
            const newItem = document.createElement('div');
            newItem.classList.add('item', 'visible', 'pasta');
            newItem.innerHTML = `<div class="item visible pasta">
                <p onclick="viewPastaDetails(${pasta.pasta_id})">${pasta.name} - Rs.${pasta.price}</p>
                <img src="${pasta.image_url}" alt="${pasta.name}" width="75"><br>
                <button class="add-btn" onclick="addToCart('${pasta.name}', ${pasta.price})">Add</button>
                <button class="delete-btn" onclick="deletePasta(${pasta.pasta_id})">Delete</button>
                <button class="update-btn" onclick="showUpdateForm(${pasta.pasta_id}, '${pasta.name}', ${pasta.price}, '${pasta.image_url}')">Update</button>
            </div>`;
            menu.appendChild(newItem);
        });
    } catch (error) {
        console.error('Error loading pastas:', error);
    }
}

// Function to redirect to pasta details page
function viewPastaDetails(pastaId) {
    window.location.href = `/pastaDetails.html?pastaId=${pastaId}`;
}

// Function to add a new pasta to the backend
async function addPasta() {
    const itemName = document.getElementById('newItemName').value;
    const itemPrice = parseFloat(document.getElementById('newItemPrice').value);
    const itemImg = document.getElementById('newItemImg').value;

    if (itemName && itemPrice && itemImg) {
        const newPasta = {
            name: itemName,
            price: itemPrice,
            image_url: itemImg,
            description: 'Delicious pasta',
            available: 'Yes'
        };

        try {
            const response = await fetch(`${baseURL}/addPasta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPasta)
            });

            if (response.ok) {
                alert('Pasta added successfully!');
                loadAllPasta(); // Refresh the list after adding
            } else {
                alert('Failed to add pasta.');
            }
        } catch (error) {
            console.error('Error adding pasta:', error);
        }
    }
}

window.onload = loadAllPasta;
