document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("accountAddBtn");
    addButton.addEventListener("click", async () => {
        const accountId = document.getElementById("accountId").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const authority = document.getElementById("authority").value.trim();

        if (!accountId || !username || !password || !authority) {
            alert("All fields are required!");
            return;
        }

        const accountData = {
            accountId,
            username,
            password,
            authority,
        };

        try {
            // Send the data to the backend API
            const response = await fetch("http://localhost:3000/api/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(accountData),
            });

            if (response.ok) {
                alert("Account added successfully!");
                // clear the modal fields
                document.getElementById("accountId").value = "";
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
                document.getElementById("authority").value = "";
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error adding account:", error);
            alert("An error occurred while adding the account.");
        }
    });
});