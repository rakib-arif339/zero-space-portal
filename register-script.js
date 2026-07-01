const registerForm = document.getElementById('registerForm');
const loaderOverlay = document.getElementById('loader-overlay');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert("Your passwords do not match.");
        return;
    }

    localStorage.setItem('currentUser', userName);

    loaderOverlay.style.display = 'flex';

    setTimeout(() => {
        loaderOverlay.style.display = 'none';
        alert("Registration Successful!");
        window.location.href = 'home.html';
    }, 2500);
});