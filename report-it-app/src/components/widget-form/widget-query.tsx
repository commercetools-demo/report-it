import React, { useState } from 'react';
import styled from 'styled-components';
import alasql from 'alasql';
import _ from 'lodash';
import { FormikErrors } from 'formik';
import { Widget } from '../../types/widget';
import { useWidgetDatasourceResponseContext } from './widget-datasource-response-provider';

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

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 100%;
`;

const Th = styled.th`
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;

  &:first-child {
    border-top-left-radius: 6px;
  }

  &:last-child {
    border-top-right-radius: 6px;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
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

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    background-color: #1d4ed8;
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

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #374151;
`;

const NoDataMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

type Props = {
  errors: FormikErrors<Widget>;
  values: Widget;
  widget?: Widget;
  handleChange: any;
};

const WidgetQuery: React.FC<Props> = () => {
  const { datasources } = useWidgetDatasourceResponseContext();
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);
  const PREVIEW_ROWS = 5;

  // Function to safely flatten nested objects for better display
  const flattenObject = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object') return {};

    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...acc, ...flattenObject(value, `${prefix}${key}_`) };
      }
      return { ...acc, [`${prefix}${key}`]: value };
    }, {});
  };

  // Function to safely get schema from data
  const getSchema = (data) => {
    if (!Array.isArray(data) || !data.length) return [];
    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== 'object') return [];

    return Object.keys(flattenObject(firstRow)).map((key) => ({
      column: key,
      type: typeof _.get(firstRow, key),
    }));
  };

  // Function to execute query
  const executeQuery = () => {
    try {
      if (!query.trim()) {
        setQueryResult(null);
        setError(null);
        return;
      }

      // Initialize alasql tables
      Object.keys(datasources).forEach((name) => {
        const results = datasources[name].results;
        if (!name || !Array.isArray(results)) return;

        alasql(`DROP TABLE IF EXISTS ${name}`);
        alasql(`CREATE TABLE ${name}`);
        const flattenedResults = results.map((row) => flattenObject(row));
        alasql.tables[name].data = flattenedResults;
      });

      // Execute query
      const result = alasql(query);
      setQueryResult(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setQueryResult(null);
    }
  };

  // Table Preview Component
  const TablePreview = ({ data, title }) => {
    if (!Array.isArray(data) || !data.length) {
      return (
        <div>
          <TableTitle>{title}</TableTitle>
          <NoDataMessage>No data available</NoDataMessage>
        </div>
      );
    }

    const flattenedFirstRow = flattenObject(data[0]);
    const headers = Object.keys(flattenedFirstRow);

    return (
      <div>
        <TableTitle>{title}</TableTitle>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <Th key={header}>{header}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, PREVIEW_ROWS).map((row, idx) => {
                const flatRow = flattenObject(row);
                return (
                  <Tr key={idx}>
                    {headers.map((header, cellIdx) => (
                      <Td key={cellIdx}>
                        {flatRow[header] === null
                          ? 'null'
                          : String(flatRow[header] || '')}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  // Schema View Component
  const SchemaView = ({ name, schema }) => {
    if (!schema.length) {
      return null;
    }

    return (
      <div>
        <TableTitle>Schema: {name}</TableTitle>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Column</Th>
                <Th>Type</Th>
              </tr>
            </thead>
            <tbody>
              {schema.map(({ column, type }, idx) => (
                <Tr key={idx}>
                  <Td>{column}</Td>
                  <Td>{type}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <Container>
      {/* Data Preview Section */}
      <Card>
        <CardTitle>Available Tables Preview</CardTitle>
        {Object.keys(datasources).map((name) => (
          <div key={name || 'unnamed'}>
            <TablePreview
              data={datasources[name]?.results}
              title={`Table: ${name || 'unnamed'} (First ${PREVIEW_ROWS} rows)`}
            />
            <SchemaView
              name={name || 'unnamed'}
              schema={getSchema(datasources[name]?.results)}
            />
          </div>
        ))}
      </Card>

      {/* Query Editor Section */}
      <Card>
        <CardTitle>SQL Query Editor</CardTitle>
        <QueryTextarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
        />
        <Button type="button" onClick={executeQuery}>Execute Query</Button>
      </Card>

      {/* Results Section */}
      {error && <Alert>{error}</Alert>}

      {queryResult && (
        <Card>
          <CardTitle>Query Results</CardTitle>
          {Array.isArray(queryResult) && queryResult.length > 0 ? (
            <TablePreview
              data={queryResult}
              title={`Results (First ${PREVIEW_ROWS} rows)`}
            />
          ) : (
            <NoDataMessage>Query returned no results</NoDataMessage>
          )}
        </Card>
      )}
    </Container>
  );
};

export default WidgetQuery;
