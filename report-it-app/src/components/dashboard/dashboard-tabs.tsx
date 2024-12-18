import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  ConfirmationDialog,
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
import { TabContext } from '../tab/tab-context';
import { Tabs } from '../tab/tabs';
import DashbaordForm from './dashboard-form';
import DashboardTabButton from './dashboard-tab-button';
import NewDashboardButton from './new-dashboard-button';
import { useDashboardsStateContext } from './provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Text from '@commercetools-uikit/text';
const DashboardTabView = () => {
  const { isLoading, dashboards } = useDashboardsStateContext();
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardCustomObject | null>();
  const { createDashboard, updateDashboard, deleteDashboard } =
    useDashboardsStateContext();
  const showNotification = useShowNotification();
  const drawerState = useModalState();
  const confirmState = useModalState();

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
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

  const handleDeleteDashboard = async () => {
    const result = await deleteDashboard?.(selectedDashboard?.key || '');
    if (result?.key) {
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Dashboard deleted successfully',
      });
    }
    drawerState.closeModal();
    confirmState.closeModal();
    setSelectedDashboard(null);
  };

  const handleDeleteConfirmation = () => {
    if (!selectedDashboard?.key) {
      return;
    }

    confirmState.openModal();
  };

  const openModal = (dashboardKey?: string) => {
    setSelectedDashboard(
      !dashboardKey ? null : dashboards?.find((d) => d.key === dashboardKey)
    );

    drawerState.openModal();
  };
  return (
    <>
      <TabContext defaultTab={0} paramName="dashboard">
        {({ selectedTab, setSelectedTab }) => (
          <>
            <Tabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              additionalComponent={<NewDashboardButton openModal={openModal} />}
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
                  dashboard={dashboard}
                  key={dashboard.key}
                ></DashboardTabPanel>
              ))}
            </TabPanels>
          </>
        )}
      </TabContext>
      <Drawer
        title={selectedDashboard ? 'Edit dashboard' : 'Add new dashboard'}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={10}
      >
        <DashbaordForm
          onSubmit={handleCreateDashbaord}
          onCancel={drawerState.closeModal}
          onDelete={handleDeleteConfirmation}
          dashboard={selectedDashboard ?? undefined}
        />
      </Drawer>
      <ConfirmationDialog
        isOpen={confirmState.isModalOpen}
        onClose={confirmState.closeModal}
        onConfirm={handleDeleteDashboard}
        title="Delete datasource"
        onCancel={confirmState.closeModal}
      >
        <Text.Body>Are you sure you want to delete this dashboard?</Text.Body>
      </ConfirmationDialog>
    </>
  );
};

export default DashboardTabView;
