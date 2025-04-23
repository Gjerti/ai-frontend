document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('medical-form');
    const input = document.getElementById('medical-input');
    const messagesContainer = document.getElementById('chat-messages');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const detailToggle = document.getElementById('detail-toggle');
    const photoUploadBtn = document.getElementById('photo-upload-btn');
    const photoInput = document.getElementById('photo-input');

    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Handle photo upload button click
    photoUploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    // Handle photo selection
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        
        // Add to history
        addToHistory(message);

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Simulate AI response (replace with actual API call)
        const isDetailed = detailToggle.checked;
        simulateAIResponse(message, isDetailed);
    });

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            addMessage('', true, imageData);
            simulateAIResponseForImage();
        };
        reader.readAsDataURL(file);
    }

    function addMessage(content, isUser = false, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : ''}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (content) {
            messageContent.textContent = content;
        }
        
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'message-image';
            img.addEventListener('click', () => showImagePreview(imageUrl));
            messageContent.appendChild(img);
        }
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showImagePreview(imageUrl) {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
        preview.addEventListener('click', () => {
            preview.remove();
        });
        document.body.appendChild(preview);
    }

    function simulateAIResponseForImage() {
        // Add loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message';
        loadingDiv.innerHTML = '<div class="message-content">Analyzing image...</div>';
        messagesContainer.appendChild(loadingDiv);

        // Simulate API delay
        setTimeout(() => {
            messagesContainer.removeChild(loadingDiv);
            addMessage("I've analyzed the image. To provide better assistance, could you please describe any specific symptoms or concerns related to what's shown in the image?");
        }, 2000);
    }

    function addToHistory(message) {
        const li = document.createElement('li');
        li.textContent = message.length > 30 ? message.substring(0, 30) + '...' : message;
        li.title = message;
        li.addEventListener('click', () => {
            input.value = message;
            input.focus();
        });
        historyList.insertBefore(li, historyList.firstChild);
    }

    function simulateAIResponse(message, isDetailed) {
        // Add loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message';
        loadingDiv.innerHTML = '<div class="message-content">Thinking...</div>';
        messagesContainer.appendChild(loadingDiv);

        // Simulate API delay
        setTimeout(() => {
            messagesContainer.removeChild(loadingDiv);
            
            // Generate response based on message content
            let response = generateResponse(message, isDetailed);
            addMessage(response);
        }, 1500);
    }

    function generateResponse(message, isDetailed) {
        // Simple response generation logic (replace with actual AI response)
        const lowercaseMsg = message.toLowerCase();
        
        if (lowercaseMsg.includes('headache')) {
            return isDetailed 
                ? "Based on your description of headache symptoms, there could be several causes including tension, dehydration, or eye strain. I recommend: 1) Rest in a quiet, dark room 2) Stay hydrated 3) Try over-the-counter pain relievers. If symptoms persist over 24 hours or are severe, please consult a healthcare provider."
                : "For headaches, try resting, staying hydrated, and taking over-the-counter pain relievers. See a doctor if symptoms are severe or persistent.";
        }
        
        return isDetailed
            ? "I understand your concern. While I can provide general information, it's important to consult with a healthcare provider for personalized medical advice. Could you provide more specific details about your symptoms?"
            : "Could you tell me more about your symptoms? For accurate medical advice, please consult a healthcare provider.";
    }

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
    });

    // Handle drag and drop
    messagesContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        messagesContainer.style.border = '2px dashed var(--primary-color)';
    });

    messagesContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        messagesContainer.style.border = 'none';
    });

    messagesContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        messagesContainer.style.border = 'none';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
}); 