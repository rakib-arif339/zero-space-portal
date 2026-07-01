// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
}

// --- LOGIN FORM SUBMISSION LOGIC ---
const loginForm = document.getElementById('loginForm');
const loaderOverlay = document.getElementById('loader-overlay');
const emailInput = document.getElementById('userCredential');
const passwordInput = document.getElementById('password');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Credentials check
        if (emailInput.value === "arifimtiazrakib@gmail.com" && passwordInput.value === "qwertyuiopasdfghjklzxcvbnm") {
            if (loaderOverlay) loaderOverlay.style.display = 'flex';

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500); 
        } else {
            alert("Invalid credentials. Please check your email and password.");
        }
    });
}