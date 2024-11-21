import { DashboardCustomObject } from '../../types/dashboard';
import DashboardGridWrapper from '../dashboard-grid/dashboard-grid-wrapper';
import { DashboardPanelProvider } from './provider';

type Props = {
  dashboard: DashboardCustomObject;
};

export const DashboardTabPanel = ({ dashboard }: Props) => {
  return (
    <DashboardPanelProvider dashboard={dashboard}>
      <DashboardGridWrapper />
    </DashboardPanelProvider>
  );
};
