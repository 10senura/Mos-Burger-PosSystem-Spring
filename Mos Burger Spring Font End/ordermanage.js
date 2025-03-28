document.addEventListener("DOMContentLoaded", loadOrders);

let currentOrderId = null;

function loadOrders() {
    fetch("http://localhost:8080/orders/allOrder")
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
            <td>${order.burger_id}</td>
            <td>${order.c_name}</td>
            <td>${order.order_date}</td>
            <td>${order.order_status}</td>
            <td>${order.quantity}</td>
            <td>${order.order_name}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editOrder(${order.order_id}, ${order.burger_id}, '${order.c_name}', '${order.order_date}', '${order.order_status}', ${order.quantity}, '${order.order_name}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.order_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addOrder() {
    const burger_id = document.getElementById("orderBurgerId").value;
    const c_name = document.getElementById("orderCustomerName").value;
    const order_date = document.getElementById("orderDate").value;
    const order_status = document.getElementById("orderStatus").value;
    const quantity = document.getElementById("orderQuantity").value;
    const order_name = document.getElementById("orderName").value;

    fetch("http://localhost:8080/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ burger_id, c_name, order_date, order_status, quantity, order_name })
    }).then(() => loadOrders());
}

function searchOrderById() {
    const order_id = document.getElementById("searchOrderById").value;

    fetch(`http://localhost:8080/orders/search-by-order-id/${order_id}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching order by ID:", error));
}

function searchOrderByName() {
    const order_name = document.getElementById("searchOrderByName").value;

    fetch(`http://localhost:8080/orders/search-by-order-name/${order_name}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching order by name:", error));
}

function editOrder(order_id, burger_id, c_name, order_date, order_status, quantity, order_name) {
    currentOrderId = order_id;
    document.getElementById("updateOrderId").value = order_id;
    document.getElementById("updateBurgerId").value = burger_id;
    document.getElementById("updateCustomerName").value = c_name;
    document.getElementById("updateOrderDate").value = order_date;
    document.getElementById("updateOrderStatus").value = order_status;
    document.getElementById("updateQuantity").value = quantity;
    document.getElementById("updateOrderName").value = order_name;
    document.getElementById("updateOrderForm").style.display = "block";
}

function updateOrderDetails() {
    const burger_id = document.getElementById("updateBurgerId").value;
    const c_name = document.getElementById("updateCustomerName").value;
    const order_date = document.getElementById("updateOrderDate").value;
    const order_status = document.getElementById("updateOrderStatus").value;
    const quantity = document.getElementById("updateQuantity").value;
    const order_name = document.getElementById("updateOrderName").value;

    fetch("http://localhost:8080/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: currentOrderId, burger_id, c_name, order_date, order_status, quantity, order_name })
    }).then(() => {
        loadOrders();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updateOrderForm").style.display = "none";
    currentOrderId = null;
}

function deleteOrder(order_id) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:8080/orders/delete/${order_id}`, { method: "DELETE" })
            .then(() => loadOrders());
    }
}

