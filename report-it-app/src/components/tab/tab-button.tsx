import React, { HTMLProps, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{ isSelected?: boolean }>`
  padding: 0.25rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: 1px solid #e2e8f0;

  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  outline: none;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 150ms;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 101, 255, 0.5);
  }
  ${(props) =>
    props.isSelected
      ? 'background-color: white; color: #3182CE; border-bottom: 2px solid #3182CE;'
      : 'color: #718096; &:hover { color: #4A5568; background-color: #F7F7F7; }'}
`;
export const TabButton: React.FC<
  PropsWithChildren<HTMLProps<HTMLButtonElement>> & { isSelected?: boolean }
> = ({ children, isSelected, ...props }) => {
  return (
    <StyledButton isSelected={isSelected} {...props} type="button">
      {children}
    </StyledButton>
  );
};
