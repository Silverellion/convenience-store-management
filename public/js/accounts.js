function addAccount() {
    alert("LOADED");
    const employeeId = document.getElementById("accountId").value.trim(); 
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("authority").value.trim(); 

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
                alert("Account added successfully!");
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