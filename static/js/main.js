// Global variables
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const requestBox = document.getElementById('requestBox');
const glowEffect = document.getElementById('glowEffect');
const submitBtn = document.getElementById('submitBtn');
const requestContainer = document.getElementById('requestContainer');
const chatFrame = document.getElementById('chatFrame');
const chatMessages = document.getElementById('chatMessages');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    createBrandAnimation();
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Input handling
    requestBox.addEventListener('input', handleRequestInput);
    
    // Request submission
    submitBtn.addEventListener('click', handleRequestSubmission);
}

// Create NEXUS brand animation
function createBrandAnimation() {
    const letters = document.querySelectorAll('.brand h1 span');
    letters.forEach((letter, index) => {
        letter.addEventListener('mouseover', () => {
            letter.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow');
            if (htmlElement.getAttribute('data-theme') === 'cyberpunk') {
                letter.style.textShadow = `0 0 10px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-glow')}`;
            }
        });

        letter.addEventListener('mouseout', () => {
            if (index % 2 !== 0 && htmlElement.getAttribute('data-theme') === 'cyberpunk') {
                letter.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow');
            } else {
                letter.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-light');
            }
            letter.style.textShadow = '';
        });
    });
}

// Toggle between cyberpunk and google themes
function toggleTheme() {
    if (htmlElement.getAttribute('data-theme') === 'cyberpunk') {
        htmlElement.setAttribute('data-theme', 'google');
        themeToggle.querySelector('.theme-tooltip').textContent = 'Switch to Cyberpunk Theme';
    } else {
        htmlElement.setAttribute('data-theme', 'cyberpunk');
        themeToggle.querySelector('.theme-tooltip').textContent = 'Switch to Google Theme';
    }
}

// Handle text input
function handleRequestInput() {
    if (requestBox.value.trim().length > 0) {
        glowEffect.style.opacity = '1';
        submitBtn.classList.add('active');
        requestContainer.classList.add('active');
    } else {
        glowEffect.style.opacity = '0';
        submitBtn.classList.remove('active');
        requestContainer.classList.remove('active');
    }
}

// Handle request submission
function handleRequestSubmission() {
    if (requestBox.value.trim().length === 0) return;

    // Get the request text
    const requestText = requestBox.value.trim();

    // Clear the input
    requestBox.value = '';
    submitBtn.classList.remove('active');
    glowEffect.style.opacity = '0';

    // Show the chat frame if not already visible
    if (!chatFrame.classList.contains('active')) {
        chatFrame.classList.add('active');
        setTimeout(() => {
            // Scroll to chat frame
            chatFrame.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Add user message
    addMessage('user', requestText);

    // Start the conversation flow
    analyzeRequest(requestText);
}

// Analyze user request
function analyzeRequest(requestText) {
    // Add typing indicator
    const typingIndicator = addTypingIndicator();

    // First check if this is known territory
    fetch('/api/is_known_territory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: requestText }),
    })
    .then(response => response.json())
    .then(knownData => {
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Add first response
        addMessage('ai', "I'm analyzing your request...");

        // Create neural network widget
        const neuralWidget = createNeuralNetworkWidget();

        // Add message with widget
        addMessage('ai', "Searching our AI agent network for the perfect solution for you...", neuralWidget);

        // If territory is known, use that data directly
        if (knownData.known) {
            const responseType = knownData.partial ? 'partial' : 'match';
            // Simulate neural network analysis with more detailed knowledge
            simulateNeuralNetworkAnalysis(requestText, neuralWidget, responseType, knownData.categoryId);
        } else {
            // If not known, fall back to simpler analysis
            fetch('/api/analyze_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: requestText }),
            })
            .then(response => response.json())
            .then(data => {
                // Simulate neural network analysis with basic analysis
                simulateNeuralNetworkAnalysis(requestText, neuralWidget, data.responseType, data.categoryId);
            })
            .catch(error => {
                console.error('Error in analyze_request:', error);
                addMessage('ai', "I'm sorry, there was an error during analysis. Please try again.");
            });
        }
    })
    .catch(error => {
        console.error('Error in is_known_territory:', error);
        chatMessages.removeChild(typingIndicator);
        addMessage('ai', "I'm sorry, there was an error processing your request. Please try again.");
    });
}

// Helper function to get current time string
function getTimeString() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const categories = {
        1: 'Development Services',
        2: 'Content Creation',
        3: 'Creative Services',
        4: 'Business Solutions',
        5: 'Financial Services'
    };

    return categories[categoryId] || 'Unknown Category';
}