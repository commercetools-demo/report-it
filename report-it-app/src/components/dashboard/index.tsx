import React from 'react';
import { Link } from 'react-router-dom';
import { TabContent } from '../tab';
import { DashboardsProvider } from './provider';
import DashboardTabView from './dashboard-tabs';

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
