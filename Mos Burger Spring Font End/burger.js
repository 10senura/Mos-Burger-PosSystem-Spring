document.addEventListener("DOMContentLoaded", loadBurger);

let currentBurgerId = null;

function loadBurger() {
    fetch("http://localhost:8080/burgers/allBurger")
        .then(res => res.json())
        .then(data => displayBurgers(data))
        .catch(error => console.error("Error fetching burgers:", error));
}

function displayBurgers(burgers) {
    const tableBody = document.getElementById("burgerTableBody");
    tableBody.innerHTML = "";

    burgers.forEach(burger => {
        const row = `<tr>
            <td>${burger.burger_id}</td>
            <td>${burger.name}</td>
            <td>${burger.price}</td>
            <td>${burger.description}</td>
            <td>${burger.image_url}</td>
            <td>${burger.available}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBurger(${burger.burger_id}, '${burger.name}', ${burger.price}, '${burger.description}', '${burger.image_url}', '${burger.available}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBurger(${burger.burger_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addBurger() {
    const name = document.getElementById("burgerName").value;
    const price = document.getElementById("burgerPrice").value;
    const description = document.getElementById("burgerDescription").value;
    const image_url = document.getElementById("burgerImageUrl").value;
    const available = document.getElementById("burgerAvailable").value;

    fetch("http://localhost:8080/burgers/addBurger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description, image_url, available })
    }).then(() => loadBurger());
}

function searchBurger() {
    const name = document.getElementById("searchBurger").value;

    fetch(`http://localhost:8080/burgers/search-by-name/${name}`)
        .then(res => res.json())
        .then(data => displayBurgers(data))
        .catch(error => console.error("Error searching burger:", error));
}

function editBurger(burger_id, name, price, description, image_url, available) {
    currentBurgerId = burger_id;
    document.getElementById("updateName").value = name;
    document.getElementById("updatePrice").value = price;
    document.getElementById("updateDescription").value = description;
    document.getElementById("updateImageUrl").value = image_url;
    document.getElementById("updateAvailable").value = available;
    document.getElementById("updateBurgerForm").style.display = "block";
}

function updateBurgerDetails() {
    const name = document.getElementById("updateName").value;
    const price = document.getElementById("updatePrice").value;
    const description = document.getElementById("updateDescription").value;
    const image_url = document.getElementById("updateImageUrl").value;
    const available = document.getElementById("updateAvailable").value;

    fetch("http://localhost:8080/burgers/updateBurger", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ burger_id: currentBurgerId, name, price, description, image_url, available })
    }).then(() => {
        loadBurger();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updateBurgerForm").style.display = "none";
    currentBurgerId = null;
}

function deleteBurger(burger_id) {
    if (confirm("Are you sure you want to delete this burger?")) {
        fetch(`http://localhost:8080/burgers/delete/${burger_id}`, { method: "DELETE" })
            .then(() => loadBurger());
    }
}
