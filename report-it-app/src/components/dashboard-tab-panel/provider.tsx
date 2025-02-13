import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDashboard } from '../../hooks/use-dashboard';
import { useWidget } from '../../hooks/use-widget';
import { DashboardCustomObject } from '../../types/dashboard';
import { ExportableWidget, Widget, WidgetResponse } from '../../types/widget';
import { useDatasource } from '../../hooks/use-datasource';

interface ContextShape {
  widgets?: WidgetResponse[];
  isLoading: boolean;
  addWidget: (widget?: Widget) => Promise<WidgetResponse | undefined>;
  updateWidget: (
    widgetKey: string,
    widget?: Widget
  ) => Promise<WidgetResponse | undefined>;
  removeWidget: (widgetKey: string) => Promise<void>;
  exportWidget: (widgetKey: string) => Promise<ExportableWidget | undefined>;
  importWidget: (json: ExportableWidget) => Promise<boolean>;
  refresh: () => Promise<void>;
  findWidget: (widgetKey?: string | null) => WidgetResponse | null;
  updateLayoutsAndRefresh: (
    updates: { widgetKey: string; layout?: Widget['layout'] }[]
  ) => Promise<void>;
}
const DashboardPanelStateContext: Context<ContextShape> =
  createContext<ContextShape>({
    widgets: [],
    isLoading: false,
    addWidget: () => Promise.resolve(undefined),
    updateWidget: () => Promise.resolve(undefined),
    removeWidget: () => Promise.resolve(),
    exportWidget: () => Promise.resolve(undefined),
    importWidget: () => Promise.resolve(false),
    refresh: () => Promise.resolve(),
    findWidget: () => null,
    updateLayoutsAndRefresh: () => Promise.resolve(),
  });

export const DashboardPanelProvider = ({
  children,
  dashboard,
}: React.PropsWithChildren<{ dashboard: DashboardCustomObject }>) => {
  const [widgets, setWidgets] = useState<WidgetResponse[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { updateDashboard } = useDashboard();
  const { createDatasource } = useDatasource();
  const {
    createWidget,
    updateWidget,
    deleteWidget,
    getWidgets,
    exportWidget,
    isLayoutChanged,
  } = useWidget();

  const addWidget = async (
    widget?: Widget
  ): Promise<WidgetResponse | undefined> => {
    if (!widget) {
      return;
    }

    const result = await createWidget(widget);
    await updateDashboard(dashboard.key, undefined, [
      ...(dashboard.value.widgets || []),
      {
        key: result.key,
        typeId: 'key-value-document',
      },
    ]);
    return result;
  };
  const removeWidget = async (widgetKey: string): Promise<void> => {
    if (!widgetKey) {
      return;
    }
    await deleteWidget(widgetKey, dashboard.key);
  };
  const exportAWidget = async (
    widgetKey: string
  ): Promise<ExportableWidget | undefined> => {
    if (!widgetKey) {
      return;
    }
    return exportWidget(widgetKey, dashboard.key);
  };

  const update = async (
    widgetKey: string,
    widget?: Widget
  ): Promise<WidgetResponse | undefined> => {
    if (!widget) {
      return;
    }
    return updateWidget(widgetKey, widget);
  };

  const updateLayoutsAndRefresh = async (
    updates: { widgetKey: string; layout?: Widget['layout'] }[]
  ): Promise<void> => {
    const updatedWidgets: Pick<WidgetResponse, 'key' | 'value'>[] = [];

    for (const update of updates) {
      const widget = findWidget(update.widgetKey);
      if (!widget?.value || !update.layout) {
        continue;
      }
      if (isLayoutChanged(widget.value.layout, update.layout)) {
        updatedWidgets.push({
          key: update.widgetKey,
          value: {
            ...widget.value,
            layout: update.layout,
          },
        });
      }
    }
    if (updatedWidgets.length > 0) {
      await Promise.all(
        updatedWidgets.map(async (update) => {
          await updateWidget(update.key, update.value);
        })
      );

      await fetchWidgets();
    }
  };

  const fetchWidgets = async (): Promise<void> => {
    setIsLoading(true);
    const widgets = await getWidgets(dashboard.key);
    setWidgets(widgets);
    setIsLoading(false);
  };

  const findWidget = useCallback(
    (widgetKey?: string | null): WidgetResponse | null => {
      return widgetKey
        ? widgets?.find((w) => w.key === widgetKey) || null
        : null;
    },
    [widgets]
  );

  const importWidget = async (json: ExportableWidget): Promise<boolean> => {
    if (!json) {
      return false;
    }
    const datasourceMap = {} as Record<string, string>;
    if (json.datasources?.length) {
      for (const datasource of json.datasources) {
        const ds = await createDatasource(datasource.value!);
        datasourceMap[datasource.key] = ds.key;
      }
    }
    if (json.widget?.value) {
      const newWidget = await createWidget({
        ...json.widget.value,
        ...(json.widget.value.config && {
          config: {
            ...json.widget.value.config,
            datasources: json.widget.value.config.datasources.map((d) => ({
              typeId: 'key-value-document',
              key: datasourceMap[d.key],
            })),
          },
        }),
      });
      await addWidget(newWidget.value);
      await fetchWidgets();
      return !!newWidget;
    }
    return false;
  };

  useEffect(() => {
    fetchWidgets();
  }, []);
  return (
    <DashboardPanelStateContext.Provider
      value={{
        widgets,
        findWidget,
        addWidget,
        exportWidget: exportAWidget,
        importWidget,
        updateWidget: update,
        refresh: fetchWidgets,
        removeWidget,
        updateLayoutsAndRefresh,
        isLoading,
      }}
    >
      {children}
    </DashboardPanelStateContext.Provider>
  );
};

export const useDashboardPanelStateContext = () =>
  useContext(DashboardPanelStateContext);
