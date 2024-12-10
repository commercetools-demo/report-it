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
