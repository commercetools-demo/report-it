import React, { Dispatch, SetStateAction } from 'react';
import {
  type FileRejection,
  type DropEvent,
  useDropzone,
} from 'react-dropzone';
import { useIntl } from 'react-intl';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { getDropArea, getDropAreaState, DropWrapper } from './drop-area-states';
import messages from './messages';
import Constraints from '@commercetools-uikit/constraints';

export type DropAreaState =
  | 'active-drag'
  | 'disabled'
  | 'ready-for-drop'
  | 'file-dropped';

type Props = {
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
};

export const FileDropArea: React.FC<Props> = ({ file, setFile }) => {
  const intl = useIntl();
  const showNotification = useShowNotification();
  const onDrop = React.useCallback<OnDrop>(
    ([file]) => {
      if (!file) {
        return;
      }
      setFile(file);
    },
    [setFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/json': ['.json'],
    },
    onDropRejected: ([rejectedFile]) => {
      if (
        rejectedFile.errors.some((error) => error.code === 'too-many-files')
      ) {
        showNotification({
          kind: 'error',
          domain: DOMAINS.PAGE,
          text: intl.formatMessage(messages.tooManyFilesError),
        });
        return;
      }

      if (
        rejectedFile.errors.some((error) => error.code === 'file-invalid-type')
      ) {
        showNotification({
          kind: 'error',
          domain: DOMAINS.PAGE,
          text: intl.formatMessage(messages.fileFormatNotSupported),
        });
      } else {
        showNotification({
          kind: 'error',
          domain: DOMAINS.PAGE,
          text: intl.formatMessage(messages.genericError),
        });
      }
    },
  });
  const dropAreaState = React.useMemo<DropAreaState>(
    () =>
      getDropAreaState({
        isReady: Boolean(file),
        isDragActive,
      }),
    [file, isDragActive]
  );
  const dropArea = getDropArea({
    dropAreaState,
    isFileDropped: Boolean(file),
    fileName: file?.name || '',
  });
  return (
    <DropWrapper
      role="presentation"
      {...getRootProps()}
      dropAreaState={dropAreaState}
    >
      <input data-testid="file-input" {...getInputProps()} />
      <Constraints.Horizontal>{dropArea}</Constraints.Horizontal>
    </DropWrapper>
  );
};

type OnDrop = <T extends File>(
  acceptedFiles: T[],
  fileRejections: FileRejection[],
  event: DropEvent
) => void;
