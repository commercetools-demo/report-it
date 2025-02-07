import DashboardTabView from './dashboard-tabs';
import { DashboardsProvider } from './provider';

type Props = {
  linkToHome: string;
};
const Dashboard: React.FC<Props> = ({ linkToHome }) => {
  return (
    <DashboardsProvider>
      <DashboardTabView linkToHome={linkToHome} />
    </DashboardsProvider>
  );
};

export default Dashboard;
