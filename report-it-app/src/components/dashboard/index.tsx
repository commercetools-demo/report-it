import DashboardTabView from './dashboard-tabs';
import { DashboardsProvider } from './provider';

const Dashboard = () => {
  return (
    <DashboardsProvider>
      <DashboardTabView />
    </DashboardsProvider>
  );
};

export default Dashboard;
