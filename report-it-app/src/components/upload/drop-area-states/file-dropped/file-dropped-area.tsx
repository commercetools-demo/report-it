import { useIntl } from 'react-intl';

import messages from '../../messages';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Constraints from '@commercetools-uikit/constraints';
import { PaperclipIcon } from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';

type Props = {
  fileName?: string;
};

export default function FileDroppedArea({ fileName }: Props) {
  const intl = useIntl();

  return (
    <Spacings.Stack alignItems="center" scale="s">
      <Spacings.Inline alignItems="flex-start" scale="xs">
        <PaperclipIcon color="neutral60" />
        <Constraints.Horizontal max={13}>
          <Text.Body>{fileName}</Text.Body>
        </Constraints.Horizontal>
      </Spacings.Inline>
      <SecondaryButton
        tone="secondary"
        size="10"
        label={intl.formatMessage(messages.chooseFile)}
      />
    </Spacings.Stack>
  );
}
