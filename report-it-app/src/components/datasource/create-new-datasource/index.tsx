import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import DatasourceForm from '../datasource-form';
import { useDatasource } from '../../../hooks/use-datasource';
import { DatasourceDraft } from '../../../types/datasource';
import { useDatasourceStateContext } from '../provider';

const NewDatasource = () => {
  const drawerState = useModalState();
  const { refreshData } = useDatasourceStateContext();

  const { createDatasource } = useDatasource();

  const handleCreateDatasource = async (datasource: DatasourceDraft) => {
    const result = await createDatasource(datasource);
    if (!!result) {
      drawerState.closeModal();
    }
    refreshData?.();
  };

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Create a new datasource"
        onClick={drawerState.openModal}
      />
      <Drawer
        title="Create a new datasource"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={20}
      >
        <DatasourceForm
          onSubmit={handleCreateDatasource}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </>
  );
};

export default NewDatasource;
