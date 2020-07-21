import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import './styles.css';
import * as d3 from 'd3';
import { generate } from 'short-uuid';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = props => {
  const styles = getStyles();
  const svgEl = useRef(null);

  const { options, width, height, data } = props;
  const seriesList = data.series.map(s => s.name);

  let colorScheme = (options.primaryColorSet && options.primaryColorSet.trim().split(',')) || [];
  colorScheme = [...colorScheme, ...d3.schemeCategory10];
  colorScheme.splice(seriesList.length);

  const generatedIds = seriesList.map(() => generate());

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    drawLineGraph();
  }, [data, options, width, height]);

function handleKeyDown(e: { keyCode: number; preventDefault: () => void; stopPropagation: () => void; }) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.stopPropagation();
  }
}

  function drawLineGraph() {
    var svg = d3.select(svgEl.current),
      margin = { top: 10, right: 15, bottom: options.showLegend ? 30 : 20, left: 40 },
      width = +svg.attr('width') - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;

    var cities = data.series.map((series, index) => {
      return {
        id: series.name,
        values: series.fields[0]['values']['buffer'].map((key: string | number | Date, index: React.ReactText) => {
          return { date: new Date(key), degrees: series.fields[1]['values']['buffer'][index] };
        }),
      };
    });

    // define the area
    var area = d3
      .area()
      .x((d: { date: any; }) => x(d.date))
      .y0(height - margin.bottom)
      .y1((d: { degrees: any; }) => y(d.degrees));

    var x = d3
      .scaleTime()
      .domain(d3.extent(cities[0].values, (d: { date: any; }) => d.date))
      .rangeRound([margin.left, width - margin.right])
      .nice();

    var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal(colorScheme);

    var line = d3
      .line()
      .x((d: { date: any; }) => x(d.date))
      .y((d: { degrees: any; }) => y(d.degrees));

    // clean up overlap issue
    svg.selectAll('.x-axis').remove();
    svg.selectAll('.y-axis').remove();
    svg.selectAll('.focus').remove();
    svg.selectAll('.cities').remove();
    svg.selectAll('linearGradient').remove();

    let secondaryColorScheme = (options.secondaryColorSet && options.secondaryColorSet.trim().split(',')) || [];
    if (!options.showLineGradient) {
      options.secondaryColorSet = '';
      secondaryColorScheme = [];
    }
    secondaryColorScheme = [...secondaryColorScheme, ...colorScheme, ...d3.schemeCategory10];
    secondaryColorScheme.splice(seriesList.length);

    const maxValue = d3.max(cities, (d: any[]) => d3.max(d.values, (c: { degrees: any; }) => c.degrees));
    const maxLengthValue = options.tooltipValues === 'decimals' ? maxValue.toFixed(2) : Math.floor(maxValue);

    // Area/line chart
    colorScheme.forEach((color, index) => {
      if (options.fillGradient) {
        // area fill gradient
        svg
          .append('linearGradient')
          .attr('id', `grad${generatedIds[index]}`)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%')
          .selectAll('stop')
          .data([
            { offset: '0%', color: `${color}` },
            { offset: '91%', color: `${color}` },
          ])
          .enter()
          .append('stop')
          .attr('offset', (d: { offset: any; }) => d.offset)
          .attr('stop-color', (d: { color: any; }) => d.color)
          .attr('stop-opacity', (_: any, i: number) => (i === 0 ? 0.3 : 0));
      }

      if (options.showLineGradient) {
        // Line gradient
        svg
          .append('linearGradient')
          .attr('id', `linegrad${generatedIds[index]}`)
          .attr('gradientUnits', 'userSpaceOnUse')

          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '0%')
          .selectAll('stop')
          .data([
            { offset: '0%', color: `${color}` },
            { offset: '100%', color: secondaryColorScheme[index] },
          ])
          .enter()
          .append('stop')
          .attr('offset', function(d: { offset: any; }) {
            return d.offset;
          })
          .attr('stop-color', function(d: { color: any; }) {
            return d.color;
          });
      }
    });

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
      .call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat('%H:%M'))
          .ticks(options.xAxisTickSize)
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
      .attr('stroke-width', 1.5)
      .style('shape-rendering', 'crispEdges')
      .style('opacity', 0.8)
      .attr('y1', -height)
      .attr('y2', 0);

    var textBg = focus.append('g').attr('class', 'textBg');

    textBg
      .append('rect')
      .attr('class', 'textBgRect')
      .attr('width', `${maxLengthValue}`.length * 2 + 40)
      .attr('height', seriesList.length * 22 + 10)
      .attr('transform', 'translate(' + -100 + ',' + height / 2.5 + ')');

    var overlay = svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('x', margin.left)
      .attr('width', width - margin.right - margin.left)
      .attr('height', height);

    y.domain([d3.min(cities, (d: any[]) => d3.min(d.values, (c: { degrees: any; }) => c.degrees)), maxValue]).nice();

    const yAxisUnitFormat = options.yAxisFormat;

    svg.selectAll('.y-axis').call(
      d3
        .axisLeft(y)
        .ticks(options.yAxisTickSize)
        .tickSize(5)
        .tickFormat(d3.format(yAxisUnitFormat))
    );

    var city = svg.selectAll('.cities').data(cities);

    city.exit().remove();

    city
      .enter()
      .insert('g', '.focus')
      .append('path')
      .attr('stroke', (_: any, i: React.ReactText) => (!options.showLineGradient ? colorScheme[i] : `url(#linegrad${generatedIds[i]})`))
      .attr('class', 'line cities')
      .merge(city)
      .style('stroke-width', options.lineWidth)
      .attr('d', (d: any[]) => line(d.values));

    const areas = svg.selectAll('.area');
    areas.remove();

    if (options.fillGradient) {
      cities.map((city, index) => {
        // Add the area.
        svg
          .append('path')
          .data([city])
          .attr('class', 'area')
          .attr('fill', (_: any, i: any) => `url(#grad${generatedIds[index]})`)
          .attr('d', (d: any[]) => area(d.values));
      });
    }

    if (options.showTooltip) {
      tooltip();
    }

    function tooltip() {
      var labels = textBg.selectAll('.lineHoverText').data(seriesList);

      labels
        .enter()
        .append('circle')
        .attr('class', 'lineHoverCircles')
        .style('fill', (d: any) => z(d))
        .attr('r', 2)
        .attr('cx', 10)
        .attr('cy', (_: any, i: number) => 0.5 + i * 1.4 + 'em')
        .attr('transform', 'translate(' + -100 + ',' + height + ')');

      labels
        .enter()
        .append('text')
        .attr('class', 'lineHoverText')
        .style('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', (_: any, i: number) => 1 + i * 2 + 'em')
        .merge(labels);

      var circles = focus.selectAll('.hoverCircle').data(seriesList);

      circles
        .enter()
        .append('circle')
        .attr('class', 'hoverCircle')
        .style('stroke', '#fff')
        .style('stroke-width', '2')
        .style('fill', (d: any, i: React.ReactText) => colorScheme[i])
        .attr('cx', -100)
        .attr('cy', -100)
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

      function mousemove(this: any) {
        var x0 = x.invert(d3.mouse(this)[0]);
        const milliSeconds = x0.getMilliseconds();
        const parsedDate = Date.parse(x0);
        const newDate = parsedDate + milliSeconds;

        const closest = data.series[0].fields[0].values['buffer'].reduce((a: number, b: number) => {
          return Math.abs(b - newDate) < Math.abs(a - newDate) ? b : a;
        });

        const closestIndex = data.series[0].fields[0].values['buffer'].findIndex((el: any) => el === closest);

        const val = data.series.map((series, index) => {
          return {
            [series.name]: series['fields'][1]['values']['buffer'][closestIndex],
          };
        });

        var d = {};
        d = Object.assign(d, { date: x0 });

        for (const obj of val) {
          d = Object.assign(d, obj);
        }

        focus.select('.lineHover').attr('transform', 'translate(' + x(d.date) + ',' + height + ')');

        focus
          .selectAll('.hoverCircle')
          .attr('cy', (e: React.ReactText) => y(d[e]))
          .attr('cx', x(d.date));

        const textBgRectXPostion = x(d.date) + 20;

        focus
          .selectAll('.lineHoverCircles')
          .attr('transform', 'translate(' + textBgRectXPostion + ',' + height / 2.5 + ')');

        focus.select('.textBgRect').attr('transform', 'translate(' + textBgRectXPostion + ',' + height / 2.8 + ')');

        focus
          .selectAll('.lineHoverText')
          .attr('transform', 'translate(' + textBgRectXPostion + ',' + height / 2.5 + ')')
          .text((e: React.ReactText) => (options.tooltipValues === 'decimals' ? d[e].toFixed(2) : Math.floor(d[e])));

        x(d.date) > width - width / 4
          ? focus
              .selectAll('text.lineHoverText')
              .attr('text-anchor', 'end')
              .attr('dx', -(`${maxLengthValue}`.length + 50))
          : focus
              .selectAll('text.lineHoverText')
              .attr('text-anchor', 'start')
              .attr('dx', 20);

        x(d.date) > width - width / 4
          ? focus.selectAll('.lineHoverCircles').attr('cx', -75)
          : focus.selectAll('.lineHoverCircles').attr('cx', 10);

        x(d.date) > width - width / 4
          ? focus.selectAll('.textBgRect').attr('x', -85)
          : focus.selectAll('.textBgRect').attr('x', 0);
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
      <svg
        id="chart"
        ref={svgEl}
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width} ${height}`}
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
  };
});
