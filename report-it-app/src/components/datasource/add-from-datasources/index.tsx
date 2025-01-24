import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { BackIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import NewDatasource from '../create-new-datasource';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import AllDatasources from '../all-datasources';
import { Widget } from '../../../types/widget';

interface Props {
  onSelect?: (keys: string[]) => void;
  widget?: Widget;
}
const AddFromDatasources = ({ onSelect, widget }: Props) => {
  const drawerState = useModalState();
  const selectedDatasources = widget?.config?.datasources?.map((d) => d.key);

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Pick from datasources"
        onClick={drawerState.openModal}
      />
      <Drawer
        title="Pick a datasource"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={20}
      >
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between" alignItems="center">
            <FlatButton
              label="Back"
              icon={<BackIcon />}
              onClick={drawerState.closeModal}
            />
            <NewDatasource />
          </Spacings.Inline>
          <Text.Headline>Pick from all Datasources</Text.Headline>
          <AllDatasources
            selectedDatasources={selectedDatasources}
            onSelect={onSelect}
          />
        </Spacings.Stack>
      </Drawer>
    </>
  );
};

export default AddFromDatasources;
