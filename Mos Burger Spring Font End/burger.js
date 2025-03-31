document.addEventListener("DOMContentLoaded", loadBurger);

let currentBurgerId = null;

function loadBurger() {
    fetch("http://localhost:8080/burgers/allBurger")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayBurgers(data);
            document.getElementById("searchBurger").value = "";
        })
        .catch(error => {
            console.error("Error loading burgers:", error);
            showAlert("danger", "Failed to load burgers. Please try again.");
        });
}

function displayBurgers(burgerList) {
    const tableBody = document.getElementById("burgerTableBody");
    tableBody.innerHTML = "";

    if (!burgerList || burgerList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="bi bi-exclamation-circle fs-1"></i>
                    <p class="mt-2 mb-0">No burgers found</p>
                </td>
            </tr>`;
        return;
    }

    burgerList.forEach(burger => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${burger.burger_id}</td>
            <td>${burger.name}</td>
            <td>${burger.qty || 0}</td>
            <td>$${burger.price.toFixed(2)}</td>
            <td>${burger.description || '-'}</td>
            <td>
                ${burger.image_url ? 
                    `<img src="${burger.image_url}" alt="${burger.name}" class="img-thumbnail" style="width: 80px; height: 60px; object-fit: cover;">` : 
                    '<span class="text-muted">No image</span>'}
            </td>
            <td>
                <span class="badge ${burger.available === 'Yes' ? 'bg-success' : 'bg-danger'}">
                    ${burger.available}
                </span>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-danger" 
                        onclick="editBurger(${burger.burger_id}, '${escapeHtml(burger.name)}', ${burger.qty || 0}, ${burger.price}, 
                        '${escapeHtml(burger.description)}', '${escapeHtml(burger.image_url)}', '${burger.available}')">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" 
                        onclick="confirmDeleteBurger(${burger.burger_id}, '${escapeHtml(burger.name)}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>`;
        tableBody.appendChild(row);
    });
}

function addBurger() {
    const burgerData = {
        name: document.getElementById("burgerName").value.trim(),
        qty: parseInt(document.getElementById("burgerQty").value) || 0,
        price: parseFloat(document.getElementById("burgerPrice").value),
        description: document.getElementById("burgerDescription").value.trim(),
        image_url: document.getElementById("burgerImageUrl").value.trim(),
        available: document.getElementById("burgerAvailable").value
    };

    if (!burgerData.name || isNaN(burgerData.price)) {
        showAlert("warning", "Please enter valid name and price");
        return;
    }

    fetch("http://localhost:8080/burgers/addBurger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(burgerData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Burger added successfully!");
        loadBurger();
        // Clear form
        document.getElementById("burgerName").value = "";
        document.getElementById("burgerQty").value = "";
        document.getElementById("burgerPrice").value = "";
        document.getElementById("burgerDescription").value = "";
        document.getElementById("burgerImageUrl").value = "";
    })
    .catch(error => {
        console.error("Error adding burger:", error);
        showAlert("danger", error.message || "Failed to add burger");
    });
}

function searchBurger() {
    const name = document.getElementById("searchBurger").value.trim();
    if (!name) {
        loadBurger();
        return;
    }

    fetch(`http://localhost:8080/burgers/search-by-name/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayBurgers(data))
        .catch(error => {
            console.error("Error searching burger:", error);
            showAlert("warning", "No burgers found matching your search");
        });
}

function editBurger(id, name, qty, price, description, image_url, available) {
    currentBurgerId = id;
    document.getElementById("updateBurgerId").value = id;
    document.getElementById("updateBurgerName").value = name;
    document.getElementById("updateBurgerQty").value = qty;
    document.getElementById("updateBurgerPrice").value = price;
    document.getElementById("updateBurgerDescription").value = description;
    document.getElementById("updateBurgerImageUrl").value = image_url;
    document.getElementById("updateBurgerAvailable").value = available;
    
    document.getElementById("updateBurgerForm").style.display = "block";
    document.getElementById("updateBurgerForm").scrollIntoView({ behavior: 'smooth' });
}

function updateBurgerDetails() {
    const burgerData = {
        burger_id: currentBurgerId,
        name: document.getElementById("updateBurgerName").value.trim(),
        qty: parseInt(document.getElementById("updateBurgerQty").value) || 0,
        price: parseFloat(document.getElementById("updateBurgerPrice").value),
        description: document.getElementById("updateBurgerDescription").value.trim(),
        image_url: document.getElementById("updateBurgerImageUrl").value.trim(),
        available: document.getElementById("updateBurgerAvailable").value
    };

    if (!burgerData.name || isNaN(burgerData.price)) {
        showAlert("warning", "Please enter valid name and price");
        return;
    }

    fetch("http://localhost:8080/burgers/updateBurger", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(burgerData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Burger updated successfully!");
        loadBurger();
        cancelUpdate();
    })
    .catch(error => {
        console.error("Error updating burger:", error);
        showAlert("danger", error.message || "Failed to update burger");
    });
}

function cancelUpdate() {
    document.getElementById("updateBurgerForm").style.display = "none";
    currentBurgerId = null;
}

function confirmDeleteBurger(id, name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        deleteBurger(id);
    }
}

function deleteBurger(id) {
    fetch(`http://localhost:8080/burgers/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Burger deleted successfully!");
        loadBurger();
    })
    .catch(error => {
        console.error("Error deleting burger:", error);
        showAlert("danger", error.message || "Failed to delete burger");
    });
}

// Helper functions
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showAlert(type, message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = "20px";
    alertDiv.style.right = "20px";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.minWidth = "300px";
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
