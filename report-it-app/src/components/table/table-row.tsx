import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PropsWithChildren } from 'react';

type TableRowProps = PropsWithChildren<{
  children: React.ReactNode;
}>;

type SortableTableRowProps = { sortableId: number } & TableRowProps;

export const SortableTableRow = ({
  children,
  sortableId,
}: SortableTableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: sortableId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </li>
  );
};

SortableTableRow.displayName = 'TableRow';

export const TableRow = ({ children }: TableRowProps) => {
  return <li>{children}</li>;
};

TableRow.displayName = 'TableRow';
