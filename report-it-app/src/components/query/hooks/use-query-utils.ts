import alasql from 'alasql';
import get from 'lodash.get';
import { useState } from 'react';
import { useWidgetDatasourceResponseContext } from '../../widget-form/widget-datasource-response-provider';
import { ChartFieldItem } from '../../../types/widget';

export const useQueryUtils = () => {
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [error, setError] = useState(null);
  const { datasources } = useWidgetDatasourceResponseContext();

  /**
   * Flatten an object to a single level by concatenating nested keys.
   *
   * @param {Object} obj - The object to flatten
   * @param {string} [prefix=''] - A prefix to add to each key
   * @returns {Object} The flattened object
   *
   * @example
   * flattenObject({ a: { b: 1 } })
   * // => { a_b: 1 }
   */
  const flattenObject = (
    obj: Record<string, any>,
    prefix = ''
  ): Record<string, any> => {
    if (!obj || typeof obj !== 'object') return {};

    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...acc, ...flattenObject(value, `${prefix}${key}_`) };
      }
      return { ...acc, [`${prefix}${key}`]: value };
    }, {});
  };

  /**
   * Generate the schema of a dataset by examining the first row.
   *
   * @param {Array<any>} data - The dataset to analyze, expected to be an array of objects.
   * @returns {Array<{ column: string, type: string }>} An array of schema objects, each with a 'column' and 'type'.
   *
   * @example
   * getSchema([{ a: 1, b: 'text' }])
   * // => [{ column: 'a', type: 'number' }, { column: 'b', type: 'string' }]
   */
  const getSchema = (data: any) => {
    if (!Array.isArray(data) || !data.length) return [];
    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== 'object') return [];

    return Object.keys(flattenObject(firstRow)).map((key) => ({
      column: key,
      type: typeof get(firstRow, key),
      id: key,
    }));
  };

  const executeQuery = (query: string) => {
    try {
      if (!query.trim()) {
        setQueryResult(null);
        setError(null);
        return;
      }

      // Initialize alasql tables
      Object.keys(datasources).forEach((name) => {
        const results = datasources[name].results;
        if (!name || !Array.isArray(results)) return;

        alasql(`DROP TABLE IF EXISTS ${name}`);
        alasql(`CREATE TABLE ${name}`);
        const flattenedResults = results.map((row) => flattenObject(row));
        alasql.tables[name].data = flattenedResults;
      });

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
  };

  const getChartData = (sqlQuery: string, chartFields?: ChartFieldItem[]) => {
    const headers: string[] = [];
    const chartData = [];

    if (Object.keys(datasources)?.length && sqlQuery) {
      const result = executeQuery(sqlQuery!);
      const flattenedFirstRow = flattenObject(result[0]);

      console.log('chartFields', chartFields);

      headers.push(...Object.keys(flattenedFirstRow));
      console.log('headers', headers);

      chartData.push(chartFields?.filter((field) => field.enabled));

      result.forEach((item: any) => {
        const flatRow = flattenObject(item);
        chartData.push(
          chartFields
            ?.filter((field) => field.enabled)
            .map((header) => flatRow[header.key || header])
        );
      });
    }

    return {
      headers,
      chartData,
    };
  };
  return {
    flattenObject,
    getSchema,
    executeQuery,
    getChartData,
    queryResult,
    error,
  };
};
