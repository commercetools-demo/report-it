import { MouseEventHandler, ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TableBody from './table-body';
import styles from './table.module.css';
import { DragEndEvent } from '@dnd-kit/core';
import { ItemRenderer } from './table-row-cell';
import classnames from 'classnames';

export type TableRowType = { id: number };

export type TableColumnType<Row extends TableRowType = TableRowType> = {
  key: string;
  label: ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  onClick?: (event: MouseEventHandler) => void;
  renderItem?: (row: Row, isRowCollapsed: boolean) => ReactNode;
  // headerIcon?: ReactNode;
  // isTruncated?: boolean;
  // isSortable?: boolean;
  // disableResizing?: boolean;
  // shouldIgnoreRowClick?: boolean;
  className?: string;
};

type TableProps<Row extends TableRowType = TableRowType> = {
  noResultsLabel?: string | React.ReactElement;
  items: Array<Row>;
  columns: Array<TableColumnType<Row>>;
  transitionOptions?: {
    active: boolean;
    key?: string;
    toLeft?: boolean;
  };
  getItemRowStyle?: (...args: unknown[]) => unknown;
  itemRenderer: ItemRenderer<Row>;
  onItemRowClick?: (...args: unknown[]) => unknown;
  // For DnD capabilities
  isSortable?: boolean;
  handleDragEnd?: (event: DragEndEvent) => void;
};

const Table = <Row extends TableRowType = TableRowType>({
  isSortable = false,
  transitionOptions = {
    active: false,
    toLeft: false,
  },
  columns,
  getItemRowStyle,
  itemRenderer,
  items,
  noResultsLabel,
  onItemRowClick,
  handleDragEnd,
}: TableProps<Row>) => {
  const renderTableBody = () => {
    const defaultTableProps = {
      columns: columns,
      getItemRowStyle: getItemRowStyle,
      itemRenderer: itemRenderer,
      items: items,
      noResultsLabel: noResultsLabel,
      onItemRowClick: onItemRowClick,
    };

    const tableProps = {
      ...defaultTableProps,
      ...(isSortable
        ? {
            isSortable: true,
            helperClass: styles['list-row-being-sorted'],
            handleDragEnd: handleDragEnd,
          }
        : {}),
    };
    return <TableBody {...tableProps} />;
  };

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <ul className={styles['header-list']}>
          {columns.map(({ key, label, className, width }) => (
            <li
              key={key}
              className={classnames(className, styles.column)}
              style={{
                flexBasis: width
                  ? `calc(${width} - var(--spacing-m))`
                  : undefined,
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {transitionOptions.active ? (
          <TransitionGroup className={styles.slider}>
            <CSSTransition
              key={transitionOptions.key}
              classNames={{
                enter: transitionOptions.toLeft
                  ? styles['enter-from-right']
                  : styles['enter-from-left'],
                enterActive: styles['enter-active'],
                exit: styles.exit,
                exitActive: transitionOptions.toLeft
                  ? styles['exit-to-left']
                  : styles['exit-to-right'],
                appear: styles.appear,
                appearActive: styles['appear-active'],
              }}
              timeout={{ enter: 1, exit: 500, appear: 500 }}
              appear={true}
            >
              <div className={styles.wrapper}>{renderTableBody()}</div>
            </CSSTransition>
          </TransitionGroup>
        ) : (
          <div className={styles.slider}>
            <div className={styles.wrapper}>{renderTableBody()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

Table.displayName = 'Table';

export default Table;
