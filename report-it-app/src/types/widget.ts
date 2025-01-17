import { Datasource, DatasourceRef } from './datasource';

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  isDraggable: boolean;
  i: string;
}

export interface ChartFieldItem {
  key: string;
  type: string;
  label: string;
  enabled?: boolean;
}
export interface Widget {
  name: string;
  config?: {
    [key: string]: any;
    chartType: string;
    chartFields: ChartFieldItem[];
    colors: string[];
    xAxis: string;
    yAxis: string;
    sqlQuery: string;
    datasources: DatasourceRef[];
  };
  layout: WidgetLayout;
}

export interface WidgetRef {
  key: string;
  typeId: 'custom-object';
}

export interface WidgetResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Widget;
}

export interface ExportableWidget {
  widget?: {
    key: string;
    value?: Widget;
  };
  datasources: {
    key: string;
    value?: Datasource;
  }[];
}
