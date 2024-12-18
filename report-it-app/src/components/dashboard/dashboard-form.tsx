import Grid from '@commercetools-uikit/grid';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import { Form, Formik } from 'formik';
import { DashboardCustomObject } from '../../types/dashboard';

type Props = {
  onSubmit: (dashbaord: DashboardCustomObject) => Promise<void>;
  onCancel: () => void;
  onDelete: () => void;
  dashboard?: DashboardCustomObject;
};

const DashbaordForm = ({
  onCancel,
  onSubmit,
  onDelete,
  dashboard = { value: { name: '' } },
}: Props) => {
  const handleValidation = (values: DashboardCustomObject) => {
    const errors: Record<keyof DashboardCustomObject, string> = {} as never;
    if (!values.value.name) {
      errors = { value: { name: 'Required' } };
    }

    return errors;
  };

  return (
    <Formik
      initialValues={dashboard}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm, dirty }) => (
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
                  onClick={onCancel}
                  type="button"
                />
                <PrimaryButton
                  label="Save"
                  onClick={submitForm}
                  type="button"
                  isDisabled={!dirty}
                />
              </Spacings.Inline>
              {!!dashboard?.value?.name && !!onDelete && (
                <IconButton
                  label="Delete"
                  onClick={onDelete}
                  icon={<BinLinearIcon size="small" />}
                  type="button"
                />
              )}
            </Spacings.Inline>
          </div>
          <Grid
            gridGap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            gridAutoColumns="1fr"
          >
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <TextField
                  title="Name"
                  value={values?.value?.name}
                  name="value.name"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.value?.name && (
                <Text.Caption tone="warning">{errors.value.name}</Text.Caption>
              )}
            </Grid.Item>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default DashbaordForm;
