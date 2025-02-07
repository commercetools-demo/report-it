import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Dashboard from './components/dashboard';
import { OpenAIConfigurationProvider } from './providers/open-ai';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  return (
    <OpenAIConfigurationProvider>
      <Spacings.Inset scale="l">
        <Switch>
          <Route path={`${match.path}/:type?`}>
            <Dashboard linkToHome={match.url} />
          </Route>
        </Switch>
      </Spacings.Inset>
    </OpenAIConfigurationProvider>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
