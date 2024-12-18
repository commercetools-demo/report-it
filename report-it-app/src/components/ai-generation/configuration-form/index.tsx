import { ContentNotification } from '@commercetools-uikit/notifications';
import NumberField from '@commercetools-uikit/number-field';
import TextField from '@commercetools-uikit/text-field';
import PasswordField from '@commercetools-uikit/password-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useOpenAiConfigurationContext } from '../../../providers/open-ai';

const ConfigurationForm = () => {
  const {
    apiKey,
    maxTokens,
    graphQLConversationId,
    alaSqlonversationId,
    initializeConversations,
    setBasicInfo,
  } = useOpenAiConfigurationContext();
  const initialValues = {
    apiKey: apiKey || '',
    maxTokens: maxTokens || 100,
    graphQLConversationId: graphQLConversationId || '',
    alaSqlonversationId: alaSqlonversationId || '',
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleConversationCreation = async () => {
    setIsLoading(true);
    await initializeConversations();
    setIsLoading(false);
  };

  const handleSubmit = (values: typeof initialValues) => {
    setBasicInfo(values.apiKey, values.maxTokens);
  };

  return (
    <Spacings.Inline scale="xl" justifyContent="flex-start">
      <Spacings.Stack scale="xl">
        <ContentNotification type="info">
          <Text.Body>
            OpenAI capabilities are turned off. Configure using the form below.
          </Text.Body>
        </ContentNotification>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {} as any;
            if (!values.apiKey) {
              errors.apiKey = 'Required';
            }
            if (!values.maxTokens) {
              errors.maxTokens = 'Required';
            }
            return errors;
          }}
        >
          {({
            values,
            isValid,
            errors,
            touched,
            dirty,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Spacings.Stack scale="l">
                <Spacings.Stack scale="xs">
                  <PasswordField
                    title="Openai API key"
                    hint="Enter your API key. We will only store it in your browser."
                    name="apiKey"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.apiKey}
                    renderShowHideButton={false}
                  />
                  {errors.apiKey && touched.apiKey && (
                    <Text.Caption tone="critical">{errors.apiKey}</Text.Caption>
                  )}
                </Spacings.Stack>
                <Spacings.Stack scale="xs">
                  <NumberField
                    title="Max token usage per request"
                    value={values.maxTokens}
                    name="maxTokens"
                    onChange={handleChange}
                  />
                  {errors.maxTokens && touched.maxTokens && (
                    <Text.Caption tone="critical">
                      {errors.maxTokens}
                    </Text.Caption>
                  )}
                </Spacings.Stack>
                <Spacings.Inline scale="xl" alignItems="flex-end">
                  <Spacings.Stack scale="xs">
                    <TextField
                      title="Conversation ID for SQL queries"
                      value={values.alaSqlonversationId}
                      name="alaSqlonversationId"
                      isRequired
                      isReadOnly
                    />
                  </Spacings.Stack>
                  <Spacings.Stack scale="xs">
                    <TextField
                      title="Conversation ID for GraphQL queries"
                      value={values.graphQLConversationId}
                      name="graphQLConversationId"
                      isRequired
                      isReadOnly
                    />
                  </Spacings.Stack>
                  <PrimaryButton
                    isDisabled={
                      !!alaSqlonversationId && !!graphQLConversationId
                    }
                    label="Create Conversations"
                    type="button"
                    iconRight={isLoading ? <LoadingSpinner /> : <></>}
                    onClick={handleConversationCreation}
                  ></PrimaryButton>
                </Spacings.Inline>
                <Spacings.Inline scale="xl">
                  <PrimaryButton
                    isDisabled={!dirty}
                    label="Save"
                    type="submit"
                  ></PrimaryButton>
                </Spacings.Inline>
              </Spacings.Stack>
            </Form>
          )}
        </Formik>
      </Spacings.Stack>
    </Spacings.Inline>
  );
};

export default ConfigurationForm;
