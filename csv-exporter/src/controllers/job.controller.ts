import { Request, Response } from 'express';

import CustomError from '../errors/custom.error';
import { getAllExportableWisgets } from '../services/fetch.widgets';
import { checkWidgetsForSchedule } from '../utils/schedule.widget';
import { executeWidgetsExport } from '../utils/execute.widget';
import { updateWidgetsHistory } from '../services/update.widgets';
import { logger } from '../utils/logger.utils';

/**
 * Exposed job endpoint.
 *
 * @param {Request} _request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (_request: Request, response: Response) => {
  try {
    // Get the orders
    const allWidgets = await getAllExportableWisgets({
      where: `value(csvExportConfig(enabled=true))`,
    });
    logger.info(
      'Retrieved all widgets with enabled status',
      allWidgets.results?.length
    );
    const allWidgetsCheckedSchedule = checkWidgetsForSchedule(allWidgets);
    logger.info(
      `Checked all widgets for schedule ${allWidgetsCheckedSchedule?.length}`
    );
    const executionResult = await executeWidgetsExport(
      allWidgetsCheckedSchedule
    );
    logger.info('Executed all widgets', executionResult.length);
    await updateWidgetsHistory(executionResult);

    response.status(200).send();
  } catch (error) {
    logger.error(error);
    throw new CustomError(500, 'Error executing widgets');
  }
};
