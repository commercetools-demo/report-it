import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { Widget, WidgetResponse } from '../../types/widget';
import { buildUrlWithParams, uniqueId } from '../../utils/utils';
import { PagedQueryResponse } from '../../types/general';
import { useDashboard } from '../use-dashboard';

const CONTAINER = `${APP_NAME}_widgets`;
const WIDGET_KEY_PREFIX = 'widget-';

export const useWidget = () => {
  const { getDashboard } = useDashboard();
  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, WidgetResponse>();
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<WidgetResponse>
  >();

  const createWidget = async (payload: Widget): Promise<WidgetResponse> => {
    const key = uniqueId(WIDGET_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
          } as Widget,
        },
      })
    );
    return result;
  };

  const deleteWidget = async (widgetKey: string): Promise<WidgetResponse> => {
    if (!widgetKey) {
      return {} as WidgetResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${widgetKey}`,
      })
    );
    return result;
  };

  const getWidget = async (widgetKey: string): Promise<WidgetResponse> => {
    if (!widgetKey) {
      return {} as WidgetResponse;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${widgetKey}`,
      })
    );
    return result;
  };

  const getWidgets = async (
    dashboardKey: string
  ): Promise<WidgetResponse[]> => {
    if (!dashboardKey) {
      return [] as WidgetResponse[];
    }
    const dashboard = await getDashboard(dashboardKey);
    const widgetKeys = dashboard?.value?.widgets?.map((w) => w.key) || [];
    if (!widgetKeys?.length) {
      return [] as WidgetResponse[];
    }
    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            where: `key in (${widgetKeys.map((key) => `"${key}"`).join(',')})`,
          }
        ),
      })
    );
    return result?.results;
  };

  const getWidgetsWithDatasource = async (
    datasourceKey: string
  ): Promise<WidgetResponse[]> => {
    if (!datasourceKey) {
      return [] as WidgetResponse[];
    }
    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            where: `value(config(datasources(key="${datasourceKey}")))`,
          }
        ),
      })
    );
    return result?.results;
  };

  const updateWidget = async (
    widgetKey: string,
    widget?: Widget
  ): Promise<WidgetResponse> => {
    if (!widgetKey || !widget) {
      return {} as WidgetResponse;
    }
    const result = await getWidget(widgetKey).then((ds) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: widgetKey,
            value: {
              ...ds.value,
              ...widget,
            } as Widget,
          },
        })
      );
    });
    return result;
  };

  return {
    createWidget,
    deleteWidget,
    getWidget,
    getWidgets,
    updateWidget,
    getWidgetsWithDatasource,
  };
};
