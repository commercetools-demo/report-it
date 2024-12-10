import { FormikErrors } from 'formik';
import { Widget } from '../../types/widget';
import WidgetMainInfo from './widget-main-info';
import { TabContext } from '../tab/tab-context';
import { Tabs } from '../tab/tabs';
import { TabPanels } from '../tab/panels';
import WidgetDatasource from './widget-datasource';
import DatasourceStateProvider from '../datasource/provider';
import WidgetQuery from '../query';
import WidgetDatasourceResponseProvider from './widget-datasource-response-provider';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
};

const WidgetTabularView = (props: Props) => {
  if (!props.widget?.name) {
    return <WidgetMainInfo {...props} />;
  }
  return (
    <DatasourceStateProvider>
      <TabContext defaultTab={0} paramName="widget-tab">
        {({ selectedTab, setSelectedTab }) => (
          <>
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
              <span>Main Info</span>
              <span>Select Datasource</span>
              <span>Write query</span>
            </Tabs>
            <TabPanels selectedTab={selectedTab}>
              <WidgetMainInfo {...props} />
              <WidgetDatasource {...props} />
              <WidgetDatasourceResponseProvider>
                <WidgetQuery {...props} />
              </WidgetDatasourceResponseProvider>
            </TabPanels>
          </>
        )}
      </TabContext>
    </DatasourceStateProvider>
  );
};

export default WidgetTabularView;
