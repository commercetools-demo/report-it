import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';

type Props = {
  openModal: () => void;
};

const NewDashboardButton = ({ openModal }: Props) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        type="button"
        onClick={() => openModal()}
        label="Add dashboard"
        icon={<PlusBoldIcon size="10" />}
        size="10"
      />
    </div>
  );
};

export default NewDashboardButton;
