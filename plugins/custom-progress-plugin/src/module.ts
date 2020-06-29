import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'licenseUsageText',
      name: 'License Usage Text',
      defaultValue: 'Peak Client License Usage',
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
    .addColorPicker({
      path:'gradientColorFrom',
      name:'Gradient Color From',
      defaultValue:'#3A9EDC'
    })
    .addColorPicker({
      path:'gradientColorTo',
      name:'Gradient Color To',
      defaultValue:'#3ADCB5'
    })
});
