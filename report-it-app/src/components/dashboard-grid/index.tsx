import { useCallback, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import styled from 'styled-components';
import { WidgetLayout } from '../../types/widget';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import Widget from '../widget';
import WidgetEditButton from '../widget/widget-edit-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useHistory, useRouteMatch } from 'react-router-dom';

const StyledWrapper = styled.div<{ hasWidgets?: boolean }>`
  position: relative;
  flex: 1;
  min-width: 400px;
  @media (min-width: 768px) {
    min-width: 990px;
  }
  @media (min-width: 1024px) {
    min-width: 1280px;
  }
  ${(props) => (props.hasWidgets ? '' : 'height: 160px;')}
`;
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = () => {
  const { isLoading, widgets } = useDashboardPanelStateContext();
  const { push } = useHistory();
  const match = useRouteMatch();

  const onLayoutChange = useCallback(
    (newWidgets: WidgetLayout[]) => {
      const newWidgetArr = widgets ? [...widgets] : [];
      newWidgetArr.forEach((widget) => {
        const found = newWidgets.find((item) => item.i === widget.id);
        if (!!found && widget.value) {
          widget.value.layout = found;
        }
      });
      //   setWidgets?.(newWidgetArr);
    },
    [widgets]
  );

  const children = useMemo(() => {
    return widgets?.map((widget) => {
      return (
        <div
          data-grid={{
            ...widget.value?.layout,
            x: widget.value?.layout.x || 0,
            y: widget.value?.layout.y || 0,
            w: widget.value?.layout.w || 1,
            h: widget.value?.layout.h || 1,
          }}
          key={widget.key}
        >
          <WidgetEditButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              push(match.url + '/edit/' + widget.key);
            }}
            title="Edit widget"
          />
          <Widget widget={widget} />
        </div>
      );
    });
  }, [widgets]);

  return (
    <StyledWrapper hasWidgets={!!widgets?.length}>
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
