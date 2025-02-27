class QuestionHandler {
    constructor() {
        this.cdpPlatforms = ['segment', 'mparticle', 'lytics', 'zeotap'];
        this.howToPatterns = [
            /how (do|can|to|should) i/i,
            /what('s| is) the (process|way) to/i,
            /steps? (for|to)/i,
            /guide (for|to)/i
        ];
        this.comparisonPatterns = [
            /compare|comparison|versus|vs|difference/i,
            /how does (.+) compare to (.+)/i,
            /which is better/i,
            /what('s| is) the difference/i
        ];
    }

    isCDPRelated(question) {
        const lowerQuestion = question.toLowerCase();
        return this.cdpPlatforms.some(platform => lowerQuestion.includes(platform)) ||
               lowerQuestion.includes('cdp') ||
               lowerQuestion.includes('customer data');
    }

    isComparisonQuestion(question) {
        return this.comparisonPatterns.some(pattern => pattern.test(question));
    }

    identifyPlatforms(question) {
        const lowerQuestion = question.toLowerCase();
        let platforms = this.cdpPlatforms.filter(platform => 
            lowerQuestion.includes(platform)
        );

        // For comparison questions with only one platform mentioned
        if (this.isComparisonQuestion(question) && platforms.length === 1) {
            // Add another platform for comparison
            const otherPlatform = this.cdpPlatforms.find(p => p !== platforms[0]);
            platforms.push(otherPlatform);
        }

        return platforms;
    }

    formatResponse(documents) {
        if (!documents || documents.length === 0) {
            return "I'm sorry, I couldn't find specific information about that.";
        }

        let response = documents[0].content;
        
        // If there are advanced docs and basic docs, combine them
        if (documents.length > 1 && 
            documents[0].type !== documents[1].type) {
            response += "\n\nAdditional advanced information:\n" + documents[1].content;
        }

        return response;
    }

    formatComparison(responses) {
        let result = "Here's a comparison between the platforms:\n\n";
        
        // Compare features
        result += "🔍 Features:\n";
        for (const [platform, data] of Object.entries(responses)) {
            result += `${platform.toUpperCase()}: ${data.features}\n`;
        }
        
        // Compare limitations
        result += "\n⚠️ Limitations:\n";
        for (const [platform, data] of Object.entries(responses)) {
            result += `${platform.toUpperCase()}: ${data.limitations}\n`;
        }
        
        // Compare pricing models
        result += "\n💰 Pricing Models:\n";
        for (const [platform, data] of Object.entries(responses)) {
            result += `${platform.toUpperCase()}: ${data.pricing}\n`;
        }

        return result;
    }
}

module.exports = { QuestionHandler };