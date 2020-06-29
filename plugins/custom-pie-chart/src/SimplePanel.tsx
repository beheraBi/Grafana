import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { PieChart } from 'react-minimal-pie-chart';
import { GoTriangleUp ,GoTriangleDown } from 'react-icons/go';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();

  console.log({data});
  

  const { mainHeading, paragraphText ,lineWidth ,trianleUp } = options;
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
      <h2 className={cx(styles.mainHeading)}> {mainHeading} </h2>
      <div className={cx(styles.mainContainer)}>
        <div>
          <PieChart
            data={[
              { value: 20, color: '#F5A623' },
              { value: 25, color: '#3AA8D6' },
              { value: 45, color: '#CE1443' },
            ]}
            lineWidth={lineWidth}
            style={{ height: `${height - 30}px`, width: `${height - 30}px` }}
          />
        </div>

        <div className={cx(styles.pieText)}>
          <div className={cx(styles.numberText)}>
            <h1 className={cx(styles.numberCount)}>
              19&nbsp;
              {
                trianleUp ?  <GoTriangleUp style={{ color: '#CD1543', fontSize: '.7em' }} />: <GoTriangleDown style={{ color: '#3DB75E', fontSize: '.7em' }}/>
              } 
            </h1>
          </div>
          <p className={cx(styles.paragraphText)}>{paragraphText}</p>
        </div>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    mainContainer: css`
      display: flex;
      justify-content: space-around;
      align-items: center;
    `,
    mainHeading: css`
     font-family:Roboto,
     font-style: normal;
     font-weight:500;
     font-size:14px;
     line-height:21px;
     text-align:center;
     color: #E7E7E7;
    `,
    numberText: css`
      display: flex;
      align-items: center;
    `,
    pieText: css`
      display: flex;
      flex-direction: column;
    `,
    paragraphText: css`
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 11px;
      color: #d9dadc;
    `,
    numberCount: css`
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      font-size: 40px;

      display: flex;
      align-items: center;
      text-align: center;
      color: #d5d7dd;
    `,
  };
});
