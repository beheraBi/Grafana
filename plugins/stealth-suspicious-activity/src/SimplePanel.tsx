import React,{useEffect, useState} from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { GoTriangleUp ,GoTriangleDown} from "react-icons/go";
import parse from 'html-react-parser';
import './SimplePanel.css';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, id }) => {
  const styles = getStyles();
  const [uniqueCount, setUniqueCount] = useState(0);
  const [differenceCount, setDifferentCount] = useState(0);

  useEffect(() => {
    const countSeries = data.series.find(series => series.name === 'count');
    const uniqueCounts = countSeries['fields'][1]['values']['buffer'];
    const newUniqueCount = uniqueCounts[uniqueCounts.length - 1 ];

    let oldValue = localStorage.getItem(`suspecious-${id}`);

    if(!oldValue){
      localStorage.setItem(`suspecious-${id}`,newUniqueCount);
      oldValue = newUniqueCount;
    }

    setUniqueCount(newUniqueCount)
    setDifferentCount(newUniqueCount - Number(oldValue))
  }, [data])

  function renderTriange() {
    if(differenceCount > 0){
      return <GoTriangleUp className='arrow-up' />
    }else if(differenceCount < 0){
      return <GoTriangleDown className='arrow-down' />
    }else {
      return (
          <div className='icon-list'>
      <GoTriangleUp className='arrow-up' /> 
      <GoTriangleDown className='arrow-down' style={{marginBottom:'5px'}} />
      </div>
      )
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
        <h4 className='main-text'>
          {parse(`${options.isolatedText}`)}
        </h4>
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
