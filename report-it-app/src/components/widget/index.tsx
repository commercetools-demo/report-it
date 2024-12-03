import React from 'react';
import { WidgetResponse } from '../../types/widget';
import { Chart } from 'react-google-charts';

type Props = {
  widget: WidgetResponse;
};

const Widget = ({ widget }: Props) => {
  return (
    <Chart
      // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
      chartType="ScatterChart"
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
  );
};

export default Widget;
