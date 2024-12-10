import NewDatasource from './new-datasource';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import AllDatasources from './all-datasources';
import SelectedDatasources from './selected-datasources';

interface Props {
  selectedDatasources?: string[];
  onSelect?: (keys: string[]) => void;
}
const Datasource: React.FC<Props> = ({ selectedDatasources, onSelect }) => {
  return (
    <Spacings.Stack scale="xl">
      <Text.Subheadline>Selected Datasources</Text.Subheadline>
      <SelectedDatasources selectedDatasources={selectedDatasources} />
      <Spacings.Stack scale="l">
        <Text.Subheadline>Pick from all Datasources</Text.Subheadline>
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
