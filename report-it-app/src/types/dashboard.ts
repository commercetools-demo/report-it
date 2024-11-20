import { WidgetRef } from './widget';

export interface DashboardCustomObject extends DashboardCustomObjectDraft {
  id: string;
  createdAt: string;
  version?: number;
}

export interface DashboardCustomObjectDraft {
  version?: number;
  container: string;
  key: string;
  value: {
    name: string;
    widgets?: WidgetRef[];
  };
}
export interface DashboardResponse extends DashboardCustomObjectDraft {
  id: string;
  createdAt: string;
}
