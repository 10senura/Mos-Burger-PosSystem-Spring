document.addEventListener("DOMContentLoaded", loadOrders);

let currentOrderId = null;

function loadOrders() {
    console.log("Attempting to load orders..."); 
    
    fetch("http://localhost:8080/orders/allOrder")
    .then(res => {
        console.log("Response status:", res.status); 
        return res.json();
    })
    .then(data => {
        console.log("Received data:", data);
        displayOrders(data);
    })
    .catch(error => console.error("Error:", error));
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
                <button class="btn btn-warning btn-sm" onclick="editOrder(${order.order_id}, '${order.orderName}', ${order.burger_id}, ${order.quantity}, '${order.order_status}', '${order.order_date}')">Update</button>
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
    const orderDate = document.getElementById("orderDate").value;

    fetch("http://localhost:8080/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            orderName, 
            burger_id: burgerId, 
            quantity, 
            order_status: orderStatus, 
            order_date: orderDate 
        })
    }).then(() => loadOrders());
}

function editOrder(orderId, orderName, burgerId, quantity, status, date) {
    currentOrderId = orderId;
    document.getElementById("updateOrderName").value = orderName;
    document.getElementById("updateBurgerId").value = burgerId;
    document.getElementById("updateQuantity").value = quantity;
    document.getElementById("updateOrderStatus").value = status;
    document.getElementById("updateOrderDate").value = date;
    document.getElementById("updateOrderForm").style.display = "block";
}

function updateOrderDetails() {
    const orderName = document.getElementById("updateOrderName").value;
    const burgerId = document.getElementById("updateBurgerId").value;
    const quantity = document.getElementById("updateQuantity").value;
    const status = document.getElementById("updateOrderStatus").value;
    const date = document.getElementById("updateOrderDate").value;

    fetch("http://localhost:8080/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            order_id: currentOrderId,
            orderName,
            burger_id: burgerId,
            quantity,
            order_status: status,
            order_date: date
        })
    }).then(() => {
        loadOrders();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById("updateOrderForm").style.display = "none";
    currentOrderId = null;
}

function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:8080/orders/delete/${orderId}`, { 
            method: "DELETE" 
        }).then(() => loadOrders());
    }
}

function searchOrderById() {
    const orderId = document.getElementById("searchOrderId").value;
    
    fetch(`http://localhost:8080/orders/search-by-order-id/${orderId}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching order:", error));
}

function searchOrderByName() {
    const orderName = document.getElementById("searchOrderName").value;
    
    fetch(`http://localhost:8080/orders/search-by-order-name/${orderName}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching order:", error));
}

