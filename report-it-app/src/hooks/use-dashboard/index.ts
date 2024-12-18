import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  MC_API_PROXY_TARGETS,
  NOTIFICATION_DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  actions,
  TSdkAction,
  useAsyncDispatch,
} from '@commercetools-frontend/sdk';
import { APP_NAME } from '../../constants';
import { PagedQueryResponse } from '../../types/general';

import {
  DashboardCustomObjectDraft,
  DashboardResponse,
} from '../../types/dashboard';
import { WidgetRef } from '../../types/widget';
import { buildUrlWithParams, uniqueId } from '../../utils/utils';
import { useShowNotification } from '@commercetools-frontend/actions-global';

const CONTAINER = `${APP_NAME}_dashboards`;
const DASHBOARD_KEY_PREFIX = 'dashboard-';

export const useDashboard = () => {
  const showNotification = useShowNotification();
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<DashboardResponse>
  >();
  const dispatchAppsAction = useAsyncDispatch<TSdkAction, DashboardResponse>();

  const fetchAllDashboards = async (limit: number = 20, page: number = 1) => {
    const offset = (page - 1) * limit;

    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            ...(limit && { limit: limit.toString() }),
            ...(offset && { offset: offset.toString() }),
          }
        ),
      })
    );
    return result;
  };

  const createDashboard = async (
    payload: DashboardCustomObjectDraft['value']
  ): Promise<DashboardResponse> => {
    const key = uniqueId(DASHBOARD_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
          },
        } as DashboardCustomObjectDraft,
      })
    );
    return result;
  };

  const getDashboard = async (
    dashboardKey: string
  ): Promise<DashboardResponse> => {
    if (!dashboardKey) {
      return {} as DashboardResponse;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${dashboardKey}`,
      })
    );
    return result;
  };

  const deleteDashboard = async (
    dashboardKey: string
  ): Promise<DashboardResponse> => {
    if (!dashboardKey) {
      return {} as DashboardResponse;
    }
    const dashboard = await getDashboard(dashboardKey);
    if (dashboard?.value?.widgets?.length) {
      showNotification({
        domain: NOTIFICATION_DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: 'There are widgets referenced in this dashboard. Please remove them first.',
      });
      return {} as DashboardResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${dashboardKey}`,
      })
    );
    return result;
  };

  const updateDashboard = async (
    dashboardKey: string,
    name?: string,
    widgets?: WidgetRef[]
  ): Promise<DashboardResponse> => {
    if (!dashboardKey) {
      return {} as DashboardResponse;
    }
    const result = await getDashboard(dashboardKey).then((ds) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: dashboardKey,
            value: {
              ...ds.value,
              ...(name && { name }),
              ...(widgets && { widgets }),
            },
          } as DashboardCustomObjectDraft,
        })
      );
    });
    return result;
  };

  const removeWidgetFromDashboard = async (
    dashboardKey: string,
    widgetKey: string
  ): Promise<DashboardResponse> => {
    if (!dashboardKey) {
      return {} as DashboardResponse;
    }
    const result = await getDashboard(dashboardKey).then((ds) => {
      const widgets = ds.value.widgets?.filter((w) => w.key !== widgetKey);
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: dashboardKey,
            value: {
              ...ds.value,
              widgets,
            },
          } as DashboardCustomObjectDraft,
        })
      );
    });
    return result;
  };

  return {
    fetchAllDashboards,
    removeWidgetFromDashboard,
    getDashboard,
    updateDashboard,
    createDashboard,
    deleteDashboard,
  };
};
