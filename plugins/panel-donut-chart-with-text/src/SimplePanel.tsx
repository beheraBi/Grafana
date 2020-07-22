import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './SimplePanel.css';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = props => {
  const { options, data, width, height, replaceVariables } = props;
  const styles = getStyles();
  
  const licenseUsageMax = replaceVariables(`$${options.totalMaxVariable}`);

  let strokeColor = 'red';
  let dataValues = data['series'][0]['fields'][1]['values']['buffer'];
  let totalInUseValues = data['series'][1]['fields'][1]['values']['buffer'];

  let percentage = dataValues[dataValues.length - 1].toFixed(2);
  let totalInUse = totalInUseValues[totalInUseValues.length - 1];

  let thresholds = props.fieldConfig.defaults.thresholds?.steps || [];

  for (const iterator of thresholds) {
    if (percentage >= iterator.value) {
      strokeColor = iterator.color;
    }
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
      <div className="flex-container">
        <div>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={options.strokewidth}
          styles={{
            // Customize the root svg element
            root: {
              width: `${options.chartSize}px`,
              height: `${options.chartSize}px`,
            },
            // Customize the path, i.e. the "completed progress"
            path: {
              // Path color
              stroke: `${strokeColor}`,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Customize transition animation
              transition: 'stroke-dashoffset 0.5s ease 0s',
              // Rotate the path
            },
            // Customize the circle behind the path, i.e. the "total progress"
            trail: {
              // Trail color
              stroke: '#000',
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Rotate the trail
            },
            // Customize the text
            text: {
              // Text color
              fill: '#fff',
              // Text size
              fontSize: `${options.chartTextSize}px`,
              fontFamily: 'inherit',
            },
            // Customize background - only used when the `background` prop is true
            background: {
              fill: 'transparent',
            },
          }}
        />
       </div>
        <div className='text-content'>
          <h4 className='heading-primary'>{totalInUse}<span className='heading-secondary'>/{licenseUsageMax}</span></h4>
          <p className='license-usage-text'> {options.licenseUsageText} </p>
        </div>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      font-family: Roboto;
      position: relative;
      background: #0C0F24;
    `,
  };
});
