import React, { type ChangeEventHandler, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DragIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import TextField from '@commercetools-uikit/text-field';
import ToggleInput from '@commercetools-uikit/toggle-input';
import FieldLabel from '@commercetools-uikit/field-label';
import IconButton from '@commercetools-uikit/icon-button';
import SelectField from '@commercetools-uikit/select-field';
import { Widget } from '../../types/widget';
import { FieldArray } from 'formik';
import Spacings from '@commercetools-uikit/spacings';

type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  config?: Widget['config'];
  configName: string;
  defaultValues: string[];
};

const StyledColorPicker = styled.input`
  width: 30px;
  height: 30px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  outline: none;
`;

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 3fr 3fr 2fr 1fr;
  gap: 5px;
  align-items: end;
  margin-bottom: 10px;
`;

const StyledDragIcon = styled.div`
  cursor: move;
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 20px;
`;

const StyledDraggableItem = styled.div<{ isDragging: boolean }>`
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;

const DraggableList = ({
  onChange,
  config,
  configName,
  defaultValues,
}: Props) => {
  const name = `${configName}.chartFields`;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const availableOptions = useMemo(() => {
    return defaultValues
      ?.filter((header) => !config?.chartFields?.find((h) => h.key === header))
      .map((header) => ({
        value: header,
        label: header,
      }));
  }, [defaultValues]);
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,
    targetIndex: number,
    move: (from: number, to: number) => void
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    move(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <FieldArray name={name}>
      {({ remove, push, move }) => (
        <div>
          {config?.chartFields?.map((item, index) => (
            <StyledDraggableItem
              key={item.key || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, move)}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
            >
              <div className="flex items-center gap-4">
                <StyledRow>
                  <StyledDragIcon>
                    <DragIcon />
                  </StyledDragIcon>

                  <TextField
                    name={`${name}.${index}.key`}
                    value={item.key}
                    onChange={onChange}
                    isDisabled
                    title="Key"
                    isCondensed
                    placeholder="Key"
                  />
                  <TextField
                    value={item.label}
                    name={`${name}.${index}.label`}
                    onChange={onChange}
                    title="Label"
                    isCondensed
                    placeholder="Label"
                  />
                  <TextField
                    value={item.type}
                    name={`${name}.${index}.type`}
                    onChange={onChange}
                    title="Type"
                    isCondensed
                    placeholder="Type"
                  />
                  {index !== 0 ? (
                    <Spacings.Stack>
                      <FieldLabel title="Color" />
                      <StyledColorPicker
                        value={config.colors?.[index] || ''}
                        name={`${configName}.colors.${index}`}
                        onChange={onChange}
                        title="Color"
                        placeholder="Color"
                        type="color"
                      />
                    </Spacings.Stack>
                  ) : (
                    <div></div>
                  )}
                  <Spacings.Stack>
                    <FieldLabel title="Enabled?" />
                    <ToggleInput
                      isChecked={item.enabled}
                      name={`${name}.${index}.enabled`}
                      onChange={onChange}
                      size={'small'}
                    />
                  </Spacings.Stack>
                  <IconButton
                    label="Delete"
                    onClick={() => remove(index)}
                    icon={<BinLinearIcon />}
                  />
                </StyledRow>
              </div>
            </StyledDraggableItem>
          ))}
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
        </div>
      )}
    </FieldArray>
  );
};

export default DraggableList;
