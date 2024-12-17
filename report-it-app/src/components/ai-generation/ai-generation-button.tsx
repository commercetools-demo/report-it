import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import InlineSvg from '@commercetools-uikit/icons/inline-svg';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import Spacings from '@commercetools-uikit/spacings';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOpenAiConfigurationContext } from '../../providers/open-ai';
import ConfigurationForm from './configuration-form';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs></svg>`;
const AiIcon = <InlineSvg data={svg} color="primary" size="10"></InlineSvg>;

const SwitcherWrapper = styled.div`
  margin-bottom: 1rem;
`;

type ParentRenderProps = {
  generatedQuery: string;
  isSuggestionArrived: boolean;
};

type ParentProps = {
  children: (props: ParentRenderProps) => React.ReactNode;
};

type Props = {
  onSelectAIGeneration: (seed: string) => Promise<string>;
};
const AIGenerationButton = ({
  onSelectAIGeneration,
  children,
}: Props & ParentProps) => {
  const { isConfigured } = useOpenAiConfigurationContext();
  const [seed, setSeed] = useState<string>('');
  const [isLoading, setisLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string>();
  const [isSuggestionArrived, setisSuggestionArrived] = useState(false);
  const [isAIGenerationActive, setisAIGenerationActive] = useState(false);
  const [toggleButtonLabel, setToggleButtonLabel] = useState('manual');

  const { closeModal, openModal, isModalOpen } = useModalState();

  const handleGenerate = async () => {
    setisLoading(true);
    const sug = await onSelectAIGeneration(seed);

    setisAIGenerationActive(false);

    setSuggestion(sug as string);
    setisLoading(false);
    setisSuggestionArrived(true);
  };

  const handleClick = () => {
    if (!isConfigured) {
      openModal();
      setToggleButtonLabel('manual');
    } else {
      setisAIGenerationActive(true);
    }
  };

  const handleManual = () => {
    setisAIGenerationActive(false);
  };

  const handleToggle = (buttonValue: string) => {
    setToggleButtonLabel(buttonValue);

    if (buttonValue === 'manual') {
      handleManual();
    } else if (buttonValue === 'use-ai') {
      handleClick();
    } else if (buttonValue === 'generate') {
      handleGenerate();
    }
  };

  const FirstButton = () => {
    if (toggleButtonLabel === 'manual') {
      return (
        <ViewSwitcher.Button value="use-ai">
          Continue with AI
        </ViewSwitcher.Button>
      );
    }
    return (
      <ViewSwitcher.Button
        value="generate"
        icon={isLoading ? <LoadingSpinner /> : AiIcon}
      >
        Generate query
      </ViewSwitcher.Button>
    );
  };

  return (
    <>
      <SwitcherWrapper>
        <Spacings.Stack scale="xs">
          {isAIGenerationActive && (
            <MultilineTextField
              value={seed}
              title="Prompt"
              placeholder={'What do you want to display in your chart?'}
              onChange={(e) => setSeed(e.target.value)}
            />
          )}
          <ViewSwitcher.Group
            selectedValue={toggleButtonLabel}
            onChange={handleToggle}
          >
            {FirstButton()}
            <ViewSwitcher.Button value="manual">
              Continue Manually
            </ViewSwitcher.Button>
          </ViewSwitcher.Group>
        </Spacings.Stack>
      </SwitcherWrapper>

      {children({
        generatedQuery: isSuggestionArrived ? suggestion ?? '' : '',
        isSuggestionArrived,
      })}
      <Drawer
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Configure AI"
        hideControls
      >
        <ConfigurationForm />
      </Drawer>
    </>
  );
};

export default AIGenerationButton;
