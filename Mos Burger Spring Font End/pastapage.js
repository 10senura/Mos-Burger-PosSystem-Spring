document.addEventListener("DOMContentLoaded", loadPasta);

let currentPastaId = null;

function loadPasta() {
    fetch("http://localhost:8080/pasta/allPasta")
        .then(res => res.json())
        .then(data => displayPastas(data))
        .catch(error => console.error("Error fetching pastas:", error));
}

function displayPastas(pastas) {
    const tableBody = document.getElementById("pastaTableBody");
    tableBody.innerHTML = "";

    pastas.forEach(pasta => {
        const row = `<tr>
            <td>${pasta.pasta_id}</td>
            <td>${pasta.name}</td>
            <td>${pasta.price}</td>
            <td>${pasta.description}</td>
            <td>${pasta.image_url}</td>
            <td>${pasta.available}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editPasta(${pasta.pasta_id}, '${pasta.name}', ${pasta.price}, '${pasta.description}', '${pasta.image_url}', '${pasta.available}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deletePasta(${pasta.pasta_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addPasta() {
    const pastaData = {
        name: document.getElementById("pastaName").value,
        price: document.getElementById("pastaPrice").value,
        description: document.getElementById("pastaDescription").value,
        image_url: document.getElementById("pastaImageUrl").value,
        available: document.getElementById("pastaAvailable").value
    };

    fetch("http://localhost:8080/pasta/addPasta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pastaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        loadPasta();
        // Clear form fields
        document.getElementById("pastaName").value = '';
        document.getElementById("pastaPrice").value = '';
        document.getElementById("pastaDescription").value = '';
        document.getElementById("pastaImageUrl").value = '';
        document.getElementById("pastaAvailable").value = '';
    })
    .catch(error => console.error("Error adding pasta:", error));
}

function searchPasta() {
    const name = document.getElementById("searchPasta").value;

    if (!name.trim()) {
        loadPasta();
        return;
    }

    fetch(`http://localhost:8080/pasta/search-by-pasta-name/${name}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Search failed');
            }
            return res.json();
        })
        .then(data => displayPastas(data))
        .catch(error => {
            console.error("Error searching pasta:", error);
            alert("Pasta not found or search error occurred");
        });
}

function editPasta(pastaId, name, price, description, image_url, available) {
    currentPastaId = pastaId;
    document.getElementById("updatePastaName").value = name;
    document.getElementById("updatePastaPrice").value = price;
    document.getElementById("updatePastaDescription").value = description;
    document.getElementById("updatePastaImageUrl").value = image_url;
    document.getElementById("updatePastaAvailable").value = available;
    document.getElementById("updatePastaForm").style.display = "block";
    
    // Scroll to update form
    document.getElementById("updatePastaForm").scrollIntoView({ behavior: 'smooth' });
}

function updatePastaDetails() {
    const pastaData = {
        pasta_id: currentPastaId,
        name: document.getElementById("updatePastaName").value,
        price: document.getElementById("updatePastaPrice").value,
        description: document.getElementById("updatePastaDescription").value,
        image_url: document.getElementById("updatePastaImageUrl").value,
        available: document.getElementById("updatePastaAvailable").value
    };

    fetch("http://localhost:8080/pasta/updatePasta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pastaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Update failed');
        }
        return response.json();
    })
    .then(() => {
        loadPasta();
        cancelUpdate();
    })
    .catch(error => console.error("Error updating pasta:", error));
}

function cancelUpdate() {
    document.getElementById("updatePastaForm").style.display = "none";
    currentPastaId = null;
}

function deletePasta(pastaId) {
    if (confirm("Are you sure you want to delete this pasta?")) {
        fetch(`http://localhost:8080/pasta/delete/${pastaId}`, { 
            method: "DELETE" 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Delete failed');
            }
            return response.json();
        })
        .then(() => loadPasta())
        .catch(error => console.error("Error deleting pasta:", error));
    }
}