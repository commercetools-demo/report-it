import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { Widget } from '../../types/widget';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import FieldLabel from '@commercetools-uikit/field-label';
import ToggleInput from '@commercetools-uikit/toggle-input';
import Text from '@commercetools-uikit/text';
import cronstrue from 'cronstrue';
import DataTable from '@commercetools-uikit/data-table';

const WidgetCSVExport = () => {
  const formik = useFormikContext<Widget>();
  const cronHint = useMemo(() => {
    try {
      return cronstrue.toString(formik.values?.csvExportConfig?.schedule || '');
    } catch (e) {
      return '';
    }
  }, [formik.values?.csvExportConfig?.schedule]);
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
              isChecked={formik.values?.csvExportConfig?.enabled}
              name="csvExportConfig.enabled"
              onChange={formik.handleChange}
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
                  isDisabled={!formik.values?.csvExportConfig?.enabled}
                  value={formik.values?.csvExportConfig?.url || ''}
                  name="csvExportConfig.url"
                  onChange={formik.handleChange}
                />
              </Spacings.Inline>
            </Grid.Item>
            <Grid.Item gridColumn="span 1">
              <Spacings.Inline alignItems="center">
                <TextField
                  title="Schedule"
                  isDisabled={!formik.values?.csvExportConfig?.enabled}
                  value={formik.values?.csvExportConfig?.schedule || ''}
                  name="csvExportConfig.schedule"
                  placeholder="0 7 * * *"
                  hint={cronHint}
                  onChange={formik.handleChange}
                />
              </Spacings.Inline>
              {(formik.errors?.csvExportConfig as any)?.schedule && (
                <Text.Caption tone="warning">
                  {(formik.errors?.csvExportConfig as any)?.schedule}
                </Text.Caption>
              )}
            </Grid.Item>
            <Grid.Item gridColumn="span 1">
              <Spacings.Inline alignItems="flex-end" justifyContent="flex-end">
                <Spacings.Stack>
                  <FieldLabel title="CSV format?" />
                  <ToggleInput
                    isChecked={formik.values?.csvExportConfig?.csv}
                    isDisabled={!formik.values?.csvExportConfig?.enabled}
                    name="csvExportConfig.csv"
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('csvExportConfig.json', false);
                    }}
                  />
                </Spacings.Stack>
                <Spacings.Stack>
                  <FieldLabel title="JSON format?" />
                  <ToggleInput
                    isChecked={formik.values?.csvExportConfig?.json}
                    isDisabled={!formik.values?.csvExportConfig?.enabled}
                    name="csvExportConfig.json"
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('csvExportConfig.csv', false);
                    }}
                  />
                </Spacings.Stack>
              </Spacings.Inline>
            </Grid.Item>
            {!!formik.values?.csvExportConfig?.history?.length && (
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
                    rows={formik.values?.csvExportConfig?.history}
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
