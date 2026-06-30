// ... (Keep the Theme Toggle logic at the top)

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (password.value !== confirmPassword.value) {
        alert("Your passwords do not match.");
        return;
    }

    // NEW: Save the user's name to LocalStorage
    const userName = document.getElementById('fullName').value;
    localStorage.setItem('currentUser', userName);

    loaderOverlay.style.display = 'flex';

    setTimeout(() => {
        loaderOverlay.style.display = 'none';
        alert("Registration Successful!");
        window.location.href = 'home.html';
    }, 2500);
});