import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useState } from 'react';
import { DashboardCustomObject } from '../../types/dashboard';
import { DashboardTabPanel } from '../dashboard-tab-panel';
import { TabPanels } from '../tab/panels';
import { Tabs } from '../tab/tabs';
import DashbaordForm from './dashboard-form';
import DashboardTabButton from './dashboard-tab-button';
import NewDashboard from './new-dashboard';
import { useDashboardsStateContext } from './provider';
import { TabContext } from '../tab/tab-context';
const DashboardTabView = () => {
  const { isLoading, dashboards } = useDashboardsStateContext();
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardCustomObject | null>();
  const { createDashboard, updateDashboard } = useDashboardsStateContext();
  const showNotification = useShowNotification();
  const drawerState = useModalState();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCreateDashbaord = async (dashbaord: DashboardCustomObject) => {
    try {
      if (selectedDashboard) {
        await updateDashboard?.(dashbaord);
      } else {
        await createDashboard?.(dashbaord.value.name);
      }
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Dashboard created successfully',
      });
    } catch (error: any) {
      showNotification({
        domain: NOTIFICATION_DOMAINS.PAGE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: error.message,
      });
    } finally {
      drawerState.closeModal();
      setSelectedDashboard(null);
    }
  };

  const openModal = (dashboardKey?: string) => {
    setSelectedDashboard(
      !dashboardKey ? null : dashboards?.find((d) => d.key === dashboardKey)
    );

    drawerState.openModal();
  };
  return (
    <>
      <TabContext defaultTab={0}>
        {({ selectedTab, setSelectedTab }) => (
          <>
            <Tabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              additionalComponent={<NewDashboard openModal={openModal} />}
            >
              {dashboards?.map((dashboard) => (
                <DashboardTabButton
                  key={dashboard.id}
                  dashbaord={dashboard}
                  openModal={openModal}
                />
              ))}
            </Tabs>
            <TabPanels selectedTab={selectedTab}>
              {dashboards?.map((dashboard) => (
                <DashboardTabPanel
                  dashboardKey={dashboard.key}
                  key={dashboard.id}
                ></DashboardTabPanel>
              ))}
            </TabPanels>
          </>
        )}
      </TabContext>
      <Drawer
        title="Add new datasource"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={10}
      >
        <DashbaordForm
          onSubmit={handleCreateDashbaord}
          onCancel={drawerState.closeModal}
          dashboard={selectedDashboard ?? undefined}
        />
      </Drawer>
    </>
  );
};

export default DashboardTabView;
