import { tool } from 'ai';
import { z } from 'zod';
import type { Session } from 'next-auth';
import type { DataStreamWriter } from 'ai';
import { generateUUID } from '@/lib/utils';
import { saveDocument } from '@/lib/db/queries';

interface CreateAppProps {
  session: Session;
  dataStream: DataStreamWriter;
}

const appTypes = [
  'chat-agent',
  'automation-agent', 
  'react-app',
  'spatial-network-tool',
  'conversational-model'
] as const;

export const createApp = ({ session, dataStream }: CreateAppProps) =>
  tool({
    description: 'Create a new agentic application based on user requirements. This master agent tool analyzes user intent and generates the appropriate app type with custom AI models and system prompts.',
    parameters: z.object({
      appName: z.string().describe('Name of the application to create'),
      appType: z.enum(appTypes).describe('Type of application: chat-agent (conversational AI), automation-agent (workflow automation), react-app (deployable web app), spatial-network-tool (specialized tools), conversational-model (AI model only)'),
      description: z.string().describe('Detailed description of what the app should do'),
      systemPrompt: z.string().describe('Custom system prompt for the AI model that will power this app'),
      capabilities: z.array(z.string()).describe('List of specific capabilities and features this app should have'),
      integrations: z.array(z.string()).optional().describe('External services or APIs this app needs to integrate with'),
      deploymentTarget: z.enum(['standalone', 'spatial-network', 'domain']).describe('Where this app will be deployed'),
    }),
    execute: async ({ 
      appName, 
      appType, 
      description, 
      systemPrompt, 
      capabilities, 
      integrations = [],
      deploymentTarget 
    }) => {
      const appId = generateUUID();

      dataStream.writeData({
        type: 'app-generation-start',
        content: `Creating ${appType}: ${appName}`,
      });

      // Generate the app configuration
      const appConfig = {
        id: appId,
        name: appName,
        type: appType,
        description,
        systemPrompt,
        capabilities,
        integrations,
        deploymentTarget,
        createdAt: new Date().toISOString(),
        aiModel: {
          id: `${appId}-model`,
          name: `${appName} AI Model`,
          systemPrompt,
          provider: 'jaguar',
          modelName: 'jaguar-pro',
        },
      };

      // Stream the generation process
      dataStream.writeData({
        type: 'app-config',
        content: JSON.stringify(appConfig, null, 2),
      });

      let generatedContent = '';

      // Generate app-specific content based on type
      switch (appType) {
        case 'chat-agent':
          generatedContent = await generateChatAgent(appConfig, dataStream);
          break;
        case 'automation-agent':
          generatedContent = await generateAutomationAgent(appConfig, dataStream);
          break;
        case 'react-app':
          generatedContent = await generateReactApp(appConfig, dataStream);
          break;
        case 'spatial-network-tool':
          generatedContent = await generateSpatialNetworkTool(appConfig, dataStream);
          break;
        case 'conversational-model':
          generatedContent = await generateConversationalModel(appConfig, dataStream);
          break;
      }

      // Save the generated app as a document
      if (session?.user?.id) {
        await saveDocument({
          id: appId,
          title: `${appName} (${appType})`,
          content: generatedContent,
          kind: 'code',
          userId: session.user.id,
        });
      }

      dataStream.writeData({
        type: 'app-generation-complete',
        content: `Successfully created ${appName}!`,
      });

      return {
        id: appId,
        name: appName,
        type: appType,
        content: `Successfully generated ${appType} application: ${appName}. The app includes a custom AI model with specialized system prompts and all necessary code/configuration.`,
      };
    },
  });

async function generateChatAgent(config: any, dataStream: DataStreamWriter): Promise<string> {
  dataStream.writeData({
    type: 'generation-step',
    content: 'Generating chat agent interface...',
  });

  return `// Chat Agent: ${config.name}
// Generated on: ${config.createdAt}

import React, { useState } from 'react';
import { useChat } from 'ai/react';

export default function ${config.name.replace(/\s+/g, '')}ChatAgent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/${config.id}',
    initialMessages: [{
      role: 'system',
      content: \`${config.systemPrompt}\`
    }]
  });

  return (
    <div className="chat-agent-container">
      <h1>${config.name}</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={\`message \${message.role}\`}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

// API Route: /api/chat/${config.id}/route.ts
import { streamText } from 'ai';
import { myProvider } from '@/lib/ai/providers';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: myProvider.languageModel('${config.aiModel.modelName}'),
    system: \`${config.systemPrompt}\`,
    messages,
  });

  return result.toAIStreamResponse();
}

// Configuration
export const agentConfig = ${JSON.stringify(config, null, 2)};
`;
}

async function generateAutomationAgent(config: any, dataStream: DataStreamWriter): Promise<string> {
  dataStream.writeData({
    type: 'generation-step',
    content: 'Generating automation agent workflow...',
  });

  return `// Automation Agent: ${config.name}
// Generated on: ${config.createdAt}

import { schedule } from 'node-cron';
import { myProvider } from '@/lib/ai/providers';

class ${config.name.replace(/\s+/g, '')}AutomationAgent {
  private aiModel: any;
  
  constructor() {
    this.aiModel = myProvider.languageModel('${config.aiModel.modelName}');
  }

  async executeTask(trigger: string, context: any) {
    const prompt = \`
System: ${config.systemPrompt}

Trigger: \${trigger}
Context: \${JSON.stringify(context)}

Execute the appropriate automation based on this trigger and context.
\`;

    const result = await this.aiModel.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt,
    });

    return result.text;
  }

  async processWorkflow(workflowData: any) {
    // Process automation workflow
    console.log('Processing workflow:', workflowData);
    
    const decision = await this.executeTask('workflow_process', workflowData);
    
    // Execute based on AI decision
    return this.executeAutomation(decision);
  }

  private async executeAutomation(decision: string) {
    // Implementation specific to automation type
    console.log('Executing automation:', decision);
    return { success: true, result: decision };
  }

  // Schedule periodic tasks
  startScheduledTasks() {
    schedule('0 */1 * * *', async () => {
      await this.executeTask('scheduled_check', { timestamp: Date.now() });
    });
  }
}

// Export the agent
export const automationAgent = new ${config.name.replace(/\s+/g, '')}AutomationAgent();

// Configuration
export const agentConfig = ${JSON.stringify(config, null, 2)};

// Capabilities: ${config.capabilities.join(', ')}
// Integrations: ${config.integrations.join(', ')}
`;
}

async function generateReactApp(config: any, dataStream: DataStreamWriter): Promise<string> {
  dataStream.writeData({
    type: 'generation-step',
    content: 'Generating React application structure...',
  });

  return `// React App: ${config.name}
// Generated on: ${config.createdAt}

import React, { useState, useEffect } from 'react';
import { myProvider } from '@/lib/ai/providers';

export default function ${config.name.replace(/\s+/g, '')}App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const handleAIInteraction = async (userInput: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userInput,
          systemPrompt: \`${config.systemPrompt}\`,
          appId: '${config.id}'
        })
      });
      
      const result = await response.json();
      setAiResponse(result.response);
    } catch (error) {
      console.error('AI interaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>${config.name}</h1>
        <p>${config.description}</p>
      </header>
      
      <main>
        <div className="ai-interface">
          <h2>AI-Powered Features</h2>
          <input 
            type="text" 
            placeholder="Interact with AI..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAIInteraction(e.target.value);
                e.target.value = '';
              }
            }}
          />
          {isLoading && <p>Processing...</p>}
          {aiResponse && (
            <div className="ai-response">
              <strong>AI Response:</strong> {aiResponse}
            </div>
          )}
        </div>

        <div className="app-features">
          <h3>Features</h3>
          <ul>
            ${config.capabilities.map((cap: string) => `<li>${cap}</li>`).join('\n            ')}
          </ul>
        </div>
      </main>
    </div>
  );
}

// API Route for AI interactions
export async function handleAIInteraction(input: string, systemPrompt: string) {
  const result = await myProvider.languageModel('${config.aiModel.modelName}').doGenerate({
    inputFormat: 'prompt',
    mode: { type: 'regular' },
    prompt: \`\${systemPrompt}\n\nUser: \${input}\`,
  });
  
  return result.text;
}

// Configuration
export const appConfig = ${JSON.stringify(config, null, 2)};

// Deployment target: ${config.deploymentTarget}
// Integrations: ${config.integrations.join(', ')}
`;
}

async function generateSpatialNetworkTool(config: any, dataStream: DataStreamWriter): Promise<string> {
  dataStream.writeData({
    type: 'generation-step',
    content: 'Generating Spatial Network tool integration...',
  });

  return `// Spatial Network Tool: ${config.name}
// Generated on: ${config.createdAt}

import { myProvider } from '@/lib/ai/providers';

class ${config.name.replace(/\s+/g, '')}SpatialTool {
  private aiModel: any;
  
  constructor() {
    this.aiModel = myProvider.languageModel('${config.aiModel.modelName}');
  }

  async processRequest(spatialContext: any, userRequest: string) {
    const prompt = \`
${config.systemPrompt}

Spatial Context: \${JSON.stringify(spatialContext)}
User Request: \${userRequest}

Provide specialized assistance for this spatial network request.
\`;

    const result = await this.aiModel.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt,
    });

    return {
      response: result.text,
      spatialData: this.extractSpatialData(result.text),
      recommendations: this.generateRecommendations(spatialContext, result.text)
    };
  }

  private extractSpatialData(response: string) {
    // Extract spatial-relevant data from AI response
    return {
      coordinates: null, // Parse coordinates if mentioned
      areas: [], // Parse area references
      projects: [] // Parse project references
    };
  }

  private generateRecommendations(context: any, aiResponse: string) {
    // Generate spatial network specific recommendations
    return [
      'Consider local environmental impact',
      'Check community alignment',
      'Verify sustainable practices'
    ];
  }

  // Integration with Spatial Network APIs
  async integrateWithSpatialNetwork(data: any) {
    // This would integrate with The Spatial Network backend
    console.log('Integrating with Spatial Network:', data);
    
    return {
      success: true,
      spatialNetworkId: 'generated-id',
      deployment: 'https://thespatialnetwork.net/tools/${config.id}'
    };
  }
}

// Export the tool
export const spatialTool = new ${config.name.replace(/\s+/g, '')}SpatialTool();

// Configuration for Spatial Network deployment
export const spatialConfig = {
  ...${JSON.stringify(config, null, 2)},
  spatialNetwork: {
    category: 'ai-tool',
    permissions: ['read-projects', 'create-recommendations'],
    integrationEndpoint: '/api/spatial/${config.id}'
  }
};
`;
}

async function generateConversationalModel(config: any, dataStream: DataStreamWriter): Promise<string> {
  dataStream.writeData({
    type: 'generation-step',
    content: 'Generating conversational AI model configuration...',
  });

  return `// Conversational Model: ${config.name}
// Generated on: ${config.createdAt}

import { myProvider } from '@/lib/ai/providers';

export class ${config.name.replace(/\s+/g, '')}ConversationalModel {
  private modelConfig: any;
  
  constructor() {
    this.modelConfig = {
      name: '${config.name}',
      systemPrompt: \`${config.systemPrompt}\`,
      modelProvider: '${config.aiModel.provider}',
      baseModel: '${config.aiModel.modelName}',
      capabilities: ${JSON.stringify(config.capabilities)},
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9
    };
  }

  async generateResponse(messages: any[], context?: any) {
    const systemMessage = {
      role: 'system',
      content: this.modelConfig.systemPrompt + (context ? \`\n\nContext: \${JSON.stringify(context)}\` : '')
    };

    const result = await myProvider.languageModel(this.modelConfig.baseModel).doGenerate({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: [systemMessage, ...messages],
      temperature: this.modelConfig.temperature,
      maxTokens: this.modelConfig.maxTokens,
      topP: this.modelConfig.topP,
    });

    return {
      response: result.text,
      usage: result.usage,
      model: this.modelConfig.name
    };
  }

  async streamResponse(messages: any[], onToken: (token: string) => void) {
    const systemMessage = {
      role: 'system',
      content: this.modelConfig.systemPrompt
    };

    // Implement streaming response
    const stream = await myProvider.languageModel(this.modelConfig.baseModel).doStream({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: [systemMessage, ...messages],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'text-delta') {
        onToken(chunk.textDelta);
      }
    }
  }

  getModelInfo() {
    return {
      id: '${config.id}',
      name: this.modelConfig.name,
      description: '${config.description}',
      capabilities: this.modelConfig.capabilities,
      systemPrompt: this.modelConfig.systemPrompt,
      apiEndpoint: \`/api/models/\${this.modelConfig.name}\`
    };
  }
}

// Export instance
export const conversationalModel = new ${config.name.replace(/\s+/g, '')}ConversationalModel();

// API endpoint for model access
export async function POST(req: Request) {
  const { messages, context } = await req.json();
  
  const response = await conversationalModel.generateResponse(messages, context);
  
  return Response.json(response);
}

// Model Configuration
export const modelConfig = ${JSON.stringify(config, null, 2)};
`;
}