import { CustomObjectPagedQueryResponse } from '@commercetools/platform-sdk';

import { createApiRoot } from '../client/create.client';
import { getAll } from './modifier';
import { APP_NAME } from '../utils/constants';
import { DatasourceRef, GetFunction } from '../types/index.types';
const WIDGETS_CONTAINER = `${APP_NAME}_widgets`;
const DATASOURCES_CONTAINER = `${APP_NAME}_datasources`;

const allExportableWisgets: GetFunction<
  CustomObjectPagedQueryResponse
> = async (queryArgs) => {
  const rawWidgets = await createApiRoot()
    .customObjects()
    .withContainer({ container: WIDGETS_CONTAINER })
    .get({
      queryArgs,
    })
    .execute()
    .then((response) => response.body);

  for await (const widget of rawWidgets.results) {
    const rawDatasourceRefs = widget.value.config.datasources;
    let datasources = rawDatasourceRefs;
    if (rawDatasourceRefs?.length) {
      datasources = await Promise.all(
        rawDatasourceRefs.map(async (datasource: DatasourceRef) => {
          const ds = await createApiRoot()
            .customObjects()
            .withContainerAndKey({
              container: DATASOURCES_CONTAINER,
              key: datasource.key,
            })
            .get()
            .execute()
            .then((response) => ({
              ...datasource,
              obj: response.body,
            }));
          return ds;
        })
      );
    }

    widget.value.config.datasources = datasources;
    widget.value.key = widget.key;
  }

  return rawWidgets;
};

export const getAllExportableWisgets: GetFunction<CustomObjectPagedQueryResponse> =
  getAll(allExportableWisgets);
