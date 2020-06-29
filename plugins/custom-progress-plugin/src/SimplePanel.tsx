import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import './SimplePanel.css';

const DonutChart = ({
  value = 0,
  size = 100,
  strokewidth = 15,
  chartTextSize = 20,
  gradientColorFrom = '#3A9EDC',
  gradientColorTo = '#3ADCB5',
}) => {
  const halfsize = size * 0.5;
  const radius = halfsize - strokewidth * 0.5;
  const circumference = 2 * Math.PI * radius;
  const strokeval = (value * circumference) / 100;
  const dashval = strokeval + ' ' + circumference;

  const trackstyle = { strokeWidth: strokewidth };
  const indicatorstyle = { strokeWidth: strokewidth, strokeDasharray: dashval };
  const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

  return (
    <svg width={size} height={size} className="donutchart">
      <linearGradient id="sky">
        <stop stop-color={`${gradientColorTo}`} offset="0%" />
        <stop stop-color={`${gradientColorFrom}`} offset="100%" />
      </linearGradient>
      <circle
        r={radius}
        cx={halfsize}
        cy={halfsize}
        transform={rotateval}
        style={trackstyle}
        className="donutchart-track"
      />
      <circle
        r={radius}
        cx={halfsize}
        cy={halfsize}
        transform={rotateval}
        style={indicatorstyle}
        stroke="url(#sky)"
        className="donutchart-indicator"
      />
      <text className="donutchart-text" x={halfsize} y={halfsize + 9} style={{ textAnchor: 'middle' }}>
        <tspan className="donutchart-text-val" style={{ fontSize: `${chartTextSize}px` }}>
          {value}%
        </tspan>
      </text>
    </svg>
  );
};

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
  console.log({data});
  
  const { licenseUsageText, strokewidth, chartTextSize, gradientColorFrom, gradientColorTo } = options;
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
      <div className={cx(styles.mainContainer)}>
        <div>
          <DonutChart
            value={58}
            strokewidth={strokewidth}
            size={height}
            chartTextSize={chartTextSize}
            gradientColorTo={gradientColorTo}
            gradientColorFrom={gradientColorFrom}
          ></DonutChart>
        </div>
        <div className="textContainer">
          <h4 className="text-heading">
            <span className="text-heading-primary">555</span>
            <span className="text-heading-secondary">/567</span>
          </h4>
          <p className="text-paragraph">{licenseUsageText}</p>
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
    `,
    mainContainer: css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    `,
  };
});
