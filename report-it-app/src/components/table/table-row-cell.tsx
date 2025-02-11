import classnames from 'classnames';
import styles from './table.module.css';
import { ReactNode } from 'react';
import { TableRowType } from './table';

export type ItemRenderer<Row extends TableRowType = TableRowType> = (
  row: Row,
  columnKey: string,
  index: number
) => ReactNode;

type TableRowCellProps<Row extends TableRowType = TableRowType> = {
  itemRenderer: ItemRenderer<Row>;
  columnKey: string;
  item: Row;
  index: number;
  className?: string;
  width?: string | number;
};

const TableRowCell = <Row extends TableRowType = TableRowType>({
  itemRenderer,
  className,
  columnKey,
  item,
  index,
  width,
}: TableRowCellProps<Row>) => (
  <li
    className={classnames(className, styles['body-column'])}
    style={{
      flexBasis: width ? `calc(${width} - var(--spacing-m))` : undefined,
    }}
  >
    <div className={styles.cell}>{itemRenderer(item, columnKey, index)}</div>
  </li>
);
TableRowCell.displayName = 'TableRowCell';
export default TableRowCell;
