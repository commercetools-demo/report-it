import { createApiRoot } from '../client/create.client';

export const gqlFetcher = async ({ query, variables }: any) => {
  const { body } = await createApiRoot()
    .graphql()
    .post({
      body: {
        query,
        ...(variables && { variables }),
      },
    })
    .execute();
  return body;
};
