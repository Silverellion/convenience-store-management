function addAccount() {
    const employeeId = document.getElementById("employeeId").value.trim(); 
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim(); 

    console.log("Form values:", { employeeId, username, password, role });

    if (!employeeId || !username || !password || !role) {
        alert("All fields are required!");
        return;
    }

    fetch("http://localhost:3000/api/accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, username, password, role }),
    })
        .then((response) => {
            console.log("Response status:", response.status);
            if (response.ok) {
                document.getElementById("accountId").value = "";
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
                document.getElementById("authority").value = "";
            } else {
                return response.json().then((error) => {
                    alert(`Error: ${error.message}`);
                });
            }
        })
        .catch((error) => {
            console.error("Error adding account:", error);
            alert("An error occurred while adding the account.");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadAccounts();
});

function loadAccounts() {
    fetch("http://localhost:3000/api/accounts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((accounts) => {
            console.log("Accounts fetched:", accounts);
            const tableBody = document.getElementById("tableBody"); 

            tableBody.innerHTML = "";

            accounts.forEach((account) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="text-center"><input type="checkbox"></td>
                    <td>${account.employeeId}</td>
                    <td style="color: blue;">${account.username}</td>
                    <td>**********</td>
                    <td>${account.role}</td>
                    <td class="d-flex">
                        <span class="general-icon"><img src="../img/edit.svg" alt="Edit"></span>
                        <span class="general-icon"><img src="../img/delete.svg" alt="Delete"></span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching accounts:", error);
            alert("An error occurred while loading accounts.");
        });
}