// This file contains UI-specific functions that aren't directly related 
// to the chat or widgets functionality

// Handle Enter key press in request box
document.addEventListener('DOMContentLoaded', () => {
    const requestBox = document.getElementById('requestBox');
    if (requestBox) {
        requestBox.addEventListener('keydown', function(e) {
            // Check if Enter was pressed without Shift
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default newline
                // Trigger submit button click if input has content
                if (requestBox.value.trim().length > 0) {
                    document.getElementById('submitBtn').click();
                }
            }
        });
    }
});

// Update the typing indicator animation when theme changes
function updateAnimationColors() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    if (typingIndicators.length > 0) {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-light');
        typingIndicators.forEach(indicator => {
            const dots = indicator.querySelectorAll('.typing-dot');
            dots.forEach(dot => {
                dot.style.backgroundColor = textColor;
            });
        });
    }
}

// Listen for theme changes to update animations
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', updateAnimationColors);
    }
});

// Enhance accessibility with keyboard navigation for message action buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation to action buttons that get dynamically added
    document.addEventListener('keydown', function(e) {
        // Only add keyboard handling when chat frame is active
        if (!document.getElementById('chatFrame').classList.contains('active')) return;
        
        // Handle Tab key for action buttons
        if (e.key === 'Tab') {
            const allButtons = document.querySelectorAll('.message-action-btn, .generate-btn');
            if (allButtons.length > 0) {
                // Focus management - would need more complex logic for full implementation
                // Just demonstrating a basic approach here
            }
        }
        
        // Handle Enter key for focused buttons
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('message-action-btn') || 
                focusedElement.classList.contains('generate-btn')) {
                focusedElement.click();
            }
        }
    });
});

// Add smooth scrolling when chat messages are added
function scrollChatToBottom(smooth = true) {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }
}

// Handle window resize to adjust chat height if needed
window.addEventListener('resize', () => {
    const chatFrame = document.getElementById('chatFrame');
    if (chatFrame && chatFrame.classList.contains('active')) {
        // You could adjust max-height based on window size if needed
        scrollChatToBottom(false);
    }
});