document.addEventListener('DOMContentLoaded', function() {
    // Check the localStorage for user role
    const userRole = localStorage.getItem('userRole');
    console.log('Current user role:', userRole);
    const accountsMenuItem = document.querySelector('.nav-link[data-content="accounts"]');
    
    if (accountsMenuItem) {
        if (userRole === 'administrator') {
            accountsMenuItem.parentElement.style.display = 'block';
        } else {
            accountsMenuItem.parentElement.style.display = 'none';
        }
    }
});