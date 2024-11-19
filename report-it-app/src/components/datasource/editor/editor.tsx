import 'graphiql/graphiql.css';
import './graphiql-overrides.css';
import { useCallback, useMemo } from 'react';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import type {
  TGraphQLTargets,
  ApplicationWindow,
} from '@commercetools-frontend/constants';
import createHttpUserAgent from '@commercetools/http-user-agent';
import explorerPlugin from './plugin-explorer';
import QueryContext from './query-context';

declare let window: ApplicationWindow;

type TEditorProps = {
  target: TGraphQLTargets;
  query: string;
  variables: string;
  onUpdateQuery: (query: string) => void;
  onUpdateVariables: (variables: string) => void;
};

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  libraryName: window.app.applicationName,
});

const graphqlFetcher = async (
  graphQLParams: FetcherParams,
  fetcherOpts?: FetcherOpts
) => {
  const data = await executeHttpClientRequest(
    async (options) => {
      const res = await fetch(buildApiUrl('/graphql'), {
        ...options,
        method: 'POST',
        body: JSON.stringify(graphQLParams),
      });
      const data = res.json();
      return {
        data,
        statusCode: res.status,
        getHeader: (key) => res.headers.get(key),
      };
    },
    {
      userAgent,
      headers: {
        'content-type': 'application/json',
        ...fetcherOpts?.headers,
      },
    }
  );
  return data;
};

const Editor = ({
  query,
  variables,
  target,
  onUpdateQuery,
  onUpdateVariables,
}: TEditorProps) => {
  const context = useMemo(() => ({ query, setQuery: onUpdateQuery }), [query]);
  const fetcher = useCallback(
    (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) =>
      graphqlFetcher(graphQLParams, {
        ...fetcherOpts,
        headers: {
          'X-GraphQL-Target': target,
        },
      }),
    [target]
  );

  return (
    <QueryContext.Provider value={context}>
      <GraphiQL
        fetcher={fetcher}
        query={query}
        onEditQuery={onUpdateQuery}
        onEditVariables={onUpdateVariables}
        variables={variables}
        plugins={[explorerPlugin]}
      />
    </QueryContext.Provider>
  );
};
Editor.displayName = 'Editor';

export default Editor;
