document.addEventListener("DOMContentLoaded", loadOrders);

let currentOrderId = null;

function loadOrders() {
    fetch("http://localhost:8080/orders/allOrder")
        .then(res => res.json())
        .then(data => displayOrders(data))
        .catch(error => {
            console.error("Error fetching orders:", error);
            alert("Failed to load orders. Please check the console for details.");
        });
}

function displayOrders(orders) {
    const tableBody = document.getElementById("orderTableBody");
    tableBody.innerHTML = "";

    orders.forEach(order => {
        const row = `<tr>
            <td>${order.order_id || ''}</td>
            <td>${order.burger_id || ''}</td>
            <td>${order.c_name || ''}</td>
            <td>${order.order_date || ''}</td>
            <td>${order.order_status || ''}</td>
            <td>${order.quantity || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editOrder(${order.order_id}, ${order.burger_id}, '${order.c_name || ''}', '${order.order_date || ''}', '${order.order_status || ''}', ${order.quantity || 0})">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.order_id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function addOrder() {
    // Get values from the form
    const burger_id = document.getElementById("orderBurgerId").value.trim();
    const c_name = document.getElementById("orderCustomerName").value.trim();
    const order_date = document.getElementById("orderDate").value.trim();
    const order_status = document.getElementById("orderStatus").value.trim();
    const quantity = document.getElementById("orderQuantity").value.trim();
    
    // Validate form fields
    if (!burger_id || !c_name || !order_date || !order_status || !quantity) {
        alert("Please fill in all fields");
        return;
    }

    // Create the order object matching your Spring entity field names
    const orderData = {
        burger_id: parseInt(burger_id),
        c_name: c_name,
        order_date: order_date,
        order_status: order_status,
        quantity: quantity
    };

    fetch("http://localhost:8080/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        alert("Order added successfully!");
        // Clear form fields
        document.getElementById("orderBurgerId").value = "";
        document.getElementById("orderCustomerName").value = "";
        document.getElementById("orderDate").value = "";
        document.getElementById("orderStatus").value = "";
        document.getElementById("orderQuantity").value = "";
        // Reload orders
        loadOrders();
    })
    .catch(error => {
        console.error("Error adding order:", error);
        alert("Failed to add order. Please check the console for details.");
    });
}

function searchOrderById() {
    const order_id = document.getElementById("searchOrderById").value.trim();
    
    if (!order_id) {
        alert("Please enter an Order ID to search");
        return;
    }

    fetch(`http://localhost:8080/orders/search-by-order-id/${order_id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Order not found or an error occurred");
            }
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length === 0) {
                alert("No orders found with that ID");
            }
            displayOrders(Array.isArray(data) ? data : [data]);
        })
        .catch(error => {
            console.error("Error searching order by ID:", error);
            alert("Error searching order: " + error.message);
        });
}

function editOrder(order_id, burger_id, c_name, order_date, order_status, quantity) {
    currentOrderId = order_id;
    
    // Set values in the update form
    document.getElementById("updateOrderId").value = order_id || '';
    document.getElementById("updateBurgerId").value = burger_id || '';
    document.getElementById("updateCustomerName").value = c_name || '';
    document.getElementById("updateOrderDate").value = order_date || '';
    document.getElementById("updateOrderStatus").value = order_status || '';
    document.getElementById("updateQuantity").value = quantity || '';
    
    // Show the update form
    document.getElementById("updateOrderForm").style.display = "block";
}
function updateOrderDetails() {
    const burger_id = document.getElementById("updateBurgerId").value.trim();
    const c_name = document.getElementById("updateCustomerName").value.trim();
    const order_date = document.getElementById("updateOrderDate").value.trim();
    const order_status = document.getElementById("updateOrderStatus").value.trim();
    const quantity = document.getElementById("updateQuantity").value.trim();
    
    // Validate form fields
    if (!burger_id || !c_name || !order_date || !order_status || !quantity) {
        alert("Please fill in all fields");
        return;
    }

    const orderData = {
        order_id: currentOrderId,
        burger_id: parseInt(burger_id),
        c_name: c_name,
        order_date: order_date,
        order_status: order_status,
        quantity: parseInt(quantity)  
    };

    console.log("Sending update data:", orderData);

    fetch("http://localhost:8080/orders/updateOrder", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { 
                console.error("Server error details:", err);
                throw new Error(err.message || "Failed to update order"); 
            });
        }
        return response.json();
    })
    .then(data => {
        alert("Order updated successfully!");
        loadOrders();
        cancelUpdate();
    })
    .catch(error => {
        console.error("Error updating order:", error);
        alert("Failed to update order: " + (error.message || "Unknown error"));
    });
}

function cancelUpdate() {
    document.getElementById("updateOrderForm").style.display = "none";
    currentOrderId = null;
}

function deleteOrder(order_id) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:8080/orders/delete/${order_id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete order");
                }
                alert("Order deleted successfully!");
                loadOrders();
            })
            .catch(error => {
                console.error("Error deleting order:", error);
                alert("Failed to delete order. Please check the console for details.");
            });
    }
}