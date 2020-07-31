import React,{useEffect, useState} from 'react';
import { PanelProps, unitOverrideProcessor, simpleCountUnit } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { GoTriangleUp ,GoTriangleDown} from "react-icons/go";
import parse from 'html-react-parser';
import './SimplePanel.css';
import { PieChart } from 'react-minimal-pie-chart';
import { dataError } from '@grafana/data/types/panelEvents';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, id }) => {
  const styles = getStyles();
  const [uniqueCount, setUniqueCount] = useState(0);
  const [differenceCount, setDifferentCount] = useState(0);
  const [piechartData, setPiechartData] = useState([]);


  useEffect(() => {
    // const countSeries = data.series.find(series => series.name === 'count');
    // const uniqueCounts = countSeries['fields'][1]['values']['buffer'];
    // const newUniqueCount = uniqueCounts[uniqueCounts.length - 1 ];
    
  const predefinedColorSet = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"];
  const userdefinedColorSet = (options.pieChartColorset && options.pieChartColorset.trim().split(',')) || [];
  const colorSet = [...userdefinedColorSet, ...predefinedColorSet];

    const newData = data.series.map((series) => {
      return {
        name: series.name,
        value: series['fields'][1]['values']['buffer'][series.length -1]
      }
    })

   const pieData =  newData.map((d,i) => {
      return {
        value : d.value,
        color : colorSet[i]
      }
      
    })

    const newUniqueCount =newData.reduce((accumulator, currentValue) => accumulator + currentValue.value,0);

    let oldValue = localStorage.getItem(`suspecious-${id}`);

    if(!oldValue){
      localStorage.setItem(`suspecious-${id}`,`${newUniqueCount}`);
      oldValue = `${newUniqueCount}`;
    }

    setUniqueCount(newUniqueCount)
    setDifferentCount(newUniqueCount - Number(oldValue))
    setPiechartData(pieData);
  
    

  }, [data,options,width, height])

  function renderTriange() {
    if(differenceCount > 0){
      return <GoTriangleUp className='arrow-up' />
    }else if(differenceCount < 0){
      return <GoTriangleDown className='arrow-down' />
    }
  }


  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          padding-top:1rem;
        `
      )}
    >
      <div>
        {/* <h4 className='main-text'>
          {parse(`${options.isolatedText}`)}
        </h4> */}
          <PieChart
            data={piechartData}
            lineWidth={options.piechartLineWidth}
            style={{ height: `${options.pieChartSize }px`, width: `${options.pieChartSize}px` }}
          />
      </div>

      <div className='stat-box'>
        <div className='heading-text'>
      <h1 className='heading-number'>{uniqueCount}</h1>
          {
            renderTriange()
          }
        </div>
        <p className='para-text'>{Math.abs(differenceCount)}{ differenceCount > 0 ?  ' more' :  differenceCount < 0 ? ' fewer' : '' }&nbsp;{options.activityText}</p>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
      background: #0C0F24;
      display:flex;
      align-items:center;
      justify-content: space-around;
    `,
  };
});
