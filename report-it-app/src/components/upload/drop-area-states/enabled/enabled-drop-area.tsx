import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import FileIcon from './file.react.svg';
import messages from '../../messages';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

export default function EnabledDropArea() {
  const intl = useIntl();
  return (
    <Spacings.Inline alignItems="center" justifyContent="center" scale="s">
      <FileIcon />
      <Spacings.Inline alignItems="center" scale="s">
        <Text.Subheadline as="h4" intlMessage={messages.dragAndDropJson} />
        <Text.Body intlMessage={messages.or} />
        <Link to="" onClick={(ev) => ev.preventDefault()}>
          {intl.formatMessage(messages.browseButton)}
        </Link>
      </Spacings.Inline>
    </Spacings.Inline>
  );
}
