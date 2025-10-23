// Authentication Management

function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For demo purposes - in production, this should be handled server-side
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('keaMedCollege_adminLoggedIn', 'true');
        localStorage.setItem('keaMedCollege_adminUsername', username);
        
        alert('Login successful!');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('keaMedCollege_adminLoggedIn');
    localStorage.removeItem('keaMedCollege_adminUsername');
    
    alert('Logged out successfully');
    window.location.href = 'index.html';
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('keaMedCollege_adminLoggedIn') === 'true';
    
    if (!isLoggedIn && window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
        return false;
    }
    
    return isLoggedIn;
}