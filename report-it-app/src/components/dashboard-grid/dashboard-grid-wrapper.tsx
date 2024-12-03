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
import WidgetForm from '../widget-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import { useEasyParams } from '../../hooks/use-params';

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DashboardGridWrapper = () => {
  const { addWidget, updateWidget, removeWidget, refresh, findWidget } =
    useDashboardPanelStateContext();
  const confirmState = useModalState();
  const showNotification = useShowNotification();
  const { setParam, clearParam, getParam } = useEasyParams();
  const [selectedWidget, setSelectedWidget] = useState<WidgetResponse | null>(
    findWidget(getParam('widgetKey'))
  );
  const drawerState = useModalState();

  const openModal = (widgetKey?: string) => {
    if (widgetKey) {
      setParam('widgetKey', widgetKey);
    }
    setSelectedWidget(findWidget(widgetKey));

    drawerState.openModal();
  };

  const closeModal = () => {
    drawerState.closeModal();
    clearParam('widgetKey');
  };

  const handleCreateWidget = async (widget: Widget) => {
    if (selectedWidget) {
      const result = await updateWidget?.(selectedWidget.key, widget);
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Widget updated successfully',
      });
      await refresh();
      if (result) {
        setSelectedWidget(result);
      }
    } else {
      const result = await addWidget?.(widget);
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.success,
        text: 'Widget created successfully',
      });
      await refresh();

      if (result) {
        setSelectedWidget(result);
      }
    }
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
        onClose={closeModal}
        hideControls
        size={10}
      >
        <WidgetForm
          onSubmit={handleCreateWidget}
          onDelete={handleDeleteConfirmation}
          onCancel={closeModal}
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
