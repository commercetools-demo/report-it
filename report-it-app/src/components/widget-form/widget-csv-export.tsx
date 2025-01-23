import { FormikErrors } from 'formik';
import React, { useMemo } from 'react';
import { Widget } from '../../types/widget';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import FieldLabel from '@commercetools-uikit/field-label';
import ToggleInput from '@commercetools-uikit/toggle-input';
import Text from '@commercetools-uikit/text';
import cronstrue from 'cronstrue';
import DataTable from '@commercetools-uikit/data-table';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  handleChange: any;
  setFieldValue: any;
};

const WidgetCSVExport = ({
  errors,
  values,
  handleChange,
  setFieldValue,
}: Props) => {
  const cronHint = useMemo(() => {
    try {
      return cronstrue.toString(values?.csvExportConfig?.schedule || '');
    } catch (e) {
      return '';
    }
  }, [values?.csvExportConfig?.schedule]);
  return (
    <Spacings.Stack>
      <Grid
        gridGap="16px"
        gridTemplateColumns="repeat(2, 1fr)"
        gridAutoColumns="1fr"
      >
        <Grid.Item gridColumn="span 1">
          <Spacings.Inline alignItems="center">
            <FieldLabel title="CSV Export" />
            <ToggleInput
              isChecked={values?.csvExportConfig?.enabled}
              name="csvExportConfig.enabled"
              onChange={handleChange}
            />
          </Spacings.Inline>
        </Grid.Item>
        <Grid.Item gridColumn="span 1" />

        <Grid.Item>
          <FieldLabel title="Layout" />
          <Grid gridGap="16px" gridTemplateColumns="repeat(2, 1fr)">
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <TextField
                  title="URL"
                  isDisabled={!values?.csvExportConfig?.enabled}
                  value={values?.csvExportConfig?.url || ''}
                  name="csvExportConfig.url"
                  onChange={handleChange}
                />
              </Spacings.Inline>
            </Grid.Item>
            <Grid.Item gridColumn="span 1">
              <Spacings.Inline alignItems="center">
                <TextField
                  title="Schedule"
                  isDisabled={!values?.csvExportConfig?.enabled}
                  value={values?.csvExportConfig?.schedule || ''}
                  name="csvExportConfig.schedule"
                  placeholder="0 7 * * *"
                  hint={cronHint}
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {(errors?.csvExportConfig as any)?.schedule && (
                <Text.Caption tone="warning">
                  {(errors?.csvExportConfig as any)?.schedule}
                </Text.Caption>
              )}
            </Grid.Item>
            <Grid.Item gridColumn="span 1">
              <Spacings.Inline alignItems="flex-end" justifyContent="flex-end">
                <Spacings.Stack>
                  <FieldLabel title="CSV format?" />
                  <ToggleInput
                    isChecked={values?.csvExportConfig?.csv}
                    isDisabled={!values?.csvExportConfig?.enabled}
                    name="csvExportConfig.csv"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue('csvExportConfig.json', false);
                    }}
                  />
                </Spacings.Stack>
                <Spacings.Stack>
                  <FieldLabel title="JSON format?" />
                  <ToggleInput
                    isChecked={values?.csvExportConfig?.json}
                    isDisabled={!values?.csvExportConfig?.enabled}
                    name="csvExportConfig.json"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue('csvExportConfig.csv', false);
                    }}
                  />
                </Spacings.Stack>
              </Spacings.Inline>
            </Grid.Item>
            {!!values?.csvExportConfig?.history?.length && (
              <Grid.Item gridColumn="span 2">
                <Spacings.Stack scale="m">
                  <FieldLabel title="Execution History"></FieldLabel>
                  <DataTable
                    isCondensed
                    columns={[
                      {
                        key: 'text',
                        label: 'Message',
                      },
                      {
                        key: 'date',
                        label: 'Date',
                        renderItem: (row: any) => (
                          <Text.Body>
                            {new Date(row.date).toLocaleString()}
                          </Text.Body>
                        ),
                      },
                    ]}
                    rows={values?.csvExportConfig?.history}
                  />
                </Spacings.Stack>

              </Grid.Item>
            )}
          </Grid>
        </Grid.Item>
      </Grid>
    </Spacings.Stack>
  );
};

export default WidgetCSVExport;
