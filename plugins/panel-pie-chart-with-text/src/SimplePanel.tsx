import React, { useEffect, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import parse from 'html-react-parser';
import './SimplePanel.css';
import { PieChart } from 'react-minimal-pie-chart';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();
  const theme = useTheme();

  const [uniqueCount, setUniqueCount] = useState(0);
  const [differenceCount, setDifferentCount] = useState(0);
  const [piechartData, setPiechartData] = useState([]);
  const [showTooltip, setshowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function renderTriange() {
    if (differenceCount > 0) {
      return <GoTriangleUp className="arrow-up" />;
    } else if (differenceCount < 0) {
      return <GoTriangleDown className="arrow-down" />;
    }
  }

  useEffect(() => {
    try {
      if (data.series && data.series.length > 0) {
        const lastHourData = data.series.map(field => {
          return {
            role: field.name,
            value: field['fields'][1]['values']['buffer'][0],
          };
        });

        const newCurrentHourData = data.series.map(field => {
          return {
            role: field.name,
            value: field['fields'][1]['values']['buffer'][field.length - 1],
          };
        });

        const predefinedColorSet = newCurrentHourData.map(() => getRandomColor());
        const standardardColorSet = [
          '#3AA8D6',
          '#7BB359',
          '#88277E',
          '#FF5858',
          '#5A1919',
          '#CE1443',
          '#19374D',
          '#ECDFBD',
          '#EA8247',
          '#75EEDC',
          '#9F4707',
          '#474EEA',
          '#F5A623',
          '#F05A28',
          '#FF5E86',
          '#8EB667',
          '#5C58FF',
          '#FDD8E1',
        ];
        const userdefinedColorSet = (options.pieChartColorset && options.pieChartColorset.trim().split(',')) || [];
        const colorSet = [...userdefinedColorSet, ...standardardColorSet, ...predefinedColorSet];

        const pieData = newCurrentHourData
          .filter(el => el.value > 0)
          .map((el, i) => {
            return {
              role: el.role,
              value: el.value,
              color: colorSet[i],
            };
          });

        const newHourTotalData = newCurrentHourData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.value,
          0
        );

        const lastHourTotalData = lastHourData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.value,
          0
        );

        setPiechartData(pieData);
        setUniqueCount(newHourTotalData);
        setDifferentCount(newHourTotalData - lastHourTotalData);
      }
    } catch (error) {}
  }, [options, data]);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          padding: 20px 0;
        `
      )}
    >
      {showTooltip && (
        <div className="pie-tooltip">
          <div className="pie-tooltip-text">{parse(tooltipText)}</div>
        </div>
      )}

      <div>
        <PieChart
          data={piechartData}
          animate={true}
          onMouseOver={(e, segmentIndex) => {
            setshowTooltip(true);
            const role = piechartData[segmentIndex];
            const rolePercent = ((role.value * 100) / uniqueCount).toFixed(2);
            setTooltipText(`${role.role} <br/> ${role.value} (${rolePercent}%)`);
          }}
          onMouseOut={(e, segmentIndex) => {
            setshowTooltip(false);
          }}
          lineWidth={options.piechartLineWidth}
          style={{ height: `${options.pieChartSize}px`, width: `${options.pieChartSize}px`, cursor: 'pointer' }}
          startAngle={-90}
        />
      </div>

      <div className="stat-box">
        <div className="heading-text">
          <h1 className="heading-number" style={{ color: `${theme.isDark ? '#D5D7DD' : '#000'}` }}>
            {uniqueCount}
          </h1>
          {renderTriange()}
        </div>
        <p className="para-text" style={{ color: `${theme.isDark ? '#D5D7DD' : '#828282'}` }}>
          {Math.abs(differenceCount)}
          {differenceCount > 0 ? ' more' : differenceCount < 0 ? ' fewer' : ''}&nbsp;{options.activityText}
        </p>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
    `,
  };
});
