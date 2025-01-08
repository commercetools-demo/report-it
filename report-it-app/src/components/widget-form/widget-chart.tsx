import { FieldArray, FormikErrors } from 'formik';
import React, { useMemo } from 'react';
import { Widget } from '../../types/widget';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import SelectInput from '@commercetools-uikit/select-input';
import FieldLabel from '@commercetools-uikit/field-label';
import { useQueryUtils } from '../query/hooks/use-query-utils';
import { useWidgetDatasourceResponseContext } from './widget-datasource-response-provider';
import styled from 'styled-components';
import { Chart as GoogleChart } from 'react-google-charts';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
};

export const GoogleChartWrapperCharts = [
  'AnnotationChart',
  'AreaChart',
  'BarChart',
  'BubbleChart',
  'Calendar',
  'CandlestickChart',
  'ColumnChart',
  'ComboChart',
  'DiffChart',
  'DonutChart',
  'Gantt',
  'Gauge',
  'GeoChart',
  'Histogram',
  'LineChart',
  'Line',
  'Bar',
  'Map',
  'OrgChart',
  'PieChart',
  'Sankey',
  'ScatterChart',
  'Scatter',
  'SteppedAreaChart',
  'Table',
  'Timeline',
  'TreeMap',
  'WaterfallChart',
  'WordTree',
];

const StyledDiv = styled.div`
  width: 100%;
  height: 300px;
`;

const WidgetChart = ({ values, handleChange }: Props) => {
  const { executeQuery, flattenObject, error } = useQueryUtils();
  const { datasources } = useWidgetDatasourceResponseContext();

  const headers = useMemo(() => {
    if (Object.keys(datasources)?.length && values?.config?.sqlQuery) {
      const result = executeQuery(values.config?.sqlQuery!);
      const flattenedFirstRow = flattenObject(result[0]);

      return Object.keys(flattenedFirstRow).map((key) => ({
        label: key,
        value: key,
      }));
    }
    return [];
  }, [datasources, values]);

  const chartData = useMemo(() => {
    if (
      Object.keys(datasources)?.length &&
      values.config?.sqlQuery &&
      headers
    ) {
      const result = executeQuery(values.config?.sqlQuery!);

      const data = [];
      data.push(headers.map((item) => item.value));

      result.forEach((item: any) => {
        const flatRow = flattenObject(item);
        data.push(headers.map((item) => flatRow[item.value]));
      });

      return data;
    }
    return [];
  }, [datasources, headers]);

  return (
    <Spacings.Stack>
      <SelectField
        title="Chart Type"
        name="config.chartType"
        value={values?.config?.chartType}
        options={GoogleChartWrapperCharts.map((chartType) => ({
          value: chartType,
          label: chartType,
        }))}
        onChange={handleChange}
      ></SelectField>

      {!!error && <Text.Caption tone="warning">{error}</Text.Caption>}
      {!values?.config?.sqlQuery && (
        <Text.Caption tone="warning">
          No SQL Query has been provided
        </Text.Caption>
      )}
      {!!headers?.length && (
        <>
          <FieldLabel title="Chart Fields" />
          <SelectInput
            value={values?.config?.chartFields}
            isMulti
            options={headers}
            optionStyle="checkbox"
            name="config.chartFields"
            onChange={handleChange}
          />
        </>
      )}
      {!!chartData?.length && (
        <StyledDiv>
          <FieldLabel title="Chart preview" />
          <GoogleChart
            //   @ts-ignore
            chartType={values?.config?.chartType}
            data={chartData}
            options={{
              title: values.name,
            }}
            legendToggle
          />
        </StyledDiv>
      )}
    </Spacings.Stack>
  );
};

export default WidgetChart;
