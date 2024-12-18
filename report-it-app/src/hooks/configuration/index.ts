import OpenAI from 'openai';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { alaSqlAssistant, graphQLInstructions } from './assistant';
import schemaFileContent from '../../../static/schema.sdl';

const apiKeyKey = '__apiKey';
const maxTokensKey = '__maxTokens';
const graphQLConversationKey = '__graphQLConversationId';
const alaSqlonversationKey = '__alaSqlonversationId';

export const useConfiguration = () => {
  const showNotification = useShowNotification();
  const getLocalStorageApiKey = (): string => {
    const apiKey = localStorage.getItem(apiKeyKey);
    return apiKey ?? '';
  };
  const getLocalStorageConversationIds = () => {
    const graphQLConversationId =
      localStorage.getItem(graphQLConversationKey) || '';
    const alaSqlonversationId =
      localStorage.getItem(alaSqlonversationKey) || '';
    return {
      graphQLConversationId,
      alaSqlonversationId,
    };
  };
  const getLocalStorageMaxTokens = () => {
    const maxTokens = localStorage.getItem(maxTokensKey);
    return parseInt(maxTokens || '100', 10);
  };

  const setlocalStorageMaxTokens = (maxTokens: number) => {
    localStorage.setItem(maxTokensKey, maxTokens.toString());
  };

  const initializeAlaSqlConversation = async () => {
    const apiKey = getLocalStorageApiKey();

    if (!apiKey) {
      showNotification({
        domain: NOTIFICATION_DOMAINS.PAGE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: 'API key is not set',
      });
      throw new Error('API key is not set');
    }
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey,
    });
    const assistant = await openai.beta.assistants.create({
      name: 'AlaSql Assistant',
      instructions: alaSqlAssistant,
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4o',
    });

    return assistant.id;
  };

  const initializeGraphQLConversation = async (): Promise<string> => {
    const apiKey = getLocalStorageApiKey();

    if (!apiKey) {
      showNotification({
        domain: NOTIFICATION_DOMAINS.PAGE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: 'API key is not set',
      });
      throw new Error('API key is not set');
    }
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey,
    });
    const assistant = await openai.beta.assistants.create({
      name: 'GraphQL Assistant',
      instructions: graphQLInstructions,
      tools: [{ type: 'code_interpreter' }, { type: 'file_search' }],
      model: 'gpt-4o',
    });

    const response = await fetch(schemaFileContent);
    const schema = await response.text();
    // convert to FsReadStream
    const schemaBlob = new Blob([schema], { type: 'text/plain' });
    const schemaStream = new File([schemaBlob], 'schema.txt', {
      type: 'text/plain',
    });

    let vectorStore = await openai.beta.vectorStores.create({
      name: 'commercetools graphql schema',
    });

    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
      files: [schemaStream],
    });
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });
    return assistant.id;
  };

  const setLocalStorgeConversationIds = (
    graphQLConversationId: string,
    alaSqlonversationId: string
  ) => {
    localStorage.setItem(graphQLConversationKey, graphQLConversationId);
    localStorage.setItem(alaSqlonversationKey, alaSqlonversationId);
  };

  const initializeConversations = async () => {
    const [graphQLConversationId, alaSqlonversationId] = await Promise.all([
      initializeGraphQLConversation(),
      initializeAlaSqlConversation(),
    ]);
    return {
      graphQLConversationId,
      alaSqlonversationId,
    };
  };

  const setLocalStorageApiKey = (apiKey: string) => {
    localStorage.setItem(apiKeyKey, apiKey);
  };

  return {
    getLocalStorageApiKey,
    setLocalStorageApiKey,
    setlocalStorageMaxTokens,
    getLocalStorageMaxTokens,
    setLocalStorgeConversationIds,
    getLocalStorageConversationIds,
    initializeConversations,
  };
};
