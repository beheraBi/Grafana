import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addNumberInput({
      path: 'piechartLineWidth',
      name: 'Piechart Line Width',
      defaultValue: 40,
    })
    .addNumberInput({
      path: 'pieChartSize',
      name: 'Pie Chart Size',
      defaultValue: 60,
    })
    .addTextInput({
      path: 'pieChartColorset',
      name: 'Pie Chart Color Set',
      description: 'Describe the color names/codes with comma(,) separated values eg:red,green,#fff',
    })
    .addTextInput({
      path: 'activityText',
      name: 'Activity Text',
      defaultValue: 'more in the last past hour',
    })
});
