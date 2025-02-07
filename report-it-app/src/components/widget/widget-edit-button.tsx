import IconButton from '@commercetools-uikit/flat-button';
import { EditIcon } from '@commercetools-uikit/icons';
import { HTMLProps, type KeyboardEvent, type MouseEvent } from 'react';
import styled from 'styled-components';

type Props = {
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;
};
const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: -10px;
  z-index: 10000;
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
