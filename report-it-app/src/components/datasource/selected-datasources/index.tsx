import React, { useMemo } from 'react';
import { useDatasourceStateContext } from '../provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DatasourceList from '../list';

type Props = {
  selectedDatasources?: string[];
  onSelect?: (keys: string[]) => void;
};

const SelectedDatasources: React.FC<Props> = ({
  selectedDatasources,
  onSelect,
}) => {
  const { datasources, refreshData, isLoading } = useDatasourceStateContext();

  const filteredDatasources = useMemo(() => {
    if (!datasources) {
      return datasources;
    }
    return {
      ...datasources,
      results: datasources.results.filter((datasource) =>
        selectedDatasources?.includes(datasource.key)
      ),
    };
  }, [selectedDatasources, datasources]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!filteredDatasources) {
    return <div>No datasources yet! Please add one.</div>;
  }

  return (
    <DatasourceList
      datasources={filteredDatasources}
      refreshData={refreshData}
      selectedRows={selectedDatasources}
      onSelect={onSelect}
      hideCheckbox
    />
  );
};

export default SelectedDatasources;
