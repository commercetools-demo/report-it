import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { PagedQueryResponse } from '../../types/general';
import {
  Datasource,
  DatasourceDraft,
  DatasourceResponse,
} from '../../types/datasource';
import { buildUrlWithParams, uniqueId } from '../../utils/utils';

const CONTAINER = `${APP_NAME}_datasources`;
const DATASOURCES_KEY_PREFIX = 'datasource-';

export const useDatasource = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<DatasourceResponse>
  >();
  const dispatchAppsAction = useAsyncDispatch<TSdkAction, DatasourceResponse>();

  const fetchAllDatasources = async (limit: number = 20, page: number = 1) => {
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

  const createDatasource = async (
    payload: DatasourceDraft
  ): Promise<DatasourceResponse> => {
    const key = uniqueId(DATASOURCES_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
            key,
          } as DatasourceDraft,
        },
      })
    );
    return result;
  };

  const deleteDatasource = async (
    datasourceKey: string
  ): Promise<DatasourceResponse> => {
    if (!datasourceKey) {
      return {} as DatasourceResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${datasourceKey}`,
      })
    );
    return result;
  };

  const getDatasource = async (
    datasourceKey: string
  ): Promise<DatasourceResponse> => {
    if (!datasourceKey) {
      return {} as DatasourceResponse;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${datasourceKey}`,
      })
    );
    return result;
  };

  const updateDatasource = async (
    datasourceKey: string,
    datasource?: Datasource
  ): Promise<DatasourceResponse> => {
    if (!datasourceKey || !datasource) {
      return {} as DatasourceResponse;
    }
    const result = await getDatasource(datasourceKey).then((ds) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: datasourceKey,
            value: {
              ...ds.value,
              ...datasource,
            } as DatasourceDraft,
          },
        })
      );
    });
    return result;
  };

  return {
    fetchAllDatasources,
    getDatasource,
    updateDatasource,
    deleteDatasource,
    createDatasource,
  };
};
