import { CustomObjectPagedQueryResponse } from '@commercetools/platform-sdk';
import cron from 'node-cron';
import { logger } from './logger.utils';
import cronParser from 'cron-parser';
import { Widget } from '../types/index.types';

const THRESHOLD_IN_MINUTES = 5;
export const checkWidgetsForSchedule = (
  allWidgets?: CustomObjectPagedQueryResponse
) => {
  const scheduleTimeIsReached: Widget[] = [];
  allWidgets?.results?.map((widget) => {
    const schedule = widget.value.csvExportConfig?.schedule;

    if (schedule) {
      if (checkAndExecute(schedule)) {
        logger.info(`Schedule time is reached for widget: ${widget.key}`);
        scheduleTimeIsReached.push({ key: widget.key, ...widget.value });
      } else {
        logger.info(`Schedule time is NOT reached for widget: ${widget.key}`);
      }
    }
  });
  return scheduleTimeIsReached;
};

const checkAndExecute = (schedule: string) => {
  const now = new Date().getTime();

  // Validate if the schedule is a valid cron expression
  if (!cron.validate(schedule)) {
    logger.error('Invalid schedule format');
    return;
  }

  try {
    const interval = cronParser.parseExpression(schedule);
    const nextRun = interval.next().toDate().getTime();

    // Check if current time matches the schedule
    // We'll give a 1-minute window to account for slight delays
    const diffInMinutes = Math.abs((nextRun - now) / (1000 * 60));

    if (diffInMinutes <= THRESHOLD_IN_MINUTES) {
      return true;
    }
    return false;
    // If not the right time, do nothing
  } catch (err) {
    logger.error('Error parsing schedule:', err);
    return false;
  }
};
