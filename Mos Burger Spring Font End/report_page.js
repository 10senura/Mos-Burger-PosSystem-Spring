// API endpoints
const API_ENDPOINTS = {
    burger: 'http://localhost:8080/burgers/allBurger',
    pasta: 'http://localhost:8080/pasta/allPasta',
    Fries: 'http://localhost:8080/fries/allFries',
    submarine: 'http://localhost:8080/submarines/allSubmarine',
    Chiken: 'http://localhost:8080/chikens/allChiken',
    Bevarages: 'http://localhost:8080/bevarages/allBevarages',
    orders: 'http://localhost:8080/orders/allOrders' // Assuming there's an endpoint to get all orders
};

// Store fetched items
let allItems = {};
let allOrders = [];

// DOM elements
const reportType = document.getElementById('reportType');
const dateContainer = document.getElementById('dateContainer');
const weekContainer = document.getElementById('weekContainer');
const monthContainer = document.getElementById('monthContainer');
const itemContainer = document.getElementById('itemContainer');
const generateReportBtn = document.getElementById('generateReport');
const downloadReportBtn = document.getElementById('downloadReport');
const printReportBtn = document.getElementById('printReport');
const reportDisplay = document.getElementById('reportDisplay');
const itemSelect = document.getElementById('itemSelect');

// Event listeners
reportType.addEventListener('change', toggleReportFields);
generateReportBtn.addEventListener('click', generateReport);
downloadReportBtn.addEventListener('click', downloadReport);
printReportBtn.addEventListener('click', printReport);

// Initialize with current date
document.getElementById('reportDate').valueAsDate = new Date();
document.getElementById('weekStart').valueAsDate = new Date();
document.getElementById('reportMonth').value = new Date().toISOString().slice(0, 7);

// Load all menu items when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAllItems();
    fetchAllOrders();
    populateItemDropdown();
    
    // Hide report display initially
    reportDisplay.style.display = 'none';
});

// Fetch all items from each category
async function fetchAllItems() {
    try {
        // Fetch each category
        for (const category in API_ENDPOINTS) {
            if (category !== 'orders') {
                const response = await fetch(API_ENDPOINTS[category]);
                if (response.ok) {
                    const items = await response.json();
                    allItems[category] = items;
                } else {
                    console.error(`Failed to fetch ${category}`);
                }
            }
        }
        console.log('All items loaded:', allItems);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Fetch all orders
async function fetchAllOrders() {
    try {
        const response = await fetch(API_ENDPOINTS.orders);
        if (response.ok) {
            allOrders = await response.json();
            console.log('All orders loaded:', allOrders);
        } else {
            console.error('Failed to fetch orders');
            // Use sample data for demonstration if API fails
            generateSampleOrders();
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        // Use sample data for demonstration if API fails
        generateSampleOrders();
    }
}

// Generate sample orders for demonstration
function generateSampleOrders() {
    const today = new Date();
    allOrders = [];
    
    // Create sample orders for last 30 days
    for (let i = 0; i < 30; i++) {
        const orderDate = new Date();
        orderDate.setDate(today.getDate() - i);
        
        // Create 3-10 orders per day
        const orderCount = 3 + Math.floor(Math.random() * 8);
        
        for (let j = 0; j < orderCount; j++) {
            const order = {
                id: `sample-${i}-${j}`,
                customerName: `Customer ${i}-${j}`,
                orderDate: orderDate.toISOString().split('T')[0],
                orderStatus: 'completed',
                orderItems: []
            };
            
            // Add 1-5 items to each order
            const itemCount = 1 + Math.floor(Math.random() * 5);
            
            for (let k = 0; k < itemCount; k++) {
                // Select random category
                const categories = Object.keys(allItems).filter(cat => cat !== 'orders');
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                
                if (allItems[randomCategory] && allItems[randomCategory].length > 0) {
                    // Select random item from category
                    const randomItem = allItems[randomCategory][Math.floor(Math.random() * allItems[randomCategory].length)];
                    
                    order.orderItems.push({
                        itemId: randomItem.id || `item-${k}`,
                        itemName: randomItem.name || `${randomCategory} Item ${k}`,
                        price: randomItem.price || (Math.round(Math.random() * 1000) + 500),
                        quantity: 1 + Math.floor(Math.random() * 3),
                        category: randomCategory
                    });
                }
            }
            
            allOrders.push(order);
        }
    }
    
    console.log('Generated sample orders:', allOrders);
}

// Populate item dropdown from all items
function populateItemDropdown() {
    itemSelect.innerHTML = ''; // Clear existing options
    
    // Add items from each category
    for (const category in allItems) {
        if (allItems[category] && allItems[category].length > 0) {
            // Create optgroup for category
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
            
            // Add each item as an option
            allItems[category].forEach(item => {
                const option = document.createElement('option');
                option.value = `${category}-${item.id}`;
                option.textContent = item.name || `Unknown ${category} item`;
                optgroup.appendChild(option);
            });
            
            itemSelect.appendChild(optgroup);
        }
    }
}

function toggleReportFields() {
    // Hide all containers first
    dateContainer.classList.add('hidden');
    weekContainer.classList.add('hidden');
    monthContainer.classList.add('hidden');
    itemContainer.classList.add('hidden');
    
    // Show relevant container based on report type
    switch(reportType.value) {
        case 'daily':
            dateContainer.classList.remove('hidden');
            break;
        case 'weekly':
            weekContainer.classList.remove('hidden');
            break;
        case 'monthly':
            monthContainer.classList.remove('hidden');
            break;
        case 'itemSpecific':
            itemContainer.classList.remove('hidden');
            dateContainer.classList.remove('hidden');
            break;
    }
}

function generateReport() {
    // Get report parameters
    const type = reportType.value;
    let reportData = [];
    let period = '';
    let title = '';
    
    // Process orders based on report type
    switch(type) {
        case 'daily':
            const date = document.getElementById('reportDate').value;
            period = formatDate(date);
            title = 'Daily Sales Report';
            
            // Filter orders for the selected date
            const dailyOrders = allOrders.filter(order => 
                order.orderDate === date && 
                order.orderStatus === 'completed'
            );
            
            reportData = processOrdersForReport(dailyOrders);
            break;
            
        case 'weekly':
            const weekStart = new Date(document.getElementById('weekStart').value);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            period = `${formatDate(weekStart)} to ${formatDate(weekEnd)}`;
            title = 'Weekly Sales Report';
            
            // Filter orders for the selected week
            const weeklyOrders = allOrders.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= weekStart && 
                       orderDate <= weekEnd && 
                       order.orderStatus === 'completed';
            });
            
            reportData = processOrdersForReport(weeklyOrders);
            break;
            
        case 'monthly':
            const monthInput = document.getElementById('reportMonth').value;
            const [year, month] = monthInput.split('-');
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                'July', 'August', 'September', 'October', 'November', 'December'];
            
            period = `${monthNames[parseInt(month) - 1]} ${year}`;
            title = 'Monthly Sales Report';
            
            // Filter orders for the selected month
            const monthlyOrders = allOrders.filter(order => {
                return order.orderDate.startsWith(`${year}-${month}`) && 
                       order.orderStatus === 'completed';
            });
            
            reportData = processOrdersForReport(monthlyOrders);
            break;
            
        case 'itemSpecific':
            const itemDate = document.getElementById('reportDate').value;
            const itemValue = document.getElementById('itemSelect').value;
            const [itemCategory, itemId] = itemValue.split('-');
            
            // Find the selected item
            let selectedItemName = "Unknown Item";
            if (allItems[itemCategory]) {
                const selectedItem = allItems[itemCategory].find(item => item.id == itemId);
                if (selectedItem) {
                    selectedItemName = selectedItem.name;
                }
            }
            
            period = `Last 30 days from ${formatDate(itemDate)}`;
            title = `Item Sales Report - ${selectedItemName}`;
            
            // Create date range - last 30 days
            const startDate = new Date(itemDate);
            const endDate = new Date(itemDate);
            startDate.setDate(startDate.getDate() - 30);
            
            // Get orders within date range
            const itemOrders = allOrders.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startDate && 
                       orderDate <= endDate && 
                       order.orderStatus === 'completed';
            });
            
            // Generate daily data for selected item
            const dailyData = {};
            
            // Initialize all days in range
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                dailyData[dateStr] = { date: dateStr, quantity: 0, revenue: 0 };
            }
            
            // Populate with actual data
            itemOrders.forEach(order => {
                if (order.orderItems) {
                    order.orderItems.forEach(item => {
                        if (item.category === itemCategory && item.itemId == itemId) {
                            const dateKey = order.orderDate;
                            if (dailyData[dateKey]) {
                                dailyData[dateKey].quantity += item.quantity;
                                dailyData[dateKey].revenue += item.price * item.quantity;
                            }
                        }
                    });
                }
            });
            
            // Convert to array and sort by date
            reportData = Object.values(dailyData).sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            
            // Calculate average for percentage
            const totalQty = reportData.reduce((sum, day) => sum + day.quantity, 0);
            const avgQty = totalQty / reportData.length;
            
            // Add percentage of average
            reportData = reportData.map(day => ({
                name: formatDate(day.date),
                quantity: day.quantity,
                revenue: day.revenue,
                percentage: avgQty > 0 ? ((day.quantity / avgQty) * 100).toFixed(2) : 0
            }));
            
            // Update table headers for item specific report
            document.querySelector('#reportTable thead tr').innerHTML = `
                <th>Date</th>
                <th>Quantity Sold</th>
                <th>Revenue (Rs.)</th>
                <th>% of Average</th>
            `;
            break;
    }
    
    // Calculate total revenue for percentage calculation
    const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Create table rows
    let tableRows = '';
    reportData.forEach(item => {
        const percentage = item.percentage || ((item.revenue / totalRevenue) * 100).toFixed(2);
        tableRows += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.revenue.toLocaleString()} Rs.</td>
                <td>${percentage}%</td>
            </tr>
        `;
    });
    
    // Add total row
    const totalQuantity = reportData.reduce((sum, item) => sum + item.quantity, 0);
    const footerRow = `
        <tr>
            <th>TOTAL</th>
            <th>${totalQuantity}</th>
            <th>${totalRevenue.toLocaleString()} Rs.</th>
            <th>100%</th>
        </tr>
    `;
    
    // Update report display
    document.getElementById('reportTitle').textContent = title;
    document.getElementById('displayReportType').textContent = title;
    document.getElementById('displayPeriod').textContent = period;
    document.getElementById('generatedDate').textContent = formatDate(new Date()) + " " + 
                    new Date().toLocaleTimeString();
    document.getElementById('reportData').innerHTML = tableRows;
    document.getElementById('reportFooter').innerHTML = footerRow;
    
    // Show report
    reportDisplay.style.display = 'block';
    
    // Reset table headers if needed
    if (type !== 'itemSpecific') {
        document.querySelector('#reportTable thead tr').innerHTML = `
            <th>Item</th>
            <th>Quantity Sold</th>
            <th>Revenue (Rs.)</th>
            <th>% of Total</th>
        `;
    }
}

// Process orders into report data
function processOrdersForReport(orders) {
    // Group items by name
    const itemSales = {};
    
    orders.forEach(order => {
        if (order.orderItems) {
            order.orderItems.forEach(item => {
                const itemName = item.itemName || 'Unknown Item';
                
                if (!itemSales[itemName]) {
                    itemSales[itemName] = {
                        name: itemName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                
                itemSales[itemName].quantity += item.quantity;
                itemSales[itemName].revenue += item.price * item.quantity;
            });
        }
    });
    
    // Convert to array and sort by revenue
    return Object.values(itemSales).sort((a, b) => b.revenue - a.revenue);
}

function downloadReport() {
    // Get the report content
    const reportTitle = document.getElementById('reportTitle').textContent;
    const reportType = document.getElementById('displayReportType').textContent;
    const period = document.getElementById('displayPeriod').textContent;
    const generatedDate = document.getElementById('generatedDate').textContent;
    
    // Get table headers
    const headers = Array.from(document.querySelectorAll('#reportTable th'))
        .slice(0, 4) // Get only the first 4 headers
        .map(header => header.textContent.trim())
        .join(',');
    
    // Get table data
    const tableRows = Array.from(document.querySelectorAll('#reportData tr'))
        .map(row => Array.from(row.querySelectorAll('td'))
            .map(cell => cell.textContent.trim())
            .join(','))
        .join('\n');
        
    const footerRow = Array.from(document.querySelectorAll('#reportFooter tr'))
        .map(row => Array.from(row.querySelectorAll('th'))
            .map(cell => cell.textContent.trim())
            .join(','))
        .join('\n');
        
    // Create CSV content
    let csv = 'MISTER BURGER SHOP - COLOMBO\n';
    csv += reportTitle + '\n\n';
    csv += 'Report Type,' + reportType + '\n';
    csv += 'Period,' + period + '\n';
    csv += 'Generated On,' + generatedDate + '\n\n';
    csv += headers + '\n';
    csv += tableRows + '\n';
    csv += footerRow;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = `MisterBurger_${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    a.href = url;
    a.download = fileName;
    a.click();
    
    window.URL.revokeObjectURL(url);
}

function printReport() {
    window.print();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
}

// Initialize the form fields visibility
toggleReportFields();