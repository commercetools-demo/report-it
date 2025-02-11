import TableRowColumns from './table-row-columns';
import styles from './table.module.css';
import { TableColumnType, TableRowType } from './table';
import { SortableTableRow, TableRow } from './table-row';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import classnames from 'classnames';
import { ItemRenderer } from './table-row-cell';

interface NoResultsRowProps {
  children: React.ReactNode;
}

const NoResultsRow = ({ children }: NoResultsRowProps) => (
  <div className={styles['no-results']}>{children}</div>
);
NoResultsRow.displayName = 'NoResultsRow';

type BodyProps<Row extends TableRowType = TableRowType> = {
  columns: Array<TableColumnType<Row>>;
  getItemRowStyle?: (...args: unknown[]) => unknown;
  itemRenderer: ItemRenderer<Row>;
  items: Array<Row>;
  onItemRowClick?: (...args: unknown[]) => unknown;
  noResultsLabel?: string | React.ReactElement;
};

const Body = <Row extends TableRowType = TableRowType>({
  items,
  columns,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  noResultsLabel,
}: BodyProps<Row>) => (
  <ul className={styles['body-list']}>
    {items.length ? (
      items.map((item, index) => (
        <TableRow key={item.id}>
          <TableRowColumns
            columns={columns}
            getItemRowStyle={getItemRowStyle}
            index={index}
            item={item}
            itemRenderer={itemRenderer}
            onItemRowClick={onItemRowClick}
          />
        </TableRow>
      ))
    ) : (
      <NoResultsRow>{noResultsLabel}</NoResultsRow>
    )}
  </ul>
);
Body.displayName = 'Body';

type SortableBodyProps<Row extends TableRowType = TableRowType> = {
  helperClass?: string;
} & BodyProps<Row>;

const SortableBody = <Row extends TableRowType = TableRowType>({
  items,
  columns,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  noResultsLabel,
  helperClass,
}: SortableBodyProps<Row>) => {
  return (
    <ul className={classnames(styles['body-list'], helperClass)}>
      {items.length ? (
        items.map((item, index) => {
          return (
            <SortableTableRow key={item.id} sortableId={item.id}>
              <TableRowColumns
                columns={columns}
                getItemRowStyle={getItemRowStyle}
                index={index}
                item={item}
                itemRenderer={itemRenderer}
                onItemRowClick={onItemRowClick}
              />
            </SortableTableRow>
          );
        })
      ) : (
        <NoResultsRow>{noResultsLabel}</NoResultsRow>
      )}
    </ul>
  );
};

SortableBody.displayName = 'SortableBody';

interface TableBodyProps<Row extends TableRowType = TableRowType> {
  columns: Array<TableColumnType<Row>>;
  items: Array<Row>;
  getItemRowStyle?: (...args: unknown[]) => unknown;
  itemRenderer: ItemRenderer<Row>;
  onItemRowClick?: (...args: unknown[]) => unknown;
  noResultsLabel?: string | React.ReactElement;
  isSortable?: boolean;
  handleDragEnd?: (event: DragEndEvent) => void;
  helperClass?: string;
}

const TableBody = <Row extends TableRowType = TableRowType>({
  columns,
  items,
  getItemRowStyle = () => null,
  itemRenderer,
  noResultsLabel,
  onItemRowClick,
  isSortable = false,
  handleDragEnd,
  helperClass,
}: TableBodyProps<Row>) =>
  isSortable && handleDragEnd ? (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(event) => handleDragEnd(event)}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SortableBody
          columns={columns}
          items={items}
          getItemRowStyle={getItemRowStyle}
          itemRenderer={itemRenderer}
          noResultsLabel={noResultsLabel}
          onItemRowClick={onItemRowClick}
          helperClass={helperClass}
        />
      </SortableContext>
    </DndContext>
  ) : (
    <Body
      columns={columns}
      items={items}
      getItemRowStyle={getItemRowStyle}
      itemRenderer={itemRenderer}
      noResultsLabel={noResultsLabel}
      onItemRowClick={onItemRowClick}
    />
  );
TableBody.displayName = 'TableBody';

export default TableBody;
