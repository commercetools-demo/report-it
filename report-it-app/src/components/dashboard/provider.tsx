import { Context, createContext, useContext, useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/use-dashboard';
import { DashboardCustomObject } from '../../types/dashboard';

interface ContextShape {
  dashboards?: DashboardCustomObject[];
  isLoading: boolean;
  createDashboard?: (dashboardName: string) => Promise<void>;
  updateDashboard?: (dashboard: DashboardCustomObject) => Promise<void>;
}

const DashboardsStateContext: Context<ContextShape> =
  createContext<ContextShape>({
    dashboards: [],
    isLoading: false,
    createDashboard: () => Promise.resolve(),
    updateDashboard: () => Promise.resolve(),
  });

export const DashboardsProvider = ({
  children,
  key,
}: React.PropsWithChildren<{ key?: string }>) => {
  const [dashboards, setDashboards] = useState<DashboardCustomObject[]>();
  const [isLoading, setIsLoading] = useState(false);
  // const debouncedDashboards = useDebounce(dashboards, 500);
  const { fetchAllDashboards, createDashboard, updateDashboard } =
    useDashboard();

  const getAllDashboards = async (): Promise<void> => {
    setIsLoading(true);
    const dashboards = await fetchAllDashboards();
    setDashboards(dashboards?.results);
    setIsLoading(false);
  };

  const createNewDashboard = async (dashboardName: string): Promise<void> => {
    if (dashboardName) {
      const result = await createDashboard({
        name: dashboardName,
      });
      if (result) {
        getAllDashboards();
      }
    }
  };

  const update = async (dashboard: DashboardCustomObject): Promise<void> => {
    if (dashboard) {
      const result = await updateDashboard(
        dashboard.key,
        dashboard.value.name,
        dashboard.value.widgets
      );
      if (result) {
        getAllDashboards();
      }
    }
  };
  const addWidget = async (
    dashboardKey: string,
    dashboardName: string
  ): Promise<void> => {};
  const removeWidget = async (
    dashboardKey: string,
    dashboardName: string
  ): Promise<void> => {};

  useEffect(() => {
    getAllDashboards();
  }, []);

  return (
    <DashboardsStateContext.Provider
      value={{
        dashboards,
        isLoading,
        createDashboard: createNewDashboard,
        updateDashboard: update,
      }}
    >
      {children}
    </DashboardsStateContext.Provider>
  );
};

export const useDashboardsStateContext = () =>
  useContext(DashboardsStateContext);
