import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDatasource } from '../hooks/use-datasource';
import { useGraphQlFetcher } from '../hooks/use-graph-ql-fetcher';
import alasql from 'alasql';
import { useQueryUtils } from '../hooks/use-query-utils';
import { ChartFieldItem } from '../types/widget';

export interface ContextShape {
  datasources: Record<string, { results: any[] }>;
  tables: Record<string, any> | undefined;
  queryResult: any[] | null;
  error: string | null;
  fetcher: (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => any;
  executeQuery: (query: string) => any;
  getChartData: (sqlQuery: string, chartFields?: ChartFieldItem[]) => any;
}

const initialState = {
  datasources: {} as {},
  fetcher: () => {},
  queryResult: null,
  error: null,
  tables: undefined,
  executeQuery: () => {},
  getChartData: () => {},
} as ContextShape;

export const WidgetDatasourceResponseContext = createContext(initialState);

const WidgetDatasourceResponseProvider = ({
  children,
  availableDatasourceKeys,
  widgetKey: widgetKeyProp,
}: React.PropsWithChildren<{
  availableDatasourceKeys?: string[];
  widgetKey?: string;
}>) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getDatasources } = useDatasource();
  const { fetcher } = useGraphQlFetcher();
  const { flattenObject, getSchema } = useQueryUtils();
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [error, setError] = useState(null);

  const [datasources, setDatasources] = useState<
    Record<string, { results: any[] }>
  >({});

  const widgetKey = widgetKeyProp?.split('--')[1];

  const processArrayData = (
    data: any[],
    parentTableName: string,
    parentForeignKey: any = null
  ) => {
    const schema = getSchema(data);

    schema.forEach((schemaItem) => {
      if (schemaItem.type === 'array') {
        const tableName = `${parentTableName}_${schemaItem.column}`;

        const relatedData = data.reduce((acc, row) => {
          const arrayItems = row[schemaItem.column].map((item: any) => ({
            ...item,
            fk:
              typeof parentForeignKey === 'string' ? parentForeignKey : row.id,
          }));

          // Recursively process nested arrays
          arrayItems.forEach((item: any) => {
            Object.entries(item).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                processArrayData(
                  [item],
                  `${tableName}`,
                  item.id || parentForeignKey || row.id
                );
              }
            });
          });

          return acc.concat(arrayItems);
        }, []);

        // Create table if it doesn't exist
        if (!alasql.tables[tableName]) {
          alasql(`CREATE TABLE ${tableName}`);
          alasql.tables[tableName].data = [];
        }

        alasql.tables[tableName].data.push(...relatedData);
      }
    });
  };

  const createTables = useCallback(
    (dts: Record<string, { results: any[] }>) => {
      if (!widgetKey || !dts) return;

      if (!Object.keys(alasql.databases[widgetKey]).length) {
        return;
      }

      alasql(`USE ${widgetKey}`);

      Object.keys(dts).forEach((name) => {
        const results = dts[name].results;
        if (!name || !Array.isArray(results)) return;

        alasql(`DROP TABLE IF EXISTS ${name}`);
        alasql(`CREATE TABLE ${name}`);
        const flattenedResults = results.map((row) => flattenObject(row));
        alasql.tables[name].data = flattenedResults;
      });

      // Track created tables to avoid redundant drops
      const createdTables = new Set();

      Object.keys(dts).forEach((datasourceName) => {
        const firstRow = dts[datasourceName].results[0];
        const columns = Object.keys(firstRow);
        const tables = new Set();

        columns.forEach((column) => {
          if (Array.isArray(firstRow[column])) {
            tables.add(`${datasourceName}_${column}`);
          }
        });

        tables.forEach((tableName) => {
          if (!createdTables.has(tableName)) {
            alasql(`DROP TABLE IF EXISTS ${tableName}`);
            alasql(`CREATE TABLE ${tableName}`);
            createdTables.add(tableName);
          }
        });

        processArrayData(dts[datasourceName].results, datasourceName);
      });
    },
    [widgetKey]
  );

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
    const dts = responses.reduce((acc, response) => {
      return { ...acc, ...response };
    }, {});
    setDatasources(dts);
    createTables(dts);

    setIsLoading(false);
  };

  const executeQuery = useCallback(
    (query: string) => {
      try {
        if (!query.trim() || !widgetKey || isLoading) {
          setQueryResult(null);
          setError(null);
          return;
        }
        alasql(`USE ${widgetKey}`);

        // Execute query
        const result = alasql(query);

        setQueryResult(result);
        setError(null);
        return result;
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setQueryResult(null);
        return null;
      }
    },
    [widgetKey, isLoading]
  );

  const getChartData = useCallback(
    (sqlQuery: string, chartFields?: ChartFieldItem[]) => {
      const headers: string[] = [];
      const chartData = [];

      if (!widgetKey || isLoading || !sqlQuery) {
        return {
          headers: [],
          chartData: [],
        };
      }

      const result = executeQuery(sqlQuery!);

      const flattenedFirstRow = flattenObject(result[0]);

      headers.push(...Object.keys(flattenedFirstRow));
      chartData.push(chartFields?.filter((field) => field.enabled));

      result.forEach((item: any) => {
        const flatRow = flattenObject(item);
        chartData.push(
          chartFields
            ?.filter((field) => field.enabled)
            .map((header) => flatRow[header.key || header])
        );
      });

      return {
        headers,
        chartData,
      };
    },
    [isLoading, widgetKey]
  );

  useEffect(() => {
    if (widgetKey) {
      try {
        alasql(`CREATE DATABASE ${widgetKey}`);
      } catch (error) {
        console.error('Error creating database', error);
      }
    }
  }, [widgetKey]);

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
        tables: alasql.tables,
        queryResult,
        error,
        executeQuery,
        getChartData,
      }}
    >
      {children}
    </WidgetDatasourceResponseContext.Provider>
  );
};
export default WidgetDatasourceResponseProvider;
export const useWidgetDatasourceResponseContext = () =>
  useContext(WidgetDatasourceResponseContext);
