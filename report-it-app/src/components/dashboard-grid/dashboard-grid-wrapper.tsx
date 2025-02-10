import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import DashboardGrid from './index';
import { useState } from 'react';
import { Widget, WidgetResponse } from '../../types/widget';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import WidgetForm from '../widget-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useEasyParams } from '../../hooks/use-params';
import ImportWidgetButton from '../widget/import-widget-button';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/flat-button';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { useHistory, useRouteMatch } from 'react-router-dom';

const DashboardGridWrapper = () => {
  const {
    addWidget,
    updateWidget,
    removeWidget,
    exportWidget,
    refresh,
    findWidget,
  } = useDashboardPanelStateContext();
  const showNotification = useShowNotification();
  const { setParam, clearParam, getParam } = useEasyParams();
  const [selectedWidget, setSelectedWidget] = useState<WidgetResponse | null>(
    findWidget(getParam('widgetKey'))
  );
  const drawerState = useModalState();
  const { push } = useHistory();
  const match = useRouteMatch();

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
  const handleExportWidget = async () => {
    if (!selectedWidget) {
      return;
    }
    const result = await exportWidget?.(selectedWidget.key);
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `widget-${selectedWidget.key}.json`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget exported successfully',
    });
  };

  const handleDeleteWidget = async (selectedWidgetKey: string) => {
    await removeWidget(selectedWidgetKey);
    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget deleted successfully',
    });
    await refresh();
    push(match.url);
  };

  return (
    <>
      <Constraints.Horizontal max={'scale'}>
        <Spacings.Inline alignItems={'flex-start'}>
          <DashboardGrid />
          <Spacings.Stack scale={'s'}>
            <IconButton
              onClick={() => openModal()}
              icon={<PlusBoldIcon size="10" />}
              title="Add widget"
              label=""
            />
            <ImportWidgetButton />
          </Spacings.Stack>
        </Spacings.Inline>
      </Constraints.Horizontal>
      <SuspendedRoute path={`${match.path}/edit/:selectedWidget`}>
        <WidgetForm
          onClose={async () => {
            push(match.url);
          }}
          onSubmit={handleCreateWidget}
          onDelete={handleDeleteWidget}
          onCancel={closeModal}
          onExport={handleExportWidget}
        />
      </SuspendedRoute>
      <Drawer
        title={selectedWidget ? 'Edit widget' : 'Add widget'}
        isOpen={drawerState.isModalOpen}
        onClose={closeModal}
        hideControls
        size={selectedWidget ? 30 : 10}
      >
        <WidgetForm
          onSubmit={handleCreateWidget}
          onCancel={closeModal}
          onExport={handleExportWidget}
        />
      </Drawer>
    </>
  );
};

export default DashboardGridWrapper;
