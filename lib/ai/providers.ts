import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// Jaguar API configuration - OpenWebUI instance
const jaguarProvider = createOpenAI({
  baseURL: `${process.env.JAGUAR_BASE_URL}/api`,
  apiKey: process.env.JAGUAR_API_KEY,
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        'jaguar-pro': chatModel,
        nature: chatModel,
        codewriter: chatModel,
      },
    })
  : customProvider({
      languageModels: {
        // Core Jaguar models
        'chat-model': jaguarProvider('jaguar'),
        'chat-model-reasoning': wrapLanguageModel({
          model: jaguarProvider('jaguar'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': jaguarProvider('jaguar'),
        'artifact-model': jaguarProvider('jaguar-pro'),

        // Extended Jaguar model suite
        'jaguar-pro': jaguarProvider('jaguar-pro'),
        nature: jaguarProvider('nature'),
        codewriter: jaguarProvider('codewriter:latest'),

        // External models available through OpenWebUI
        'openrouter/cypher-alpha:free': jaguarProvider(
          'openrouter/cypher-alpha:free',
        ),
        'anthropic/claude-sonnet-4': jaguarProvider(
          'anthropic/claude-sonnet-4',
        ),
        'anthropic/claude-opus-4': jaguarProvider('anthropic/claude-opus-4'),
      },
      // Future: Image models when Jaguar supports them
      // imageModels: {
      //   'jaguar-vision': jaguarProvider('jaguar-vision'),
      // },
    });

// Model capabilities and ethics mapping
export const modelCapabilities = {
  'chat-model': ['coding', 'workflows', 'mentoring'],
  'chat-model-reasoning': ['reasoning', 'analysis', 'problem-solving'],
  'jaguar-pro': ['advanced-coding', 'architecture', 'strategy'],
  nature: ['permaculture', 'ecology', 'sustainability'],
  codewriter: ['coding', 'architecture', 'optimization'],
} as const;

export const modelEthics = {
  'chat-model': 'Earth Care, People Care, Fair Share',
  'chat-model-reasoning': 'Earth Care, People Care, Fair Share',
  'jaguar-pro': 'Earth Care, People Care, Fair Share',
  nature: 'Ecocentric, Seven Generations Thinking',
  codewriter: 'Technical Excellence, Clean Code',
} as const;
