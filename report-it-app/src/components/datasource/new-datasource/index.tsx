import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import DatasourceForm from '../datasource-form';
import { useDatasource } from '../../../hooks/use-datasource';
import { DatasourceDraft } from '../../../types/datasource';

const NewDatasource = () => {
  const drawerState = useModalState();

  const { createDatasource } = useDatasource();

  const handleCreateDatasource = async (datasource: DatasourceDraft) => {
    const result = await createDatasource(datasource);
    if (!!result) {
      drawerState.closeModal();
    }
  };

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Add new datasource"
        onClick={drawerState.openModal}
      />
      <Drawer
        title="Add new datasource"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
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
