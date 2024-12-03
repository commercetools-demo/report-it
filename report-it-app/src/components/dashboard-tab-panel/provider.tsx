import { Context, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/use-dashboard';
import { useWidget } from '../../hooks/use-widget';
import { DashboardCustomObject } from '../../types/dashboard';
import { Widget, WidgetResponse } from '../../types/widget';

interface ContextShape {
  widgets?: WidgetResponse[];
  isLoading: boolean;
  addWidget: (widget?: Widget) => Promise<void>;
  updateWidget: (widgetKey: string, widget?: Widget) => Promise<void>;
  removeWidget: (widgetKey: string) => Promise<void>;
  refresh: () => Promise<void>;
  findWidget: (widgetKey?: string | null) => WidgetResponse | null;
}

const DashboardPanelStateContext: Context<ContextShape> =
  createContext<ContextShape>({
    widgets: [],
    isLoading: false,
    addWidget: () => Promise.resolve(),
    updateWidget: () => Promise.resolve(),
    removeWidget: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    findWidget: () => null,
  });

export const DashboardPanelProvider = ({
  children,
  dashboard,
}: React.PropsWithChildren<{ dashboard: DashboardCustomObject }>) => {
  const [widgets, setWidgets] = useState<WidgetResponse[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { getWidgets } = useWidget();
  const { updateDashboard } = useDashboard();
  const { createWidget, updateWidget, deleteWidget } = useWidget();

  const addWidget = async (widget?: Widget): Promise<void> => {
    if (!widget) {
      return;
    }

    const result = await createWidget(widget);
    await updateDashboard(dashboard.key, undefined, [
      ...(dashboard.value.widgets || []),
      {
        key: result.key,
        typeId: 'custom-object',
      },
    ]);
  };
  const removeWidget = async (widgetKey: string): Promise<void> => {
    if (!widgetKey) {
      return;
    }
    await deleteWidget(widgetKey);
  };
  const update = async (widgetKey: string, widget?: Widget): Promise<void> => {
    if (!widget) {
      return;
    }
    await updateWidget(widgetKey, widget);
  };

  const fetchWidgets = async (): Promise<void> => {
    setIsLoading(true);
    const widgets = await getWidgets(dashboard.key);
    setWidgets(widgets);
    setIsLoading(false);
  };

  const findWidget = useCallback((widgetKey?: string | null): WidgetResponse | null => {
    return widgetKey ? widgets?.find((w) => w.key === widgetKey) || null : null;
  }, [widgets]);

  useEffect(() => {
    fetchWidgets();
  }, []);
  return (
    <DashboardPanelStateContext.Provider
      value={{
        widgets,
        findWidget,
        addWidget,
        updateWidget: update,
        refresh: fetchWidgets,
        removeWidget,
        isLoading,
      }}
    >
      {children}
    </DashboardPanelStateContext.Provider>
  );
};

export const useDashboardPanelStateContext = () =>
  useContext(DashboardPanelStateContext);
