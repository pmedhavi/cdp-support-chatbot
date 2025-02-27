class DocumentIndexer {
    constructor() {
        this.documents = {};
        this.index = {};
        this.comparisonData = {};
    }

    async loadDocumentation() {
        // Load regular documentation
        this.documents = {
            segment: await this.fetchSegmentDocs(),
            mparticle: await this.fetchMParticleDocs(),
            lytics: await this.fetchLyticsDocs(),
            zeotap: await this.fetchZeotapDocs()
        };

        // Load comparison data
        this.comparisonData = {
            'audience-creation': {
                segment: {
                    features: 'Visual interface, real-time updates, multiple data sources',
                    limitations: 'Limited to connected sources',
                    pricing: 'Based on monthly tracked users'
                },
                lytics: {
                    features: 'ML-powered, behavioral scoring, predictive analytics',
                    limitations: 'More complex setup required',
                    pricing: 'Based on data points processed'
                },
                mparticle: {
                    features: 'Real-time segmentation, cross-channel targeting',
                    limitations: 'Requires technical setup',
                    pricing: 'Based on monthly active users'
                },
                zeotap: {
                    features: 'Identity resolution, custom rules engine',
                    limitations: 'Limited third-party integrations',
                    pricing: 'Custom enterprise pricing'
                }
            }
        };

        this.buildIndex();
    }

    async fetchSegmentDocs() {
        return [
            {
                id: 'segment-basic-1',
                title: 'Setting up a new source',
                content: `To set up a new source in Segment:
1. Log in to your Segment workspace
2. Click on 'Sources' in the left navigation
3. Click the 'Add Source' button
4. Search for and select your desired source type
5. Name your source and click 'Add Source'
6. Follow the source-specific setup instructions
7. Enable the source when configuration is complete`,
                type: 'basic'
            },
            {
                id: 'segment-advanced-1',
                title: 'Advanced Source Configuration',
                content: `Advanced configuration options for Segment sources include:
1. Custom Schema Configuration:
   - Define custom properties
   - Set property types
   - Configure nested objects
2. Middleware Implementation:
   - Create custom middleware functions
   - Transform events in-flight
   - Add validation logic
3. API Authentication:
   - Set up OAuth 2.0
   - Configure API keys
   - Manage token rotation
4. Advanced Settings:
   - Rate limiting configuration
   - Retry logic settings
   - Error handling rules
5. Data Transformation:
   - Create custom mappings
   - Set up field enrichment
   - Configure data filtering`,
                type: 'advanced'
            }
        ];
    }

    async fetchMParticleDocs() {
        return [
            {
                id: 'mparticle-basic-1',
                title: 'Creating a user profile',
                content: `To create a user profile in mParticle:
1. Navigate to the User Profile section
2. Click "Create New Profile"
3. Fill in the required user attributes
4. Set any custom attributes as needed
5. Save the profile`,
                type: 'basic'
            },
            {
                id: 'mparticle-advanced-1',
                title: 'Advanced User Profile Configuration',
                content: `Advanced user profile features in mParticle:
1. Custom Attribute Schema:
   - Define custom data types
   - Set validation rules
   - Configure array attributes
2. Identity Mapping:
   - Set up cross-platform identity
   - Configure identity hierarchy
   - Manage identity resolution
3. Audience Rules:
   - Create complex segmentation
   - Set up real-time triggers
   - Configure audience activation`,
                type: 'advanced'
            }
        ];
    }

    async fetchLyticsDocs() {
        return [
            {
                id: 'lytics-basic-1',
                title: 'Building audience segments',
                content: `To build an audience segment in Lytics:
1. Go to Audiences in the main menu
2. Click "Create New Audience"
3. Define your segment criteria
4. Set behavioral rules
5. Save and activate your segment`,
                type: 'basic'
            },
            {
                id: 'lytics-advanced-1',
                title: 'Advanced Audience Configuration',
                content: `Advanced audience features in Lytics:
1. Machine Learning Models:
   - Content affinity modeling
   - Predictive scoring
   - Behavioral clustering
2. Custom JavaScript Rules:
   - Write custom scoring logic
   - Create advanced filters
   - Implement complex conditions
3. Real-time Processing:
   - Stream processing rules
   - Event-based triggers
   - Dynamic audience updates`,
                type: 'advanced'
            }
        ];
    }

    async fetchZeotapDocs() {
        return [
            {
                id: 'zeotap-basic-1',
                title: 'Data integration',
                content: `To integrate your data with Zeotap:
1. Access the Integration Hub
2. Select your data source type
3. Configure the connection settings
4. Map your data fields
5. Test and validate the integration
6. Enable the data flow`,
                type: 'basic'
            },
            {
                id: 'zeotap-advanced-1',
                title: 'Advanced Integration Features',
                content: `Advanced integration capabilities in Zeotap:
1. Custom Data Pipelines:
   - Build custom transformations
   - Set up data validation rules
   - Configure error handling
2. Identity Resolution:
   - Cross-device mapping
   - Probabilistic matching
   - Custom identity rules
3. Real-time Processing:
   - Stream processing setup
   - Event triggering
   - Custom webhooks`,
                type: 'advanced'
            }
        ];
    }

    buildIndex() {
        // Build a simple keyword-based index
        for (const [platform, docs] of Object.entries(this.documents)) {
            this.index[platform] = {};
            docs.forEach(doc => {
                const words = doc.content.toLowerCase().split(/\W+/);
                words.forEach(word => {
                    if (!this.index[platform][word]) {
                        this.index[platform][word] = new Set();
                    }
                    this.index[platform][word].add(doc.id);
                });
            });
        }
    }

    isAdvancedQuery(query) {
        const advancedKeywords = [
            'advanced', 'complex', 'custom', 'api',
            'middleware', 'transform', 'schema',
            'authentication', 'advanced configuration',
            'machine learning', 'identity resolution'
        ];
        return advancedKeywords.some(keyword => 
            query.toLowerCase().includes(keyword)
        );
    }

    async search(query, platform) {
        const queryWords = query.toLowerCase().split(/\W+/);
        const relevantDocIds = new Set();
        const isAdvanced = this.isAdvancedQuery(query);

        queryWords.forEach(word => {
            if (this.index[platform][word]) {
                this.index[platform][word].forEach(docId => {
                    relevantDocIds.add(docId);
                });
            }
        });

        let docs = Array.from(relevantDocIds)
            .map(id => this.documents[platform].find(doc => doc.id === id))
            .filter(Boolean);

        // Prioritize advanced or basic docs based on query type
        docs.sort((a, b) => {
            if (isAdvanced) {
                return (b.type === 'advanced') - (a.type === 'advanced');
            }
            return (b.type === 'basic') - (a.type === 'basic');
        });

        return docs;
    }

    async getComparison(aspect, platforms) {
        if (this.comparisonData[aspect]) {
            const comparison = {};
            platforms.forEach(platform => {
                if (this.comparisonData[aspect][platform]) {
                    comparison[platform] = this.comparisonData[aspect][platform];
                }
            });
            return comparison;
        }
        return null;
    }
}

module.exports = { DocumentIndexer };