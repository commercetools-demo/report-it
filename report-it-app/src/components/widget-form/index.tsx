import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, ExportIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { FormikProvider, useFormik } from 'formik';
import { Widget } from '../../types/widget';
import cronstrue from 'cronstrue';
import { useDashboardPanelStateContext } from '../dashboard-tab-panel/provider';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import {
  ConfirmationDialog,
  TabHeader,
  TabularModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import { useMemo } from 'react';
import WidgetMainInfo from './widget-main-info';
import WidgetDatasource from './widget-datasource';
import WidgetQuery from '../query';
import WidgetChart from './widget-chart';
import WidgetCSVExport from './widget-csv-export';
import WidgetDatasourceResponseProvider from '../../providers/widget-datasource-response-provider';
import DatasourceStateProvider from '../datasource/provider';
import Text from '@commercetools-uikit/text';

type Props = {
  onClose?: () => void;
  onSubmit: (widget: Widget) => Promise<void>;
  onDelete?: (selectedWidgetKey: string) => Promise<void>;
  onCancel: () => void;
  onExport: () => void;
};

const WidgetForm = ({
  onCancel,
  onSubmit,
  onDelete,
  onExport,
  onClose,
}: Props) => {
  const { findWidget } = useDashboardPanelStateContext();
  const { selectedWidget } = useParams<{ selectedWidget: string }>();
  const match = useRouteMatch();
  const confirmState = useModalState();

  const widget = findWidget(selectedWidget);
  const handleValidation = (values: Widget) => {
    const errors: Record<keyof Widget, string | object> = {} as never;
    if (!values.name) {
      errors.name = 'Required';
    }
    if (typeof values.layout.h === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), h: 'Required' };
    }
    if (typeof values.layout.w === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), w: 'Required' };
    }
    if (typeof values.layout.x === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), x: 'Required' };
    }
    if (typeof values.layout.y === 'undefined') {
      errors.layout = { ...((errors.layout as object) ?? {}), y: 'Required' };
    }
    if (
      typeof values.layout.h !== 'undefined' &&
      parseInt(values.layout.h.toString()) < 1
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        h: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.w !== 'undefined' &&
      parseInt(values.layout.w.toString()) < 1
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        w: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.x !== 'undefined' &&
      parseInt(values.layout.x.toString()) < 0
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        x: 'Must be bigger than 0',
      };
    }
    if (
      typeof values.layout.y !== 'undefined' &&
      parseInt(values.layout.y.toString()) < 0
    ) {
      errors.layout = {
        ...((errors.layout as object) ?? {}),
        y: 'Must be bigger than 0',
      };
    }
    if (values.csvExportConfig?.enabled) {
      if (!values.csvExportConfig?.schedule) {
        try {
          cronstrue.toString(values?.csvExportConfig?.schedule || '');
        } catch (e) {
          errors.csvExportConfig = {
            ...((errors.csvExportConfig as object) ?? {}),
            schedule: 'Invalid cron expression',
          };
        }
      }
    }

    return errors;
  };

  const handleDeleteWidget = async () => {
    onDelete && widget && (await onDelete(widget.key));
    confirmState.closeModal();
  };

  const tabs = [
    { name: 'Main Info' },
    { name: 'Select Datasource', id: 'datasource' },
    { name: 'Write query', id: 'query' },
    { name: 'Chart', id: 'chart' },
    { name: 'CSV Export', id: 'export' },
  ];

  const availableDatasourceKeys = useMemo(() => {
    return widget?.value?.config?.datasources.map((d) => d.key);
  }, [widget?.value?.config?.datasources]);

  const formik = useFormik<Widget>({
    initialValues:
      widget?.value ||
      ({
        name: '',
        layout: { w: 4, h: 2, x: 0, y: 0 },
        csvExportConfig: { csv: true },
      } as Widget),
    onSubmit: onSubmit,
    validateOnBlur: true,
    validate: handleValidation,
    enableReinitialize: true,
  });

  return (
    <FormikProvider value={formik}>
      {!widget?.value?.name && <WidgetMainInfo />}

      {widget && widget.value && widget.value.name && (
        <TabularModalPage
          title={widget.value.name}
          customTitleRow={
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="s"
            >
              <SecondaryButton
                label="Cancel"
                onClick={onCancel}
                type="button"
              />
              <PrimaryButton
                label="Save"
                onClick={formik.submitForm}
                type="button"
                isDisabled={!formik.dirty}
              />
              {!!widget && (
                <IconButton
                  label="Export"
                  title="Export to JSON"
                  onClick={onExport}
                  icon={<ExportIcon size="10" />}
                  type="button"
                />
              )}
              {!!widget && (
                <IconButton
                  label="Delete"
                  title="Delete widget"
                  onClick={confirmState.openModal}
                  icon={<BinLinearIcon size="10" />}
                  type="button"
                />
              )}
            </Spacings.Inline>
          }
          isOpen={true}
          onClose={onClose}
          tabControls={tabs.map((tab) => (
            <TabHeader
              to={`${match.url}${tab.id ? '/' + tab.id : ''}`}
              label={tab.name}
              key={tab.name}
              exactPathMatch={true}
            />
          ))}
        >
          <DatasourceStateProvider>
            <WidgetDatasourceResponseProvider
              availableDatasourceKeys={availableDatasourceKeys}
            >
              <Switch>
                <Route path={`${match.path}`} exact={true}>
                  <WidgetMainInfo />
                </Route>
                <Route path={`${match.path}/datasource`}>
                  <WidgetDatasource widget={widget.value} />
                </Route>
                <Route path={`${match.path}/query`}>
                  <WidgetQuery />
                </Route>
                <Route path={`${match.path}/chart`}>
                  <WidgetChart />
                </Route>
                <Route path={`${match.path}/export`}>
                  <WidgetCSVExport />
                </Route>
              </Switch>
            </WidgetDatasourceResponseProvider>
          </DatasourceStateProvider>
          <ConfirmationDialog
            isOpen={confirmState.isModalOpen}
            onClose={confirmState.closeModal}
            onConfirm={handleDeleteWidget}
            title="Delete widget"
            onCancel={confirmState.closeModal}
          >
            <Text.Body>Are you sure you want to delete this widget?</Text.Body>
          </ConfirmationDialog>
        </TabularModalPage>
      )}
    </FormikProvider>
  );
};

export default WidgetForm;
