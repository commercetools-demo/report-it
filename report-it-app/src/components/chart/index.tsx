import Text from '@commercetools-uikit/text';
import { useMemo } from 'react';
import { Chart as GoogleChart } from 'react-google-charts';
import styled from 'styled-components';
import { useQueryUtils } from '../query/hooks/use-query-utils';
import { useWidgetDatasourceResponseContext } from '../widget-form/widget-datasource-response-provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

type Props = {
  chartType: string;
  chartFields: string[];
  sqlQuery: string;
  name?: string;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Chart = ({ chartType, chartFields, sqlQuery, name }: Props) => {
  const { executeQuery, flattenObject } = useQueryUtils();
  const { datasources } = useWidgetDatasourceResponseContext();

  const chartData = useMemo(() => {
    if (Object.keys(datasources)?.length && sqlQuery) {
      const result = executeQuery(sqlQuery!);

      const data = [];
      data.push(chartFields.map((key) => key));

      result.forEach((item: any) => {
        const flatRow = flattenObject(item);
        data.push(chartFields.map((key) => flatRow[key]));
      });

      return data;
    }
    return [];
  }, [datasources]);

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
      <GoogleChart
        //   @ts-ignore
        chartType={chartType}
        data={chartData}
        options={{
          title: name,
        }}
        legendToggle
      />
    </StyledDiv>
  );
};

export default Chart;
