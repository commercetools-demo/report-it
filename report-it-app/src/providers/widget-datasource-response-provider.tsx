import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDatasource } from '../hooks/use-datasource';
import { useGraphQlFetcher } from '../hooks/use-graph-ql-fetcher';

export interface ContextShape {
  datasources: Record<string, { results: any[] }>;
  fetcher: (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => any;
}

const initialState = {
  datasources: {} as {},
  fetcher: () => {},
} as ContextShape;

export const WidgetDatasourceResponseContext = createContext(initialState);

const WidgetDatasourceResponseProvider = ({
  children,
  availableDatasourceKeys,
}: React.PropsWithChildren<{ availableDatasourceKeys?: string[] }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getDatasources } = useDatasource();
  const { fetcher } = useGraphQlFetcher();

  const [datasources, setDatasources] = useState<
    Record<string, { results: any[] }>
  >({});

  const fetchAndSetDatasources = async () => {
    setIsLoading(true);
    const fetchedDatasources = await getDatasources(availableDatasourceKeys);

    const responses = await Promise.all(
      fetchedDatasources.map((availableDatasource) => {
        return fetcher({
          query: availableDatasource.value?.query || '',
          variables: availableDatasource.value?.variables || '',
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
