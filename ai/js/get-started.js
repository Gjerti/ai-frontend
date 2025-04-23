// Form Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Input Elements
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupConfirm = document.getElementById('signup-confirm');
const rememberMe = document.getElementById('remember-me');
const acceptTerms = document.getElementById('accept-terms');

// Tab Switching Animation
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.dataset.tab;
        
        // Update active tab with animation
        authTabs.forEach(t => {
            t.classList.remove('active');
            t.style.transform = 'translateY(0)';
        });
        tab.classList.add('active');
        tab.style.transform = 'translateY(-2px)';
        
        // Animate form transition
        authForms.forEach(form => {
            form.classList.remove('active');
            form.style.opacity = '0';
            form.style.transform = 'translateX(-10px)';
            
            if (form.id === `${targetForm}-form`) {
                form.classList.add('active');
                setTimeout(() => {
                    form.style.opacity = '1';
                    form.style.transform = 'translateX(0)';
                }, 50);
            }
        });
    });
});

// Password Visibility Toggle
const toggleButtons = document.querySelectorAll('.toggle-password');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    
    if (!existingError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('error');
}

function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    input.classList.remove('error');
}

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    const email = loginForm.querySelector('input[type="email"]');
    const password = loginForm.querySelector('input[type="password"]');
    const rememberMe = document.getElementById('rememberMe');
    
    // Clear previous errors
    removeError(email);
    removeError(password);
    
    // Validate email
    if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    if (isValid) {
        try {
            // Show loading state
            const submitBtn = loginForm.querySelector('.auth-button');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            // Store remember me preference
            if (rememberMe.checked) {
                localStorage.setItem('rememberedEmail', email.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Use auth system to login
            await auth.login(email.value, password.value);
            
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    const email = signupForm.querySelector('input[type="email"]');
    const password = signupForm.querySelector('input[type="password"]');
    const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]');
    const agreeTerms = document.getElementById('agreeTerms');
    
    // Clear previous errors
    removeError(email);
    removeError(password);
    removeError(confirmPassword);
    
    // Validate email
    if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword(password.value)) {
        showError(password, 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
        isValid = false;
    }
    
    // Validate password confirmation
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!agreeTerms.checked) {
        alert('Please accept the Terms and Privacy Policy');
        isValid = false;
    }
    
    if (isValid) {
        try {
            // Show loading state
            const submitBtn = signupForm.querySelector('.auth-button');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            
            // Use auth system to signup
            await auth.signup(email.value, password.value, confirmPassword.value);
            
        } catch (error) {
            console.error('Signup error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
});

// Social Authentication
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const provider = button.classList.contains('google') ? 'Google' : 'GitHub';
        
        try {
            // Show loading state
            const originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting to ${provider}...`;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`${provider} authentication is not implemented yet.`);
            
            // Reset button state
            button.disabled = false;
            button.innerHTML = originalText;
        } catch (error) {
            console.error(`${provider} auth error:`, error);
            alert(`An error occurred during ${provider} authentication. Please try again.`);
            
            // Reset button state
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });
});

// Remember Me Functionality
window.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const loginEmail = document.getElementById('loginEmail');
        loginEmail.value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }

    // Handle tab switching
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    loginTab.addEventListener('click', () => {
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    });

    signupTab.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    });

    // Check if there's a redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('redirect')) {
        const message = document.createElement('div');
        message.className = 'info-message';
        message.textContent = 'Please log in or sign up to access this page.';
        document.querySelector('.auth-container').insertBefore(message, document.querySelector('.auth-tabs'));
    }
});

// Add input validation styles
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', () => {
        removeError(input);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            await auth.login(email, password);
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]').value;

        try {
            await auth.signup(email, password, confirmPassword);
            successMessage.textContent = 'Signup successful! Redirecting...';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });

    // Add password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const passwordInput = e.target.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            e.target.classList.toggle('show-password');
        });
    });

    // Handle tab switching
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    loginTab.addEventListener('click', () => {
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    });

    signupTab.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    });

    // Check if there's a redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('redirect')) {
        const message = document.createElement('div');
        message.className = 'info-message';
        message.textContent = 'Please log in or sign up to access this page.';
        document.querySelector('.auth-container').insertBefore(message, document.querySelector('.auth-tabs'));
    }
}); 