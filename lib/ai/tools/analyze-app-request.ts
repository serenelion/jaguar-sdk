import { tool } from 'ai';
import { z } from 'zod';
import type { Session } from 'next-auth';
import type { DataStreamWriter } from 'ai';

interface AnalyzeAppRequestProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const analyzeAppRequest = ({ session, dataStream }: AnalyzeAppRequestProps) =>
  tool({
    description: 'Analyze a user request to determine what type of agentic application they want to build. This is the first step in the master agent workflow.',
    parameters: z.object({
      userRequest: z.string().describe('The user\'s description of what they want to build'),
    }),
    execute: async ({ userRequest }) => {
      dataStream.writeData({
        type: 'analysis-start',
        content: 'Analyzing your request to determine the best app type...',
      });

      // Analyze the request to determine app type
      const analysis = analyzeRequest(userRequest);

      dataStream.writeData({
        type: 'analysis-result',
        content: JSON.stringify(analysis, null, 2),
      });

      // Provide recommendations
      const recommendations = generateRecommendations(analysis);

      dataStream.writeData({
        type: 'recommendations',
        content: recommendations,
      });

      return {
        analysis,
        recommendations,
        nextStep: 'Use the create-app tool to generate the application based on this analysis.',
      };
    },
  });

function analyzeRequest(userRequest: string) {
  const request = userRequest.toLowerCase();
  
  // Keywords and patterns for different app types
  const patterns = {
    'chat-agent': [
      'chatbot', 'chat bot', 'conversational', 'assistant', 'help desk', 
      'customer support', 'talk to', 'answer questions', 'virtual assistant',
      'tutor', 'coach', 'advisor', 'consultant'
    ],
    'automation-agent': [
      'automate', 'automation', 'workflow', 'schedule', 'monitor', 
      'automatically', 'process', 'manage', 'organize', 'sync',
      'email management', 'social media', 'posting', 'scheduling'
    ],
    'react-app': [
      'web app', 'website', 'dashboard', 'interface', 'platform', 
      'application', 'tool', 'calculator', 'tracker', 'manager',
      'interactive', 'visual', 'ui', 'user interface'
    ],
    'spatial-network-tool': [
      'grant', 'sustainability', 'regenerative', 'community', 'environment',
      'spatial network', 'ecological', 'permaculture', 'green', 'climate',
      'agriculture', 'conservation', 'renewable'
    ],
    'conversational-model': [
      'ai model', 'language model', 'api', 'service', 'backend',
      'model only', 'no interface', 'headless', 'integration'
    ]
  };

  // Calculate confidence scores for each app type
  const scores: Record<string, number> = {};
  
  for (const [appType, keywords] of Object.entries(patterns)) {
    scores[appType] = keywords.reduce((score, keyword) => {
      return score + (request.includes(keyword) ? 1 : 0);
    }, 0) / keywords.length;
  }

  // Find the app type with highest score
  const bestMatch = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  );

  const appType = bestMatch[0];
  const confidence = Math.min(bestMatch[1] * 2, 1); // Scale confidence

  // Generate suggested capabilities based on request
  const capabilities = extractCapabilities(userRequest, appType);
  
  // Generate app name suggestion
  const suggestedName = generateAppName(userRequest);

  // Estimate complexity
  const estimatedComplexity = estimateComplexity(userRequest);

  // Recommend integrations
  const recommendedIntegrations = recommendIntegrations(userRequest, appType);

  return {
    appType,
    confidence,
    reasoning: generateReasoning(userRequest, appType, confidence),
    suggestedName,
    coreCapabilities: capabilities,
    estimatedComplexity,
    recommendedIntegrations
  };
}

function extractCapabilities(request: string, appType: string): string[] {
  const baseCapabilities: Record<string, string[]> = {
    'chat-agent': ['Natural conversation', 'Context awareness', 'Helpful responses'],
    'automation-agent': ['Task scheduling', 'Process automation', 'Integration handling'],
    'react-app': ['User interface', 'Data management', 'Interactive features'],
    'spatial-network-tool': ['Sustainability analysis', 'Community features', 'Impact assessment'],
    'conversational-model': ['Text generation', 'API responses', 'Domain expertise']
  };

  const capabilities = [...(baseCapabilities[appType] || [])];
  
  // Extract specific capabilities from request
  const request_lower = request.toLowerCase();
  
  if (request_lower.includes('email')) capabilities.push('Email processing');
  if (request_lower.includes('social media')) capabilities.push('Social media integration');
  if (request_lower.includes('calendar')) capabilities.push('Calendar management');
  if (request_lower.includes('analytics')) capabilities.push('Data analytics');
  if (request_lower.includes('notification')) capabilities.push('Notifications');
  if (request_lower.includes('search')) capabilities.push('Search functionality');
  if (request_lower.includes('database')) capabilities.push('Database management');
  if (request_lower.includes('file')) capabilities.push('File processing');

  return capabilities.slice(0, 5); // Limit to 5 capabilities
}

function generateAppName(request: string): string {
  // Extract key nouns and concepts to suggest a name
  const words = request.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const importantWords = words.filter(word => 
    word.length > 3 && 
    !['want', 'need', 'create', 'build', 'make', 'help', 'that', 'will', 'can'].includes(word)
  );

  if (importantWords.length > 0) {
    const mainWord = importantWords[0];
    return mainWord.charAt(0).toUpperCase() + mainWord.slice(1) + ' Agent';
  }

  return 'Custom Agent';
}

function estimateComplexity(request: string): 'simple' | 'moderate' | 'complex' {
  const complexityIndicators = {
    simple: ['simple', 'basic', 'just', 'only', 'single'],
    moderate: ['multiple', 'several', 'integrate', 'connect', 'manage'],
    complex: ['advanced', 'sophisticated', 'machine learning', 'ai', 'complex', 'enterprise']
  };

  const request_lower = request.toLowerCase();
  
  for (const [level, indicators] of Object.entries(complexityIndicators)) {
    if (indicators.some(indicator => request_lower.includes(indicator))) {
      return level as 'simple' | 'moderate' | 'complex';
    }
  }

  // Default based on length and features mentioned
  const wordCount = request.split(/\s+/).length;
  if (wordCount < 10) return 'simple';
  if (wordCount < 25) return 'moderate';
  return 'complex';
}

function recommendIntegrations(request: string, appType: string): string[] {
  const integrations: string[] = [];
  const request_lower = request.toLowerCase();

  // Common integrations based on keywords
  if (request_lower.includes('email')) integrations.push('Email API');
  if (request_lower.includes('calendar')) integrations.push('Calendar API');
  if (request_lower.includes('slack')) integrations.push('Slack API');
  if (request_lower.includes('discord')) integrations.push('Discord API');
  if (request_lower.includes('twitter') || request_lower.includes('x.com')) integrations.push('Twitter API');
  if (request_lower.includes('facebook')) integrations.push('Facebook API');
  if (request_lower.includes('instagram')) integrations.push('Instagram API');
  if (request_lower.includes('notion')) integrations.push('Notion API');
  if (request_lower.includes('airtable')) integrations.push('Airtable API');
  if (request_lower.includes('google')) integrations.push('Google APIs');
  if (request_lower.includes('payment')) integrations.push('Stripe API');
  if (request_lower.includes('database')) integrations.push('PostgreSQL');

  // App-type specific integrations
  switch (appType) {
    case 'automation-agent':
      integrations.push('n8n Workflows', 'Zapier');
      break;
    case 'spatial-network-tool':
      integrations.push('Spatial Network API', 'OpenStreetMap');
      break;
    case 'react-app':
      integrations.push('Vercel Deployment', 'Database');
      break;
  }

  return [...new Set(integrations)]; // Remove duplicates
}

function generateReasoning(request: string, appType: string, confidence: number): string {
  const reasoningMap: Record<string, string> = {
    'chat-agent': 'This appears to be a conversational interface request focusing on user interaction and dialogue.',
    'automation-agent': 'This request involves automating processes, workflows, or repetitive tasks.',
    'react-app': 'This requires a visual interface and interactive features, best suited for a web application.',
    'spatial-network-tool': 'This aligns with sustainability, community, or environmental themes suited for the Spatial Network.',
    'conversational-model': 'This appears to need only an AI model without a specific user interface.'
  };

  const baseReasoning = reasoningMap[appType] || 'This request matches general application development patterns.';
  const confidenceText = confidence > 0.7 ? 'high confidence' : confidence > 0.4 ? 'moderate confidence' : 'low confidence';
  
  return `${baseReasoning} Analysis suggests ${appType} with ${confidenceText} based on keywords and context.`;
}

function generateRecommendations(analysis: any): string {
  const { appType, confidence, estimatedComplexity, coreCapabilities } = analysis;
  
  let recommendations = `Based on your request, I recommend building a **${appType}** with ${estimatedComplexity} complexity.\n\n`;
  
  recommendations += `**Key Features:**\n`;
  coreCapabilities.forEach((cap: string) => {
    recommendations += `- ${cap}\n`;
  });
  
  recommendations += `\n**Next Steps:**\n`;
  recommendations += `1. I'll create a custom AI model with specialized system prompts\n`;
  recommendations += `2. Generate the application code and structure\n`;
  recommendations += `3. Set up the necessary integrations\n`;
  recommendations += `4. Prepare for deployment\n`;
  
  if (confidence < 0.6) {
    recommendations += `\n*Note: I have moderate confidence in this classification. Feel free to clarify your requirements if this doesn't match your vision.*`;
  }

  return recommendations;
}