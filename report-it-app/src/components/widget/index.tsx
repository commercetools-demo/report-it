import { WidgetResponse } from '../../types/widget';
import Chart from '../chart';
import WidgetDatasourceResponseProvider from '../widget-form/widget-datasource-response-provider';
import Text from '@commercetools-uikit/text';

type Props = {
  widget: WidgetResponse;
};

const Widget = ({ widget }: Props) => {
  const { value } = widget;

  if (!value) {
    return (
      <div>
        <Text.Caption tone="warning">Widget not found</Text.Caption>
      </div>
    );
  }
  if (!value?.config?.chartType) {
    return (
      <div>
        <Text.Caption tone="warning">No chart type</Text.Caption>
      </div>
    );
  }
  if (!value?.config?.chartFields?.length) {
    return (
      <div>
        <Text.Caption tone="warning">No chart fields</Text.Caption>
      </div>
    );
  }
  if (!value?.config?.sqlQuery) {
    return (
      <div>
        <Text.Caption tone="warning">No sql query</Text.Caption>
      </div>
    );
  }
  return (
    <WidgetDatasourceResponseProvider
      availableDatasourceKeys={value.config.datasources.map((d) => d.key)}
    >
      <Chart {...value.config} name={value.name} />
    </WidgetDatasourceResponseProvider>
  );
};

export default Widget;
