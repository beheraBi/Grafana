import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
  .useFieldConfig()
  .setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'licenseUsageText',
      name: 'License Usage Text',
      defaultValue: 'Peak Client License Usage',
    })
    .addBooleanSwitch({
      path: 'showDonutChart',
      name: 'Show Donut Chart',
      defaultValue: false,
    })
    .addNumberInput({
      path: 'chartSize',
      name: 'Chart Size',
      defaultValue: 150,
    })
    .addNumberInput({
      path: 'strokewidth',
      name: 'Stroke Width',
      defaultValue: 15,
      showIf: config => !config.showDonutChart
    })
    .addNumberInput({
      path: 'pieChartStrokeWidth',
      name: 'Stroke Width',
      defaultValue: 35,
      showIf: config => config.showDonutChart
    })
    .addNumberInput({
      path: 'chartTextSize',
      name: 'Chart Text Size',
      defaultValue: 20,
    })
});
