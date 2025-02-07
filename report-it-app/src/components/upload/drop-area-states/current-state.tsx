import ActiveDragDropArea from './active-drag';
import DisabledDropArea from './disabled';
import EnabledDropArea from './enabled';
import FileDroppedArea from './file-dropped';
import { DropAreaState } from '../file-drop-area';

interface Props {
  dropAreaState: DropAreaState;
  isFileDropped: boolean;
  fileName?: string;
}

export function getDropArea({
  dropAreaState,
  isFileDropped,
  fileName,
}: Props): React.ReactNode {
  if (dropAreaState === 'file-dropped') {
    return <FileDroppedArea fileName={fileName} />;
  }
  if (dropAreaState === 'disabled') {
    return <DisabledDropArea />;
  }
  if (dropAreaState === 'ready-for-drop') {
    return <EnabledDropArea />;
  }
  if (dropAreaState === 'active-drag') {
    return <ActiveDragDropArea isFileDropped={isFileDropped} />;
  }
  return fallbackDropArea(dropAreaState);
}
function fallbackDropArea(_invalidDropAreaState: never): React.ReactNode {
  return <DisabledDropArea />;
}

type Flags = {
  isReady: boolean;
  isDragActive: boolean;
};
export function getDropAreaState(flags: Flags) {
  if (flags.isDragActive) {
    return 'active-drag';
  }
  if (flags.isReady) {
    return 'file-dropped';
  }
  return 'ready-for-drop';
}
