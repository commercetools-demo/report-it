import { defineMessages } from 'react-intl';

export default defineMessages({
  dragAndDropJson: {
    id: 'ImportResourcesModal.dragAndDropJson',
    description:
      'The message telling the user to drag and drop CSV file in the file drop area',
    defaultMessage: 'Drag and drop JSON',
  },
  or: {
    id: 'ImportResourcesModal.or',
    description: 'The word "or" in the drag and drop message',
    defaultMessage: 'or',
  },
  browseButton: {
    id: 'ImportResourcesModal.browseFile',
    defaultMessage: 'Browse file',
  },
  uploadFile: {
    id: 'ImportResourcesModal.uploadFile',
    description:
      'Label for a button on the file upload page, shown on active drop area state',
    defaultMessage: 'Upload file',
  },
  chooseFile: {
    id: 'ImportResourcesModal.chooseFile',
    description:
      'Label for a button on the file upload page, shown on ready to upload state',
    defaultMessage: 'Choose file',
  },
  fileUploadFailed: {
    id: 'ImportResourcesModal.fileUploadFailed',
    description:
      'A title on the file upload page, shown on file upload error state',
    defaultMessage: 'File upload failed',
  },
  fileFormatNotSupported: {
    id: 'ImportResourcesModal.fileFormatNotSupported',
    description:
      'Error message displayed when a user drags and drops a non-CSV file',
    defaultMessage:
      'Invalid file format: The file is not in CSV format and cannot be processed.',
  },
  tooManyFilesError: {
    id: 'ImportResourcesModal.tooManyFilesError',
    description:
      'Error message displayed when a user drags and drops multiple files at once',
    defaultMessage:
      'Multiple files detected: You can only drag and drop one file at a time.',
  },
  genericError: {
    id: 'ImportResourcesModal.genericError',
    description:
      'Default error message for unexpected file upload issues (for unhandled cases)',
    defaultMessage:
      'Error occurred: Please try uploading the file again or contact our support team for assistance.',
  },
  dataType: {
    id: 'ImportResourcesModal.dataType',
    description: 'Label for the data type selection dropdown',
    defaultMessage: 'Data type',
  },
  instructions: {
    id: 'ImportResourcesModal.instructions',
    description: 'Label for the instructions section',
    defaultMessage: 'Instructions',
  },
});
