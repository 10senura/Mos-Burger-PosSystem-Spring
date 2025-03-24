document.addEventListener("DOMContentLoaded", function() {
    loadBurger();
    setupImagePreview();
});

let currentBurgerId = null;

// Image preview setup
function setupImagePreview() {
    // Add burger image preview
    document.getElementById('burgerImageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('previewImage');
        const previewContainer = document.getElementById('imagePreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Update burger image preview
    document.getElementById('updateImageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('updatePreviewImage');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
}

function loadBurger() {
    fetch("http://localhost:8080/burgers/allBurger")
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => displayBurgers(data))
        .catch(error => {
            console.error("Error fetching burgers:", error);
            alert("Error loading burgers. Please try again.");
        });
}

function displayBurgers(burgers) {
    const tableBody = document.getElementById("burgerTableBody");
    tableBody.innerHTML = "";

    if (!burgers || burgers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No burgers found</td></tr>`;
        return;
    }

    burgers.forEach(burger => {
        const row = `<tr>
            <td>${burger.burger_id}</td>
            <td>${burger.b_name || burger.name}</td>
            <td>$${parseFloat(burger.price).toFixed(2)}</td>
            <td>${burger.description}</td>
            <td><img src="${burger.image_url}" alt="${burger.b_name || burger.name}" style="max-width: 100px;"></td>
            <td>${burger.available ? '✅ Available' : '❌ Not Available'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBurger(${burger.burger_id}, '${burger.b_name || burger.name}', ${burger.price}, '${burger.description}', '${burger.image_url}', ${burger.available})">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBurger(${burger.burger_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}



async function addBurger() {
    const statusElement = document.getElementById('addStatus');
    statusElement.innerHTML = '<div class="alert alert-info">Processing your request...</div>';

    try {
        // Get form values
        const b_name = document.getElementById("burgerName").value.trim();
        const price = parseFloat(document.getElementById("burgerPrice").value);
        const description = document.getElementById("burgerDescription").value.trim();
        const available = document.getElementById("burgerAvailable").value === "true";
        const fileInput = document.getElementById('burgerImageUpload');
        const file = fileInput.files[0];

        // Validate inputs
        if (!b_name || isNaN(price) || !description || !file) {
            throw new Error('Please fill all fields with valid values');
        }

        // Check file size
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('Image size must be less than 2MB');
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('b_name', b_name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('available', available);
        formData.append('image', file);  // Keep as 'image' for backend processing

        // Debug: Log what we're sending
        console.log("Sending burger data:", {
            b_name, price, description, available,
            image: file.name, size: file.size
        });

        // Send request to server
        const response = await fetch("http://localhost:8080/burgers/addBurger", {
            method: "POST",
            body: formData
        });

        // Check response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add burger');
        }

        const result = await response.json();
        console.log("Server response:", result);

        // Success case
        statusElement.innerHTML = `<div class="alert alert-success">${result.message || 'Burger added successfully!'}</div>`;
        
        // Reset form
        document.getElementById("burgerName").value = '';
        document.getElementById("burgerPrice").value = '';
        document.getElementById("burgerDescription").value = '';
        document.getElementById("burgerAvailable").value = '';
        document.getElementById("burgerImageUpload").value = '';
        document.getElementById("imagePreview").style.display = 'none';
        
        // Reload burger list
        await loadBurger();
        
    } catch (error) {
        console.error("Add Burger Error:", error);
        statusElement.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        
        // Additional error details
        if (error.response) {
            console.error("Server response:", await error.response.json());
        }
    }
}

function searchBurger() {
    const name = document.getElementById("searchBurger").value.trim();

    if (!name) {
        alert("Please enter a burger name to search");
        return;
    }

    fetch(`http://localhost:8080/burgers/search-by-name/${encodeURIComponent(name)}`)
        .then(res => {
            if (!res.ok) throw new Error('Search failed');
            return res.json();
        })
        .then(data => displayBurgers(data))
        .catch(error => {
            console.error("Error searching burger:", error);
            alert("Error searching for burger. Please try again.");
        });
}

function editBurger(burger_id, name, price, description, image_url, available) {
    currentBurgerId = burger_id;
    document.getElementById("updateName").value = name;
    document.getElementById("updatePrice").value = price;
    document.getElementById("updateDescription").value = description;
    document.getElementById("updatePreviewImage").src = image_url;
    document.getElementById("updateAvailable").value = available;
    document.getElementById("updateImageUpload").value = '';
    document.getElementById("updateBurgerForm").style.display = "block";
    
    // Scroll to update form
    document.getElementById("updateBurgerForm").scrollIntoView({ behavior: 'smooth' });
}

async function updateBurgerDetails() {
    const name = document.getElementById("updateName").value;
    const price = document.getElementById("updatePrice").value;
    const description = document.getElementById("updateDescription").value;
    const available = document.getElementById("updateAvailable").value;
    const fileInput = document.getElementById('updateImageUpload');
    const file = fileInput.files[0];
    const statusElement = document.getElementById('updateStatus');

    // Basic validation
    if (!name || !price || !description || !available) {
        statusElement.innerHTML = '<div class="alert alert-danger">Please fill all required fields</div>';
        return;
    }

    const formData = new FormData();
    formData.append('burger_id', currentBurgerId);
    formData.append('b_name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('available', available);
    if (file) {
        formData.append('image', file);
    }

    try {
        statusElement.innerHTML = '<div class="alert alert-info">Updating burger...</div>';
        
        const response = await fetch("http://localhost:8080/burgers/updateBurger", {
            method: "PUT",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update burger');
        }

        const result = await response.json();
        statusElement.innerHTML = `<div class="alert alert-success">${result.message || 'Burger updated successfully!'}</div>`;
        
        loadBurger();
        cancelUpdate();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            statusElement.innerHTML = '';
        }, 3000);
    } catch (error) {
        console.error("Error updating burger:", error);
        statusElement.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

function cancelUpdate() {
    document.getElementById("updateBurgerForm").style.display = "none";
    currentBurgerId = null;
    document.getElementById("updateStatus").innerHTML = '';
}

function deleteBurger(burger_id) {
    if (!confirm("Are you sure you want to delete this burger?")) return;

    fetch(`http://localhost:8080/burgers/delete/${burger_id}`, { 
        method: "DELETE" 
    })
    .then(response => {
        if (!response.ok) throw new Error('Delete failed');
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Burger deleted successfully');
        loadBurger();
    })
    .catch(error => {
        console.error("Error deleting burger:", error);
        alert("Error deleting burger. Please try again.");
    });
}