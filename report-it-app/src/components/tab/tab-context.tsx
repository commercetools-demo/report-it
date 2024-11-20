import React, { PropsWithChildren, useEffect, useState } from 'react';

export const TabContext: React.FC<
  PropsWithChildren<{ defaultTab?: number }>
> = ({ children, defaultTab = 0 }) => {
  // Get initial selected tab from URL hash or default to 0
  const [selectedTab, setSelectedTab] = useState(() => {
    const hash = window.location.hash;
    if (hash) {
      const tabIndex = parseInt(hash.replace('#', ''), 10);
      return isNaN(tabIndex) ? defaultTab : tabIndex;
    }
    return defaultTab;
  });

  // Update URL hash when selected tab changes
  useEffect(() => {
    window.location.hash = `#${selectedTab}`;
  }, [selectedTab]);

  // Update selected tab when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const tabIndex = parseInt(hash.replace('#', ''), 10);
      if (!isNaN(tabIndex)) {
        setSelectedTab(tabIndex);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      {typeof children === 'function'
        ? children({ selectedTab, setSelectedTab })
        : children}
    </div>
  );
};
