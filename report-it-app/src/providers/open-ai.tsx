import { Context, createContext, useContext, useMemo, useState } from 'react';
import { useConfiguration } from '../hooks/configuration';

interface ContextShape {
  isConfigured: boolean;
  apiKey?: string;
  maxTokens?: number;
  graphQLConversationId?: string;
  alaSqlonversationId?: string;
  setBasicInfo: (apiKey: string, maxToken: number) => void;
  initializeConversations: () => Promise<void>;
}

const OpenAIConfigurationContext: Context<ContextShape> =
  createContext<ContextShape>({
    isConfigured: false,
    apiKey: undefined,
    maxTokens: undefined,
    graphQLConversationId: undefined,
    alaSqlonversationId: undefined,
    setBasicInfo: () => {},
    initializeConversations: () => Promise.resolve(),
  });

export const OpenAIConfigurationProvider = ({
  children,
}: React.PropsWithChildren<{ key?: string }>) => {
  const {
    setLocalStorageApiKey,
    setlocalStorageMaxTokens,
    initializeConversations,
    getLocalStorageConversationIds,
    setLocalStorgeConversationIds,
    getLocalStorageApiKey,
    getLocalStorageMaxTokens,
  } = useConfiguration();
  const [apiKey, setApiKey] = useState<string>(getLocalStorageApiKey());
  const [maxTokens, setMaxTokens] = useState<number>(
    getLocalStorageMaxTokens()
  );
  const [graphQLConversationId, setGraphQLConversationId] = useState<string>(
    getLocalStorageConversationIds().graphQLConversationId
  );
  const [alaSqlonversationId, setAlaSqlonversationId] = useState<string>(
    getLocalStorageConversationIds().alaSqlonversationId
  );

  const handleSetApiKey = (apiKey: string) => {
    setApiKey(apiKey);
    setLocalStorageApiKey(apiKey);
  };
  const handleSetMaxToken = (maxToken: number) => {
    setMaxTokens(maxToken);
    setlocalStorageMaxTokens(maxToken);
  };

  const handleSetBasicInfo = (apiKey: string, maxToken: number) => {
    handleSetApiKey(apiKey);
    handleSetMaxToken(maxToken);
  };

  const handleInitializeConversations = async () => {
    const { alaSqlonversationId, graphQLConversationId } =
      await initializeConversations();
    setGraphQLConversationId(graphQLConversationId);
    setAlaSqlonversationId(alaSqlonversationId);
    setLocalStorgeConversationIds(graphQLConversationId, alaSqlonversationId);
  };

  const configuration = useMemo(() => {
    return {
      isConfigured:
        !!apiKey && !!graphQLConversationId && !!alaSqlonversationId,
      apiKey,
      maxTokens,
      graphQLConversationId,
      alaSqlonversationId,
    };
  }, [apiKey, maxTokens, graphQLConversationId, alaSqlonversationId]);

  return (
    <OpenAIConfigurationContext.Provider
      value={{
        ...configuration,
        setBasicInfo: handleSetBasicInfo,
        initializeConversations: handleInitializeConversations,
      }}
    >
      {children}
    </OpenAIConfigurationContext.Provider>
  );
};

export const useOpenAiConfigurationContext = () =>
  useContext(OpenAIConfigurationContext);
