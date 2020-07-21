import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import './SimplePanel.css'
import parse from 'html-react-parser'

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {

  const certicatesExpires = data.series[0].fields[1].values['buffer'];
  const certificateExpiresCount = certicatesExpires[certicatesExpires.length - 1];
  

  const styles = getStyles();
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
      <div className='main-flex-container'>
        <div className='primary-number'> {certificateExpiresCount} </div>
        <div className='text-content'>
          <h4 className='certificate-text'> {
            parse(`${options.certificateExpiresText}`)
          } </h4>
        </div>
        </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
      background: #0C0F24;
    `,
  };
});
