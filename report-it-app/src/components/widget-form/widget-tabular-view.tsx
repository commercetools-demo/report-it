import { FormikErrors } from 'formik';
import { Widget } from '../../types/widget';
import WidgetMainInfo from './widget-main-info';
import { TabContext } from '../tab/tab-context';
import { Tabs } from '../tab/tabs';
import { TabPanels } from '../tab/panels';
import WidgetDatasource from './widget-datasource';
import DatasourceStateProvider from '../datasource/provider';
import WidgetQuery from '../query';
import WidgetDatasourceResponseProvider from '../../providers/widget-datasource-response-provider';
import WidgetChart from './widget-chart';
import { useMemo, useState } from 'react';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
  setFieldValue: any;
};

const WidgetTabularView = (props: Props) => {
  const availableDatasourceKeys = useMemo(() => {
    return props.widget?.config?.datasources.map((d) => d.key);
  }, [props.widget?.config?.datasources]);
  if (!props.widget?.name) {
    return <WidgetMainInfo {...props} />;
  }
  return (
    <DatasourceStateProvider>
      <TabContext defaultTab={0} paramName="widget-tab">
        {({ selectedTab, setSelectedTab }) => (
          <WidgetDatasourceResponseProvider
            availableDatasourceKeys={availableDatasourceKeys}
          >
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
              <span>Main Info</span>
              <span>Select Datasource</span>
              <span>Write query</span>
              <span>Chart</span>
            </Tabs>
            <TabPanels selectedTab={selectedTab}>
              <WidgetMainInfo {...props} />
              <WidgetDatasource {...props} />
              <WidgetQuery {...props} />
              <WidgetChart {...props} />
            </TabPanels>
          </WidgetDatasourceResponseProvider>
        )}
      </TabContext>
    </DatasourceStateProvider>
  );
};

export default WidgetTabularView;
