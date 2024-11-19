import NewDatasource from './new-datasource';
import Spacings from '@commercetools-uikit/spacings';

const Datasource = () => {
  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <NewDatasource />
          </Spacings.Inline>
        </Spacings.Stack>
      </Spacings.Stack>
    </>
  );
};

export default Datasource;
