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
    .addTextInput({
      path: 'totalMaxVariable',
      name: 'Total Max Variable Name',
      description: 'License Status Total Max Variable Name eg: licenseClientMax',
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
    })
    .addNumberInput({
      path: 'chartTextSize',
      name: 'Chart Text Size',
      defaultValue: 20,
    })
});
