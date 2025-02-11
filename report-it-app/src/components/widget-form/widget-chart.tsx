import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { Widget } from '../../types/widget';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import FieldLabel from '@commercetools-uikit/field-label';
import styled from 'styled-components';
import {
  Chart as GoogleChart,
  GoogleChartWrapperChartType,
} from 'react-google-charts';
import ChartFields from './chart-fields';
import { useWidgetDatasourceResponseContext } from '../../providers/widget-datasource-response-provider';

export const StyledBorder = styled.div`
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 0;
`;

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

const WidgetChart = () => {
  const formik = useFormikContext<Widget>();
  const { getChartData, error } = useWidgetDatasourceResponseContext();

  const { chartData, headers } = useMemo(() => {
    return getChartData(
      formik.values.config?.sqlQuery!,
      formik.values.config?.chartFields
    );
  }, [formik.values.config?.chartFields]);

  return (
    <Spacings.Stack scale={'l'}>
      <SelectField
        title="Chart Type"
        name="config.chartType"
        value={formik.values?.config?.chartType}
        options={GoogleChartWrapperCharts.map((chartType) => ({
          value: chartType,
          label: chartType,
        }))}
        onChange={formik.handleChange}
      ></SelectField>

      {!!error && <Text.Caption tone="warning">{error}</Text.Caption>}
      {!formik.values?.config?.sqlQuery && (
        <Text.Caption tone="warning">
          No SQL Query has been provided
        </Text.Caption>
      )}
      {!!headers?.length && (
        <ChartFields defaultValues={headers} configName="config" />
      )}
      <StyledBorder />
      {!!chartData?.length && (
        <StyledDiv>
          <FieldLabel title="Chart preview" />
          <GoogleChart
            chartType={
              formik.values?.config?.chartType as GoogleChartWrapperChartType
            }
            data={chartData}
            options={{
              title: formik.values.name,
              colors: formik.values?.config?.colors,
            }}
            legendToggle
          />
        </StyledDiv>
      )}
    </Spacings.Stack>
  );
};

export default WidgetChart;
