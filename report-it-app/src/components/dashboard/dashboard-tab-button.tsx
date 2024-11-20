import React from 'react';
import { EditIcon } from '@commercetools-uikit/icons';
import { DashboardCustomObject } from '../../types/dashboard';
import { TabButton } from '../tab/tab-button';
import IconButton from '@commercetools-uikit/icon-button';

type Props = {
  dashbaord: DashboardCustomObject;
  openModal: (dashboardkey: string) => void;
};

const DashboardTabButton = ({ dashbaord, openModal }: Props) => {
  return (
    <>
      <span>{dashbaord.value.name}</span>
      <IconButton
        onClick={() => openModal(dashbaord.key)}
        label="Edit"
        size="small"
        icon={<EditIcon size="small" />}
      ></IconButton>
    </>
  );
};

export default DashboardTabButton;
