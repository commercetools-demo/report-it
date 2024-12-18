import NewDatasource from './new-datasource';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import AllDatasources from './all-datasources';
import SelectedDatasources from './selected-datasources';
import styled from 'styled-components';

const Spacer = styled.div`
  height: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

interface Props {
  selectedDatasources?: string[];
  onSelect?: (keys: string[]) => void;
}
const Datasource: React.FC<Props> = ({ selectedDatasources, onSelect }) => {
  return (
    <Spacings.Stack scale="xl">
      <Text.Headline>Selected datasources for this Widget</Text.Headline>
      <SelectedDatasources selectedDatasources={selectedDatasources} />
      <Spacer />
      <Spacings.Stack scale="l">
        <Text.Headline>Pick from all Datasources</Text.Headline>
        <AllDatasources
          selectedDatasources={selectedDatasources}
          onSelect={onSelect}
        />
        <Spacings.Inline justifyContent="space-between">
          <NewDatasource />
        </Spacings.Inline>
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default Datasource;
