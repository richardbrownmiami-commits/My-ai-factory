import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class PuterProvider extends BaseProvider {
  name = 'Puter';
  getApiKeyLink = 'https://puter.com';

  config = {
    apiTokenKey: '',
  };

  staticModels: ModelInfo[] = [
    { name: 'gpt-4o', label: 'GPT-4o (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'gpt-4o-mini', label: 'GPT-4o Mini (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'deepseek-chat', label: 'DeepSeek Chat (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
    { name: 'mistral-large-latest', label: 'Mistral Large (via Puter)', provider: 'Puter', maxTokenAllowed: 8000 },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const openai = createOpenAI({
      baseURL: '/api/puter-proxy',
      apiKey: 'puter-free',
    });
    return openai(options.model);
  }
}
