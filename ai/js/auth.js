// Authentication state
const auth = {
    isAuthenticated: false,
    currentUser: null,
    init() {
        // Check if user is logged in on page load
        const user = localStorage.getItem('user');
        if (user) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(user);
        }
        this.protectRoutes();
    },
    login(email, password) {
        // Simulate API call - in real app, this would be a server request
        return new Promise((resolve, reject) => {
            // Simple validation
            if (!email || !password) {
                reject(new Error('Email and password are required'));
                return;
            }

            // Simulate successful login
            const user = {
                email,
                name: email.split('@')[0], // Use email username as display name
                loginTime: new Date().toISOString()
            };

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            this.isAuthenticated = true;
            this.currentUser = user;

            // Redirect to the originally requested page or default to home
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirectUrl;
            
            resolve(user);
        });
    },
    signup(email, password, confirmPassword) {
        return new Promise((resolve, reject) => {
            // Validation
            if (!email || !password || !confirmPassword) {
                reject(new Error('All fields are required'));
                return;
            }
            if (password !== confirmPassword) {
                reject(new Error('Passwords do not match'));
                return;
            }
            if (password.length < 6) {
                reject(new Error('Password must be at least 6 characters'));
                return;
            }

            // Simulate successful signup
            const user = {
                email,
                name: email.split('@')[0],
                signupTime: new Date().toISOString()
            };

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            this.isAuthenticated = true;
            this.currentUser = user;

            // Redirect to home page after successful signup
            window.location.href = 'index.html';
            
            resolve(user);
        });
    },
    logout() {
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.currentUser = null;
        window.location.href = 'index.html';
    },
    protectRoutes() {
        // List of protected pages
        const protectedPages = [
            'code-assistant.html',
            'medical-ai.html',
            'image-creator.html',
            'ai-therapist.html',
            'tech-news.html'
        ];

        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Don't check auth on get-started.html or index.html
        if (currentPage === 'get-started.html' || currentPage === 'index.html') {
            return;
        }

        // If on a protected page and not authenticated, redirect to get-started
        if (protectedPages.includes(currentPage) && !this.isAuthenticated) {
            window.location.href = 'get-started.html?redirect=' + currentPage;
        }
    }
};

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
}); 