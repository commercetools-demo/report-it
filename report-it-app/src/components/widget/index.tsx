import React from 'react';
import { WidgetResponse } from '../../types/widget';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';

type Props = {
  widget: WidgetResponse;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Widget = ({ widget }: Props) => {
  return (
    <StyledDiv>
      <Chart
        // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
        chartType={widget.value?.config?.chartType || 'LineChart'}
        data={[
          ['Age', 'Weight'],
          [4, 16],
          [8, 25],
          [12, 40],
          [16, 55],
          [20, 70],
        ]}
        options={{
          title: 'Average Weight by Age',
        }}
        legendToggle
      />
    </StyledDiv>
  );
};

export default Widget;
