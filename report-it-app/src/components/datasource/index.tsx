import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectedDatasources from './selected-datasources';
import styled from 'styled-components';
import AddFromDatasources from './add-from-datasources';
import { Widget } from '../../types/widget';

const Spacer = styled.div`
  height: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

interface Props {
  values: Widget;
  widget?: Widget;
  onSelect?: (keys: string[]) => void;
}
const Datasource: React.FC<Props> = ({ values, widget, onSelect }) => {
  return (
    <Spacings.Stack scale="xl">
      <Text.Headline>Selected datasources for this Widget</Text.Headline>
      <SelectedDatasources values={values} widget={widget} />
      <Spacer />
      <Spacings.Inline scale="xl">
        <AddFromDatasources
          onSelect={onSelect}
          widget={widget}
          values={values}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default Datasource;
