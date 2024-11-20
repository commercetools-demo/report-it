import { Link } from 'react-router-dom';
import DashboardTabView from './dashboard-tabs';
import { DashboardsProvider } from './provider';

type Props = {
  linkToParent: string;
};

const Dashboard = ({ linkToParent }: Props) => {
  return (
    <DashboardsProvider>
      <p>Dashboard</p>
      <Link to={`${linkToParent}/configuration`}>Configuration</Link>
      <DashboardTabView />
    </DashboardsProvider>
  );
};

export default Dashboard;
