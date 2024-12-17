import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDatasource } from '../../hooks/use-datasource';

export interface ContextShape {
  datasources: Record<string, { results: any[] }>;
  fetcher: (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => any;
}

const initialState = {
  datasources: {} as {},
  fetcher: () => {},
} as ContextShape;

export const WidgetDatasourceResponseContext = createContext(initialState);

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
      return value.replace(/:(\w+)/g, (match, key) => {
        return params[key] || match;
      });
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
  ).catch((error) => {
    return { data: {} };
  });
  return data;
};

const WidgetDatasourceResponseProvider = ({
  children,
  availableDatasourceKeys,
}: React.PropsWithChildren<{ availableDatasourceKeys?: string[] }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getDatasources } = useDatasource();

  const [datasources, setDatasources] = useState<
    Record<string, { results: any[] }>
  >({});

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

  const fetchAndSetDatasources = async () => {
    setIsLoading(true);
    const fetchedDatasources = await getDatasources(availableDatasourceKeys);

    const responses = await Promise.all(
      fetchedDatasources.map((availableDatasource) => {
        return fetcher({
          query: availableDatasource.value?.query || '',
        }).then((data) =>
          Object.keys(data?.data || {}).reduce(
            (acc: Record<string, { results: any[] }>, key) => {
              acc[key] = data?.data?.[key];
              return acc;
            },
            {}
          )
        );
      })
    );
    setDatasources(
      responses.reduce((acc, response) => {
        return { ...acc, ...response };
      }, {})
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (!availableDatasourceKeys?.length) {
      setIsLoading(false);

      return;
    }

    fetchAndSetDatasources();
  }, [availableDatasourceKeys]);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    ); // Or any loading indicator
  }
  return (
    <WidgetDatasourceResponseContext.Provider
      value={{
        datasources,
        fetcher,
      }}
    >
      {children}
    </WidgetDatasourceResponseContext.Provider>
  );
};
export default WidgetDatasourceResponseProvider;
export const useWidgetDatasourceResponseContext = () =>
  useContext(WidgetDatasourceResponseContext);
