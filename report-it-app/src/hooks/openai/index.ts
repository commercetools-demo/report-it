import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import OpenAI from 'openai';
import { useQueryUtils } from '../use-query-utils';
import { useOpenAiConfigurationContext } from '../../providers/open-ai';
import { useWidgetDatasourceResponseContext } from '../../providers/widget-datasource-response-provider';

export const useOpenAI = () => {
  const { apiKey, alaSqlonversationId, graphQLConversationId } =
    useOpenAiConfigurationContext();
  const showNotification = useShowNotification();
  const { tables: sqlTables } = useWidgetDatasourceResponseContext();

  const { getSchema } = useQueryUtils();

  const getGraphQLQueries = async (seed: string): Promise<string> => {
    if (!apiKey || !graphQLConversationId) {
      return '';
    }
    const result: string[] = [];
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey,
    });
    try {
      const assistant = await openai.beta.assistants.retrieve(
        graphQLConversationId
      );
      const thread = await openai.beta.threads.create();

      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: seed,
      });

      let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
      });

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        messages.data.reverse().forEach((message, i) => {
          if (i !== 0) {
            result.push(message.content[0].text.value);
          }
        });
      } else {
        throw new Error('Query generation failed');
      }
      return result[0];
    } catch (error) {
      showNotification({
        kind: NOTIFICATION_KINDS_SIDE.error,
        domain: DOMAINS.SIDE,
        text: (error as Error).message,
      });
      return '';
    }
  };

  const getAlaSQLQueries = async (queries: string): Promise<string> => {
    if (!apiKey || !alaSqlonversationId || !sqlTables) {
      return '';
    }
    const result: string[] = [];
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey,
    });
    try {
      const assistant = await openai.beta.assistants.retrieve(
        alaSqlonversationId
      );
      const thread = await openai.beta.threads.create();

      const tables = Object.keys(sqlTables).join(', ');
      const schemas = Object.keys(sqlTables).map((tableName) => ({
        tableName: name,
        schema: getSchema(sqlTables[tableName]?.data),
      }));

      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content:
          'create a query to ' +
          queries +
          ' using this json tables:' +
          tables +
          '\n\n schemas:' +
          JSON.stringify(schemas) +
          '\n\n',
      });

      let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
      });

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        messages.data.reverse().forEach((message, i) => {
          if (i !== 0) {
            result.push(message.content[0].text.value);
          }
        });
      } else {
        throw new Error('Query generation failed');
      }
      return result?.[0];
    } catch (error) {
      showNotification({
        kind: NOTIFICATION_KINDS_SIDE.error,
        domain: DOMAINS.SIDE,
        text: (error as Error).message,
      });
      return '';
    }
  };

  return {
    getGraphQLQueries,
    getAlaSQLQueries,
  };
};
