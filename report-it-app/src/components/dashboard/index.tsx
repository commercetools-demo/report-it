import DashboardTabView from './dashboard-tabs';
import { DashboardsProvider } from './provider';
import { FC } from 'react';

type Props = {
  linkToHome: string;
};
const Dashboard: FC<Props> = ({ linkToHome }) => {
  return (
    <DashboardsProvider>
      <DashboardTabView linkToHome={linkToHome} />
    </DashboardsProvider>
  );
};

export default Dashboard;
