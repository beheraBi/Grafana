import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
  .setPanelOptions((builder) => {
    return builder
    .addTextInput({
      path: 'primaryColorSet',
      name: 'Primary Color Set',
      description: 'Describe the color names/codes with comma(,) separated values eg:red,green,#fff',
    })
    .addBooleanSwitch({
      path: 'showLineGradient',
      name: 'Show Line Gradient',
      defaultValue: false,
    })
   .addTextInput({
      path: 'secondaryColorSet',
      name: 'Secondary Color Set',
      description: 'Describe the color names/codes with comma(,) separated values eg:red,green,#fff',
      showIf: config => config.showLineGradient,
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
      defaultValue: 5,
    })
    .addNumberInput({
      path: 'yAxisTickSize',
      name: 'Y-Axis Tick Size',
      defaultValue: 5,
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
          {
            value: '4',
            label: '4',
          },
          {
            value: '5',
            label: '5',
          },
          {
            value: '6',
            label: '6',
          },
        ],
      },
    })
    .addRadio({
      path: 'yAxisFormat',
      defaultValue: '.1s',
      name: 'Y-axis Unit Format',
      settings: {
        options: [
          {
            value: '',
            label: 'None',
          },
          {
            value: '.1s',
            label: 'Thousands',
          },
        ],
      },
    })
    .addRadio({
      path: 'tooltipValues',
      defaultValue: 'none',
      name: 'Show tooltip values in',
      settings: {
        options: [
          {
            value: 'none',
            label: 'None',
          },
          {
            value: 'decimals',
            label: 'Decimals',
          },
        ],
      },
    })
});
