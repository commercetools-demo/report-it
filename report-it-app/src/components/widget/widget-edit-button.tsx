import IconButton from '@commercetools-uikit/flat-button';
import { EditIcon } from '@commercetools-uikit/icons';
import { HTMLProps } from 'react';
import styled from 'styled-components';

type Props = {
  onClick: (e: any) => void;
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
      {...props}
    ></StyledIconButton>
  );
};

export default WidgetEditButton;
