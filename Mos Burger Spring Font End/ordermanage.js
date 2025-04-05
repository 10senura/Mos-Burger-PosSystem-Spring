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

    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No orders found</td>
            </tr>`;
        return;
    }

    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.burger_id}</td>
                <td>${order.c_name}</td>
                <td>${order.order_date}</td>
                <td><span class="badge bg-${getStatusColor(order.order_status)}">${order.order_status}</span></td>
                <td>${order.quantity}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="editOrder(${order.order_id}, ${order.burger_id}, ${order.c_name}, '${order.order_date}', '${order.order_status}', ${order.quantity})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.order_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'pending': return 'warning';
        case 'processing': return 'primary';
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function addOrder() {
    const orderData = {
        burger_id: parseInt(document.getElementById("orderBurgerId").value),
        c_name: document.getElementById("updateCustomerName").value,
        quantity: parseInt(document.getElementById("orderQuantity").value),
        order_status: document.getElementById("orderStatus").value,
        order_date: document.getElementById("orderDate").value
    };

    fetch("http://localhost:8080/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        loadOrders();
        clearAddForm();
    })
    .catch(error => console.error("Error adding order:", error));
}

function clearAddForm() {
    document.getElementById("orderBurgerId").value = '';
    document.getElementById("orderCustomerName").value = '';
    document.getElementById("orderQuantity").value = '';
    document.getElementById("orderStatus").value = '';
    document.getElementById("orderDate").value = '';
}

function searchOrderById() {
    const orderId = document.getElementById("searchOrderById").value;
    if (!orderId) return;

    fetch(`http://localhost:8080/orders/search-by-order-id/${orderId}`)
        .then(res => res.json())
        .then(data => displayOrders([data]))
        .catch(error => console.error("Error searching order:", error));
}

function searchOrderByName() {
    const customerId = document.getElementById("searchOrderByName").value;
    if (!customerId) return;

    // Note: This endpoint needs to exist in your backend
    fetch(`http://localhost:8080/orders/search-by-customer/${customerId}`)
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => console.error("Error searching orders:", error));
}

function editOrder(orderId, burgerId, customerId, orderDate, status, quantity) {
    currentOrderId = orderId;
    
    document.getElementById("updateOrderId").value = orderId;
    document.getElementById("updateBurgerId").value = burgerId;
    document.getElementById("updateCustomerName").value = customerId;
    document.getElementById("updateOrderDate").value = orderDate;
    document.getElementById("updateOrderStatus").value = status;
    document.getElementById("updateQuantity").value = quantity;
    
    document.getElementById("updateOrderForm").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateOrderDetails() {
    const updateData = {
        order_id: currentOrderId,
        burger_id: parseInt(document.getElementById("updateBurgerId").value),
        c_name: document.getElementById("updateCustomerName").value,
        quantity: parseInt(document.getElementById("updateQuantity").value),
        order_status: document.getElementById("updateOrderStatus").value,
        order_date: document.getElementById("updateOrderDate").value
    };

    fetch("http://localhost:8080/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    })
    .then(() => {
        loadOrders();
        cancelUpdate();
    })
    .catch(error => console.error("Error updating order:", error));
}

function cancelUpdate() {
    document.getElementById("updateOrderForm").style.display = "none";
    currentOrderId = null;
}

function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:8080/orders/delete/${orderId}`, {
            method: "DELETE"
        })
        .then(() => loadOrders())
        .catch(error => console.error("Error deleting order:", error));
    }
}