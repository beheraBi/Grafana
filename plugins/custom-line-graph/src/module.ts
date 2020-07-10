import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
  .setPanelOptions((builder) => {
    return builder
    .addTextInput({
      path: 'title',
      name: 'Title',
      defaultValue: '',
    })
    .addTextInput({
      path: 'colorSet',
      name: 'Color Set',
      description: 'Describe the color set with comma(,) separated values eg:red,green,blue',
      defaultValue: 'red,orange,blue',
    })
    .addUnitPicker({
      path: 'unitPicker',
      name: 'Select Unit Picker',
    })
    .addBooleanSwitch({
      path: 'showLegend',
      name: 'Show Legend',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showTooltip',
      name: 'Show Tooltip',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'fillGradient',
      name: 'Area fill',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'xAxisTickSize',
      name: 'X-Axis Tick Size',
      defaultValue: 6,
    })
    .addNumberInput({
      path: 'yAxisTickSize',
      name: 'Y-Axis Tick Size',
      defaultValue: 6,
    })
    .addSelect({
      path: 'lineWidth',
      name: 'Line Width',
      defaultValue: '1',
      settings: {
        options: [
          {
            value: '1',
            label: '1',
          },
          {
            value: '2',
            label: '2',
          },
          {
            value: '3',
            label: '3',
          },
        ],
      },
    });
});
