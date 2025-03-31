// Base URL for the Pasta API
const baseURL = 'http://localhost:8080/pastas';

// Function to load all pastas from the backend
function loadPasta() {
    fetch(`${baseURL}/allPasta`)
        .then(response => response.json())
        .then(data => displayPasta(data))
        .catch(error => console.error('Error loading pasta:', error));
}

// Function to display the list of pastas in the table
function displayPasta(pastas) {
    const tableBody = document.getElementById("pastaTableBody");
    tableBody.innerHTML = ""; // Clear previous table rows

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

// Function to add a new pasta
function addPasta() {
    const name = document.getElementById("pastaName").value;
    const price = document.getElementById("pastaPrice").value;
    const description = document.getElementById("pastaDescription").value;
    const image_url = document.getElementById("pastaImageUrl").value;
    const available = document.getElementById("pastaAvailable").value;

    const newPasta = { name, price, description, image_url, available };

    fetch(`${baseURL}/addPasta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPasta),
    }).then(() => loadPasta());
}

// Function to search pastas by name
function searchPasta() {
    const name = document.getElementById("searchPasta").value;
    fetch(`${baseURL}/search-by-name/${name}`)
        .then(response => response.json())
        .then(data => displayPasta(data))
        .catch(error => console.error("Error searching pasta:", error));
}

// Function to edit a pasta
function editPasta(pasta_id, name, price, description, image_url, available) {
    document.getElementById("updateName").value = name;
    document.getElementById("updatePrice").value = price;
    document.getElementById("updateDescription").value = description;
    document.getElementById("updateImageUrl").value = image_url;
    document.getElementById("updateAvailable").value = available;

    document.getElementById("updatePastaForm").style.display = "block";
    currentPastaId = pasta_id;
}

// Function to update a pasta's details
function updatePastaDetails() {
    const name = document.getElementById("updateName").value;
    const price = document.getElementById("updatePrice").value;
    const description = document.getElementById("updateDescription").value;
    const image_url = document.getElementById("updateImageUrl").value;
    const available = document.getElementById("updateAvailable").value;

    const updatedPasta = { pasta_id: currentPastaId, name, price, description, image_url, available };

    fetch(`${baseURL}/updatePasta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPasta),
    }).then(() => {
        loadPasta();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updatePastaForm").style.display = "none";
}

function deletePasta(pasta_id) {
    if (confirm("Are you sure you want to delete this pasta?")) {
        fetch(`${baseURL}/delete/${pasta_id}`, { method: "DELETE" })
            .then(() => loadPasta());
    }
}

window.onload = loadPasta;
