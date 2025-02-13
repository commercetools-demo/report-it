import { useCallback, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import styled from 'styled-components';
import { WidgetLayout } from '../../types/widget';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import Widget from '../widget';
import WidgetEditButton, {
  StyledIconButton,
} from '../widget/widget-edit-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { designTokens } from '@commercetools-uikit/design-system';
import Spacings from '@commercetools-uikit/spacings';

const StyledWrapper = styled.div<{ $hasWidgets?: boolean }>`
  position: relative;
  flex: 1;
  min-width: 400px;
  @media (min-width: 768px) {
    min-width: 768px;
  }
  @media (min-width: 1024px) {
    min-width: 1024px;
  }
  ${(props) => (props.$hasWidgets ? '' : 'height: 160px;')}
`;
const ResponsiveGridLayout = WidthProvider(Responsive);

const StyledWidgetFrame = styled.div`
  box-shadow: ${designTokens.shadow17};
  border-radius: ${designTokens.borderRadius4};
  border: ${`1px solid ${designTokens.colorNeutral90}`};
  background: ${designTokens.colorSurface};
  z-index: 10;
  &:hover ${StyledIconButton} {
    opacity: 1;
  }
`;

const DashboardGrid = () => {
  const { isLoading, widgets, updateWidget, refresh } =
    useDashboardPanelStateContext();
  const { push } = useHistory();
  const match = useRouteMatch();

  const onLayoutChange = useCallback(
    async (newWidgets: WidgetLayout[]) => {
      const newWidgetArr = widgets ? [...widgets] : [];
      for (const widget of newWidgetArr) {
        const found = newWidgets.find((item) => item.i === widget.key);
        if (!!found && widget.value) {
          await updateWidget(widget.key, { ...widget.value, layout: found });
          await refresh();
        }
      }
      //   setWidgets?.(newWidgetArr);
    },
    [widgets]
  );

  const children = useMemo(() => {
    return widgets?.map((widget) => {
      return (
        <StyledWidgetFrame
          data-grid={{
            ...widget.value?.layout,
            x: widget.value?.layout.x || 0,
            y: widget.value?.layout.y || 0,
            w: widget.value?.layout.w || 1,
            h: widget.value?.layout.h || 1,
          }}
          key={widget.key}
        >
          <Spacings.Inset scale={'m'}>
            <WidgetEditButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                push(match.url + '/edit/' + widget.key);
              }}
              title="Edit widget"
            />
            <Widget widget={widget} />
          </Spacings.Inset>
        </StyledWidgetFrame>
      );
    });
  }, [widgets]);

  return (
    <StyledWrapper $hasWidgets={!!widgets?.length} data-test="test">
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <>
          <ResponsiveGridLayout
            autoSize
            useCSSTransforms
            isDroppable
            resizeHandles={['se']}
            compactType={null}
            breakpoints={{ lg: 1280, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            // @ts-ignore
            onDragStop={onLayoutChange}
            // @ts-ignore
            onResizeStop={onLayoutChange}
            style={!widgets?.length ? { height: '160px' } : {}}
          >
            {children}
          </ResponsiveGridLayout>
        </>
      )}
    </StyledWrapper>
  );
};

export default DashboardGrid;
