import React from 'react';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import NumberField from '@commercetools-uikit/number-field';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import { FormikErrors } from 'formik';
import { Widget } from '../../types/widget';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
  onSelectAIGeneration?: (value: boolean) => void;
};

const WidgetMainInfo = ({
  errors,
  values,
  handleChange,
  widget,
  onSelectAIGeneration,
}: Props) => {
  return (
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
              <Text.Caption tone="warning">{errors.layout.h}</Text.Caption>
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
              <Text.Caption tone="warning">{errors.layout.w}</Text.Caption>
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
              <Text.Caption tone="warning">{errors.layout.x}</Text.Caption>
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
              <Text.Caption tone="warning">{errors.layout.y}</Text.Caption>
            )}
          </Grid.Item>
        </Grid>
      </Grid.Item>
    </Grid>
  );
};

export default WidgetMainInfo;
