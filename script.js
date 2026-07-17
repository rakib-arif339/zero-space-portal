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

// --- LOGIN FORM SUBMISSION LOGIC (Updated for Admin Portal) ---
const loginForm = document.getElementById('loginForm');
const loaderOverlay = document.getElementById('loader-overlay');
const emailInput = document.getElementById('userCredential');
const passwordInput = document.getElementById('password');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Credentials check for Rakib Sir
        if (emailInput.value === "arifimtiazrakib@gmail.com" && passwordInput.value === "qwertyuiopasdfghjklzxcvbnm") {
            if (loaderOverlay) loaderOverlay.style.display = 'flex';

            setTimeout(() => {
                // Redirects directly to the new Admin Dashboard
                window.location.href = 'admin.html';
            }, 1500); 
        } else {
            alert("Invalid admin credentials. Please check your email and password.");
        }
    });
}

// ==========================================
// --- ADMIN DASHBOARD CONTENT ENGINE ---
// ==========================================

const addContentForm = document.getElementById('addContentForm');
const contentListContainer = document.getElementById('contentListContainer');

// Helper function to get saved items from localStorage
function getSavedContent() {
    const data = localStorage.getItem('rakib_portfolio_custom_data');
    return data ? JSON.parse(data) : [];
}

// Helper function to save items to localStorage
function saveContent(items) {
    localStorage.setItem('rakib_portfolio_custom_data', JSON.stringify(items));
}

// Function to render the list inside admin.html
function renderAdminContentList() {
    if (!contentListContainer) return; // Only run if on admin.html page
    
    const items = getSavedContent();
    contentListContainer.innerHTML = '';

    if (items.length === 0) {
        contentListContainer.innerHTML = `<p style="color: var(--text-sub); font-style: italic;">No custom content added yet. Use the form above to add skills or projects!</p>`;
        return;
    }

    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'content-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <span>${item.category}</span>
                <h4 style="margin-top: 6px;">${item.title}</h4>
                <p>${item.description}</p>
            </div>
            <button class="btn-delete" onclick="deleteContentItem(${index})">Delete</button>
        `;
        contentListContainer.appendChild(itemDiv);
    });
}

// Function to handle form submission (Adding new content)
if (addContentForm) {
    addContentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('contentCategory').value;
        const title = document.getElementById('contentTitle').value;
        const description = document.getElementById('contentDescription').value;

        const newItem = {
            id: Date.now(),
            category: category,
            title: title,
            description: description
        };

        const currentItems = getSavedContent();
        currentItems.push(newItem);
        saveContent(currentItems);

        // Reset form and refresh list
        addContentForm.reset();
        renderAdminContentList();
        alert("Success! Item added to your live portfolio database.");
    });
}

// Function to delete an item
window.deleteContentItem = function(index) {
    if (confirm("Are you sure you want to delete this item from your website?")) {
        const currentItems = getSavedContent();
        currentItems.splice(index, 1);
        saveContent(currentItems);
        renderAdminContentList();
    }
};

// Auto-render list when admin page loads
document.addEventListener('DOMContentLoaded', () => {
    renderAdminContentList();
});