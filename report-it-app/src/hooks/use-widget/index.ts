import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { ExportableWidget, Widget, WidgetResponse } from '../../types/widget';
import { buildUrlWithParams, uniqueId } from '../../utils/utils';
import { PagedQueryResponse } from '../../types/general';
import { useDashboard } from '../use-dashboard';
import { CONTAINER as DATASOURCE_CONTAINER } from '../use-datasource';
import { Datasource, DatasourceResponse } from '../../types/datasource';

const CONTAINER = `${APP_NAME}_widgets`;
const WIDGET_KEY_PREFIX = 'widget-';

export const useWidget = () => {
  const { getDashboard, removeWidgetFromDashboard } = useDashboard();
  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, WidgetResponse>();
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<WidgetResponse>
  >();
  const dispatchDatasourceRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<DatasourceResponse>
  >();

  const getDatasources = async (
    datasourceKeys?: string[]
  ): Promise<DatasourceResponse[]> => {
    if (!datasourceKeys || !datasourceKeys.length) {
      return [] as DatasourceResponse[];
    }
    const result = await dispatchDatasourceRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(`/${context?.project?.key}/custom-objects`, {
          limit: '500',
          where: `container="${DATASOURCE_CONTAINER}" and key in (${datasourceKeys
            .map((key) => `"${key}"`)
            .join(',')})`,
        }),
      })
    );
    return result.results;
  };

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

  const deleteWidget = async (
    widgetKey: string,
    dashboardKey: string
  ): Promise<WidgetResponse> => {
    if (!widgetKey || !dashboardKey) {
      return {} as WidgetResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${widgetKey}`,
      })
    );
    if (result.key) {
      removeWidgetFromDashboard(dashboardKey, widgetKey);
    }
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

  const exportWidget = async (
    widgetKey: string,
    dashboardKey: string
  ): Promise<ExportableWidget> => {
    if (!widgetKey) {
      return {} as ExportableWidget;
    }
    const jsonResp: ExportableWidget = {
      widget: undefined,
      datasources: [],
    };
    const widgetRes = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${widgetKey}`,
      })
    );

    jsonResp.widget = {
      key: widgetKey,
      value: widgetRes.value,
    };

    if (widgetRes.value?.config?.datasources?.length) {
      const datasourcesRes = await getDatasources(
        widgetRes.value.config.datasources.map((d) => d.key)
      );
      jsonResp.datasources = datasourcesRes.map((d) => ({
        key: d.key,
        value: d.value,
      }));
    }
    return jsonResp;
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
    exportWidget,
    updateWidget,
    getWidgetsWithDatasource,
  };
};
