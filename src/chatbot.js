class CDPChatbot {
    constructor(documentIndexer, questionHandler) {
        this.documentIndexer = documentIndexer;
        this.questionHandler = questionHandler;
        this.cdpPlatforms = ['segment', 'mparticle', 'lytics', 'zeotap'];
        this.initialize();
    }

    async initialize() {
        await this.documentIndexer.loadDocumentation();
    }

    async answerQuestion(question) {
        // Check if question is CDP related
        if (!this.questionHandler.isCDPRelated(question)) {
            return "I can only answer questions related to CDP platforms (Segment, mParticle, Lytics, and Zeotap).";
        }

        // Identify which CDP(s) the question is about
        const platforms = this.questionHandler.identifyPlatforms(question);

        // Handle comparison questions
        if (platforms.length > 1) {
            return this.handleComparisonQuestion(question, platforms);
        }

        // Handle single platform questions
        return this.handleSinglePlatformQuestion(question, platforms[0]);
    }

    async handleComparisonQuestion(question, platforms) {
        const responses = {};
        for (const platform of platforms) {
            const relevantDocs = await this.documentIndexer.search(question, platform);
            responses[platform] = this.questionHandler.formatResponse(relevantDocs);
        }
        return this.questionHandler.formatComparison(responses);
    }

    async handleSinglePlatformQuestion(question, platform) {
        const relevantDocs = await this.documentIndexer.search(question, platform);
        return this.questionHandler.formatResponse(relevantDocs);
    }
}

module.exports = { CDPChatbot }; 