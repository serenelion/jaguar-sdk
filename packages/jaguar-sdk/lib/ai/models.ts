export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
  ethics?: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Jaguar (lite)',
    description:
      'AI developer agent for The Spatial Network with masterclass wisdom',
    capabilities: ['coding', 'workflows', 'mentoring'],
    ethics: 'Earth Care, People Care, Fair Share',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Jaguar (reasoning)',
    description: 'Enhanced reasoning capabilities with step-by-step thinking',
    capabilities: ['reasoning', 'analysis', 'problem-solving'],
    ethics: 'Earth Care, People Care, Fair Share',
  },
  {
    id: 'jaguar-pro',
    name: 'Jaguar (pro)',
    description:
      'Advanced AI agent with enhanced capabilities and deeper wisdom',
    capabilities: ['advanced-coding', 'architecture', 'strategy'],
    ethics: 'Earth Care, People Care, Fair Share',
  },
  {
    id: 'nature',
    name: 'Nature',
    description:
      'GaiaGuard - AI dedicated to ecological regeneration and natural capital monitoring',
    capabilities: ['permaculture', 'ecology', 'sustainability'],
    ethics: 'Ecocentric, Seven Generations Thinking',
  },
  {
    id: 'codewriter',
    name: 'CodeWriter',
    description:
      'Senior full-stack developer focused on efficient, optimal code',
    capabilities: ['coding', 'architecture', 'optimization'],
    ethics: 'Technical Excellence, Clean Code',
  },
];

// Available external models from OpenWebUI
export const externalModels: Array<ChatModel> = [
  {
    id: 'openrouter/cypher-alpha:free',
    name: 'Cypher Alpha (free)',
    description: 'All-purpose model supporting real-world, long-context tasks',
    capabilities: ['general', 'coding', 'analysis'],
  },
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    description: 'Advanced reasoning and analysis capabilities',
    capabilities: ['reasoning', 'analysis', 'writing'],
  },
  {
    id: 'anthropic/claude-opus-4',
    name: 'Claude Opus 4',
    description: 'Most capable model for complex tasks',
    capabilities: ['complex-reasoning', 'research', 'analysis'],
  },
];

// All available models combined
export const allModels: Array<ChatModel> = [...chatModels, ...externalModels];
