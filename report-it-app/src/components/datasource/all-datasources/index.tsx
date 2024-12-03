import React from 'react';
import { useDatasourceStateContext } from '../provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DatasourceList from '../list';

type Props = {
  selectedDatasources?: string[];
  onSelect?: (keys: string[]) => void;
};

const AllDatasources: React.FC<Props> = ({ selectedDatasources, onSelect }) => {
  const { datasources, refreshData, isLoading } = useDatasourceStateContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!datasources) {
    return <div>No datasources yet! Please add one.</div>;
  }

  return (
    <DatasourceList
      datasources={datasources}
      refreshData={refreshData}
      selectedRows={selectedDatasources}
      onSelect={onSelect}
    />
  );
};

export default AllDatasources;
