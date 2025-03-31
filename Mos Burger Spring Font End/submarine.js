document.addEventListener("DOMContentLoaded", loadSubmarine);

let currentSubmarineId = null;

function loadSubmarine() {
    fetch("http://localhost:8080/submarines/allSubmarine")
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch submarines');
            }
            return res.json();
        })
        .then(data => displaySubmarines(data))
        .catch(error => {
            console.error("Error fetching submarines:", error);
            alert("Error loading submarines. Please try again.");
        });
}

function displaySubmarines(submarines) {
    const tableBody = document.getElementById("submarineTableBody");
    tableBody.innerHTML = "";

    if (!submarines || submarines.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No submarines found</td></tr>`;
        return;
    }

    submarines.forEach(sub => {
        const row = `<tr>
            <td>${sub.submarine_id}</td>
            <td>${sub.name}</td>
            <td>${sub.price}</td>
            <td>${sub.description}</td>
            <td>${sub.image_url}</td>
            <td>${sub.available}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSubmarine(${sub.submarine_id}, '${sub.name}', ${sub.price}, '${sub.description}', '${sub.image_url}', '${sub.available}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSubmarine(${sub.submarine_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addSubmarine() {
    const submarineData = {
        name: document.getElementById("submarineName").value,
        price: parseFloat(document.getElementById("submarinePrice").value),
        description: document.getElementById("submarineDescription").value,
        image_url: document.getElementById("submarineImageUrl").value,
        available: document.getElementById("submarineAvailable").value
    };

    // Basic validation
    if (!submarineData.name || !submarineData.price || !submarineData.available) {
        alert("Please fill in all required fields (Name, Price, Availability)");
        return;
    }

    fetch("http://localhost:8080/submarines/addSubmarine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submarineData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add submarine');
        }
        return response.json();
    })
    .then(() => {
        loadSubmarine();
        // Clear form
        document.getElementById("submarineName").value = "";
        document.getElementById("submarinePrice").value = "";
        document.getElementById("submarineDescription").value = "";
        document.getElementById("submarineImageUrl").value = "";
        document.getElementById("submarineAvailable").value = "";
        alert("Submarine added successfully!");
    })
    .catch(error => {
        console.error("Error adding submarine:", error);
        alert("Error adding submarine. Please try again.");
    });
}

function searchSubmarine() {
    const name = document.getElementById("searchSubmarine").value.trim();

    if (!name) {
        loadSubmarine();
        return;
    }

    fetch(`http://localhost:8080/submarines/search-by-name/${name}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Search failed');
            }
            return res.json();
        })
        .then(data => displaySubmarines(data))
        .catch(error => {
            console.error("Error searching submarine:", error);
            alert("Submarine not found or search error occurred");
        });
}

function editSubmarine(submarineId, name, price, description, image_url, available) {
    currentSubmarineId = submarineId;
    document.getElementById("updateSubmarineName").value = name;
    document.getElementById("updateSubmarinePrice").value = price;
    document.getElementById("updateSubmarineDescription").value = description;
    document.getElementById("updateSubmarineImageUrl").value = image_url;
    document.getElementById("updateSubmarineAvailable").value = available;
    document.getElementById("updateSubmarineForm").style.display = "block";
    
    // Scroll to update form
    document.getElementById("updateSubmarineForm").scrollIntoView({ behavior: 'smooth' });
}

function updateSubmarineDetails() {
    const submarineData = {
        submarine_id: currentSubmarineId,
        name: document.getElementById("updateSubmarineName").value,
        price: parseFloat(document.getElementById("updateSubmarinePrice").value),
        description: document.getElementById("updateSubmarineDescription").value,
        image_url: document.getElementById("updateSubmarineImageUrl").value,
        available: document.getElementById("updateSubmarineAvailable").value
    };

    // Basic validation
    if (!submarineData.name || !submarineData.price || !submarineData.available) {
        alert("Please fill in all required fields (Name, Price, Availability)");
        return;
    }

    fetch("http://localhost:8080/submarines/updateSubmarine", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submarineData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Update failed');
        }
        return response.json();
    })
    .then(() => {
        loadSubmarine();
        cancelUpdate();
        alert("Submarine updated successfully!");
    })
    .catch(error => {
        console.error("Error updating submarine:", error);
        alert("Error updating submarine. Please try again.");
    });
}

function cancelUpdate() {
    document.getElementById("updateSubmarineForm").style.display = "none";
    currentSubmarineId = null;
}

function deleteSubmarine(submarineId) {
    if (!confirm("Are you sure you want to delete this submarine?")) {
        return;
    }

    fetch(`http://localhost:8080/submarines/delete/${submarineId}`, { 
        method: "DELETE" 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Delete failed');
        }
        return response.json();
    })
    .then(() => {
        loadSubmarine();
        alert("Submarine deleted successfully!");
    })
    .catch(error => {
        console.error("Error deleting submarine:", error);
        alert("Error deleting submarine. Please try again.");
    });
}