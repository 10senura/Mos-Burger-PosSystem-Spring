// JavaScript code for Order Management

document.addEventListener("DOMContentLoaded", loadOrders);

let currentOrderId = null;

function loadOrders() {
    fetch("http://localhost:8080/orders/allOrders")
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error fetching orders:", error));
}

function displayOrders(orders) {
    const tableBody = document.getElementById("orderTableBody");
    tableBody.innerHTML = "";

    orders.forEach(order => {
        const row = `<tr>
            <td>${order.order_id}</td>
            <td>${order.orderName}</td>
            <td>${order.burger_id}</td>
            <td>${order.quantity}</td>
            <td>${order.order_status}</td>
            <td>${order.order_date}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editOrder(${order.order_id}, '${order.orderName}', ${order.burger_id}, ${order.quantity}, '${order.order_status}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.order_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addOrder() {
    const orderName = document.getElementById("orderName").value;
    const burgerId = document.getElementById("burgerId").value;
    const quantity = document.getElementById("quantity").value;
    const orderStatus = document.getElementById("orderStatus").value;

    fetch("http://localhost:8080/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderName, burger_id: burgerId, quantity, order_status: orderStatus })
    }).then(() => {
        loadOrders();
        clearForm();
    });
}

function searchOrder() {
    const orderName = document.getElementById("searchOrder").value;

    fetch(`http://localhost:8080/orders/search-by-name/${orderName}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching order:", error));
}

function editOrder(order_id, orderName, burger_id, quantity, order_status) {
    currentOrderId = order_id;
    document.getElementById("orderName").value = orderName;
    document.getElementById("burgerId").value = burger_id;
    document.getElementById("quantity").value = quantity;
    document.getElementById("orderStatus").value = order_status;
}

function updateOrder() {
    if (!currentOrderId) return;

    const orderName = document.getElementById("orderName").value;
    const burgerId = document.getElementById("burgerId").value;
    const quantity = document.getElementById("quantity").value;
    const orderStatus = document.getElementById("orderStatus").value;

    fetch("http://localhost:8080/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: currentOrderId, orderName, burger_id: burgerId, quantity, order_status: orderStatus })
    }).then(() => {
        loadOrders();
        clearForm();
    });
}

function deleteOrder(order_id) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:8080/orders/delete/${order_id}`, { method: "DELETE" })
            .then(() => loadOrders());
    }
}

function clearForm() {
    document.getElementById("orderName").value = "";
    document.getElementById("burgerId").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("orderStatus").value = "";
    currentOrderId = null;
}
