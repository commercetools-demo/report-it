import { useMemo, useState } from 'react';
import SelectField from '@commercetools-uikit/select-field';
import {
  Widget,
  ChartFieldItem as ChartFieldItemType,
} from '../../types/widget';
import { FieldArray, useFormikContext } from 'formik';
import { DragEndEvent } from '@dnd-kit/core';
import { ArrayHelpers } from 'formik/dist/FieldArray';
import Table from '../table';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {
  BinLinearIcon,
  DragDropIcon,
  DragIcon,
} from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import styled from 'styled-components';
import ToggleInput from '@commercetools-uikit/toggle-input';
import IconButton from '@commercetools-uikit/icon-button';
import TextField from '@commercetools-uikit/text-field';
import FieldLabel from '@commercetools-uikit/field-label';

type Props = {
  configName: string;
  defaultValues: string[];
};

type ChartFieldItemWithId = ChartFieldItemType & { id: number };

const StyledColorPicker = styled.input`
  width: 30px;
  height: 30px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  outline: none;
`;

const DraggableList = ({ configName, defaultValues }: Props) => {
  const name = `${configName}.chartFields`;
  const formik = useFormikContext<Widget>();
  const [isSortable, setIsSortable] = useState(false);

  const chartFieldItems =
    formik.values.config?.chartFields.map((item, index) => ({
      ...item,
      id: index,
    })) || [];

  const handleDragEnd = (event: DragEndEvent, move: ArrayHelpers['move']) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = chartFieldItems.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = chartFieldItems.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const availableOptions = useMemo(() => {
    return defaultValues
      ?.filter(
        (header) =>
          !formik.values.config?.chartFields?.find((h) => h.key === header)
      )
      .map((header) => ({
        value: header,
        label: header,
      }));
  }, [defaultValues]);

  return (
    <FieldArray name={name}>
      {({ remove, push, move }) => {
        const wrappedHandleDragEnd = (event: DragEndEvent) => {
          handleDragEnd(event, move);
        };
        return (
          <Spacings.Stack scale={'m'}>
            <Spacings.Inline scale={'s'} justifyContent={'flex-end'}>
              <FieldLabel title="Chart Fields" />
              <SecondaryButton
                label={'Reorder'}
                iconLeft={<DragDropIcon />}
                isToggleButton={true}
                isToggled={isSortable}
                onClick={() => setIsSortable(!isSortable)}
              />
            </Spacings.Inline>
            <Table<ChartFieldItemWithId>
              items={chartFieldItems}
              columns={[
                { key: 'key', label: 'Key' },
                { key: 'label', label: 'Label' },
                {
                  key: 'type',
                  label: 'Type',
                },
                { key: 'color', label: 'Color', width: '100px' },
                { key: 'enabled', label: 'Enabled', width: '100px' },
                { key: 'action', label: 'Action', width: '100px' },
              ]}
              itemRenderer={(row, columnKey, index) => {
                switch (columnKey) {
                  case 'key': {
                    return (
                      <Spacings.Inline scale={'l'}>
                        {isSortable && <DragIcon size="medium" />}
                        <TextField
                          name={`${name}.${index}.key`}
                          value={row.key}
                          onChange={formik.handleChange}
                          isDisabled
                          title=""
                          isCondensed
                          placeholder="Key"
                        />
                      </Spacings.Inline>
                    );
                  }
                  case 'label': {
                    return (
                      <TextField
                        value={row.label}
                        name={`${name}.${index}.label`}
                        onChange={formik.handleChange}
                        title=""
                        isCondensed
                        placeholder="Label"
                      />
                    );
                  }

                  case 'type': {
                    return (
                      <TextField
                        value={row.type}
                        name={`${name}.${index}.type`}
                        onChange={formik.handleChange}
                        title=""
                        isCondensed
                        placeholder="Type"
                      />
                    );
                  }
                  case 'color': {
                    return index !== 0 ? (
                      <StyledColorPicker
                        value={formik.values.config?.colors?.[index - 1]}
                        name={`${configName}.colors.${index - 1}`}
                        onChange={formik.handleChange}
                        title="Color"
                        placeholder="Color"
                        type="color"
                        disabled={isSortable}
                      />
                    ) : (
                      <></>
                    );
                  }
                  case 'enabled': {
                    return (
                      <ToggleInput
                        isChecked={row.enabled}
                        name={`${name}.${index}.enabled`}
                        onChange={formik.handleChange}
                        size={'small'}
                        isDisabled={isSortable}
                      />
                    );
                  }
                  case 'action': {
                    return (
                      <IconButton
                        label="Delete"
                        size={'30'}
                        onClick={() => remove(index)}
                        icon={<BinLinearIcon />}
                        isDisabled={isSortable}
                      />
                    );
                  }
                }
                return <></>;
              }}
              isSortable={isSortable}
              handleDragEnd={wrappedHandleDragEnd}
            />

            <SelectField
              onChange={(e) =>
                push({
                  key: e.target.value,
                  label: e.target.value,
                  type: 'string',
                  enabled: true,
                })
              }
              title="Add field"
              options={availableOptions}
            />
          </Spacings.Stack>
        );
      }}
    </FieldArray>
  );
};

// const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
//
// const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//         const oldIndex = items.indexOf(active.id);
//         const newIndex = items.indexOf(over.id);
//         setItems(arrayMove(items, oldIndex, newIndex));
//     }
// };
//
// return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext items={items} strategy={verticalListSortingStrategy}>
//             {items.map((id) => (
//                 <SortableItem key={id} id={id} />
//             ))}
//         </SortableContext>
//     </DndContext>
// );

export default DraggableList;
