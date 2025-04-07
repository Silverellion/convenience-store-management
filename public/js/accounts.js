document.addEventListener("DOMContentLoaded", () => {
    loadAccounts();
});

function formatRole(role) {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function showToast(message) { //This function is used to display message at the bottom right of the screen
    const toastElement = document.getElementById("toastMessage");
    const toastBody = toastElement.querySelector(".toast-body");
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function loadAccounts() {
    fetch("http://localhost:3000/api/accounts")
        .then(response => response.json())
        .then(accounts => {
            const tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";
            accounts.forEach(account => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="text-center"><input type="checkbox"></td>
                    <td>${account.employeeId}</td>
                    <td style="color: blue;">${account.username}</td>
                    <td>**********</td>
                    <td>${formatRole(account.role)}</td>
                    <td class="d-flex">
                        <span class="general-icon edit-btn" data-id="${account._id}"><img src="../img/edit.svg" alt="Edit"></span>
                        <span class="general-icon delete-btn" data-id="${account._id}"><img src="../img/delete.svg" alt="Delete"></span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", event => {
                    const accountId = event.target.closest(".edit-btn").dataset.id;
                    showEditModal(accountId);
                });
            });
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", event => {
                    const accountId = event.target.closest(".delete-btn").dataset.id;
                    deleteAccount(accountId);
                });
            });
        });
}

function addAccount() {
    const employeeId = document.getElementById("employeeId").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim();
    if (!employeeId || !username || !password || !role) return alert("All fields are required!");
    fetch("http://localhost:3000/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, username, password, role }),
    }).then(response => {
        if (response.ok) {
            document.getElementById("employeeId").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("role").value = "";
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalAccount"));
            modal.hide();
            loadAccounts();
            showToast("Account added successfully!");
        } else {
            alert("Failed to add account.");
        }
    });
}

function showEditModal(accountId) {
    fetch(`http://localhost:3000/api/accounts/${accountId}`)
        .then(response => response.json())
        .then(account => {
            document.getElementById("editEmployeeId").value = account.employeeId;
            document.getElementById("editUsername").value = account.username;
            document.getElementById("editPassword").value = "";
            document.getElementById("editRole").value = account.role;
            const editModal = new bootstrap.Modal(document.getElementById("modalAccountEdit"));
            editModal.show();
            document.getElementById("saveEditBtn").onclick = () => saveEditedAccount(accountId);
        });
}

function saveEditedAccount(accountId) {
    const employeeId = document.getElementById("editEmployeeId").value.trim();
    const username = document.getElementById("editUsername").value.trim();
    const password = document.getElementById("editPassword").value.trim();
    const role = document.getElementById("editRole").value.trim();
    if (!employeeId || !username || !role) return alert("Employee ID, Username, and Role are required!");
    fetch(`http://localhost:3000/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, username, password, role }),
    }).then(response => {
        if (response.ok) {
            const editModal = bootstrap.Modal.getInstance(document.getElementById("modalAccountEdit"));
            editModal.hide();
            loadAccounts();
            showToast("Account updated successfully!");
        } else {
            alert("Failed to update account.");
        }
    });
}

function deleteAccount(accountId) {
    if (!confirm("Are you sure you want to delete this account?")) return;
    fetch(`http://localhost:3000/api/accounts/${accountId}`, { method: "DELETE" }).then(response => {
        if (response.ok) {
            loadAccounts();
            showToast("Account deleted successfully!");
        } else {
            alert("Failed to delete account.");
        }
    });
}

function searchAccount() {
    const searchTerm = document.getElementById("searchAccountText").value.toLowerCase();
    const tableRows = document.querySelectorAll("#tableBody tr");
    
    tableRows.forEach(row => {
        row.style.display = "";
    });
    
    // If search term is empty, show all rows and exit
    if (searchTerm === "") {
        return;
    }
    
    tableRows.forEach(row => {
        const employeeId = row.cells[1].textContent.toLowerCase();
        const username = row.cells[2].textContent.toLowerCase();
        const role = row.cells[4].textContent.toLowerCase();
        
        const matchesSearch = 
            employeeId.includes(searchTerm) || 
            username.includes(searchTerm) || 
            role.includes(searchTerm);
        
        row.style.display = matchesSearch ? "" : "none";
    });
}