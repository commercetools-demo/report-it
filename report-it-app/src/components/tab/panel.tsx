import React, { HTMLProps, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledTabPanel = styled.div`
  padding: 0.25rem;
`;
export const TabPanel: React.FC<
  PropsWithChildren<HTMLProps<HTMLDivElement>> & { isSelected?: boolean }
> = ({ children, isSelected, ...props }) => {
  if (!isSelected) return null;

  return <StyledTabPanel {...props}>{children}</StyledTabPanel>;
};
