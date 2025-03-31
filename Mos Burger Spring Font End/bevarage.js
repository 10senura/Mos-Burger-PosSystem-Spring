document.addEventListener("DOMContentLoaded", loadBeverage);

let currentBevId = null;

function loadBeverage() {
    fetch("http://localhost:8080/bevarages/allBevarages")
        .then(res => res.json())
        .then(data => displayBeverages(data))
        .catch(error => console.error("Error fetching beverages:", error));
}

function displayBeverages(beverages) {
    const tableBody = document.getElementById("bevTableBody");
    tableBody.innerHTML = "";

    beverages.forEach(bev => {
        const row = `<tr>
            <td>${bev.bevarages_id}</td>
            <td>${bev.name}</td>
            <td>${bev.price}</td>
            <td>${bev.description}</td>
            <td>${bev.image_url}</td>
            <td>${bev.available}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBeverage(${bev.bevarages_id}, '${bev.name}', ${bev.price}, '${bev.description}', '${bev.image_url}', '${bev.available}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBeverage(${bev.bevarages_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addBeverage() {
    const name = document.getElementById("bevName").value;
    const price = document.getElementById("bevPrice").value;
    const description = document.getElementById("bevDescription").value;
    const image_url = document.getElementById("bevImageUrl").value;
    const available = document.getElementById("bevAvailable").value;

    fetch("http://localhost:8080/bevarages/addBevarages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description, image_url, available })
    }).then(() => loadBeverage());
}

function searchBeverage() {
    const name = document.getElementById("searchBev").value;

    fetch(`http://localhost:8080/bevarages/search-by-name/${name}`)
        .then(res => res.json())
        .then(data => displayBeverages(data))
        .catch(error => console.error("Error searching beverage:", error));
}

function editBeverage(bevId, name, price, description, image_url, available) {
    currentBevId = bevId;
    document.getElementById("updateBevName").value = name;
    document.getElementById("updateBevPrice").value = price;
    document.getElementById("updateBevDescription").value = description;
    document.getElementById("updateBevImageUrl").value = image_url;
    document.getElementById("updateBevAvailable").value = available;
    document.getElementById("updateBevForm").style.display = "block";
}

function updateBeverageDetails() {
    const name = document.getElementById("updateBevName").value;
    const price = document.getElementById("updateBevPrice").value;
    const description = document.getElementById("updateBevDescription").value;
    const image_url = document.getElementById("updateBevImageUrl").value;
    const available = document.getElementById("updateBevAvailable").value;

    fetch("http://localhost:8080/bevarages/updateBevarages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            bevarages_id: currentBevId, 
            name, 
            price, 
            description, 
            image_url, 
            available 
        })
    }).then(() => {
        loadBeverage();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updateBevForm").style.display = "none";
    currentBevId = null;
}

function deleteBeverage(bevId) {
    if (confirm("Are you sure you want to delete this beverage?")) {
        fetch(`http://localhost:8080/bevarages/delete/${bevId}`, { 
            method: "DELETE" 
        }).then(() => loadBeverage());
    }
}