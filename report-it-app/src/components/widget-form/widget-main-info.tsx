import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import NumberField from '@commercetools-uikit/number-field';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import { useFormikContext } from 'formik';
import { Widget } from '../../types/widget';
import { designTokens } from '@commercetools-uikit/design-system';

const WidgetMainInfo = () => {
  const formik = useFormikContext<Widget>();
  return (
    <Grid gridGap={designTokens.spacingM}>
      <Grid.Item>
        <TextField
          title="Name"
          value={formik.values?.name}
          name="name"
          onChange={formik.handleChange}
        />
        {formik.errors?.name && (
          <Text.Caption tone="warning">{formik.errors.name}</Text.Caption>
        )}
      </Grid.Item>
      <Grid.Item>
        <FieldLabel title="Layout" />
        <Grid
          gridGap={designTokens.spacingM}
          gridTemplateColumns="repeat(2, 1fr)"
        >
          <Grid.Item>
            <Spacings.Inline alignItems="center">
              <NumberField
                title="Height"
                value={formik.values?.layout?.h}
                name="layout.h"
                onChange={formik.handleChange}
              />
            </Spacings.Inline>
            {formik.errors?.layout?.h && (
              <Text.Caption tone="warning">
                {formik.errors.layout.h}
              </Text.Caption>
            )}
          </Grid.Item>
          <Grid.Item>
            <Spacings.Inline alignItems="center">
              <NumberField
                title="Width"
                value={formik.values?.layout?.w}
                name="layout.w"
                onChange={formik.handleChange}
              />
            </Spacings.Inline>
            {formik.errors?.layout?.w && (
              <Text.Caption tone="warning">
                {formik.errors.layout.w}
              </Text.Caption>
            )}
          </Grid.Item>
          <Grid.Item>
            <Spacings.Inline alignItems="center">
              <NumberField
                title="Position X"
                value={formik.values?.layout?.x}
                name="layout.x"
                onChange={formik.handleChange}
              />
            </Spacings.Inline>
            {formik.errors?.layout?.x && (
              <Text.Caption tone="warning">
                {formik.errors.layout.x}
              </Text.Caption>
            )}
          </Grid.Item>
          <Grid.Item>
            <Spacings.Inline alignItems="center">
              <NumberField
                title="Position Y"
                value={formik.values?.layout?.y}
                name="layout.y"
                onChange={formik.handleChange}
              />
            </Spacings.Inline>
            {formik.errors?.layout?.y && (
              <Text.Caption tone="warning">
                {formik.errors.layout.y}
              </Text.Caption>
            )}
          </Grid.Item>
        </Grid>
      </Grid.Item>
    </Grid>
  );
};

export default WidgetMainInfo;
