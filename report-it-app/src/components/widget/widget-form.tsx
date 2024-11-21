import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import NumberField from '@commercetools-uikit/number-field';
import FieldLabel from '@commercetools-uikit/field-label';
import { Form, Formik } from 'formik';
import { Widget } from '../../types/widget';

type Props = {
  onSubmit: (widget: Widget) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
  widget?: Widget;
};

const WidgetForm = ({ onCancel, onSubmit, onDelete, widget }: Props) => {
  const handleValidation = (values: Widget) => {
    const errors: Record<keyof Widget, string | object> = {} as never;
    if (!values.name) {
      errors.name = 'Required';
    }
    if (typeof values.layout.h === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), h: 'Required' };
    }
    if (typeof values.layout.w === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), w: 'Required' };
    }
    if (typeof values.layout.x === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), x: 'Required' };
    }
    if (typeof values.layout.y === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), y: 'Required' };
    }
    if (typeof values.layout.h !== 'undefined' && parseInt(values.layout.h.toString()) < 1) {
      errors.layout = { ...((errors.layout as object) ?? {}), h: 'Must be bigger than 0' };
    }
    if (typeof values.layout.w !== 'undefined' && parseInt(values.layout.w.toString()) < 1) {
      errors.layout = { ...((errors.layout as object) ?? {}), w: 'Must be bigger than 0' };
    }
    if (typeof values.layout.x !== 'undefined' && parseInt(values.layout.x.toString()) < 0) {
      errors.layout = { ...((errors.layout as object) ?? {}), x: 'Must be bigger than 0' };
    }
    if (typeof values.layout.y !== 'undefined' && parseInt(values.layout.y.toString()) < 0) {
      errors.layout = { ...((errors.layout as object) ?? {}), y: 'Must be bigger than 0' };
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
            <Grid.Item>
              <FieldLabel title="Layout" />
              <Grid gridGap="16px" gridTemplateColumns="repeat(2, 1fr)">
                <Grid.Item gridColumn="span 1">
                  <Spacings.Inline alignItems="center">
                    <NumberField
                      title="Height"
                      value={values?.layout?.h}
                      name="layout.h"
                      onChange={handleChange}
                    />
                  </Spacings.Inline>
                  {errors?.layout?.h && (
                    <Text.Caption tone="warning">
                      {errors.layout.h}
                    </Text.Caption>
                  )}
                </Grid.Item>
                <Grid.Item gridColumn="span 1">
                  <Spacings.Inline alignItems="center">
                    <NumberField
                      title="Width"
                      value={values?.layout?.w}
                      name="layout.w"
                      onChange={handleChange}
                    />
                  </Spacings.Inline>
                  {errors?.layout?.w && (
                    <Text.Caption tone="warning">
                      {errors.layout.w}
                    </Text.Caption>
                  )}
                </Grid.Item>
                <Grid.Item gridColumn="span 1">
                  <Spacings.Inline alignItems="center">
                    <NumberField
                      title="Position X"
                      value={values?.layout?.x}
                      name="layout.x"
                      onChange={handleChange}
                    />
                  </Spacings.Inline>
                  {errors?.layout?.x && (
                    <Text.Caption tone="warning">
                      {errors.layout.x}
                    </Text.Caption>
                  )}
                </Grid.Item>
                <Grid.Item gridColumn="span 1">
                  <Spacings.Inline alignItems="center">
                    <NumberField
                      title="Position Y"
                      value={values?.layout?.y}
                      name="layout.y"
                      onChange={handleChange}
                    />
                  </Spacings.Inline>
                  {errors?.layout?.y && (
                    <Text.Caption tone="warning">
                      {errors.layout.y}
                    </Text.Caption>
                  )}
                </Grid.Item>
              </Grid>
            </Grid.Item>
          </Grid>
          {widget && (
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
          )}
        </Form>
      )}
    </Formik>
  );
};

export default WidgetForm;
