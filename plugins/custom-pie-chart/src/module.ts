import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'mainHeading',
      name: 'Heading Text',
      defaultValue: 'Users Currently Isolated',
    })
    .addTextInput({
      path: 'paragraphText',
      name: 'Paragraph Text',
      defaultValue: '7 more in the last hour',
    })
    .addNumberInput({
      path: 'lineWidth',
      name: 'Line Width',
      defaultValue: 35,
    })
    .addBooleanSwitch({
      path: 'trianleUp',
      name: 'Show Triangle Up',
      description: "Switch to Triangle Up/Down",
      defaultValue: true,
    })
    
});
