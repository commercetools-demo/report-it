import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import { Form, Formik } from 'formik';
import styled from 'styled-components';
import { useOpenAI } from '../../../hooks/openai';
import { Datasource } from '../../../types/datasource';
import AIGenerationButton from '../../ai-generation/ai-generation-button';
import Editor from '../editor';
import { designTokens } from '@commercetools-uikit/design-system';

type Props = {
  onSubmit: (datasource: Datasource) => Promise<void>;
  onDelete?: () => void;
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

const Spacer = styled.div`
  height: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const DatasourceForm = ({
  onSubmit,
  onCancel,
  onDelete,
  datasource = {
    name: '',
    query: initialQueryCtp,
    variables: '',
  } as Datasource,
}: Props) => {
  const { getGraphQLQueries } = useOpenAI();

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
                <PrimaryButton
                  label="Save"
                  onClick={submitForm}
                  type="button"
                />
                {!!datasource?.name && !!onDelete && (
                  <IconButton
                    label="Delete"
                    onClick={onDelete}
                    icon={<BinLinearIcon size="10" />}
                    type="button"
                  />
                )}
              </Spacings.Inline>
            </Spacings.Inline>
          </div>
          <Grid
            gridGap={designTokens.spacingM}
            gridTemplateColumns="repeat(2, 1fr)"
            gridAutoColumns="1fr"
          >
            <Grid.Item gridColumn="span 1">
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
          <Grid.Item gridColumn="span 2">
            <FieldLabel title="Query" />
            <Spacer />
            <AIGenerationButton onSelectAIGeneration={getGraphQLQueries}>
              {({ generatedQuery, isSuggestionArrived }) => (
                <Editor
                  target="ctp"
                  query={
                    !isSuggestionArrived ? datasource.query : generatedQuery
                  }
                  onUpdateQuery={(query) => setFieldValue('query', query)}
                  variables={datasource.variables}
                  onUpdateVariables={(variables) =>
                    setFieldValue('variables', variables)
                  }
                />
              )}
            </AIGenerationButton>
          </Grid.Item>

          {errors.query && (
            <Text.Caption tone="warning">{errors.query}</Text.Caption>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default DatasourceForm;
