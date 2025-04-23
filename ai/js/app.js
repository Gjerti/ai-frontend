// Theme handling
const themeSwitch = document.getElementById('theme-switch');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on user preference
document.documentElement.setAttribute('data-theme', 
    prefersDarkScheme.matches ? 'dark' : 'light'
);

themeSwitch.textContent = prefersDarkScheme.matches ? '☀️' : '🌙';

themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeSwitch.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Navigation handling
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('.section');

function navigateToSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to current nav link
    const currentLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        navigateToSection(sectionId);
        
        // Update URL without page reload
        window.history.pushState({}, '', `#${sectionId}`);
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateToSection(hash);
    } else {
        // Default to code editor if no hash
        navigateToSection('code-editor');
    }
});

// Initialize the page based on URL hash or default to code editor
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    navigateToSection(hash || 'code-editor');
});

// Error handling utility
window.handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You can implement more sophisticated error handling here
    // such as showing error messages to the user
};

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all components
        if (typeof initCodeEditor === 'function') initCodeEditor();
        if (typeof initImageGenerator === 'function') initImageGenerator();
        if (typeof initPsychologist === 'function') initPsychologist();
        if (typeof initTechNews === 'function') initTechNews();
    } catch (error) {
        handleError(error, 'component initialization');
    }
}); 