import { DatasourceRef } from './datasource';

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  isDraggable: boolean;
  i: string;
}

export interface Widget {
  config?: {
    [key: string]: any;
    datasource: DatasourceRef;
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