import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './SimplePanel.css';
import { PieChart } from 'react-minimal-pie-chart';
import parse from 'html-react-parser';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = props => {
  const { options, data, width, height } = props;
  const styles = getStyles();
  const theme = useTheme();

  const [sumTotalInUse, setSumTotalInUse] = useState(0);
  const [maxTotal, setMaxTotal] = useState(0);
  const [maxTotalInUse, setMaxTotalInUse] = useState(0);
  const [licenseTotalMaxCount, setLicenseTotalMaxCount] = useState(0);
  const [blackValue, setblackValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [strokeColor, setStrokeColor] = useState('green');

  if (!options.showDonutChart) {
    try {
      let newPercentage = 0;
      const newmaxTotalInUse = data['series'][0]['fields'][1]['values']['buffer'][0];
      const newmaxTotal = data['series'][1]['fields'][1]['values']['buffer'][0];

      let thresholds = props.fieldConfig.defaults.thresholds?.steps || [];

      for (const iterator of thresholds) {
        if (percentage >= iterator.value) {
          setStrokeColor(iterator.color);
        }
      }

      if (newmaxTotalInUse && newmaxTotal) {
        newPercentage = Number(((sumTotalInUse * 100) / maxTotal).toFixed(2) || 0);
      }

      if (newmaxTotalInUse) {
        setSumTotalInUse(newmaxTotalInUse);
      }
      if (newmaxTotal) {
        setMaxTotal(newmaxTotal);
      }

      if (newPercentage) {
        setPercentage(newPercentage);
      }
    } catch (error) {
      // console.log(error);
    }
  } else {
    try {
      const newMaxTotalInUse = data['series'][0]['fields'][1]['values']['buffer'][0];
      const newMaxTotal = data['series'][1]['fields'][0]['values']['buffer'];
      const newLicenseTotalMaxCount = data['series'][0]['fields'][2]['values']['buffer'][0];
      const stealthEndPoints = data['series'][1]['fields'][1]['values']['buffer'][0];

      let newblackValue = sumTotalInUse - (maxTotalInUse + licenseTotalMaxCount);

      if (newblackValue < 0) {
        newblackValue = 0;
      }

      if (stealthEndPoints) {
        setSumTotalInUse(stealthEndPoints);
      }
      if (newMaxTotal) {
        setMaxTotal(newMaxTotal);
      }
      if (newMaxTotalInUse) {
        setMaxTotalInUse(newMaxTotalInUse);
      }
      if (newLicenseTotalMaxCount) {
        setLicenseTotalMaxCount(newLicenseTotalMaxCount);
        setblackValue(newblackValue);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
        {options.showDonutChart ? (
          <div>
            <PieChart
              data={[
                { color: '#F5A623', value: licenseTotalMaxCount },
                { color: '#3CB4FF', value: maxTotalInUse },
                { color: `${theme.isDark ? '#000' : '#F5F5F5'}`, value: blackValue },
              ]}
              lineWidth={options.pieChartStrokeWidth}
              style={{ height: `${options.chartSize}px`, width: `${options.chartSize}px` }}
              startAngle={275}
            />
          </div>
        ) : (
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
                  stroke: `${theme.isDark ? '#000' : '#F5F5F5'}`,
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'butt',
                  // Rotate the trail
                },
                // Customize the text
                text: {
                  // Text color
                  fill: `${theme.isDark ? '#fff' : '#000'}`,
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
        )}

        <div className="text-content">
          <h4 className="heading-primary">
            {formatNumber(sumTotalInUse)}
            <span className="heading-secondary">/{formatNumber(maxTotal)}</span>
          </h4>
          <p className="license-usage-text">{parse(`${options.licenseUsageText}`)}</p>
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
      background: none;
    `,
  };
});
