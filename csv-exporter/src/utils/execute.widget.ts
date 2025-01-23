import { gqlFetcher } from '../services/graphql';
import { Widget } from '../types/index.types';
import { logger } from './logger.utils';
import alasql from 'alasql';
import { Parser } from '@json2csv/plainjs';

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

export const executeWidgetsExport = async (widgets: Widget[]) => {
  const res = await Promise.allSettled(
    widgets.map((widget) => {
      if (widget.csvExportConfig?.url) {
        if (widget.csvExportConfig?.csv) {
          logger.info(`Sending CSV data for widget: ${widget.key}`);
          return sendCsv(widget);
        } else if (widget.csvExportConfig?.json) {
          logger.info(`Sending JSON data for widget: ${widget.key}`);
          return sendJson(widget);
        }
      }
      return Promise.reject({ error: 'No url provided', widget });
    })
  );
  return res.map((result) => {
    if (result.status === 'rejected') {
      return result.reason;
    }
    return result.value;
  });
};

const sendCsv = async (widget: Widget) => {
  const jsonData = await fecthJsonData(widget);
  const data = fetchSqlData(widget, jsonData);
  if (typeof data === 'object' && 'error' in data) {
    return { error: data.error, widget };
  }
  if (widget.csvExportConfig?.url) {
    return fetch(widget.csvExportConfig?.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/csv',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return { result: res, widget };
      })
      .catch((error) => {
        Promise.reject({ error: error?.message || error, widget });
      });
  }
  return Promise.reject({ error: 'No url provided', widget });
};

const sendJson = async (widget: Widget) => {
  const data = await fecthJsonData(widget);

  if (data.error) {
    Promise.reject({ error: data.error, widget });
  }
  if (widget.csvExportConfig?.url) {
    return fetch(widget.csvExportConfig?.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return { result: res, widget };
      })
      .catch((error) => {
        Promise.reject({ error: error?.message || error, widget });
      });
  }
  return Promise.reject({ error: 'No url provided', widget });
};

const fecthJsonData = async (
  widget: Widget
): Promise<Record<string, any> | { error: any }> => {
  try {
    logger.info('Fetching data for widget:' + widget.key);
    const promises = widget?.config?.datasources.map(async (datasource) => {
      return gqlFetcher({
        query: datasource?.obj?.value?.query,
        variables: datasource?.obj?.value?.variables,
      }).then((res) =>
        Object.keys(res?.data || {}).reduce(
          (acc: Record<string, { results: any[] }>, key) => {
            acc[key] = res?.data?.[key];
            return acc;
          },
          {}
        )
      );
    });
    const responses = await Promise.all(promises || []);

    return responses.reduce((acc, response) => {
      return { ...acc, ...response };
    }, {});
  } catch (error) {
    logger.error(`Error fetching data for widget: ${widget.key}`, error);
    return { error };
  }
};

const fetchSqlData = (widget: Widget, data: any): string | { error: any } => {
  try {
    if (!widget.config?.sqlQuery) {
      return { error: 'No sql query provided' };
    }
    // Initialize alasql tables
    Object.keys(data).forEach((name) => {
      const results = data[name].results;
      if (!name || !Array.isArray(results)) return;

      alasql(`DROP TABLE IF EXISTS ${name}`);
      alasql(`CREATE TABLE ${name}`);
      const flattenedResults = results.map((row) => flattenObject(row));
      alasql.tables[name].data = flattenedResults;
    });

    // Execute query
    const result: any = alasql(widget.config?.sqlQuery);
    const parser = new Parser({});
    return parser.parse(result);
  } catch (error) {
    logger.error(`Error fetching data for widget: ${widget.key}`, error);
    return { error };
  }
};
