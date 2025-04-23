document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        articles: [],
        currentFilter: 'all',
        isLoading: true
    };

    // DOM Elements
    const elements = {
        newsGrid: document.getElementById('news-grid'),
        featuredNews: document.getElementById('featured-news'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        newsCardTemplate: document.getElementById('news-card-template'),
        featuredTemplate: document.getElementById('featured-news-template')
    };

    // Category configurations with corrected image paths
    const categories = {
        ai: {
            icon: 'fas fa-robot',
            label: 'AI & ML',
            images: ['images/news/ai.jpg', 'images/news/machinelearning.jpg', 'images/news/nvidia.jpg']
        },
        web: {
            icon: 'fas fa-code',
            label: 'Web Dev',
            images: ['images/news/web dev.jpg', 'images/news/code.jpg', 'images/news/datascience.jpg']
        },
        mobile: {
            icon: 'fas fa-mobile-alt',
            label: 'Mobile',
            images: ['images/news/mobile.jpg', 'images/news/mobile.jpg', 'images/news/mobile.jpg']
        },
        cybersecurity: {
            icon: 'fas fa-shield-alt',
            label: 'Security',
            images: ['images/news/security.jpg', 'images/news/security.jpg', 'images/news/security.jpg']
        }
    };

    // Initialize
    function initialize() {
        setupEventListeners();
        loadNews();
    }

    // Setup event listeners
    function setupEventListeners() {
        elements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterNews(category);
                elements.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Load news
    async function loadNews() {
        showLoading();
        try {
            const articles = await generateArticles();
            state.articles = articles;
            displayFeaturedArticle(articles[0]);
            displayArticles(articles.slice(1));
        } catch (error) {
            showError('Failed to load news articles');
        }
        hideLoading();
    }

    // Filter news
    function filterNews(category) {
        const filteredArticles = category === 'all' 
            ? state.articles 
            : state.articles.filter(article => article.category === category);
        
        if (filteredArticles.length > 0) {
            displayFeaturedArticle(filteredArticles[0]);
            displayArticles(filteredArticles.slice(1));
        } else {
            showError('No articles found for this category');
        }
    }

    // Display articles
    function displayArticles(articles) {
        elements.newsGrid.innerHTML = '';
        articles.forEach(article => {
            const card = elements.newsCardTemplate.content.cloneNode(true);
            
            const img = card.querySelector('img');
            img.src = article.image;
            img.alt = article.title;
            
            // Add loading class initially
            img.classList.add('loading');
            
            // Handle image load
            img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
            
            // Handle image error
            img.onerror = () => {
                img.src = 'images/news/ai.jpg'; // Fallback image
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
            
            card.querySelector('.category').textContent = categories[article.category].label;
            card.querySelector('.news-title').textContent = article.title;
            card.querySelector('.news-excerpt').textContent = article.summary;
            card.querySelector('.news-date').textContent = article.date;
            
            elements.newsGrid.appendChild(card);
        });
    }

    // Display featured article
    function displayFeaturedArticle(article) {
        if (!article) return;
        
        const featured = elements.featuredTemplate.content.cloneNode(true);
        
        const img = featured.querySelector('img');
        img.src = article.image;
        img.alt = article.title;
        
        // Add loading class initially
        img.classList.add('loading');
        
        // Handle image load
        img.onload = () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        // Handle image error
        img.onerror = () => {
            img.src = 'images/news/ai.jpg'; // Fallback image
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        featured.querySelector('.category').textContent = categories[article.category].label;
        featured.querySelector('.featured-title').textContent = article.title;
        featured.querySelector('.featured-excerpt').textContent = article.summary;
        featured.querySelector('.featured-date').textContent = article.date;
        
        elements.featuredNews.innerHTML = '';
        elements.featuredNews.appendChild(featured);
    }

    // Generate articles (mock data)
    async function generateArticles() {
        const categoryTypes = ['ai', 'web', 'mobile', 'cybersecurity'];
        const articles = [];
        
        for (let i = 0; i < 9; i++) {
            const category = categoryTypes[i % categoryTypes.length];
            const categoryConfig = categories[category];
            
            articles.push({
                id: i + 1,
                title: `${categoryConfig.label} News Article ${i + 1}`,
                category: category,
                image: categoryConfig.images[i % categoryConfig.images.length],
                summary: 'This is a sample article summary that provides a brief overview of the news content.',
                date: new Date().toLocaleDateString()
            });
        }
        
        return articles;
    }

    // UI Helper functions
    function showLoading() {
        state.isLoading = true;
        elements.newsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>';
        elements.featuredNews.innerHTML = '';
    }

    function hideLoading() {
        state.isLoading = false;
    }

    function showError(message) {
        elements.newsGrid.innerHTML = `<div class="error-message">${message}</div>`;
        elements.featuredNews.innerHTML = '';
    }

    // Start the application
    initialize();
}); 