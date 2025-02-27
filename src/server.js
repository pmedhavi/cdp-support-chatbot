const express = require('express');
const path = require('path');
const { CDPChatbot } = require('./chatbot');
const { DocumentIndexer } = require('./documentIndexer');
const { QuestionHandler } = require('./questionHandler');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize chatbot with dependencies
const documentIndexer = new DocumentIndexer();
const questionHandler = new QuestionHandler();
const chatbot = new CDPChatbot(documentIndexer, questionHandler);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/chat', async (req, res) => {
    const { question } = req.body;
    try {
        const answer = await chatbot.answerQuestion(question);
        res.json({ answer });
    } catch (error) {
        console.error('Error processing question:', error);
        res.status(500).json({ error: 'Failed to process question' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});