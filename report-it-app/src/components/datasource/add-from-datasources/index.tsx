import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { Widget } from '../../../types/widget';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { lazy } from 'react';
const PickDatasource = lazy(() => import('../pick-datasource/pick-datasource'));

interface Props {
  onSelect?: (keys: string[]) => void;
  widget?: Widget;
  values?: Widget;
}
const AddFromDatasources = ({ onSelect, values }: Props) => {
  const selectedDatasources = values?.config?.datasources?.map((d) => d.key);
  const match = useRouteMatch();
  const { push } = useHistory();

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Pick from datasources"
        onClick={() => push(`${match.url}/pick`)}
      />
      <SuspendedRoute path={`${match.path}/pick`}>
        <PickDatasource
          onClose={() => push(`${match.url}`)}
          selectedDatasources={selectedDatasources}
          onSelect={onSelect}
        />
      </SuspendedRoute>
    </>
  );
};

export default AddFromDatasources;
