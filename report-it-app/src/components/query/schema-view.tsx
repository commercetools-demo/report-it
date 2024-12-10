import DataTable from '@commercetools-uikit/data-table';
import styled from 'styled-components';

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #374151;
`;

const columns = [
  { key: 'column', label: 'Column' },
  { key: 'type', label: 'Type' },
];

interface SchemaItem {
  column: string;
  type: string;
  id: string;
}
export const SchemaView = ({
  name,
  schema,
}: {
  name: string;
  schema: SchemaItem[];
}) => {
  if (!schema.length) {
    return null;
  }

  return (
    <>
      <TableTitle>Schema</TableTitle>
      <DataTable<NonNullable<SchemaItem>>
        isCondensed
        columns={columns}
        rows={schema}
        itemRenderer={(item, column) => {
          switch (column.key) {
            case 'column':
              return item.column;
            case 'type':
              return item.type;
            default:
              return null;
          }
        }}
      />
    </>
  );
};
