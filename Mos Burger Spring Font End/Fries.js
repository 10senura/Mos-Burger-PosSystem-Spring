document.addEventListener("DOMContentLoaded", loadFries);

let currentFriesId = null;

function loadFries() {
    fetch("http://localhost:8080/fries/allFries")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayFries(data);
            document.getElementById("searchFries").value = ""; 
        })
        .catch(error => {
            console.error("Error loading fries:", error);
            showAlert("danger", "Failed to load fries. Please try again.");
        });
}

function displayFries(friesList) {
    const tableBody = document.getElementById("friesTableBody");
    tableBody.innerHTML = "";

    if (!friesList || friesList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-exclamation-circle fs-1"></i>
                    <p class="mt-2 mb-0">No fries found</p>
                </td>
            </tr>`;
        return;
    }

    friesList.forEach(fries => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${fries.fries_id}</td>
            <td>${fries.name}</td>
            <td>$${fries.price.toFixed(2)}</td>
            <td>${fries.description || '-'}</td>
            <td>
                ${fries.image_url ? 
                    `<img src="${fries.image_url}" alt="${fries.name}" class="img-thumbnail" style="width: 80px; height: 60px; object-fit: cover;">` : 
                    '<span class="text-muted">No image</span>'}
            </td>
            <td>
                <span class="badge ${fries.available === 'Yes' ? 'bg-success' : 'bg-danger'}">
                    ${fries.available}
                </span>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-warning" 
                        onclick="editFries(${fries.fries_id}, '${escapeHtml(fries.name)}', ${fries.price}, 
                        '${escapeHtml(fries.description)}', '${escapeHtml(fries.image_url)}', '${fries.available}')">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" 
                        onclick="confirmDeleteFries(${fries.fries_id}, '${escapeHtml(fries.name)}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>`;
        tableBody.appendChild(row);
    });
}

function addFries() {
    const friesData = {
        name: document.getElementById("friesName").value.trim(),
        price: parseFloat(document.getElementById("friesPrice").value),
        description: document.getElementById("friesDescription").value.trim(),
        image_url: document.getElementById("friesImageUrl").value.trim(),
        available: document.getElementById("friesAvailable").value
    };

    // Validation
    if (!friesData.name || isNaN(friesData.price)) {
        showAlert("warning", "Please enter valid name and price");
        return;
    }

    fetch("http://localhost:8080/fries/addFries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(friesData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Fries added successfully!");
        loadFries();
        // Reset form
        document.getElementById("friesName").value = "";
        document.getElementById("friesPrice").value = "";
        document.getElementById("friesDescription").value = "";
        document.getElementById("friesImageUrl").value = "";
    })
    .catch(error => {
        console.error("Error adding fries:", error);
        showAlert("danger", error.message || "Failed to add fries");
    });
}

function searchFries() {
    const name = document.getElementById("searchFries").value.trim();
    if (!name) {
        loadFries();
        return;
    }

    fetch(`http://localhost:8080/fries/search-by-name/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayFries(data))
        .catch(error => {
            console.error("Error searching fries:", error);
            showAlert("warning", "No fries found matching your search");
        });
}

function editFries(id, name, price, description, image_url, available) {
    currentFriesId = id;
    document.getElementById("updateFriesId").value = id;
    document.getElementById("updateFriesName").value = name;
    document.getElementById("updateFriesPrice").value = price;
    document.getElementById("updateFriesDescription").value = description;
    document.getElementById("updateFriesImageUrl").value = image_url;
    document.getElementById("updateFriesAvailable").value = available;
    
    // Show update form and scroll to it
    document.getElementById("updateFriesForm").style.display = "block";
    document.getElementById("updateFriesForm").scrollIntoView({ behavior: 'smooth' });
}

function updateFriesDetails() {
    const friesData = {
        fries_id: currentFriesId,
        name: document.getElementById("updateFriesName").value.trim(),
        price: parseFloat(document.getElementById("updateFriesPrice").value),
        description: document.getElementById("updateFriesDescription").value.trim(),
        image_url: document.getElementById("updateFriesImageUrl").value.trim(),
        available: document.getElementById("updateFriesAvailable").value
    };

    // Validation
    if (!friesData.name || isNaN(friesData.price)) {
        showAlert("warning", "Please enter valid name and price");
        return;
    }

    fetch("http://localhost:8080/fries/updateFries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(friesData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Fries updated successfully!");
        loadFries();
        cancelUpdate();
    })
    .catch(error => {
        console.error("Error updating fries:", error);
        showAlert("danger", error.message || "Failed to update fries");
    });
}

function cancelUpdate() {
    document.getElementById("updateFriesForm").style.display = "none";
    currentFriesId = null;
}

function confirmDeleteFries(id, name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        deleteFries(id);
    }
}

function deleteFries(id) {
    fetch(`http://localhost:8080/fries/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(() => {
        showAlert("success", "Fries deleted successfully!");
        loadFries();
    })
    .catch(error => {
        console.error("Error deleting fries:", error);
        showAlert("danger", error.message || "Failed to delete fries");
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}