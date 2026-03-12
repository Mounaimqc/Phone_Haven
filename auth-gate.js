(function() {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const isLoginPage = window.location.pathname.includes('admin-login.html');

    if (!isAuthenticated && !isLoginPage) {
        window.location.href = 'admin-login.html';
    }
})();
