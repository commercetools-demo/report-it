import Constraints from '@commercetools-uikit/constraints';
import { useMemo, useState } from 'react';
import {
  Drawer,
  useModalState,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import DatasourceForm from '../datasource-form';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import Text from '@commercetools-uikit/text';
import { Datasource, DatasourceResponse } from '../../../types/datasource';
import { useDatasource } from '../../../hooks/use-datasource';
import { PagedQueryResponse } from '../../../types/general';

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
}

const DatasourceDataTable = ({
  selectedRows,
  datasources,
  hideCheckbox,
  refreshData,
  onSelect,
}: Props) => {
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
        label: '',
        shouldIgnoreRowClick: true,
        align: 'center',
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
  const [selectedDatasourceResponse, setSelectedDatasourceResponse] =
    useState<DatasourceResponse>();

  const { updateDatasource, deleteDatasource } = useDatasource();

  const drawerState = useModalState();
  const confirmState = useModalState();

  const handleUpdateDatasource = async (datasource: Datasource) => {
    const result = await updateDatasource(
      selectedDatasourceResponse?.key || '',
      datasource
    );

    refreshData?.();
    if (!!result) {
      drawerState.closeModal();
    }
  };

  const handleDeleteConfirmation = () => {
    if (!selectedDatasourceResponse?.key) {
      return;
    }

    confirmState.openModal();
  };

  const handleDeleteDatasource = async () => {
    await deleteDatasource(selectedDatasourceResponse?.key || '');
    refreshData?.();
    confirmState.closeModal();
  };

  const handleOpenModal = (datasource: DatasourceResponse) => {
    setSelectedDatasourceResponse(datasource);
    drawerState.openModal();
  };

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
          onRowClick={handleOpenModal}
        />
        <Pagination
          page={page.value}
          onPageChange={page.onChange}
          perPage={perPage.value}
          onPerPageChange={perPage.onChange}
          totalItems={datasources.count ?? 0}
        />
      </Spacings.Stack>
      <Drawer
        title={`Edit ${selectedDatasourceResponse?.key}`}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
      >
        <DatasourceForm
          onSubmit={handleUpdateDatasource}
          onCancel={drawerState.closeModal}
          onDelete={handleDeleteConfirmation}
          datasource={selectedDatasourceResponse?.value}
        />
      </Drawer>
      <ConfirmationDialog
        isOpen={confirmState.isModalOpen}
        onClose={confirmState.closeModal}
        onConfirm={handleDeleteDatasource}
        title="Delete datasource"
        onCancel={confirmState.closeModal}
      >
        <Text.Body>Are you sure you want to delete this datasource?</Text.Body>
      </ConfirmationDialog>
    </Constraints.Horizontal>
  );
};

export default DatasourceDataTable;
