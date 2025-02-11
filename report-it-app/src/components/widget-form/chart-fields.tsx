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
import { designTokens, themes } from '@commercetools-uikit/design-system';

const colors = [
  themes.default.colorPrimary,
  themes.default.colorPrimary10,
  themes.default.colorPrimary20,
  themes.default.colorPrimary25,
  themes.default.colorPrimary30,
  themes.default.colorPrimary40,
  themes.default.colorPrimary85,
  themes.default.colorPrimary90,
  themes.default.colorPrimary95,
  themes.default.colorPrimary98,
  themes.default.colorAccent,
  themes.default.colorAccent10,
  themes.default.colorAccent20,
  themes.default.colorAccent30,
  themes.default.colorAccent40,
  themes.default.colorAccent50,
  themes.default.colorAccent60,
  themes.default.colorAccent85,
  themes.default.colorAccent90,
  themes.default.colorAccent95,
  themes.default.colorAccent98,
  themes.default.colorBrown10,
  themes.default.colorBrown20,
  themes.default.colorBrown35,
  themes.default.colorBrown50,
  themes.default.colorBrown70,
  themes.default.colorBrown85,
  themes.default.colorBrown90,
  themes.default.colorBrown95,
  themes.default.colorBrown98,
  themes.default.colorPurple10,
  themes.default.colorPurple20,
  themes.default.colorPurple35,
  themes.default.colorPurple50,
  themes.default.colorPurple70,
  themes.default.colorPurple85,
  themes.default.colorPurple90,
  themes.default.colorPurple95,
  themes.default.colorPurple98,
  themes.default.colorTurquoise10,
  themes.default.colorTurquoise20,
  themes.default.colorTurquoise35,
  themes.default.colorTurquoise50,
  themes.default.colorTurquoise70,
  themes.default.colorTurquoise85,
  themes.default.colorTurquoise90,
  themes.default.colorTurquoise95,
  themes.default.colorTurquoise98,
  themes.default.colorNeutral,
  themes.default.colorNeutral05,
  themes.default.colorNeutral10,
  themes.default.colorNeutral40,
  themes.default.colorNeutral50,
  themes.default.colorNeutral60,
  themes.default.colorNeutral85,
  themes.default.colorNeutral90,
  themes.default.colorNeutral95,
  themes.default.colorNeutral98,
  themes.default.colorInfo,
  themes.default.colorInfo40,
  themes.default.colorInfo50,
  themes.default.colorInfo60,
  themes.default.colorInfo85,
  themes.default.colorInfo90,
  themes.default.colorInfo95,
  themes.default.colorWarning,
  themes.default.colorWarning25,
  themes.default.colorWarning40,
  themes.default.colorWarning60,
  themes.default.colorWarning85,
  themes.default.colorWarning95,
  themes.default.colorError,
  themes.default.colorError25,
  themes.default.colorError40,
  themes.default.colorError85,
  themes.default.colorError95,
  themes.default.colorSolid,
  themes.default.colorSolid02,
  themes.default.colorSolid05,
  themes.default.colorSolid10,
  themes.default.colorSurface,
  themes.default.colorTransparent,
  themes.default.colorSuccess,
  themes.default.colorSuccess25,
  themes.default.colorSuccess40,
  themes.default.colorSuccess85,
  themes.default.colorSuccess95,
];

type Props = {
  configName: string;
  defaultValues: string[];
};

type ChartFieldItemWithId = ChartFieldItemType & { id: number };

const StyledColorPicker = styled.input`
  width: 75px;
  height: 30px;
  border: ${designTokens.borderWidth1} solid ${designTokens.borderColorForInput};
  border-radius: ${designTokens.borderRadiusForInput};
  background-color: ${designTokens.backgroundColorForInput};
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

  const hslRegex =
    /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;

  function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

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
                      <>
                        <StyledColorPicker
                          value={formik.values.config?.colors?.[index - 1]}
                          name={`${configName}.colors.${index - 1}`}
                          onChange={formik.handleChange}
                          title="Color"
                          placeholder="Color"
                          type="color"
                          disabled={isSortable}
                          list="presetColors"
                        />
                        <datalist id="presetColors">
                          {colors
                            .map((color) => {
                              if (color.startsWith('#')) {
                                return color;
                              }
                              const match = color.match(hslRegex);
                              if (match) {
                                const [_all, h, s, l] = match;
                                return hslToHex(
                                  parseInt(h, 10),
                                  parseInt(s, 10),
                                  parseInt(l, 10)
                                );
                              }
                              return undefined;
                            })
                            .filter(Boolean)
                            .map((color, index) => {
                              return <option key={index}>{color}</option>;
                            })}
                        </datalist>
                      </>
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
