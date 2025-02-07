import { FormikErrors } from 'formik';
import { useMemo } from 'react';
import { Widget } from '../../types/widget';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import FieldLabel from '@commercetools-uikit/field-label';
import { useQueryUtils } from '../../hooks/use-query-utils';
import styled from 'styled-components';
import {
  Chart as GoogleChart,
  GoogleChartWrapperChartType,
} from 'react-google-charts';
import ChartFields from './chart-fields';
import { TCustomEvent } from '@commercetools-uikit/select-field/dist/declarations/src/select-field';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: (event: TCustomEvent) => void;
};

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

const WidgetChart = ({ values, handleChange }: Props) => {
  const { getChartData, error } = useQueryUtils();

  const { chartData, headers } = useMemo(() => {
    return getChartData(values.config?.sqlQuery!, values.config?.chartFields);
  }, [values.config?.chartFields]);

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
        <Spacings.Stack>
          <FieldLabel title="Chart fields" />
          {/* TODO: refresh chart when this changes */}
          <ChartFields
            defaultValues={headers}
            config={values?.config}
            configName="config"
            onChange={handleChange}
          />
        </Spacings.Stack>
      )}
      <StyledBorder />
      {!!chartData?.length && (
        <StyledDiv>
          <FieldLabel title="Chart preview" />
          <GoogleChart
            chartType={values?.config?.chartType as GoogleChartWrapperChartType}
            data={chartData}
            options={{
              title: values.name,
              colors: values?.config?.colors,
            }}
            legendToggle
          />
        </StyledDiv>
      )}
    </Spacings.Stack>
  );
};

export default WidgetChart;
