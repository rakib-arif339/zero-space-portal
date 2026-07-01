// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// --- REGISTRATION LOGIC ---
const registerForm = document.getElementById('registerForm');
const loaderOverlay = document.getElementById('loader-overlay');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get values from inputs
    const userName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Your passwords do not match.");
        return;
    }

    // Save the user's name to LocalStorage
    localStorage.setItem('currentUser', userName);

    // Show Loader
    loaderOverlay.style.display = 'flex';

    // Simulate Registration Delay
    setTimeout(() => {
        loaderOverlay.style.display = 'none';
        alert("Registration Successful!");
        window.location.href = 'home.html';
    }, 2500);
});