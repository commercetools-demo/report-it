import { useFormikContext } from 'formik';
import { Widget } from '../../types/widget';
import Datasource from '../datasource';

type Props = {
  widget?: Widget;
};
const WidgetDatasource = ({ widget }: Props) => {
  const formik = useFormikContext<Widget>();
  return (
    <Datasource
      widget={widget}
      values={formik.values}
      onSelect={(keys: string[]) => {
        formik.handleChange({
          target: {
            name: 'config.datasources',
            value: keys.map((key: string) => ({
              key,
              typeId: 'custom-object',
            })),
          },
        });
      }}
    />
  );
};

export default WidgetDatasource;
