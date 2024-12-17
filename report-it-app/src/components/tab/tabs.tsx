import React, { PropsWithChildren } from 'react';
import { TabButton } from './tab-button';
import styled from 'styled-components';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
`;

const StyledWrapper = styled.div`
  border-bottom: 1px solid #e2e8f0;
`;

export const Tabs: React.FC<
  PropsWithChildren<{
    selectedTab: number;
    setSelectedTab: (index: number) => void;
    additionalComponent?: React.ReactNode;
  }>
> = ({ children, selectedTab, additionalComponent, setSelectedTab }) => {
  return (
    <StyledWrapper>
      <StyledNav role="tablist">
        {Array.isArray(children) ? (
          children.filter(Boolean).map((child, index) => (
            <TabButton
              key={index}
              isSelected={selectedTab === index}
              onClick={() => setSelectedTab(index)}
              role="tab"
              aria-selected={selectedTab === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
            >
              {child}
            </TabButton>
          ))
        ) : (
          <TabButton
            isSelected={selectedTab === 0}
            onClick={() => setSelectedTab(0)}
            role="tab"
            aria-selected={selectedTab === 0}
            aria-controls="panel-0"
            id="tab-0"
          >
            {children}
          </TabButton>
        )}
        {additionalComponent}
      </StyledNav>
    </StyledWrapper>
  );
};
