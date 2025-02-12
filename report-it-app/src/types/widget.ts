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
  csvExportConfig?: {
    enabled: boolean;
    url?: string;
    schedule?: string;
    json?: boolean;
    csv?: boolean;
    history?: {
      text: string;
      date: string;
    }[];
  };
}

export interface WidgetRef {
  key: string;
  typeId: 'key-value-document';
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
