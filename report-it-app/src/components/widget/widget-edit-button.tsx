import IconButton from '@commercetools-uikit/flat-button';
import { EditIcon } from '@commercetools-uikit/icons';
import { HTMLProps, type KeyboardEvent, type MouseEvent } from 'react';
import styled from 'styled-components';
import { designTokens } from '@commercetools-uikit/design-system';

type Props = {
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;
};
export const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 10000;
  opacity: 0;
  box-shadow: ${designTokens.shadow17};
  border-radius: ${designTokens.borderRadius4};
  border: ${`1px solid ${designTokens.colorNeutral90}`};
  padding: 5px;

  &:hover {
    opacity: 1;
  }
`;

const WidgetEditButton: React.FC<HTMLProps<HTMLButtonElement> & Props> = (
  props
) => {
  return (
    <StyledIconButton
      icon={<EditIcon size="10" />}
      size="small"
      title="Add widget"
      label={''}
      {...props}
    ></StyledIconButton>
  );
};

export default WidgetEditButton;
