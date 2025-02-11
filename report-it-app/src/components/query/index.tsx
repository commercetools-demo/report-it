import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Widget, WidgetResponse } from '../../types/widget';
import { useQueryUtils } from '../../hooks/use-query-utils';
import Previews from './previews';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import AIGenerationButton from '../ai-generation/ai-generation-button';
import { useOpenAI } from '../../hooks/openai';
import ErrorBoundary from '../error-boundary';
import DataTable from '@commercetools-uikit/data-table';
import { useWidgetDatasourceResponseContext } from '../../providers/widget-datasource-response-provider';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const QueryTextarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const Alert = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 1rem;
  color: #991b1b;
  margin-bottom: 1rem;
`;

const NoDataMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const PREVIEW_ROWS = 5;

const WidgetQuery = () => {
  const formik = useFormikContext<Widget>();
  const { flattenObject } = useQueryUtils();
  const { getAlaSQLQueries } = useOpenAI();
  const { executeQuery, queryResult, error } =
    useWidgetDatasourceResponseContext();
  const handleGetAlaSQLQueries = async (seed: string): Promise<string> => {
    const result = await getAlaSQLQueries(seed);
    formik.setFieldValue('config.sqlQuery', result);
    return result;
  };

  const getHeaders = () => {
    return Object.keys(queryResult?.[0] || {}).map((key) => ({
      key,
      label: key,
    }));
  };

  if (!formik.values.config?.datasources?.length) {
    return (
      <div>
        <Text.Caption tone="warning">
          Please select at least one datasource
        </Text.Caption>
      </div>
    );
  }

  return (
    <Container>
      {/* Data Preview Section */}
      <Card>
        <CardTitle>Available Tables Preview</CardTitle>
        <Previews />
      </Card>

      {/* Query Editor Section */}
      <Card>
        <CardTitle>SQL Query Editor</CardTitle>
        <AIGenerationButton onSelectAIGeneration={handleGetAlaSQLQueries}>
          {() => (
            <QueryTextarea
              value={formik.values.config?.sqlQuery}
              name="config.sqlQuery"
              onChange={formik.handleChange}
              placeholder="Enter your SQL query here..."
            />
          )}
        </AIGenerationButton>
        <PrimaryButton
          label="Execute Query"
          type="button"
          isDisabled={!formik.values.config?.sqlQuery}
          onClick={() => executeQuery(formik.values.config?.sqlQuery!)}
        ></PrimaryButton>
      </Card>

      {/* Results Section */}
      {error && <Alert>{error}</Alert>}

      {queryResult && (
        <Card>
          <CardTitle>Query Results</CardTitle>
          <ErrorBoundary>
            {Array.isArray(queryResult) && queryResult.length > 0 ? (
              <DataTable<NonNullable<any>>
                isCondensed
                columns={getHeaders()}
                rows={queryResult.slice(0, PREVIEW_ROWS)}
                itemRenderer={(item, column) => {
                  const flatRow = flattenObject(item);
                  return flatRow[column.key] === null
                    ? 'null'
                    : String(flatRow[column.key] || '');
                }}
              />
            ) : (
              <NoDataMessage>Query returned no results</NoDataMessage>
            )}
          </ErrorBoundary>
        </Card>
      )}
    </Container>
  );
};

export default WidgetQuery;
