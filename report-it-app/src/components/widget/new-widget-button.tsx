import IconButton from '@commercetools-uikit/flat-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';

type Props = {
  openModal: () => void;
};
const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const NewWidgetButton = ({ openModal }: Props) => {
  return (
    <StyledIconButton
      onClick={openModal}
      icon={<PlusBoldIcon size="small" />}
      size="small"
      title="Add widget"
    ></StyledIconButton>
  );
};

export default NewWidgetButton;
