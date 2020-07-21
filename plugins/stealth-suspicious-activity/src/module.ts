import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'isolatedText',
      name: 'Isolated Text',
      defaultValue: 'Users Currently Isolated',
    })
    .addTextInput({
      path: 'activityText',
      name: 'Activity Text',
      defaultValue: 'more in the last past hour',
    })
});
