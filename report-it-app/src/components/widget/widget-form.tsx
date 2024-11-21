import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import { Form, Formik } from 'formik';
import { Widget } from '../../types/widget';

type Props = {
  onSubmit: (widget: Widget) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
  widget?: Widget;
};

const WidgetForm = ({
  onCancel,
  onSubmit,
  onDelete,
  widget = {
    layout: {
      h: 1,
      w: 1,
      x: 0,
      y: 0,
    },
  },
}: Props) => {
  const handleValidation = (values: Widget) => {
    const errors: Record<keyof Widget, string> = {} as never;
    if (!values.name) {
      errors.name = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={widget}
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
                  value={values?.name}
                  name="name"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors?.name && (
                <Text.Caption tone="warning">{errors.name}</Text.Caption>
              )}
            </Grid.Item>
          </Grid>
          <div style={{ paddingTop: '16px' }}>
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="m"
            >
              <PrimaryButton
                label="Delete"
                tone="critical"
                onClick={onDelete}
                type="button"
              />
            </Spacings.Inline>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WidgetForm;
