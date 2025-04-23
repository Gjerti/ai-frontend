// Enhanced Code Editor Component with Chat Integration
document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        currentLanguage: 'javascript',
        isExecuting: false,
        chatHistory: [],
        savedSnippets: JSON.parse(localStorage.getItem('codeSnippets') || '[]')
    };

    // DOM Elements
    const elements = {
        codeInput: document.getElementById('code-input'),
        codeOutput: document.getElementById('code-output'),
        runButton: document.getElementById('run-code'),
        clearButton: document.getElementById('clear-code'),
        languageSelect: document.getElementById('language-select'),
        chatInput: document.getElementById('chat-input'),
        sendButton: document.getElementById('send-message'),
        chatMessages: document.getElementById('chat-messages'),
        historyList: document.getElementById('history-list'),
        errorContainer: document.getElementById('error-container')
    };

    // Code execution configurations
    const languageConfigs = {
        javascript: {
            execute: executeJavaScript,
            defaultCode: `// Write your JavaScript code here
console.log("Hello, World!");

// Example: Calculate fibonacci sequence
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));`
        },
        python: {
            execute: executePython,
            defaultCode: `# Write your Python code here
print("Hello, World!")

# Example: Calculate fibonacci sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`
        }
    };

    // Initialize editor
    function initializeEditor() {
        setupEditorEventListeners();
        setupChatEventListeners();
        loadSavedSnippets();
        setInitialCode();
        updateLineNumbers();
    }

    // Setup editor event listeners
    function setupEditorEventListeners() {
        elements.codeInput.addEventListener('keydown', handleTabKey);
        elements.codeInput.addEventListener('input', () => {
            updateLineNumbers();
            highlightCode();
        });
        elements.languageSelect.addEventListener('change', handleLanguageChange);
        elements.runButton.addEventListener('click', handleCodeExecution);
        elements.clearButton.addEventListener('click', handleClearCode);
    }

    // Setup chat event listeners
    function setupChatEventListeners() {
        elements.sendButton.addEventListener('click', handleChatMessage);
        elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatMessage();
            }
        });
    }

    // Handle language change
    function handleLanguageChange(e) {
        state.currentLanguage = e.target.value;
        elements.codeInput.className = `language-${state.currentLanguage}`;
        highlightCode();
    }

    // Handle code execution
    async function handleCodeExecution() {
        if (state.isExecuting) return;

        try {
            state.isExecuting = true;
            updateUIState();
            
            const code = elements.codeInput.textContent;
            const language = state.currentLanguage;
            
            // Show loading state
            elements.codeOutput.textContent = 'Executing...';
            
            // Execute code based on language
            const result = await languageConfigs[language].execute(code);
            
            // Display result
            elements.codeOutput.textContent = result;
            
            // Save successful code snippet
            saveCodeSnippet(code, language);

        } catch (error) {
            showError(`Execution error: ${error.message}`);
            elements.codeOutput.textContent = `Error: ${error.message}`;
        } finally {
            state.isExecuting = false;
            updateUIState();
        }
    }

    // Execute JavaScript code
    async function executeJavaScript(code) {
        return new Promise((resolve, reject) => {
            try {
                // Create a safe execution context
                const logs = [];
                const originalConsole = { ...console };
                
                // Override console.log
                console.log = (...args) => {
                    logs.push(args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '));
                };

                // Execute code in a try-catch block
                const result = new Function(code)();
                
                // Restore console.log
                console.log = originalConsole.log;
                
                // Format output
                const output = logs.length > 0 ? 
                    logs.join('\n') : 
                    result !== undefined ? String(result) : '';
                
                resolve(output);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Execute Python code (mock)
    async function executePython(code) {
        // This is a mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`Python execution (mock):\n${code}`);
            }, 500);
        });
    }

    // Handle chat messages
    async function handleChatMessage() {
        const message = elements.chatInput.value.trim();
        if (!message) return;

        // Add user message
        addChatMessage(message, 'user');
        elements.chatInput.value = '';

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            // Generate AI response
            const response = await generateAIResponse(message);
            
            // Remove typing indicator and add AI response
            typingIndicator.remove();
            addChatMessage(response, 'assistant');

        } catch (error) {
            typingIndicator.remove();
            showError('Failed to generate response. Please try again.');
        }
    }

    // Generate AI response (mock)
    async function generateAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple response logic
        if (message.toLowerCase().includes('help')) {
            return `Here are some things I can help you with:
1. Code explanations
2. Debugging assistance
3. Code optimization suggestions
4. Best practices recommendations`;
        }

        return `I received your message: "${message}"\nThis is a mock AI response. In a real implementation, this would be connected to an AI service.`;
    }

    // Add chat message to the UI
    function addChatMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        // Create message content
        if (content.includes('```')) {
            // Handle code blocks
            const parts = content.split('```');
            parts.forEach((part, index) => {
                if (index % 2 === 0) {
                    // Text content
                    if (part.trim()) {
                        messageDiv.appendChild(createTextElement(part));
                    }
                } else {
                    // Code block
                    messageDiv.appendChild(createCodeBlock(part));
                }
            });
        } else {
            // Plain text message
            messageDiv.appendChild(createTextElement(content));
        }

        elements.chatMessages.appendChild(messageDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

        // Add to history if it's a code-related message
        if (sender === 'assistant' && content.includes('```')) {
            addToHistory(content);
        }
    }

    // Create text element
    function createTextElement(text) {
        const p = document.createElement('p');
        p.textContent = text;
        return p;
    }

    // Create code block element
    function createCodeBlock(code) {
        const pre = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.className = 'language-javascript';
        codeElement.textContent = code.trim();
        pre.appendChild(codeElement);
        return pre;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message assistant typing';
        indicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        elements.chatMessages.appendChild(indicator);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        return indicator;
    }

    // Add code snippet to history
    function addToHistory(content) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = content.substring(0, 50) + '...';
        historyItem.addEventListener('click', () => {
            elements.codeInput.textContent = content;
            highlightCode();
        });
        elements.historyList.appendChild(historyItem);
    }

    // Handle tab key in code editor
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const spaces = '    ';
            
            // Insert 4 spaces
            e.target.value = e.target.value.substring(0, start) + spaces + e.target.value.substring(end);
            
            // Put caret at right position
            e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
            
            updateLineNumbers();
            highlightCode();
        }
    }

    // Update line numbers
    function updateLineNumbers() {
        const lines = elements.codeInput.value.split('\n').length;
        const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)
            .join('\n');
        
        const lineNumbersElement = document.getElementById('line-numbers');
        if (lineNumbersElement) {
            lineNumbersElement.textContent = lineNumbers;
        }
    }

    // Handle clear code button
    function handleClearCode() {
        elements.codeInput.value = '';
        elements.codeOutput.textContent = '';
        updateLineNumbers();
        highlightCode();
    }

    // Save code snippet
    function saveCodeSnippet(code, language) {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        snippets.push({ code, language, timestamp: Date.now() });
        
        // Keep only last 10 snippets
        if (snippets.length > 10) snippets.shift();
        
        localStorage.setItem('codeSnippets', JSON.stringify(snippets));
    }

    // Load saved snippets
    function loadSavedSnippets() {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        snippets.forEach(snippet => addToHistory(snippet.code));
    }

    // Set initial code
    function setInitialCode() {
        elements.codeInput.value = languageConfigs[state.currentLanguage].defaultCode;
        highlightCode();
    }

    // Highlight code using Prism.js
    function highlightCode() {
        if (window.Prism) {
            Prism.highlightElement(elements.codeInput);
        }
    }

    // Update UI state
    function updateUIState() {
        elements.runButton.disabled = state.isExecuting;
        elements.clearButton.disabled = state.isExecuting;
        elements.languageSelect.disabled = state.isExecuting;
    }

    // Show error message
    function showError(message) {
        elements.errorContainer.textContent = message;
        elements.errorContainer.style.display = 'block';
        setTimeout(() => {
            elements.errorContainer.style.display = 'none';
        }, 5000);
    }

    // Initialize the editor
    initializeEditor();
}); 