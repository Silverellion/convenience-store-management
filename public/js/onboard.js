function searchOnboard() {
    const searchTerm = document.getElementById("searchOnboardText").value.toLowerCase().trim();
    const tableRows = document.querySelectorAll("#tableBodyOnboard tr");

    // Hiển thị lại tất cả các dòng trước khi tìm
    tableRows.forEach(row => {
        row.style.display = "";
    });

    // Nếu không nhập gì thì thoát
    if (searchTerm === "") return;

    tableRows.forEach(row => {
        const productId = row.cells[0].textContent.toLowerCase();
        const name = row.cells[1].textContent.toLowerCase();
        const dateExp = row.cells[2].textContent.toLowerCase();
        const stock = row.cells[3].textContent.toLowerCase();

        const matchesSearch =
            productId.includes(searchTerm) ||
            name.includes(searchTerm) ||
            dateExp.includes(searchTerm) ||
            stock.includes(searchTerm);

        row.style.display = matchesSearch ? "" : "none";
    });
}
function updateInvoiceTotal() {
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    let total = 0;

    Array.from(invoiceTableBody.rows).forEach(row => {
        const rowTotal = parseFloat(row.cells[4].textContent);
        total += rowTotal;
    });

    document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' VND';
}

function updateInvoiceAmount() {
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    let amount = 0;

    Array.from(invoiceTableBody.rows).forEach(row => {
        const rowAmount = parseFloat(row.cells[3].textContent);
        amount += rowAmount;
    });

    document.getElementById('invoiceTotalAction').textContent = amount;
}
function displayInvoiceDate() {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    document.getElementById('invoiceDate').textContent = formattedDate;
}

function addToInvoice(productId, name, price, quantity, total) {
    const invoiceTableBody = document.getElementById('invoiceTableBody');

    // Check nếu sản phẩm đã có rồi thì cộng thêm số lượng
    const existingRow = Array.from(invoiceTableBody.rows).find(row => row.cells[0].textContent === productId);

    if (existingRow) {
        const currentQty = parseInt(existingRow.cells[3].textContent);
        const newQty = currentQty + quantity;
        existingRow.cells[3].textContent = newQty;
        existingRow.cells[4].textContent = newQty * price;
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productId}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${total}</td>
            <td>
            <span class="general-icon btn-delete-product remove-from-invoice-btn" data-id="${productId}"><img src="../img/delete.svg" alt="Delete"></span>
            </td>
        `;
        invoiceTableBody.appendChild(row);
    }
    updateInvoiceTotal();
    updateInvoiceAmount();
    displayInvoiceDate();
    attachRemoveEvent();
}

async function Checkout() {
    const employeeIdInput = document.getElementById("employeeIdInput").value.trim();
    if (!employeeIdInput) {
        alert("nhap ma nhan vien");
        return;
    }

    let employeeName = "";
    try {
        const res = await fetch(`http://localhost:3000/api/employees/check/${employeeIdInput}`);
        const data = await res.json();

        if (!res.ok || !data.exists) {
            alert("Khong tim thay nhan vien");
            return;
        }

        employeeName = data.employee.name;
    } catch (err) {
        console.error("loi ktra nv", err);
        alert("loi ktra nv");
        return;
    }

    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const rows = invoiceTableBody.querySelectorAll("tr");

    const items = [];
    let totalAmount = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const productId = cells[0].innerText;
        const productName = cells[1].innerText;
        const unitPrice = parseFloat(cells[2].innerText);
        const quantity = parseInt(cells[3].innerText);
        const totalPrice = parseFloat(cells[4].innerText);

        items.push({ productId, productName, unitPrice, quantity, totalPrice });
        totalAmount += totalPrice;
    });

    const customerPaid = parseFloat(document.getElementById("customerPaidInput").value || 0);
    const date = new Date();

    const order = {
        invoiceCode: "HD" + Date.now(),
        createdAt: date,
        employeeId: employeeIdInput,
        employeeName: employeeName,
        items: items,
        totalAmount: totalAmount,
        paymentMethod: "Tiền mặt",
        customerPaid: customerPaid,
        change: customerPaid - totalAmount
    };

    try {
        const response = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (response.ok) {
            alert("done");
            document.getElementById("invoiceTableBody").innerHTML = "";
            document.getElementById("customerPaidInput").value = "";
            document.getElementById("invoiceTotal").innerText = "0 VND";
            document.getElementById("invoiceTotalAction").innerText = "0";
            document.getElementById("invoiceDate").innerText = "";
            document.getElementById("employeeIdInput").value = "";
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("loi tao hoa don");
    }
}

// Gắn sự kiện cho các nút Remove trong bảng hóa đơn
function attachRemoveEvent() {
    document.querySelectorAll('.remove-from-invoice-btn').forEach(button => {
        button.addEventListener('click', event => {
            const row = event.target.closest('tr');
            row.remove(); // Xóa dòng khỏi bảng hóa đơn

            // Cập nhật lại tổng tiền và số lượng sau khi xóa
            updateInvoiceTotal();
            updateInvoiceAmount();
        });
    });
}

