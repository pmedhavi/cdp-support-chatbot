async function sendQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    
    if (!question) return;

    // Add user message to chat
    addMessage(question, 'user-message');
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        addMessage(data.answer, 'bot-message');
    } catch (error) {
        addMessage('Sorry, I encountered an error processing your question.', 'bot-message');
    }
}

function addMessage(text, className) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById('questionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendQuestion();
    }
}); 