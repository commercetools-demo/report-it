import { createApiRoot } from '../client/create.client';

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

export const gqlFetcher = async ({ query, variables }: any) => {
  let substitutedVariables;
  if (variables) {
    substitutedVariables = substituteParams(variables, DEFAULT_PARAMS);
  }
  const { body } = await createApiRoot()
    .graphql()
    .post({
      body: {
        query,
        ...(substitutedVariables && { variables: substitutedVariables }),
      },
    })
    .execute();
  return body;
};
