import Grid from '@commercetools-uikit/grid';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import { FormikProvider, useFormik } from 'formik';
import { DashboardCustomObject } from '../../types/dashboard';
import { designTokens } from '@commercetools-uikit/design-system';
import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';

type Props = {
  onSubmit: (dashbaord: DashboardCustomObject) => Promise<void>;
  onCancel: () => void;
  onDelete: () => void;
  dashboard?: DashboardCustomObject;
};

type TErrors = {
  name: { missing?: boolean };
};

const validate = (values: DashboardCustomObject) => {
  const errors: TErrors = { name: {} };

  if (
    TextInput.isEmpty(values.value.name) ||
    values.value.name.trim().length === 0
  ) {
    errors.name.missing = true;
  }

  return omitEmpty<TErrors>(errors);
};

const DashboardForm = ({
  onCancel,
  onSubmit,
  onDelete,
  dashboard = { value: { name: '' } } as DashboardCustomObject,
}: Props) => {
  const formik = useFormik({
    initialValues: dashboard,
    onSubmit: onSubmit,
    validate: validate,
  });
  return (
    <FormikProvider value={formik}>
      <Spacings.Stack scale="m">
        <Spacings.Inline
          alignItems="center"
          justifyContent="flex-end"
          scale="s"
        >
          <SecondaryButton label="Cancel" onClick={onCancel} type="button" />
          <PrimaryButton
            label="Save"
            onClick={formik.submitForm}
            type="button"
            isDisabled={!formik.dirty}
          />
          {!!dashboard?.value?.name && !!onDelete && (
            <IconButton
              label="Delete"
              onClick={onDelete}
              icon={<BinLinearIcon size="10" />}
              type="button"
            />
          )}
        </Spacings.Inline>
        <Grid
          gridGap={designTokens.spacingM}
          gridTemplateColumns="repeat(2, 1fr)"
          gridAutoColumns="1fr"
        >
          <Grid.Item gridColumn="span 2">
            <Spacings.Inline alignItems="center">
              <TextField
                title="Name"
                value={formik.values?.value?.name}
                name="value.name"
                onChange={formik.handleChange}
                isRequired={true}
                errors={TextField.toFieldErrors<TErrors>(formik.errors).name}
                touched={!!formik.touched.value?.name}
              />
            </Spacings.Inline>
          </Grid.Item>
        </Grid>
      </Spacings.Stack>
    </FormikProvider>
  );
};

export default DashboardForm;
