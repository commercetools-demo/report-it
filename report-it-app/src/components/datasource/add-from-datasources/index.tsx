import {
  CustomFormModalPage,
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import AllDatasources from '../all-datasources';
import { Widget } from '../../../types/widget';
import DatasourceForm from '../datasource-form';
import { useDatasourceStateContext } from '../provider';
import { useDatasource } from '../../../hooks/use-datasource';
import { DatasourceDraft } from '../../../types/datasource';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';

interface Props {
  onSelect?: (keys: string[]) => void;
  widget?: Widget;
  values?: Widget;
}
const AddFromDatasources = ({ onSelect, values }: Props) => {
  const newDataSourceDrawerState = useModalState();
  const selectedDatasources = values?.config?.datasources?.map((d) => d.key);
  const match = useRouteMatch();
  const { push } = useHistory();

  const { refreshData } = useDatasourceStateContext();

  const { createDatasource } = useDatasource();

  const handleCreateDatasource = async (datasource: DatasourceDraft) => {
    const result = await createDatasource(datasource);
    if (!!result) {
      newDataSourceDrawerState.closeModal();
    }
    refreshData?.();
  };

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Pick from datasources"
        onClick={() => push(`${match.url}/pick`)}
      />
      <SuspendedRoute path={`${match.path}/pick`}>
        <CustomFormModalPage
          title="Pick a datasource"
          isOpen={true}
          onClose={() => push(`${match.url}`)}
          formControls={
            <>
              <CustomFormModalPage.FormPrimaryButton
                iconLeft={<PlusBoldIcon />}
                label="Create a new datasource"
                onClick={newDataSourceDrawerState.openModal}
              />
            </>
          }
        >
          <Spacings.Stack scale="l">
            <AllDatasources
              selectedDatasources={selectedDatasources}
              onSelect={onSelect}
            />
          </Spacings.Stack>
        </CustomFormModalPage>
      </SuspendedRoute>

      <Drawer
        title="Create a new datasource"
        isOpen={newDataSourceDrawerState.isModalOpen}
        onClose={newDataSourceDrawerState.closeModal}
        hideControls
        size={20}
      >
        <DatasourceForm
          onSubmit={handleCreateDatasource}
          onCancel={newDataSourceDrawerState.closeModal}
        />
      </Drawer>
    </>
  );
};

export default AddFromDatasources;
