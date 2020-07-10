import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import './styles.css';
import * as d3 from 'd3';
// import data from './data.json';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = props => {
  const { options, width, height, data } = props;

  const seriesList = data.series.map(s => s.name);
  let colorScheme = options.colorSet.split(',');

  colorScheme = [...colorScheme, ...d3.schemeCategory10];

  const theme = useTheme();
  const styles = getStyles();
  const svgEl = useRef(null);

  useEffect(() => {
    drawLineGraph();
  }, [data,options]);

  function drawLineGraph() {
    var cities = data.series.map((series, index) => {
      return {
        id: series.name,
        values: series.fields[0]['values'].map((key, index) => {
          return { date: new Date(key), degrees: series.fields[1]['values']['buffer'][index] };
        }),
      };
    });

    var svg = d3.select(svgEl.current),
      margin = { top: 35, right: 15, bottom: 15, left: 30 },
      width = +svg.attr('width') - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;
    
    var x = d3
      .scaleTime()
      .domain(d3.extent(cities[0].values, d=> d.date ))
      .rangeRound([margin.left, width - margin.right])
      .nice();
      
    var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal(colorScheme);

    var line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.degrees));
    
    
    // clean up overlap issue
    const xAxis = svg.selectAll('.x-axis')
    const focusText = svg.selectAll('.focus')
    xAxis.remove()
    focusText.remove()
    

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
      .call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat('%H:%M'))
          .ticks(5)
          .tickSize(0)
          .tickPadding(20)
      );

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + margin.left + ',0)');

    var focus = svg
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus
      .append('line')
      .attr('class', 'lineHover')
      .style('stroke', 'white')
      .attr('stroke-width', 1)
      .style('shape-rendering', 'crispEdges')
      .style('opacity', 0.5)
      .attr('y1', -height)
      .attr('y2', 0);

    var overlay = svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('x', margin.left)
      .attr('width', width - margin.right - margin.left)
      .attr('height', height);

    y.domain([
      d3.min(cities, d => d3.min(d.values, c => c.degrees)),
      d3.max(cities, d => d3.max(d.values, c => c.degrees))
    ]).nice();

    svg.selectAll('.y-axis').call(d3.axisLeft(y).tickSize(5));

    var city = svg.selectAll('.cities').data(cities);

    city.exit().remove();

    city
      .enter()
      .insert('g', '.focus')
      .append('path')
      .attr('class', 'line cities')
      .style('stroke', (d, i) => colorScheme[i])
      .merge(city)
      .attr('d', d => line(d.values));

    tooltip();

    function tooltip() {
      var labels = focus.selectAll('.lineHoverText').data(seriesList);

      labels
        .enter()
        .append('text')
        .attr('class', 'lineHoverText')
        .style('fill', '#fff')
        .attr('text-anchor', 'start')
        .attr('font-size', 12)
        .attr('dy', (_, i) => 1 + i * 2 + 'em')
        .merge(labels);

      var circles = focus.selectAll('.hoverCircle').data(seriesList);

      circles
        .enter()
        .append('circle')
        .attr('class', 'hoverCircle')
        .style('stroke', '#fff')
        .style('stroke-width', '2')
        .style('fill', (d, i) => colorScheme[i])
        .attr('r', 3)
        .merge(circles);

      svg
        .selectAll('.overlay')
        .on('mouseover', function() {
          focus.style('display', null);
        })
        .on('mouseout', function() {
          focus.style('display', 'none');
        })
        .on('mousemove', mousemove);

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        
        const milliSeconds = x0.getMilliseconds();

        const parsedDate = Date.parse(x0);
        const newDate = parsedDate + milliSeconds;

        const closest = data.series[0].fields[0].values['buffer'].reduce((a, b) => {
          return Math.abs(b - newDate) < Math.abs(a - newDate) ? b : a;
        });

        const closestIndex = data.series[0].fields[0].values['buffer'].findIndex(el => el === closest);

        const val = data.series.map((series,index) => {
          return {
            [series.name] : series['fields'][1]['values']['buffer'][closestIndex]
          }
        })

        var d = Object.assign({date: x0},{...val[0]})
        
        focus.select('.lineHover').attr('transform', 'translate(' + x(d.date) + ',' + height + ')');

        focus
          .selectAll('.hoverCircle')
          .attr('cy', e => y(d[e]))
          .attr('cx', x(d.date));

        focus
          .selectAll('.lineHoverText')
          .attr('transform', 'translate(' + x(d.date) + ',' + height / 2.5 + ')')
          .text( e => d[e].toFixed(2));

        x(d.date) > width - width / 4
          ? focus
              .selectAll('text.lineHoverText')
              .attr('text-anchor', 'end')
              .attr('dx', -10)
          : focus
              .selectAll('text.lineHoverText')
              .attr('text-anchor', 'start')
              .attr('dx', 10);
      }

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
      <h4 style={{ textAlign: 'center', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{options.title}</h4>
      <svg
        id="chart"
        ref={svgEl}
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        // viewBox={`0 0 ${width} ${height}`}
      ></svg>

      {options.showLegend && (
        <div className="legend-container">
          {seriesList.map((item, index) => (
            <div className="legend-item">
              <div className="legend-rect" style={{ backgroundColor: colorScheme[index] }}></div>
              <div className="legend-text"> {item} </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
      background: #0c0f24;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
