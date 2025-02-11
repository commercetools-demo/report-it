import classnames from 'classnames';
import TableRowCell, { ItemRenderer } from './table-row-cell';
import styles from './table.module.css';

import { TableColumnType, TableRowType } from './table';

const getEvenRowClass = (idx: number) =>
  idx % 2 === 0 ? styles['list-row-even'] : null;

type TableRowColumnsProps<Row extends TableRowType = TableRowType> = {
  columns: Array<TableColumnType<Row>>;
  item: Row;
  getItemRowStyle?: (...args: unknown[]) => unknown;
  itemRenderer: ItemRenderer<Row>;
  onItemRowClick?: (event: React.MouseEvent, index: number) => unknown;
  index: number;
};

const TableRowColumns = <Row extends TableRowType = TableRowType>({
  columns,
  item,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  index,
}: TableRowColumnsProps<Row>) => (
  <ul
    data-testid="list-row"
    className={classnames(
      getItemRowStyle?.(item) || undefined,
      styles['list-row'],
      getEvenRowClass(index),
      { [styles.clickable]: Boolean(onItemRowClick) }
    )}
    onClick={
      onItemRowClick ? (event) => onItemRowClick(event, index) : undefined
    }
  >
    {columns.map(({ key, className, width }) => (
      <TableRowCell
        key={key}
        columnKey={key}
        className={className}
        item={item}
        itemRenderer={itemRenderer}
        index={index}
        width={width}
      />
    ))}
  </ul>
);
TableRowColumns.displayName = 'TableRowColumns';

export default TableRowColumns;
