import { createApiRoot } from '../client/create.client';
import { Widget } from '../types/index.types';
import { APP_NAME } from '../utils/constants';
import { logger } from '../utils/logger.utils';
const CONTAINER = `${APP_NAME}_widgets`;

export const updateWidgetsHistory = async (
  widgetResults: (
    | {
        result: any;
        widget: Widget;
      }
    | {
        error: any;
        widget: Widget;
      }
  )[]
) => {
  for await (const widgetResult of widgetResults) {
    logger.info(`Updating widget history ${widgetResult.widget.key}`);
    await createApiRoot()
      .customObjects()
      .withContainerAndKey({
        container: CONTAINER,
        key: widgetResult.widget.key,
      })
      .get()
      .execute()
      .then((response) => {
        const { body } = response;
        const { version, value } = body;

        const updatedValue = {
          ...value,
          csvExportConfig: {
            ...value.csvExportConfig,
            history: [
              ...(value.csvExportConfig.history || []),
              {
                text:
                  'error' in widgetResult
                    ? widgetResult.error?.message || widgetResult.error
                    : 'Success',
                date: new Date().toISOString(),
              },
            ],
          },
        };
        return createApiRoot()
          .customObjects()
          .post({
            body: {
              container: CONTAINER,
              key: widgetResult.widget.key,
              version,
              value: updatedValue,
            },
          })
          .execute();
      });
  }
};
