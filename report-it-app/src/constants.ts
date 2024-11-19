// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'report-it';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const APP_NAME = 'REPORT_IT';

