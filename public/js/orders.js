document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadTotalSale();
});

async function loadOrders() {
    try {
        const res = await fetch(`http://localhost:3000/api/orders`);
        const orders = await res.json();
        console.log('fetching orders:', orders);

        renderOrder(orders);
    } catch (error) {
        console.error('Error fetching orders:', err);
    }
}

//hien thi hoa don
function renderOrder(orders) {
    const tableBody = document.getElementById('tableBodyOrders');
    tableBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${order.invoiceCode}</td>
      <td>${order.employeeId}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.totalAmount}</td>
      <td class="d-flex">
        <span class="general-icon btn-delete-order" data-id="${order._id}"><img src="../img/delete.svg" alt="Delete"></span>
      </td>
    `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll(".btn-delete-order").forEach(button => {
        button.addEventListener("click", event => {
            const orderId = event.target.closest(".btn-delete-order").dataset.id;
            deleteOrder(orderId);
        });
    });
    updateOrder(orders.length);
}

//Xoa hoa don
function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete this order? ${orderId}`)) {
        return;
    }
    fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method : 'DELETE',
    })
    .then(response => {
        if(response.ok) {
            loadOrders();
            alert('Delete order successfully!');
        } else {
            alert('fail to delete');
        }
    });
}

// dem so hoa don
function updateOrder(numbers) {
    const orderCount = document.getElementById('orderCount');
    if(orderCount) {
        orderCount.textContent = numbers;
    }
}

// Hiển thị tổng sản phẩm đã bán ra
async function loadTotalSale() {
    try {
        const res = await fetch(`http://localhost:3000/api/orders/total`);
        const totalSale = await res.json();
        const totalSaleCount = document.getElementById('saleCount');
        totalSaleCount.textContent = totalSale.totalQuantity;
    } catch (error) {
        console.error('Error get total Sale:', error); 
    }
}

// search
function searchOrder() {
    const searchTerm = document.getElementById("searchOrderText").value.toLowerCase().trim();
    const tableRows = document.querySelectorAll("#tableBodyOrders tr");

    tableRows.forEach(row => {
        row.style.display = "";
    });

    if (searchTerm === "") return;

    // Lặp qua từng dòng để kiểm tra điều kiện khớp
    tableRows.forEach(row => {
        const orderId = row.cells[0].textContent.toLowerCase();    
        const employeeId = row.cells[1].textContent.toLowerCase();  
        const dateExp = row.cells[2].textContent.toLowerCase();    
        const total = row.cells[3].textContent.toLowerCase();     

        const matchesSearch =
            orderId.includes(searchTerm) ||
            employeeId.includes(searchTerm) ||
            dateExp.includes(searchTerm) ||
            total.includes(searchTerm);

        // Ẩn những dòng không khớp
        row.style.display = matchesSearch ? "" : "none";
    });
}
