import { FC } from 'react';
import { CustomFormModalPage } from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import AllDatasources from '../all-datasources';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import DatasourceForm from '../datasource-form';
import { DatasourceDraft } from '../../../types/datasource';
import { useDatasourceStateContext } from '../provider';
import { useDatasource } from '../../../hooks/use-datasource';

export type Props = {
  onClose?: () => void;
  selectedDatasources?: string[];
  onSelect?: (keys: string[]) => void;
};

const PickDatasource: FC<Props> = ({
  onClose,
  selectedDatasources,
  onSelect,
}) => {
  const match = useRouteMatch();
  const { push } = useHistory();

  const { refreshData } = useDatasourceStateContext();

  const { createDatasource } = useDatasource();

  const handleCreateDatasource = async (datasource: DatasourceDraft) => {
    const result = await createDatasource(datasource);
    if (!!result) {
      onClose && onClose();
    }
    refreshData?.();
  };

  return (
    <CustomFormModalPage
      title="Pick a datasource"
      isOpen={true}
      onClose={onClose}
      formControls={
        <>
          <CustomFormModalPage.FormPrimaryButton
            iconLeft={<PlusBoldIcon />}
            label="Create a new datasource"
            onClick={() => push(`${match.url}/new`)}
          />
        </>
      }
    >
      <AllDatasources
        selectedDatasources={selectedDatasources}
        onSelect={onSelect}
      />
      <SuspendedRoute path={`${match.path}/new`}>
        <DatasourceForm
          onSubmit={handleCreateDatasource}
          onCancel={() => push(`${match.url}`)}
        />
      </SuspendedRoute>
    </CustomFormModalPage>
  );
};

export default PickDatasource;
