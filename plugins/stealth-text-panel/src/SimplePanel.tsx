import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import parse from 'html-react-parser'


interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();

  let newTextContent = options.content;

  var newTxt = options.content.split('{');
  for (var i = 1; i < newTxt.length; i++) {
      newTextContent =  newTextContent.replace(`{${newTxt[i].split('}')[0]}}`, eval(newTxt[i].split('}')[0]))
    
  }
    
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {parse(`${newTextContent}`)}
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
  };
});
