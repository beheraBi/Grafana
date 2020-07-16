import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';


export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
  .useFieldConfig()
  .setPanelOptions(builder => {
  return builder
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
