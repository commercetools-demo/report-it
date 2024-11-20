
export type Datasource = {
  id: string;
  name: string;
  query: string;
  variables: string;
  config: {
    variableBindings: Record<string, any>;
  };
};


export type DatasourceDraft = {
  id: string;
  name: string;
  query: string;
  variables: string;
};

export interface DatasourceResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Datasource;
}

export type DatasourceRef = {
  key: string;
  typeId: 'custom-object';
};
