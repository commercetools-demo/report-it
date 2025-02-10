import DashboardGrid from './index';
import { Widget } from '../../types/widget';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import WidgetForm from '../widget-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import ImportWidgetButton from '../widget/import-widget-button';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/flat-button';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { useHistory, useRouteMatch } from 'react-router-dom';

const DashboardGridWrapper = () => {
  const { addWidget, updateWidget, removeWidget, exportWidget, refresh } =
    useDashboardPanelStateContext();
  const showNotification = useShowNotification();
  const { push } = useHistory();
  const match = useRouteMatch();

  const handleUpdateWidget = async (
    widget: Widget,
    selectedWidgetKey: string
  ) => {
    await updateWidget(selectedWidgetKey, widget);
    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget updated successfully',
    });
    await refresh();
  };

  const handleCreateWidget = async (widget: Widget) => {
    const result = await addWidget(widget);
    showNotification({
      domain: NOTIFICATION_DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Widget created successfully',
    });
    await refresh();
    push(`${match.url}/edit/${result?.key}`);
  };
  const handleExportWidget = async (selectedWidgetKey: string) => {
    const result = await exportWidget(selectedWidgetKey);
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `widget-${selectedWidgetKey}.json`);
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
              onClick={() => push(`${match.url}/new/`)}
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
          onSubmit={handleUpdateWidget}
          onDelete={handleDeleteWidget}
          onExport={handleExportWidget}
        />
      </SuspendedRoute>
      <SuspendedRoute path={`${match.path}/new`}>
        <WidgetForm
          onClose={async () => {
            push(match.url);
          }}
          onSubmit={handleCreateWidget}
        />
      </SuspendedRoute>
    </>
  );
};

export default DashboardGridWrapper;
