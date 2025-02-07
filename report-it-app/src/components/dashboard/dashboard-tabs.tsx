import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  ConfirmationDialog,
  Drawer,
  TabularMainPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useState } from 'react';
import { DashboardCustomObject } from '../../types/dashboard';
import { DashboardTabPanel } from '../dashboard-tab-panel';
import DashboardForm from './dashboard-form';
import { useDashboardsStateContext } from './provider';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Text from '@commercetools-uikit/text';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TabHeader from '../tab/tab-header';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS } from '../../constants';
const DashboardTabView = () => {
  const { isLoading, dashboards } = useDashboardsStateContext();
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardCustomObject | null>();
  const { createDashboard, updateDashboard, deleteDashboard } =
    useDashboardsStateContext();
  const showNotification = useShowNotification();
  const drawerState = useModalState();
  const confirmState = useModalState();
  const match = useRouteMatch();

  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const handleCreateDashbaord = async (dashboard: DashboardCustomObject) => {
    try {
      if (selectedDashboard) {
        await updateDashboard?.(dashboard);
      } else {
        await createDashboard?.(dashboard.value.name);
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
      <TabularMainPage
        customTitleRow={
          <Spacings.Inline justifyContent="space-between">
            <span></span>
            <SecondaryButton
              iconLeft={<PlusBoldIcon />}
              label={'Add new Tab'}
              isDisabled={!canManage}
              onClick={() => openModal()}
            />
          </Spacings.Inline>
        }
        tabControls={(dashboards || []).map((dashboard, index) => {
          return (
            <TabHeader
              key={index}
              dashboardKey={dashboard.key}
              to={`${match.url}${index === 0 ? '' : '/' + dashboard.id}`}
              label={dashboard.value.name}
              exactPathMatch={true}
              openModal={openModal}
            />
          );
        })}
      >
        <Switch>
          {(dashboards || []).map((dashboard, index) => {
            const paths = [`${match.path}/${dashboard.id}`];
            if (index === 0) {
              paths.push(match.path);
            }
            return (
              <Route key={index} path={paths} exact={true}>
                <DashboardTabPanel dashboard={dashboard} key={dashboard.key} />
              </Route>
            );
          })}
        </Switch>
      </TabularMainPage>
      <Drawer
        title={selectedDashboard ? 'Edit dashboard' : 'Add new dashboard'}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={10}
      >
        <DashboardForm
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
