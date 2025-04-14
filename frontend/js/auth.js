document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const officialId = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        if (!officialId || !password) {
            alert('Please enter both Official ID and Password');
            return;
        }
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
        
        setTimeout(() => {
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = 'index.html';
        }, 1500);
    });
});