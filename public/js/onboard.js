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
