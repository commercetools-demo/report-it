import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import Editor from '../editor';
import { Datasource } from '../../../../../types/datasource';

type Props = {
  onSubmit: (datasource: Datasource) => Promise<void>;
  onCancel: () => void;
  datasource?: Datasource;
};

const initialQueryCtp = `# shift-option/alt-click on a query below to jump to it in the explorer
# option/alt-click on a field in the explorer to select all subfields
query ProjectInfo {
  project {
    name
    key
  }
}
`;

const DatasourceForm = ({
  onSubmit,
  onCancel,
  datasource = {
    name: '',
    query: initialQueryCtp,
    variables: '',
  } as Datasource,
}: Props) => {
  const handleValidation = (values: Datasource) => {
    const errors: Record<keyof Datasource, string> = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.query) {
      errors['query'] = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={datasource}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm, setFieldValue }) => (
        <Form>
          <div style={{ paddingBottom: '16px' }}>
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="m"
            >
              <SecondaryButton
                label="Cancel"
                onClick={onCancel}
                type="button"
              />
              <PrimaryButton label="Save" onClick={submitForm} type="button" />
            </Spacings.Inline>
          </div>
          <Grid
            gridGap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            gridAutoColumns="1fr"
          >
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <FieldLabel title="Name" />
                <TextInput
                  value={values?.name}
                  name="name"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.name && (
                <Text.Caption tone="warning">{errors.name}</Text.Caption>
              )}
            </Grid.Item>
          </Grid>
          <Editor
            target="ctp"
            query={datasource.query}
            onUpdateQuery={(query) => setFieldValue('query', query)}
            variables={datasource.variables}
            onUpdateVariables={(variables) =>
              setFieldValue('variables', variables)
            }
          />
          {errors.query && (
            <Text.Caption tone="warning">{errors.query}</Text.Caption>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default DatasourceForm;
