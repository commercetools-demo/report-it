import React, { PropsWithChildren } from 'react';
import { TabPanel } from './panel';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  margin-top: 1rem;
`;

export const TabPanels: React.FC<
  PropsWithChildren<{ selectedTab: number }>
> = ({ children, selectedTab }) => {
  return (
    <StyledWrapper>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <TabPanel
            key={index}
            isSelected={selectedTab === index}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            id={`panel-${index}`}
          >
            {child}
          </TabPanel>
        ))
      ) : (
        <TabPanel
          isSelected={selectedTab === 0}
          role="tabpanel"
          aria-labelledby="tab-0"
          id="panel-0"
        >
          {children}
        </TabPanel>
      )}
    </StyledWrapper>
  );
};
