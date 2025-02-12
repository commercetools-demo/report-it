import Text from '@commercetools-uikit/text';
import { useMemo } from 'react';
import {
  Chart as GoogleChart,
  GoogleChartWrapperChartType,
} from 'react-google-charts';
import styled from 'styled-components';
import { useWidgetDatasourceResponseContext } from '../../providers/widget-datasource-response-provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ChartFieldItem } from '../../types/widget';

type Props = {
  chartType: string;
  xAxis: string;
  yAxis: string;
  chartFields: ChartFieldItem[];
  colors: string[];
  sqlQuery: string;
  name?: string;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Chart = ({
  chartType,
  colors,
  xAxis,
  yAxis,
  sqlQuery,
  name,
  chartFields,
}: Props) => {
  const { getChartData } = useWidgetDatasourceResponseContext();
  const { chartData } = useMemo(() => {
    return getChartData(sqlQuery!, chartFields);
  }, [getChartData]);

  if (!chartData.length) {
    return (
      <div>
        <Text.Caption tone="information">
          <LoadingSpinner />
        </Text.Caption>
      </div>
    );
  }

  return (
    <StyledDiv>
      <Text.Subheadline as={'h5'} tone={'secondary'}>
        {name}
      </Text.Subheadline>
      <GoogleChart
        chartType={chartType as GoogleChartWrapperChartType}
        data={chartData}
        options={{
          colors: colors,
        }}
        legendToggle
      />
    </StyledDiv>
  );
};

export default Chart;
