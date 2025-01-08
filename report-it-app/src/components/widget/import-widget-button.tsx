import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import FlatButton from '@commercetools-uikit/flat-button';
import { ImportIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import styled from 'styled-components';
import { useState } from 'react';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
type Props = {};
const StyledIconButton = styled(FlatButton)`
  position: absolute;
  top: 24px;
  right: 0;
  z-index: 10;
`;

const StyledUploadInput = styled.input`
  display: none;
`;

const StyledWrapper = styled.div`
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImportWidgetButton = () => {
  const importDrawerState = useModalState();
  const [fileName, setFileName] = useState('');
  const { importWidget } = useDashboardPanelStateContext();
  const showNotification = useShowNotification();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {
    const file = values.file;
    setIsLoading(true);
    if (file) {
      const success = await importWidget(JSON.parse(file));
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
    setIsLoading(false);
  };
  const handleValidation = (values: any) => {
    const errors: Record<keyof any, string> = {} as never;
    if (!values.file) {
      errors['file'] = 'Required';
    }
    const file = values.file;
    if (file) {
      try {
        JSON.parse(file);
      } catch (e) {
        errors['file'] = 'Invalid JSON';
      }
    }
    return errors;
  };
  return (
    <>
      <StyledIconButton
        onClick={importDrawerState.openModal}
        icon={<ImportIcon size="small" />}
        size="small"
        title="Import widget"
      ></StyledIconButton>
      <Drawer
        title="Import widget"
        isOpen={importDrawerState.isModalOpen}
        onClose={importDrawerState.closeModal}
        hideControls
        size={10}
      >
        <Formik
          initialValues={{ file: null }}
          onSubmit={onSubmit}
          validateOnBlur
          validate={handleValidation}
        >
          {({
            values,
            errors,
            submitForm,
            dirty,
            setFieldValue,
            resetForm,
          }) => (
            <Form>
              <div style={{ paddingBottom: '16px' }}>
                <Spacings.Inline
                  alignItems="center"
                  justifyContent="flex-end"
                  scale="m"
                >
                  <Spacings.Inline
                    alignItems="center"
                    justifyContent="flex-end"
                    scale="m"
                  >
                    <SecondaryButton
                      label="Cancel"
                      onClick={() => {
                        importDrawerState.closeModal();
                        resetForm();
                        setFileName('');
                      }}
                      type="button"
                    />
                    <PrimaryButton
                      label="Save"
                      onClick={submitForm}
                      iconRight={isLoading ? <LoadingSpinner /> : <></>}
                      type="button"
                      isDisabled={!dirty}
                    />
                  </Spacings.Inline>
                </Spacings.Inline>
              </div>
              <StyledWrapper>
                <span>Choose file</span>
                <StyledUploadInput
                  name="file"
                  type="file"
                  accept=".json"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFieldValue('file', reader.result);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <IconButton
                  label="Choose file"
                  onClick={() => {
                    const input = document.querySelector('input[name="file"]');
                    input?.click();
                  }}
                  type="button"
                  icon={<ImportIcon size="small" />}
                />
                {fileName && <div>{fileName}</div>}
                {errors.file && (
                  <div style={{ color: 'red' }}>{errors.file}</div>
                )}
              </StyledWrapper>
            </Form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default ImportWidgetButton;
