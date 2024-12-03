import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { useDatasource } from '../../hooks/use-datasource';
import { DatasourceResponse } from '../../types/datasource';
interface DatasourceStateContextReturn {
  datasources?: PagedQueryResponse<DatasourceResponse>;
  refreshData?: () => void;
  isLoading?: boolean;
}

const initialData = {
  isLoading: false,
};

const DatasourceStateContext =
  React.createContext<DatasourceStateContextReturn>(initialData);

const DatasourceStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [datasources, setDatasources] =
    useState<PagedQueryResponse<DatasourceResponse>>();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllDatasources } = useDatasource();

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);

    const [datasourceResult] = await Promise.all([
      fetchAllDatasources(limit, page),
    ]);
    setDatasources(datasourceResult);
    setIsLoading(false);
  };

  const refreshData = () => {
    getApps();
  };

  useEffect(() => {
    getApps();
  }, []);

  return (
    <DatasourceStateContext.Provider
      value={{
        datasources,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </DatasourceStateContext.Provider>
  );
};

export default DatasourceStateProvider;

export const useDatasourceStateContext = () =>
  useContext(DatasourceStateContext);
