import styled from 'styled-components';
import { PREVIEW_ROWS } from '.';
import { useQueryUtils } from './hooks/use-query-utils';
import DataTable from '@commercetools-uikit/data-table';

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
export const TablePreview = ({ data, title }) => {
  const { flattenObject } = useQueryUtils();
  if (!Array.isArray(data) || !data.length) {
    return (
      <div>
        <TableTitle>{title}</TableTitle>
        <NoDataMessage>No data available</NoDataMessage>
      </div>
    );
  }

  const flattenedFirstRow = flattenObject(data[0]);
  const headers = Object.keys(flattenedFirstRow).map((key) => ({
    key,
    label: key,
  }));

  return (
    <div>
      <TableTitle>{title}</TableTitle>

      <DataTable<NonNullable<any>>
        isCondensed
        columns={headers}
        rows={data.slice(0, PREVIEW_ROWS)}
        itemRenderer={(item, column) => {
          const flatRow = flattenObject(item);
          return flatRow[column.key] === null
            ? 'null'
            : String(flatRow[column.key] || '');
        }}
      />
    </div>
  );
};
