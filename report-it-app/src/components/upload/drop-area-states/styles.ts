import { css } from '@emotion/react';
import { designTokens } from '@commercetools-uikit/design-system';

type DropAreaState = 'default' | 'error' | 'active';

const getBorderColor = (state: DropAreaState) => {
  const borderColors = {
    default: '#909dbc',
    error: '#e60050',
    active: designTokens.colorPrimary,
  };

  return borderColors[state] || borderColors.default;
};

const getDashedBorder = (state: DropAreaState = 'default') => {
  const color = getBorderColor(state);
  const svgContent = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none" stroke="${color}" stroke-width="2px" stroke-dasharray="6,6" stroke-dashoffset="0" stroke-linecap="square"/>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

const base = css`
  border-radius: ${designTokens.borderRadius6};
  min-height: 136px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const disabled = css``;
const readyForDrop = css`
  background-image: url(\"${getDashedBorder()}\");
  background-color: ${designTokens.colorSurface};
`;
const activeDrag = css`
  background-image: url(\"${getDashedBorder('active')}\");
  background-color: ${designTokens.colorPrimary95};
  padding: ${designTokens.spacing50} 100px;
`;
const fileDropped = css`
  background-image: url(\"${getDashedBorder()}\");
  background-color: ${designTokens.colorSurface};
  padding: ${designTokens.spacing50} 100px;
`;

export const styles = {
  base,
  readyForDrop,
  fileDropped,
  disabled,
  activeDrag,
};
