import React from 'react';

type Props = {
  dashboardKey: string;
};

export const DashboardTabPanel = ({ dashboardKey }: Props) => {
  return <div>DashboardTab dashboardKey: {dashboardKey}</div>;
};
