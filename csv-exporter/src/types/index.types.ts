import { CustomObject } from '@commercetools/platform-sdk';

export type QueryParam =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | undefined;

export type QueryArgs = {
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  localeProjection?: string;
  storeProjection?: string;
  expand?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  where?: string | string[];
  [key: string]: QueryParam;
};

export type GetFunction<ResponseType> = (
  queryArgs: QueryArgs
) => Promise<ResponseType>;

export type GetAllFunction<ResponseType> = (
  getFunction: GetFunction<ResponseType>
) => GetFunction<ResponseType>;

type SDKErrorItem = {
  code: string;
  message: string;
};

export type SDKError = {
  code: number;
  statusCode: number;
  status: number;
  message: string;
  originalRequest: {
    baseUri: string;
    method: string;
    uriTemplate: string;
    pathVariables: { projectKey: string };
    queryParams: QueryArgs;
    uri: string;
  };
  retryCount: number;
  body: { statusCode: number; message: string; errors: SDKErrorItem[] };
  name: string;
};

export type Message = {
  code: string;
  message: string;
  referencedBy: string;
};

export type ValidatorCreator = (
  path: string[],
  message: Message,
  overrideConfig?: object
) => [string[], [[(o: object) => boolean, string, [object]]]];

export type ValidatorFunction = (o: object) => boolean;

export type Wrapper = (
  validator: ValidatorFunction
) => (value: object) => boolean;

export type DatasourceRef = {
  key: string;
  typeId: 'custom-object';
  obj?: {
    value: {
      id: string;
      name: string;
      query: string;
      variables: string;
    };
  };
};

export interface Widget {
  key: string;
  name: string;
  config?: {
    [key: string]: any;
    sqlQuery: string;
    datasources: DatasourceRef[];
  };
  csvExportConfig?: {
    enabled: boolean;
    url?: string;
    schedule?: string;
    json?: boolean;
    csv?: boolean;
    history?: {
      text: string;
      date: string;
    }[];
  };
}
