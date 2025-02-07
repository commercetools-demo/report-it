import { type DropzoneRootProps } from 'react-dropzone';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { styles } from './styles';
import { DropAreaState } from '../file-drop-area';

interface DropWrapperProps extends DropzoneRootProps {
  dropAreaState: DropAreaState;
}
export const DropWrapper = styled.div<DropWrapperProps>`
  ${styles.base}
  ${(props) => {
    if (props.dropAreaState === 'disabled') {
      return styles.disabled;
    }
    if (props.dropAreaState === 'ready-for-drop') {
      return styles.readyForDrop;
    }
    if (props.dropAreaState === 'active-drag') {
      return styles.activeDrag;
    }
    if (props.dropAreaState === 'file-dropped') {
      return styles.fileDropped;
    }
    return getDefaultDropWrapperStyles(props.dropAreaState);
  }}
`;
function getDefaultDropWrapperStyles(_dropAreaState: never) {
  return css``;
}
