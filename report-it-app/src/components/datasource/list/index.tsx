import DatasourceDataTable from '../data-table';
import { PagedQueryResponse } from '../../../types/general';
import { DatasourceResponse } from '../../../types/datasource';

type Props = {
  datasources: PagedQueryResponse<DatasourceResponse>;
  refreshData?: () => void;
  selectedRows?: string[];
  onSelect?: (keys: string[]) => void;
  hideCheckbox?: boolean;
  checkboxLabel?: string;
};

const DatasourceList = ({
  datasources,
  refreshData,
  selectedRows,
  hideCheckbox,
  checkboxLabel,
  onSelect,
}: Props) => {
  return (
    <DatasourceDataTable
      datasources={datasources}
      refreshData={refreshData}
      selectedRows={selectedRows}
      onSelect={onSelect}
      hideCheckbox={hideCheckbox}
      checkboxLabel={checkboxLabel}
    />
  );
};

export default DatasourceList;
