import { FormikErrors } from 'formik';
import React from 'react';
import { Widget } from '../../types/widget';
import Datasource from '../datasource';

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
};
const WidgetDatasource = ({ errors, values, handleChange, widget }: Props) => {
  return (
    <div>
      <Datasource
        widget={widget}
        values={values}
        onSelect={(keys: string[]) => {
          handleChange({
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
    </div>
  );
};

export default WidgetDatasource;
