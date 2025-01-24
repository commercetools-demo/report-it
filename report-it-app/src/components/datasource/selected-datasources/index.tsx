import React, { useMemo } from 'react';
import { useDatasourceStateContext } from '../provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DatasourceList from '../list';
import { Widget } from '../../../types/widget';

type Props = {
  values: Widget;
  widget?: Widget;
  onSelect?: (keys: string[]) => void;
};

const SelectedDatasources: React.FC<Props> = ({ values, widget, onSelect }) => {
  const savedDatasources = widget?.config?.datasources?.map((d) => d.key);
  const currentDatasources = values?.config?.datasources?.map((d) => d.key);
  const newDatasources = currentDatasources?.filter(
    (d) => !savedDatasources?.includes(d)
  );

  const { datasources, refreshData, isLoading } = useDatasourceStateContext();

  const filteredDatasources = useMemo(() => {
    if (!datasources) {
      return datasources;
    }
    return {
      ...datasources,
      results: datasources.results.filter((datasource) =>
        currentDatasources?.includes(datasource.key)
      ),
    };
  }, [currentDatasources, datasources]);

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
      selectedRows={newDatasources}
      onSelect={onSelect}
      checkboxLabel="Will be added"
    />
  );
};

export default SelectedDatasources;
