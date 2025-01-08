import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import { Widget } from '../../types/widget';
import WidgetTabularView from './widget-tabular-view';

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
    if (
      typeof values.layout.h !== 'undefined' &&
      parseInt(values.layout.h.toString()) < 1
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        h: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.w !== 'undefined' &&
      parseInt(values.layout.w.toString()) < 1
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        w: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.x !== 'undefined' &&
      parseInt(values.layout.x.toString()) < 0
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        x: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.y !== 'undefined' &&
      parseInt(values.layout.y.toString()) < 0
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        y: 'Must be bigger than 0',
      };
    }

    return errors;
  };

  return (
    <Formik
      initialValues={widget ?? ({ layout: {} } as Widget)}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm, dirty, setFieldValue }) => (
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
              {!!widget && (
                <IconButton
                  label="Delete"
                  onClick={onDelete}
                  icon={<BinLinearIcon size="small" />}
                  type="button"
                />
              )}
            </Spacings.Inline>
          </div>
          <WidgetTabularView
            errors={errors}
            values={values}
            widget={widget}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
        </Form>
      )}
    </Formik>
  );
};

export default WidgetForm;
