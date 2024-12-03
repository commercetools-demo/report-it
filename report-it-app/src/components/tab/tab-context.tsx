import React, { PropsWithChildren } from 'react';
import { useEasyParams } from '../../hooks/use-params';

interface TabContextValue {
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
}

interface TabContextProps {
  defaultTab?: number;
  paramName: string;
}

type TabContextChildrenProps = TabContextValue;

export const TabContext: React.FC<
  PropsWithChildren<
    TabContextProps & {
      children:
        | ((props: TabContextChildrenProps) => React.ReactNode)
        | React.ReactNode;
    }
  >
> = ({ children, defaultTab = 0, paramName }) => {
  const { setParam, getParam } = useEasyParams();

  // Get selected tab from URL search params or default
  const selectedTab = (() => {
    const tabParam = getParam(paramName);
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam, 10);
      return isNaN(tabIndex) ? defaultTab : tabIndex;
    }
    return defaultTab;
  })();

  // Update URL search params when selected tab changes
  const setSelectedTab = (newTab: number) => {
    setParam(paramName, newTab.toString());
  };

  return (
    <div>
      {typeof children === 'function'
        ? children({ selectedTab, setSelectedTab })
        : children}
    </div>
  );
};
