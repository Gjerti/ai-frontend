// Image Creator Functionality
document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        isGenerating: false,
        gallery: [],
        currentImage: null
    };

    // DOM Elements
    const elements = {
        promptInput: document.getElementById('prompt-input'),
        styleSelect: document.getElementById('style-select'),
        generateBtn: document.getElementById('generate-btn'),
        loadingSection: document.getElementById('loading'),
        imageResult: document.getElementById('image-result'),
        generatedImage: document.getElementById('generated-image'),
        downloadBtn: document.getElementById('download-btn'),
        galleryGrid: document.getElementById('gallery-grid')
    };

    // Initialize
    function init() {
        if (!validateElements()) return;
        setupEventListeners();
        loadGallery();
    }

    // Validate all required elements are present
    function validateElements() {
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Missing element: ${key}`);
                return false;
            }
        }
        return true;
    }

    // Setup event listeners
    function setupEventListeners() {
        elements.generateBtn.addEventListener('click', handleGenerate);
        elements.downloadBtn?.addEventListener('click', handleDownload);
        elements.promptInput.addEventListener('input', handlePromptInput);
        
        // Add drag and drop for gallery images
        elements.galleryGrid.addEventListener('dragstart', handleDragStart);
        elements.galleryGrid.addEventListener('dragover', handleDragOver);
        elements.galleryGrid.addEventListener('drop', handleDrop);
    }

    // Handle prompt input
    function handlePromptInput(event) {
        const prompt = event.target.value.trim();
        elements.generateBtn.disabled = !prompt;
    }

    // Handle image generation
    async function handleGenerate() {
        if (state.isGenerating) return;

        const prompt = elements.promptInput.value.trim();
        const style = elements.styleSelect.value;

        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }

        try {
            state.isGenerating = true;
            updateUIState(true);

            // Simulate API call (replace with actual API call)
            const imageUrl = await generateImage(prompt, style);
            
            state.currentImage = {
                url: imageUrl,
                prompt,
                style,
                timestamp: new Date().toISOString()
            };

            displayGeneratedImage(state.currentImage);
            addToGallery(state.currentImage);

        } catch (error) {
            showError(error.message);
        } finally {
            state.isGenerating = false;
            updateUIState(false);
        }
    }

    // Generate image (mock implementation)
    async function generateImage(prompt, style) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo, return a placeholder image
        // Replace with actual API call
        return `https://picsum.photos/seed/${Math.random()}/512/512`;
    }

    // Display generated image
    function displayGeneratedImage(image) {
        elements.generatedImage.src = image.url;
        elements.generatedImage.alt = image.prompt;
        elements.loadingSection.classList.add('hidden');
        elements.imageResult.classList.remove('hidden');
    }

    // Add image to gallery
    function addToGallery(image) {
        state.gallery.unshift(image);
        updateGalleryUI();
        saveGallery();
    }

    // Update gallery UI
    function updateGalleryUI() {
        elements.galleryGrid.innerHTML = state.gallery
            .map((image, index) => createGalleryItem(image, index))
            .join('');
    }

    // Create gallery item HTML
    function createGalleryItem(image, index) {
        return `
            <div class="gallery-item" draggable="true" data-index="${index}">
                <img src="${image.url}" alt="${image.prompt}">
                <div class="gallery-item-overlay">
                    <button class="action-btn" onclick="handleGalleryItemClick(${index})">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Handle gallery item click
    window.handleGalleryItemClick = function(index) {
        const image = state.gallery[index];
        if (image) {
            state.currentImage = image;
            displayGeneratedImage(image);
            elements.promptInput.value = image.prompt;
            elements.styleSelect.value = image.style;
        }
    };

    // Handle image download
    async function handleDownload() {
        if (!state.currentImage) return;

        try {
            const response = await fetch(state.currentImage.url);
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

    // Drag and drop functionality
    function handleDragStart(event) {
        const item = event.target.closest('.gallery-item');
        if (!item) return;
        
        event.dataTransfer.setData('text/plain', item.dataset.index);
        item.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        const item = event.target.closest('.gallery-item');
        if (!item) return;
        
        const draggingItem = document.querySelector('.gallery-item.dragging');
        if (draggingItem && draggingItem !== item) {
            const rect = item.getBoundingClientRect();
            const offset = event.clientY - rect.top - rect.height / 2;
            
            if (offset < 0) {
                item.parentNode.insertBefore(draggingItem, item);
            } else {
                item.parentNode.insertBefore(draggingItem, item.nextSibling);
            }
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));
        const item = event.target.closest('.gallery-item');
        
        if (item) {
            const droppedIndex = parseInt(item.dataset.index);
            if (!isNaN(draggedIndex) && !isNaN(droppedIndex)) {
                const [movedItem] = state.gallery.splice(draggedIndex, 1);
                state.gallery.splice(droppedIndex, 0, movedItem);
                updateGalleryUI();
                saveGallery();
            }
        }

        document.querySelector('.gallery-item.dragging')?.classList.remove('dragging');
    }

    // Update UI state
    function updateUIState(isGenerating) {
        elements.generateBtn.disabled = isGenerating;
        elements.generateBtn.innerHTML = isGenerating ? 
            '<i class="fas fa-spinner fa-spin"></i> Generating...' : 
            '<i class="fas fa-wand-magic-sparkles"></i> Generate';
        
        elements.loadingSection.classList.toggle('hidden', !isGenerating);
        elements.imageResult.classList.toggle('hidden', isGenerating);
    }

    // Show error message
    function showError(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.remove('hidden');
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 3000);
        }
    }

    // Local storage functions
    function saveGallery() {
        localStorage.setItem('imageGallery', JSON.stringify(state.gallery));
    }

    function loadGallery() {
        try {
            const saved = localStorage.getItem('imageGallery');
            if (saved) {
                state.gallery = JSON.parse(saved);
                updateGalleryUI();
            }
        } catch (error) {
            console.error('Failed to load gallery:', error);
        }
    }

    // Initialize the application
    init();
}); 