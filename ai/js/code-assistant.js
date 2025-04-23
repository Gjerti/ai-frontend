// Code Assistant with Chat Integration
document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        currentLanguage: 'javascript',
        isExecuting: false,
        chatHistory: [],
        savedSnippets: [],
        isTyping: false
    };

    // DOM Elements
    const elements = {
        languageSelect: document.getElementById('language-select'),
        codeInput: document.getElementById('code-input'),
        codeOutput: document.getElementById('code-output'),
        runButton: document.getElementById('run-code'),
        clearButton: document.getElementById('clear-code'),
        chatInput: document.getElementById('chat-input'),
        chatMessages: document.getElementById('chat-messages'),
        historyList: document.getElementById('history-list'),
        errorContainer: document.getElementById('error-container'),
        lineNumbers: document.querySelector('.line-numbers'),
        chatForm: document.getElementById('chat-form')
    };

    // Initialize
    function init() {
        if (!validateElements()) return;
        setupEventListeners();
        setupEditor();
        addMessage('Hello! I\'m your AI coding assistant. How can I help you today?', false);
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
        // Code execution
        elements.runButton.addEventListener('click', executeCode);
        elements.clearButton.addEventListener('click', clearCode);
        elements.languageSelect.addEventListener('change', handleLanguageChange);
        
        // Chat functionality - only use form submission
        elements.chatForm.addEventListener('submit', handleChatSubmit);

        // Code input
        elements.codeInput.addEventListener('input', updateLineNumbers);
        elements.codeInput.addEventListener('keydown', handleTabKey);

        // Auto-resize chat input
        elements.chatInput.addEventListener('input', () => {
            elements.chatInput.style.height = 'auto';
            elements.chatInput.style.height = `${Math.min(elements.chatInput.scrollHeight, 200)}px`;
        });
    }

    // Setup editor
    function setupEditor() {
        elements.codeInput.setAttribute('spellcheck', 'false');
        elements.codeInput.value = '// Write your code here...';
        updateLineNumbers();
    }

    // Execute code based on selected language
    async function executeCode() {
        if (state.isExecuting) return;
        
        const code = elements.codeInput.value;
        const language = elements.languageSelect.value;
        if (!code.trim()) {
            showError('Please enter some code to execute');
            return;
        }

        state.isExecuting = true;
        elements.runButton.disabled = true;
        elements.codeOutput.textContent = `Running ${language} code...`;

        try {
            let result;
            switch (language) {
                case 'javascript':
                    result = await executeJavaScript(code);
                    break;
                case 'python':
                    result = 'Python execution is simulated: ' + code;
                    break;
                default:
                    result = `Execution for ${language} is not implemented yet.`;
            }
            elements.codeOutput.textContent = result;
        } catch (error) {
            elements.codeOutput.textContent = `Error: ${error.message}`;
            showError(error.message);
        } finally {
            state.isExecuting = false;
            elements.runButton.disabled = false;
        }
    }

    // Execute JavaScript code safely
    function executeJavaScript(code) {
        return new Promise((resolve, reject) => {
            try {
                const safeEval = new Function('return ' + code);
                const result = safeEval();
                resolve(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
            } catch (error) {
                reject(error);
            }
        });
    }

    // Handle chat form submission
    function handleChatSubmit(event) {
        event.preventDefault();
        const message = elements.chatInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input and reset height
            elements.chatInput.value = '';
            elements.chatInput.style.height = 'auto';
            
            // Simulate AI response
            setTimeout(() => {
                const response = "I understand you're asking about the code. How can I help you analyze or improve it?";
                addMessage(response, false);
            }, 1000);
        }
    }

    // Add message to chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const icon = document.createElement('i');
        icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
        avatar.appendChild(icon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const text = document.createElement('p');
        text.textContent = content;
        messageContent.appendChild(text);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        elements.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

        // Add to history
        addToHistory(content);
    }

    // Format message content (handle code blocks, links, etc.)
    function formatMessage(content) {
        // Replace code blocks with syntax highlighted versions
        content = content.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => {
            const language = lang || 'javascript';
            return `<pre><code class="language-${language}">${Prism.highlight(code, Prism.languages[language], language)}</code></pre>`;
        });

        // Replace inline code
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Replace URLs with links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        return content;
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (!document.querySelector('.typing-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'message ai-message typing-indicator';
            indicator.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            elements.chatMessages.appendChild(indicator);
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        }
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Generate AI response (simple implementation)
    function generateAIResponse(message) {
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            return "Hello! How can I help you with your code today?";
        }
        if (message.toLowerCase().includes('help')) {
            return "I can help you with coding questions, debugging, and explaining programming concepts. What would you like to know?";
        }
        return "I understand your message. Could you please provide more details about what you'd like to know?";
    }

    // Add message to history
    function addToHistory(content) {
        const historyItem = document.createElement('li');
        historyItem.textContent = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        historyItem.addEventListener('click', () => {
            elements.chatInput.value = content;
        });
        elements.historyList.insertBefore(historyItem, elements.historyList.firstChild);
    }

    // Update line numbers in code editor
    function updateLineNumbers() {
        const lines = elements.codeInput.value.split('\n');
        elements.lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    }

    // Handle tab key in code editor
    function handleTabKey(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    }

    // Show error message
    function showError(message) {
        elements.errorContainer.textContent = message;
        elements.errorContainer.classList.remove('hidden');
        setTimeout(() => {
            elements.errorContainer.classList.add('hidden');
        }, 3000);
    }

    // Handle language change
    function handleLanguageChange(event) {
        const language = event.target.value;
        elements.codeInput.className = `language-${language}`;
        Prism.highlightElement(elements.codeInput);
    }

    // Clear code editor
    function clearCode() {
        elements.codeInput.value = '// Write your code here...';
        elements.codeOutput.textContent = '';
        updateLineNumbers();
    }

    // Initialize the application
    init();
}); 