// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// --- LOGIN FORM SUBMISSION LOGIC ---
const loginForm = document.getElementById('loginForm');
const loaderOverlay = document.getElementById('loader-overlay');
const emailInput = document.getElementById('userCredential');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (emailInput.value === "arifimtiazrakib@gmail.com" && passwordInput.value === "qwertyuiopasdfghjklzxcvbnm") {
        loaderOverlay.style.display = 'flex';

        setTimeout(() => {
            loaderOverlay.style.display = 'none';
            window.location.href = 'home.html';
        }, 3000); 
    } else {
        alert("Invalid credentials. Please check your email and password.");
    }
});