import {
  Drawer,
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

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DashboardGridWrapper = () => {
  const drawerState = useModalState();
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

  const handleDeleteWidget = async (widgetKey: string) => {
    await removeWidget?.(widgetKey);
    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget deleted successfully',
    });
    await refresh();
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
          onDelete={handleDeleteWidget}
          onCancel={drawerState.closeModal}
          widget={selectedWidget?.value ?? undefined}
        />
      </Drawer>
    </>
  );
};

export default DashboardGridWrapper;
