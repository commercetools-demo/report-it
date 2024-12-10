import CollapsibleMotion from '@commercetools-uikit/collapsible-motion';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import styled from 'styled-components';
import { useWidgetDatasourceResponseContext } from '../widget-form/widget-datasource-response-provider';
import { useQueryUtils } from './hooks/use-query-utils';
import { SchemaView } from './schema-view';
import { TablePreview } from './table-preview';

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
  const { datasources } = useWidgetDatasourceResponseContext();
  const { getSchema } = useQueryUtils();
  return (
    <div>
      {Object.keys(datasources).map((name) => (
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
                    data={datasources[name]?.results}
                    title={`Table: ${name || 'unnamed'}`}
                  />
                  <SchemaView
                    name={name || 'unnamed'}
                    schema={getSchema(datasources[name]?.results)}
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
