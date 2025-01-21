import createHttpUserAgent from '@commercetools/http-user-agent';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import { useCallback } from 'react';
import { ApplicationWindow } from '@commercetools-frontend/constants';

const DEFAULT_PARAMS = {
  createdLastWeek: `createdAt <= "${new Date().toISOString()}" and createdAt >= "${new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()}"`,
  createdLastMonth: `createdAt <= "${new Date().toISOString()}"and createdAt >= "${new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString()}"`,
  createdLastYear: `createdAt <= "${new Date().toISOString()}" and createdAt >= "${new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString()}"`,
};

declare let window: ApplicationWindow;

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  libraryName: window.app.applicationName,
});

const substituteParams = (
  variables: Record<string, any>,
  params: Record<string, any>
) => {
  const substituteValue = (value: any): any => {
    if (typeof value === 'string') {
      const match = value.match(/:(\w+)/);
      if (value.startsWith(':') && match?.[1] && params[match[1]]) {
        return params[match[1]] || value;
      }
    } else if (Array.isArray(value)) {
      return value.map(substituteValue);
    } else if (typeof value === 'object' && value !== null) {
      return substituteParams(value, params);
    }
    return value;
  };

  return Object.entries(variables).reduce(
    (acc: Record<string, any>, [key, value]) => {
      acc[key] = substituteValue(value);
      return acc;
    },
    {}
  );
};

export const useGraphQlFetcher = () => {
  const graphqlFetcher = async (
    graphQLParams: FetcherParams,
    fetcherOpts?: FetcherOpts
  ) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const { query, variables } = graphQLParams;

        let substitutedVariables;
        if (variables) {
          substitutedVariables = substituteParams(variables, DEFAULT_PARAMS);
        }

        const res = await fetch(buildApiUrl('/graphql'), {
          ...options,
          method: 'POST',
          body: JSON.stringify({
            query,
            ...(substitutedVariables
              ? { variables: substitutedVariables }
              : {}),
          }),
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
    ).catch((error) => {
      return { data: {} };
    });
    return data;
  };

  const fetcher = useCallback(
    (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) =>
      graphqlFetcher(graphQLParams, {
        ...fetcherOpts,
        headers: {
          'X-GraphQL-Target': 'ctp',
        },
      }),
    []
  );

  return {
    fetcher,
  };
};
