import { ReactNode } from 'react';
import type { LocationDescriptor } from 'history';
import { useIntl, type MessageDescriptor } from 'react-intl';
import { Link, matchPath, useLocation } from 'react-router-dom';
import Text from '@commercetools-uikit/text';
import { warning } from '@commercetools-uikit/utils';
import { getLinkStyles } from './tab.styles';
import { EditIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import Spacings from '@commercetools-uikit/spacings';

const pathWithoutSearch = (path: TTabHeaderProps['to']) =>
  typeof path === 'string' ? path.split('?')[0] : path.pathname;

const warnIfMissingContent = (props: TTabHeaderProps) => {
  const hasContent = Boolean(props.intlMessage) || Boolean(props.label);

  warning(
    hasContent,
    'TabHeader: one of either `label` or `intlMessage` is required but their values are `undefined`'
  );
};

const getDisabledLinkAtributes = (isDisabled: TTabHeaderProps['isDisabled']) =>
  isDisabled ? { tabIndex: -1, 'aria-disabled': true } : {};

export type TTabHeaderProps = {
  /**
   * A route path to redirect to when the tab is clicked.
   */
  to: string | LocationDescriptor;
  /**
   * The label of the tab.
   * * <br />
   * Required if `intlMessage` is not provided.
   */
  label?: string;
  /**
   * The label of the tab, using an `intl` message object.
   * <br />
   * Required if `label` is not provided.
   */
  intlMessage?: MessageDescriptor & {
    values?: Record<string, ReactNode>;
  };
  /**
   * If `true`, indicates that the element is in a disabled state.
   */
  isDisabled?: boolean;
  /**
   * If `true`, marks the tab as active if the link matches exactly the route.
   */
  exactPathMatch?: boolean;

  openModal: (dashboardKey: string) => void;

  dashboardKey: string;
};

const TabLabel = ({ children }: { children?: string }) => {
  return (
    <Text.Headline as="h3" truncate={true}>
      {children}
    </Text.Headline>
  );
};

export const TabHeader = ({
  isDisabled = false,
  exactPathMatch = false,
  ...props
}: TTabHeaderProps) => {
  const intl = useIntl();
  const location = useLocation();
  const isActive = Boolean(
    matchPath(location.pathname, {
      // strip the search, otherwise the path won't match
      path: pathWithoutSearch(props.to),
      exact: exactPathMatch,
      strict: false,
    })
  );

  let label = props.label;
  if (props.intlMessage) {
    label = intl.formatMessage(props.intlMessage);
  }

  warnIfMissingContent({ exactPathMatch, isDisabled, ...props });

  return (
    <Link
      role="tab"
      aria-selected={isActive}
      to={props.to}
      css={getLinkStyles(isActive, isDisabled)}
      {...getDisabledLinkAtributes(isDisabled)}
    >
      <Spacings.Inline scale={'s'} alignItems={'center'}>
        {label && <TabLabel>{label}</TabLabel>}
        <IconButton
          onClick={() => props.openModal(props.dashboardKey)}
          label="Edit"
          size="10"
          icon={<EditIcon size="10" />}
        />
      </Spacings.Inline>
    </Link>
  );
};

TabHeader.displayName = 'TabHeader';

export default TabHeader;
