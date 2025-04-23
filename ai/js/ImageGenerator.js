// Image Generator Component
document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        isGenerating: false,
        currentPrompt: '',
        generatedImages: [],
        favorites: JSON.parse(localStorage.getItem('favoriteImages') || '[]')
    };

    // DOM Elements
    const elements = {
        promptInput: document.getElementById('prompt-input'),
        generateButton: document.getElementById('generate-image'),
        imageGallery: document.getElementById('image-gallery'),
        favoritesGallery: document.getElementById('favorites-gallery'),
        styleSelect: document.getElementById('style-select'),
        sizeSelect: document.getElementById('size-select'),
        loadingIndicator: document.getElementById('loading-indicator'),
        errorContainer: document.getElementById('error-container')
    };

    // Initialize component
    function initialize() {
        setupEventListeners();
        loadFavorites();
    }

    // Setup event listeners
    function setupEventListeners() {
        elements.generateButton.addEventListener('click', handleImageGeneration);
        elements.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleImageGeneration();
            }
        });
    }

    // Handle image generation
    async function handleImageGeneration() {
        if (state.isGenerating) return;

        const prompt = elements.promptInput.value.trim();
        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }

        try {
            state.isGenerating = true;
            updateUIState();
            
            // Show loading state
            showLoadingIndicator();
            
            // Generate image (mock implementation)
            const images = await generateImages(prompt);
            
            // Display results
            displayGeneratedImages(images);
            
            // Clear input
            elements.promptInput.value = '';
            
        } catch (error) {
            showError('Failed to generate images. Please try again.');
        } finally {
            state.isGenerating = false;
            hideLoadingIndicator();
            updateUIState();
        }
    }

    // Generate images (mock implementation)
    async function generateImages(prompt) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock image generation
        const style = elements.styleSelect.value;
        const size = elements.sizeSelect.value;
        
        // In a real implementation, this would call an AI image generation service
        const mockImages = [
            {
                url: 'https://via.placeholder.com/512',
                prompt,
                style,
                size,
                timestamp: Date.now()
            },
            {
                url: 'https://via.placeholder.com/512',
                prompt,
                style,
                size,
                timestamp: Date.now()
            }
        ];
        
        state.generatedImages = [...state.generatedImages, ...mockImages];
        return mockImages;
    }

    // Display generated images
    function displayGeneratedImages(images) {
        images.forEach(image => {
            const imageCard = createImageCard(image);
            elements.imageGallery.insertBefore(imageCard, elements.imageGallery.firstChild);
        });
    }

    // Create image card
    function createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.prompt;
        img.loading = 'lazy';
        
        const controls = document.createElement('div');
        controls.className = 'image-controls';
        
        const downloadBtn = createButton('fas fa-download', () => downloadImage(image));
        const favoriteBtn = createButton('fas fa-heart', () => toggleFavorite(image));
        const shareBtn = createButton('fas fa-share', () => shareImage(image));
        
        controls.appendChild(downloadBtn);
        controls.appendChild(favoriteBtn);
        controls.appendChild(shareBtn);
        
        const info = document.createElement('div');
        info.className = 'image-info';
        info.innerHTML = `
            <p class="prompt">${image.prompt}</p>
            <p class="details">Style: ${image.style} | Size: ${image.size}</p>
        `;
        
        card.appendChild(img);
        card.appendChild(controls);
        card.appendChild(info);
        
        return card;
    }

    // Create control button
    function createButton(iconClass, onClick) {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.innerHTML = `<i class="${iconClass}"></i>`;
        button.addEventListener('click', onClick);
        return button;
    }

    // Download image
    async function downloadImage(image) {
        try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            showError('Failed to download image');
        }
    }

    // Toggle favorite
    function toggleFavorite(image) {
        const index = state.favorites.findIndex(fav => fav.url === image.url);
        
        if (index === -1) {
            // Add to favorites
            state.favorites.push(image);
            addToFavoritesGallery(image);
        } else {
            // Remove from favorites
            state.favorites.splice(index, 1);
            removeFromFavoritesGallery(image);
        }
        
        // Update localStorage
        localStorage.setItem('favoriteImages', JSON.stringify(state.favorites));
    }

    // Share image
    async function shareImage(image) {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Generated Image',
                    text: `Check out this AI-generated image: ${image.prompt}`,
                    url: image.url
                });
            } else {
                // Fallback to copying URL
                await navigator.clipboard.writeText(image.url);
                showMessage('Image URL copied to clipboard');
            }
        } catch (error) {
            showError('Failed to share image');
        }
    }

    // Load favorites from localStorage
    function loadFavorites() {
        state.favorites.forEach(image => addToFavoritesGallery(image));
    }

    // Add image to favorites gallery
    function addToFavoritesGallery(image) {
        const card = createImageCard(image);
        elements.favoritesGallery.appendChild(card);
    }

    // Remove image from favorites gallery
    function removeFromFavoritesGallery(image) {
        const cards = elements.favoritesGallery.querySelectorAll('.image-card');
        cards.forEach(card => {
            const img = card.querySelector('img');
            if (img.src === image.url) {
                card.remove();
            }
        });
    }

    // Show loading indicator
    function showLoadingIndicator() {
        elements.loadingIndicator.style.display = 'flex';
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        elements.loadingIndicator.style.display = 'none';
    }

    // Update UI state
    function updateUIState() {
        elements.generateButton.disabled = state.isGenerating;
        elements.promptInput.disabled = state.isGenerating;
        elements.styleSelect.disabled = state.isGenerating;
        elements.sizeSelect.disabled = state.isGenerating;
    }

    // Show error message
    function showError(message) {
        elements.errorContainer.textContent = message;
        elements.errorContainer.style.display = 'block';
        setTimeout(() => {
            elements.errorContainer.style.display = 'none';
        }, 5000);
    }

    // Show message
    function showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Initialize the component
    initialize();
}); 