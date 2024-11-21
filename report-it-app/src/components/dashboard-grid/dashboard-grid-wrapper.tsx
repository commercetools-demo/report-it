import {
  Drawer,
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import styled from 'styled-components';
import DashboardGrid from '.';
import NewWidgetButton from '../widget/new-widget-button';
import { useState } from 'react';
import { Widget, WidgetResponse } from '../../types/widget';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import WidgetForm from '../widget/widget-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DashboardGridWrapper = () => {
  const drawerState = useModalState();
  const confirmState = useModalState();
  const [selectedWidget, setSelectedWidget] = useState<WidgetResponse | null>();
  const showNotification = useShowNotification();

  const { widgets, addWidget, updateWidget, removeWidget, refresh } =
    useDashboardPanelStateContext();

  const openModal = (widgetKey?: string) => {
    setSelectedWidget(
      !widgetKey ? null : widgets?.find((d) => d.key === widgetKey)
    );

    drawerState.openModal();
  };

  const handleCreateWidget = async (widget: Widget) => {
    if (selectedWidget) {
      await updateWidget?.(selectedWidget.key, widget);
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Widget updated successfully',
      });
    } else {
      await addWidget?.(widget);
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Widget created successfully',
      });
    }
    await refresh();
    drawerState.closeModal();
  };

  const handleDeleteConfirmation = () => {
    if (!selectedWidget) {
      return;
    }

    confirmState.openModal();
  };

  const handleDeleteWidget = async () => {
    if (!selectedWidget) {
      return;
    }
    await removeWidget?.(selectedWidget.key);
    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget deleted successfully',
    });
    await refresh();
    drawerState.closeModal();
    confirmState.closeModal();
  };

  return (
    <>
      <StyledWrapper>
        <DashboardGrid onSelectWidget={openModal} />
        <NewWidgetButton openModal={openModal} />
      </StyledWrapper>
      <Drawer
        title={selectedWidget ? 'Edit widget' : 'Add widget'}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={10}
      >
        <WidgetForm
          onSubmit={handleCreateWidget}
          onDelete={handleDeleteConfirmation}
          onCancel={drawerState.closeModal}
          widget={selectedWidget?.value ?? undefined}
        />
      </Drawer>
      <ConfirmationDialog
        isOpen={confirmState.isModalOpen}
        onClose={confirmState.closeModal}
        onConfirm={handleDeleteWidget}
        title="Delete widget"
        onCancel={confirmState.closeModal}
      >
        <Text.Body>Are you sure you want to delete this widget?</Text.Body>
      </ConfirmationDialog>
    </>
  );
};

export default DashboardGridWrapper;
