import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';

type Props = {
  openModal: () => void;
};

const NewDashboardButton = ({ openModal }: Props) => {
  return (
    <IconButton
      type="button"
      onClick={() => openModal()}
      label="Add dashboard"
      icon={<PlusBoldIcon size="small" />}
      size="small"
    ></IconButton>
  );
};

export default NewDashboardButton;
