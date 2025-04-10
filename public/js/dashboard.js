document.addEventListener('DOMContentLoaded', () => {
    fetchTopProducts();
});

function fetchTopProducts() {
    fetch('http://localhost:3000/api/orders/top-products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            displayTopProducts(products);
        })
        .catch(error => {
            console.error('Error fetching top products:', error);
            const topProductsList = document.getElementById('top-products-list');
            topProductsList.innerHTML = '<li class="list-group-item">Error loading product data</li>';
        });
}

function displayTopProducts(products) {
    const topProductsList = document.getElementById('top-products-list');
    topProductsList.innerHTML = '';
    
    if (!products || products.length === 0) {
        topProductsList.innerHTML = '<li class="list-group-item">No product data available</li>';
        return;
    }
    
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `${product.productName} <span class="float-end">${product.totalQuantity} đã bán</span>`;
        topProductsList.appendChild(listItem);
    });
}