import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import uniqueId from 'lodash/uniqueId';
import { Widget, WidgetResponse } from '../../types/widget';

const CONTAINER = `${APP_NAME}_widgets`;
const WIDGET_KEY_PREFIX = 'widget-';

export const useWidget = () => {
  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, WidgetResponse>();

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

  const updateWdiget = async (
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
              widget,
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
    updateWdiget,
  };
};
