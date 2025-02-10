import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import TextInput from '@commercetools-uikit/text-input';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { useOpenAI } from '../../../hooks/openai';
import { Datasource } from '../../../types/datasource';
import AIGenerationButton from '../../ai-generation/ai-generation-button';
import Editor from '../editor';
import { designTokens } from '@commercetools-uikit/design-system';
import { CustomFormModalPage } from '@commercetools-frontend/application-components';
import TextField from '@commercetools-uikit/text-field';
import FieldErrors from '@commercetools-uikit/field-errors';
import omitEmpty from 'omit-empty-es';

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

type TErrors = {
  name: { missing?: boolean };
  query: { missing?: boolean };
};

const validate = (values: Datasource) => {
  const errors: TErrors = { name: {}, query: {} };

  if (TextInput.isEmpty(values.name) || values.name.trim().length === 0) {
    errors.name.missing = true;
  }
  if (TextInput.isEmpty(values.query) || values.query.trim().length === 0) {
    errors.query.missing = true;
  }

  return omitEmpty<TErrors>(errors);
};

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

  const formik = useFormik({
    initialValues: datasource,
    onSubmit: onSubmit,
    enableReinitialize: true,
    validate: validate,
  });

  return (
    <CustomFormModalPage
      title={'Create a new datasource'}
      isOpen={true}
      onClose={onCancel}
      formControls={
        <>
          <CustomFormModalPage.FormSecondaryButton
            label="Cancel"
            onClick={onCancel}
          />
          <CustomFormModalPage.FormPrimaryButton
            label="Save"
            onClick={formik.submitForm}
            isDisabled={!formik.dirty}
          />
          {!!datasource?.name && !!onDelete && (
            <IconButton
              label="Delete"
              onClick={onDelete}
              icon={<BinLinearIcon size="10" />}
              type="button"
            />
          )}
        </>
      }
    >
      <Grid
        gridGap={designTokens.spacingM}
        gridTemplateColumns="repeat(2, 1fr)"
        gridAutoColumns="1fr"
      >
        <Grid.Item>
          <TextField
            title={'Name'}
            value={formik.values.name || ''}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={TextField.toFieldErrors<TErrors>(formik.errors).name}
            touched={!!formik.touched.name}
          />
        </Grid.Item>
        <Grid.Item gridColumn="span 2">
          <FieldLabel title="Query" />

          <Spacer />
          <AIGenerationButton onSelectAIGeneration={getGraphQLQueries}>
            {({ generatedQuery, isSuggestionArrived }) => (
              <Editor
                target="ctp"
                query={!isSuggestionArrived ? datasource.query : generatedQuery}
                onUpdateQuery={(query) => formik.setFieldValue('query', query)}
                variables={datasource.variables}
                onUpdateVariables={(variables) =>
                  formik.setFieldValue('variables', variables)
                }
              />
            )}
          </AIGenerationButton>
          <FieldErrors
            errors={(formik.errors as TErrors).query}
            isVisible={true}
          />
        </Grid.Item>
      </Grid>
    </CustomFormModalPage>
  );
};
export default DatasourceForm;
