import CollapsibleMotion from '@commercetools-uikit/collapsible-motion';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import styled from 'styled-components';
import { useQueryUtils } from '../../hooks/use-query-utils';
import { SchemaView } from './schema-view';
import { TablePreview } from './table-preview';
import { useWidgetDatasourceResponseContext } from '../../providers/widget-datasource-response-provider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
`;

const CollapsibleWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Previews = () => {
  const { tables } = useWidgetDatasourceResponseContext();

  const { getSchema } = useQueryUtils();
  return (
    <div>
      {Object.keys(tables || {}).map((name) => (
        <CollapsibleMotion key={name || 'unnamed'} isDefaultClosed>
          {({ isOpen, toggle, containerStyles, registerContentNode }) => (
            <CollapsibleWrapper>
              <SecondaryButton
                type="button"
                label={
                  isOpen
                    ? `Close ${name || 'unnamed'}`
                    : `Show ${name || 'unnamed'} preview`
                }
                onClick={toggle}
              ></SecondaryButton>
              <div style={containerStyles}>
                <Container ref={registerContentNode}>
                  <TablePreview
                    name={name || 'unnamed'}
                    data={tables?.[name]?.data}
                  />
                  <SchemaView
                    name={name || 'unnamed'}
                    schema={getSchema(tables?.[name]?.data)}
                  />
                </Container>
              </div>
            </CollapsibleWrapper>
          )}
        </CollapsibleMotion>
      ))}
    </div>
  );
};

export default Previews;
