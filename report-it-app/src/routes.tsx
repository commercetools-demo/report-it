import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Dashboard from './components/dashboard';
import Configuration from './components/configuration';
import { OpenAIConfigurationProvider } from './providers/open-ai';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/merchant-center-customizations/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <OpenAIConfigurationProvider>
      <Spacings.Inset scale="l">
        <Switch>
          <Route path={`${match.path}/configuration`}>
            <Configuration linkToParent={match.url} />
          </Route>
          <Route>
            <Dashboard linkToParent={match.url} />
          </Route>
        </Switch>
      </Spacings.Inset>
    </OpenAIConfigurationProvider>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
