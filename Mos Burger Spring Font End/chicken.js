document.addEventListener("DOMContentLoaded", loadChicken);

let currentChickenId = null;

function loadChicken() {
    fetch('http://localhost:8080/chikens/allChiken')
        .then(res => res.json())
        .then(data => displayChickens(data))
        .catch(error => console.error("Error fetching chickens:", error));
}

function displayChickens(chickens) {
    const tableBody = document.getElementById("chickenTableBody");
    tableBody.innerHTML = "";

    chickens.forEach(chicken => {
        const row = `<tr>
            <td>${chicken.chiken_id}</td>
            <td>${chicken.name}</td>
            <td>${chicken.price}</td>
            <td>${chicken.description}</td>
            <td>${chicken.image_url}</td>
            <td>${chicken.available}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editChicken(${chicken.chiken_id}, '${chicken.name}', ${chicken.price}, '${chicken.description}', '${chicken.image_url}', '${chicken.available}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteChicken(${chicken.chiken_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addChicken() {
    const chickenData = {
        name: document.getElementById("chickenName").value,
        price: document.getElementById("chickenPrice").value,
        description: document.getElementById("chickenDescription").value,
        image_url: document.getElementById("chickenImageUrl").value,
        available: document.getElementById("chickenAvailable").value
    };

    fetch("http://localhost:8080/chickens/addChiken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chickenData)
    }).then(() => loadChicken());
}

function searchChicken() {
    const name = document.getElementById("searchChicken").value;
    
    fetch(`http://localhost:8080/chickens/search-by-name/${name}`)
        .then(res => res.json())
        .then(data => displayChickens(data))
        .catch(error => console.error("Error searching chicken:", error));
}

function editChicken(id, name, price, description, image_url, available) {
    currentChickenId = id;
    document.getElementById("updateChickenName").value = name;
    document.getElementById("updateChickenPrice").value = price;
    document.getElementById("updateChickenDescription").value = description;
    document.getElementById("updateChickenImageUrl").value = image_url;
    document.getElementById("updateChickenAvailable").value = available;
    document.getElementById("updateChickenForm").style.display = "block";
}

function updateChickenDetails() {
    const updatedData = {
        chiken_id: currentChickenId,
        name: document.getElementById("updateChickenName").value,
        price: document.getElementById("updateChickenPrice").value,
        description: document.getElementById("updateChickenDescription").value,
        image_url: document.getElementById("updateChickenImageUrl").value,
        available: document.getElementById("updateChickenAvailable").value
    };

    fetch("http://localhost:8080/chickens/updateChiken", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    }).then(() => {
        loadChicken();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updateChickenForm").style.display = "none";
    currentChickenId = null;
}

function deleteChicken(id) {
    if (confirm("Are you sure you want to delete this chicken?")) {
        fetch(`http://localhost:8080/chickens/delete/${id}`, { 
            method: "DELETE" 
        }).then(() => loadChicken());
    }
}