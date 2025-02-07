import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import FlatButton from '@commercetools-uikit/flat-button';
import { ImportIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { useState } from 'react';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { FileDropArea } from '../upload/file-drop-area';
import Constraints from '@commercetools-uikit/constraints';

const ImportWidgetButton = () => {
  const importDrawerState = useModalState();
  const [file, setFile] = useState<File>();
  const { importWidget } = useDashboardPanelStateContext();
  const showNotification = useShowNotification();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const loadedFile = reader.result;
        if (loadedFile) {
          const success = await importWidget(JSON.parse(loadedFile as string));
          if (success) {
            showNotification({
              domain: NOTIFICATION_DOMAINS.SIDE,
              kind: NOTIFICATION_KINDS_SIDE.success,
              text: 'Widget imported successfully',
            });
            importDrawerState.closeModal();
          } else {
            showNotification({
              domain: NOTIFICATION_DOMAINS.SIDE,
              kind: NOTIFICATION_KINDS_SIDE.error,
              text: 'Widget import failed',
            });
          }
        }
      };
      reader.readAsText(file);
    }
    setIsLoading(false);
  };

  return (
    <>
      <FlatButton
        onClick={importDrawerState.openModal}
        icon={<ImportIcon size="10" />}
        title="Import widget"
        label={''}
      ></FlatButton>
      <Drawer
        title="Import widget"
        isOpen={importDrawerState.isModalOpen}
        onClose={importDrawerState.closeModal}
        hideControls
        size={10}
      >
        <Constraints.Horizontal max={'scale'}>
          <Spacings.Stack alignItems="stretch" scale="m">
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="s"
            >
              <SecondaryButton
                label="Cancel"
                onClick={() => {
                  importDrawerState.closeModal();
                  setFile(undefined);
                }}
                type="button"
              />
              <PrimaryButton
                label="Save"
                onClick={onSubmit}
                iconRight={isLoading ? <LoadingSpinner /> : undefined}
                type="button"
                isDisabled={!file}
              />
            </Spacings.Inline>
            <FileDropArea file={file} setFile={setFile} />
          </Spacings.Stack>
        </Constraints.Horizontal>
      </Drawer>
    </>
  );
};

export default ImportWidgetButton;
