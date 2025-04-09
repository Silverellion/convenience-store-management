let allProducts = []; // lưu toàn bộ sản phẩm để lọc lại

document.addEventListener('DOMContentLoaded', fetchAndRenderProducts);

function showToast(message) { //This function is used to display message at the bottom right of the screen
    const toastElement = document.getElementById("toastMessage");
    const toastBody = toastElement.querySelector(".toast-body");
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

async function fetchAndRenderProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        allProducts = products; // lưu toàn bộ sản phẩm ban đầu
        console.log('products Fetch', allProducts);

        renderTable(products);
        renderCategories(products);
        renderOnboard(products);
        renderOnboardCategory(products);

    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

//Hien thi san pham
function renderTable(products) {
    const tableBody = document.getElementById('tableBodyProducts');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${product.productId}</td>
      <td>${product.name}</td>
      <td>${new Date(product.expirationDate).toLocaleDateString()}</td>
      <td>${product.stock}</td>
      <td class="d-flex">
        <span class="general-icon btn-edit-product" data-id="${product._id}"><img src="../img/edit.svg" alt="Edit"></span>
        <span class="general-icon btn-delete-product" data-id="${product._id}"><img src="../img/delete.svg" alt="Delete"></span>
      </td>
    `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll(".btn-edit-product").forEach(button => {
        button.addEventListener("click", event => {
            const productId = event.target.closest(".btn-edit-product").dataset.id;
            showEditModalProducts(productId);
        });
    });
    document.querySelectorAll(".btn-delete-product").forEach(button => {
        button.addEventListener("click", event => {
            const productId = event.target.closest(".btn-delete-product").dataset.id;
            deleteProducts(productId);
        });
    });
    updateProductCount(products.length);
}

//Hien thi danh muc
function renderCategories(products) {
    const categoryContainer = document.getElementById('category');
    categoryContainer.innerHTML = '';

    const categorySet = new Set(products.map(p => p.category).filter(Boolean));

    // Thêm nút "All"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'category-btn';
    allBtn.addEventListener('click', () => renderTable(allProducts));
    categoryContainer.appendChild(allBtn);

    categorySet.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = 'category-btn';
        btn.addEventListener('click', () => {
            const filtered = allProducts.filter(p => p.category === cat);
            renderTable(filtered);
        });
        categoryContainer.appendChild(btn);
    });
}

function renderOnboard(products) {
    const tableBody = document.getElementById('tableBodyOnboard');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${product.productId}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td class="d-flex align-items-center">
        <input type="number" class="form-control form-control-sm mx-2 quantity-input" data-id="${product._id}" value="1" min="1" style="width: 60px; text-align: center;">
      </td>
    `;
        tableBody.appendChild(row);
    });
}

function renderOnboardCategory(products) {
    const categoryContainer = document.getElementById('categoryOnboard');
    categoryContainer.innerHTML = '';

    const categorySet = new Set(products.map(p => p.category).filter(Boolean));

    // Thêm nút "All"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'category-btn';
    allBtn.addEventListener('click', () => renderOnboard(allProducts));
    categoryContainer.appendChild(allBtn);

    categorySet.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = 'category-btn';
        btn.addEventListener('click', () => {
            const filtered = allProducts.filter(p => p.category === cat);
            renderOnboard(filtered);
        });
        categoryContainer.appendChild(btn);
    });
}

//Them san pham moi vao DB
function addProduct() {
    const productId = document.getElementById('productId').value.trim();
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('categoryForm').value.trim();
    const price = parseFloat(document.getElementById('price').value.trim());
    const stock = parseInt(document.getElementById('stock').value.trim());
    const supplier = document.getElementById('supplier').value.trim();
    const expirationDate = document.getElementById('expirationDate').value.trim();

    if (!productId || !name || !category || isNaN(price) || isNaN(stock) || !supplier || !expirationDate) {
        alert('all fields are required');
    }
    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, category, price, stock, supplier, expirationDate }),
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('productId').value = '';
                document.getElementById('name').value = '';
                document.getElementById('category').value = '';
                document.getElementById('price').value = '';
                document.getElementById('stock').value = '';
                document.getElementById('supplier').value = '';
                document.getElementById('expirationDate').value = '';
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalProducts"));
                modal.hide();
                fetchAndRenderProducts();
                showToast('Product added successfully!');
            } else {
                showToast("Failed to add product.");
            }
        });
}

//edit san pham
function showEditModalProducts(productId) {
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById("editProductId").value = product.productId;
            document.getElementById("editName").value = product.name;
            document.getElementById("editCategory").value = product.category;
            document.getElementById("editPrice").value = product.price;
            document.getElementById('editStock').value = product.stock;
            document.getElementById('editSupplier').value = product.supplier;
            document.getElementById('editExpirationDate').value = product.expirationDate;
            const editModal = new bootstrap.Modal(document.getElementById('modalProductsEdit'));
            editModal.show();
            document.getElementById("saveEditBtn").onclick = () => saveEditedProduct(productId);
        });
}

function saveEditedProduct(productId) {
    const editProductId = document.getElementById("editProductId").value.trim();
    const name = document.getElementById("editName").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const price = parseFloat(document.getElementById("editPrice").value.trim());
    const stock = parseInt(document.getElementById('editStock').value.trim());
    const supplier = document.getElementById('editSupplier').value.trim();
    const expirationDate = document.getElementById('editExpirationDate').value.trim();
    if (!editProductId || !name || !category || isNaN(price) || isNaN(stock) || !supplier || !expirationDate) {
        return alert("All fields are required!");
    }
    fetch(`http://localhost:3000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: editProductId, name, category, price, stock, supplier, expirationDate }),
    }).then(response => {
        if (response.ok) {
            const editModal = bootstrap.Modal.getInstance(document.getElementById("modalProductsEdit"));
            editModal.hide();
            fetchAndRenderProducts();
            showToast('Product updated successfully!');
        } else {
            showToast("Failed to update product.");
        }
    });
}

//xoa san pham
function deleteProducts(productId) {
    if (!confirm(`Are you sure you want to remove this product?`)) {
        return;
    }
    fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                fetchAndRenderProducts();
                showToast('Product deleted successfully!');
            } else {
                showToast('Failed to delete product');
            }
        });
}

// search sản phẩm (theo mã code của Tâm và sửa lại phù hợp với products)
function searchProduct() {
    const searchTerm = document.getElementById("searchProductText").value.toLowerCase();
    const tableRows = document.querySelectorAll("#tableBodyProducts tr");

    // Hiển thị lại tất cả các dòng trước khi tìm
    tableRows.forEach(row => {
        row.style.display = "";
    });

    // Nếu không nhập gì thì thoát
    if (searchTerm === "") return;

    tableRows.forEach(row => {
        const productId = row.cells[1].textContent.toLowerCase();
        const name = row.cells[2].textContent.toLowerCase();
        const dateExp = row.cells[3].textContent.toLowerCase();
        const stock = row.cells[4].textContent.toLowerCase();

        const matchesSearch =
            productId.includes(searchTerm) ||
            name.includes(searchTerm) ||
            dateExp.includes(searchTerm) ||
            stock.includes(searchTerm);

        row.style.display = matchesSearch ? "" : "none";
    });
}

//cap nhat so luong tong san pham dua(lấy theo source code của tâm nhưng sửa lại cho product)
function updateProductCount(numbers) {
    const productNumber = document.getElementById('productCount');
    if (productNumber) {
        productNumber.textContent = numbers;
    }
}


