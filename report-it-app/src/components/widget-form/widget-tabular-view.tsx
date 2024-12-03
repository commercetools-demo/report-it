import { FormikErrors } from 'formik';
import { Widget } from '../../types/widget';
import WidgetMainInfo from './widget-main-info';
import { TabContext } from '../tab/tab-context';
import { Tabs } from '../tab/tabs';
import { TabPanels } from '../tab/panels';

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
    <TabContext defaultTab={0} paramName="widget-tab">
      {({ selectedTab, setSelectedTab }) => (
        <>
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
            <span>Main Info</span>
          </Tabs>
          <TabPanels selectedTab={selectedTab}>
            <WidgetMainInfo {...props} />
          </TabPanels>
        </>
      )}
    </TabContext>
  );
};

export default WidgetTabularView;
