import Constraints from '@commercetools-uikit/constraints';
import { useEffect, useMemo, useState } from 'react';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import DatasourceForm from '../datasource-form';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { Datasource, DatasourceResponse } from '../../../types/datasource';
import { useDatasource } from '../../../hooks/use-datasource';
import { PagedQueryResponse } from '../../../types/general';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Datasource Name' },
];

interface Props {
  datasources: PagedQueryResponse<DatasourceResponse>;
  selectedRows?: string[];
  refreshData?: () => void;
  onSelect?: (keys: string[]) => void;
  hideCheckbox?: boolean;
  checkboxLabel?: string;
}

const DatasourceDataTable = ({
  selectedRows,
  datasources,
  hideCheckbox,
  checkboxLabel = '',
  refreshData,
  onSelect,
}: Props) => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const [checkedRowsState, setCheckedRowsState] = useState<
    Record<string, boolean>
  >(
    selectedRows?.length
      ? selectedRows.reduce((obj, key) => ({ ...obj, [key]: true }), {})
      : {}
  );
  const tableColumns = useMemo(() => {
    if (hideCheckbox) {
      return columns;
    }
    return [
      {
        key: 'checkbox',
        label: checkboxLabel,
        shouldIgnoreRowClick: true,
        align: 'left',
        renderItem: (row: DatasourceResponse) => (
          <CheckboxInput
            isChecked={checkedRowsState[row.key]}
            onChange={() => {
              setCheckedRowsState((obj) => {
                const newState = {
                  ...obj,
                  [row.key]: !obj[row.key],
                };
                onSelect?.(
                  Object.keys(newState).filter((key) => newState[key])
                );
                return newState;
              });
            }}
          />
        ),
        disableResizing: true,
      },
      ...columns,
    ];
  }, [columns, checkedRowsState]);

  const { page, perPage } = usePaginationState();

  const { updateDatasource } = useDatasource();

  const handleUpdateDatasource = async (
    datasource: Datasource,
    datasourceKey?: string
  ) => {
    await updateDatasource(datasourceKey || '', datasource);

    refreshData?.();
  };

  useEffect(() => {
    setCheckedRowsState((prev) => {
      return selectedRows?.length
        ? {
            ...prev,
            ...selectedRows.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
          }
        : prev;
    });
  }, [selectedRows]);

  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Stack scale="l">
        <DataTable<NonNullable<DatasourceResponse>>
          isCondensed
          columns={tableColumns as any}
          rows={datasources.results}
          itemRenderer={(item, column) => {
            switch (column.key) {
              case 'key':
                return item.key;
              case 'name':
                return item.value?.name;
              default:
                return null;
            }
          }}
          sortedBy={tableSorting.value.key}
          sortDirection={tableSorting.value.order}
          onSortChange={tableSorting.onChange}
          onRowClick={(row) => push(`${match.url}/edit/${row.key}`)}
        />
        <Pagination
          page={page.value}
          onPageChange={page.onChange}
          perPage={perPage.value}
          onPerPageChange={perPage.onChange}
          totalItems={datasources.count ?? 0}
        />
      </Spacings.Stack>
      <SuspendedRoute path={`${match.path}/edit/:rowKey`}>
        <DatasourceForm
          onSubmit={handleUpdateDatasource}
          onCancel={() => push(match.url)}
          createNewMode={false}
          dataSources={datasources.results}
          onDelete={() => {
            refreshData && refreshData();
            push(`${match.url}`);
          }}
        />
      </SuspendedRoute>
    </Constraints.Horizontal>
  );
};

export default DatasourceDataTable;
