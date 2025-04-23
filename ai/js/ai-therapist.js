// Mood tracking and chat state
const state = {
    currentMood: null,
    isTyping: false,
    chatHistory: [],
    lastInteractionTime: null
};

// Therapeutic responses for the AI
const therapeuticResponses = {
    greetings: [
        "Hello! I'm here to listen and support you. How are you feeling today?",
        "Welcome back! How has your day been going?",
        "Hi there! This is a safe space to share your thoughts. What's on your mind?"
    ],
    acknowledgments: [
        "I hear you, and what you're feeling is valid.",
        "Thank you for sharing that with me.",
        "That sounds really challenging. Would you like to tell me more about it?",
        "I can understand why you would feel that way."
    ],
    followUps: [
        "How long have you been feeling this way?",
        "What do you think triggered these feelings?",
        "Have you talked to anyone else about this?",
        "What usually helps you when you feel this way?"
    ],
    supportive: [
        "Remember that it's okay to take things one step at a time.",
        "You're showing great strength by talking about this.",
        "Let's explore this together and see if we can find some helpful perspectives."
    ]
};

// Mood tracking emojis and their meanings
const moodEmojis = {
    "😊": "Happy",
    "😔": "Sad",
    "😠": "Angry",
    "😰": "Anxious",
    "😐": "Neutral",
    "🤔": "Confused"
};

// Initialize the chat interface
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const historyList = document.getElementById('history-list');

    // Chat state
    const state = {
        currentMood: null,
        isTyping: false,
        chatHistory: [],
        lastInteractionTime: null
    };

    // Event Listeners
    chatForm.addEventListener('submit', handleSubmit);
    userInput.addEventListener('input', autoResize);
    userInput.addEventListener('keydown', handleKeyDown);
    moodButtons.forEach(btn => btn.addEventListener('click', handleMoodSelection));

    // Auto-resize textarea on load
    autoResize.call(userInput);

    function handleSubmit(e) {
        e.preventDefault();
        sendMessage();
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function handleMoodSelection(e) {
        const btn = e.target;
        const mood = btn.dataset.mood;
        
        // Remove selection from other buttons
        moodButtons.forEach(b => b.classList.remove('selected'));
        
        // Select current button
        btn.classList.add('selected');
        
        // Update state and send message
        state.currentMood = mood;
        sendMessage(`I'm feeling ${mood.toLowerCase()} today.`);
    }

    function autoResize() {
        // Reset height to auto to get correct scrollHeight
        this.style.height = 'auto';
        
        // Set new height
        const newHeight = Math.min(this.scrollHeight, 150);
        this.style.height = newHeight + 'px';
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to history if it's a user message
        if (sender === 'user') {
            addToHistory(text);
        }
        
        return messageDiv;
    }

    function addToHistory(message) {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = message.length > 30 ? message.substring(0, 30) + '...' : message;
        
        const date = document.createElement('div');
        date.className = 'date';
        date.textContent = new Date().toLocaleString();
        
        li.appendChild(title);
        li.appendChild(date);
        
        // Add click handler to reload message
        li.addEventListener('click', () => {
            userInput.value = message;
            userInput.focus();
            autoResize.call(userInput);
        });
        
        // Add to beginning of list
        if (historyList.firstChild) {
            historyList.insertBefore(li, historyList.firstChild);
        } else {
            historyList.appendChild(li);
        }
    }

    function showTypingIndicator() {
        const indicator = addMessage('...', 'assistant');
        indicator.classList.add('typing');
        return indicator;
    }

    function generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Generate appropriate response based on context
        if (state.currentMood) {
            if (message.includes('yes') || message.includes('yeah')) {
                return getRandomResponse('followUps');
            } else if (message.includes('no') || message.includes('not')) {
                return "That's okay. Would you like to talk about something else?";
            } else if (message.includes('help') || message.includes('cant') || message.includes("can't")) {
                return getRandomResponse('supportive');
            } else {
                return getRandomResponse('acknowledgments');
            }
        }
        
        return getRandomResponse('greetings');
    }

    function getRandomResponse(type) {
        const responses = therapeuticResponses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    async function sendMessage(overrideMessage = null) {
        const message = overrideMessage || userInput.value.trim();
        
        if (!message) return;

        // Clear input and resize
        if (!overrideMessage) {
            userInput.value = '';
            autoResize.call(userInput);
        }

        // Add user message
        addMessage(message, 'user');
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Generate and show response
            const response = generateResponse(message);
            addMessage(response, 'assistant');
            
        } catch (error) {
            console.error('Error generating response:', error);
            typingIndicator.remove();
            addMessage('I apologize, but I encountered an error. Please try again.', 'assistant');
        }
    }

    // Show initial greeting
    addMessage(getRandomResponse('greetings'), 'assistant');
}); 