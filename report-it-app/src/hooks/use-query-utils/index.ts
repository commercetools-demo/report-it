import get from 'lodash.get';

export const useQueryUtils = () => {
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

    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        acc[key] = value.map((item: any) =>
          typeof item === 'object'
            ? { id: obj.id, ...flattenObject(item, '') }
            : { id: obj.id, value: item }
        );
      } else if (value && typeof value === 'object') {
        Object.assign(acc, flattenObject(value, `${prefix}${key}_`));
      } else {
        acc[`${prefix}${key}`] = value;
      }
      return acc;
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
    const firstRowFlattened = flattenObject(firstRow);

    return Object.keys(firstRowFlattened).map((key) => {
      const rowValue = get(firstRowFlattened, key);
      return {
        column: key,
        type: Array.isArray(rowValue) ? 'array' : typeof rowValue,
        id: key,
      };
    });
  };

  return {
    flattenObject,
    getSchema,
  };
};
