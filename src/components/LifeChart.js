import React, { Component } from 'react';
import './Chart.css';

import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { format } from 'd3-format'
import { interpolateNumber } from 'd3-interpolate'

import { updateSvg, appendArea } from './chartFunctions'

import * as chroma from 'chroma-js'

class LifeChart extends Component {


  componentDidMount(){
    //console.log(data)
    this.initVis()
  }


  componentDidUpdate(prevProps){

    if(this.props.country !== prevProps.country){
        this.updateVis()
    }


  }


  initVis(){

    const svg = select(this.node),
          { data, width, height, margin, transition} = this.props,
          { start, delayShort } = transition,
          { chartWidth, chartHeight } = updateSvg(svg, height, width, margin)
    this.chartWidth = chartWidth
    this.chartHeight = chartHeight
    //
    appendArea(svg, 'life-chart-area', margin.left, margin.top)

    this.chartArea = svg.select('.life-chart-area')

    this.xScale = scaleLinear().range([0, chartWidth]).domain([0,100])
    this.colorScale = chroma.scale(['#1d4350' ,'#556c75' ,'#8d989d' ,'#c6c6c6' ,'#c29891' ,'#b66a5f' ,'#a43931']).domain([100, 0])


    //
    //

    this.chartArea.append('rect')
            .attr('class', `stroke-rect`)
            .attr('x', this.xScale(0))
            .attr('y', chartHeight - 90)
            .attr('height', 10)
            .attr('rx', 8)
            .attr('opacity', 1)
            .attr('stroke', '#333')
            .attr('fill', 'none')
            .attr('width', this.xScale(data))

    this.chartArea.append('rect')
            .attr('class', `life-rect`)
            .attr('x', this.xScale(0))
            .attr('y', chartHeight - 90)
            .attr('width', this.xScale(0))
            .attr('height', 10)
            .attr('rx', 8)
            .attr('opacity', 0)
            .attr('fill', '#a43931')
                .transition('life-in')
                .duration(start)
                .delay(delayShort)
                .attr('width', this.xScale(data))
                .attr('opacity', 1)
                .attr('fill', this.colorScale(data))


    this.chartArea
            .append('text')
            .attr('class', 'life-text')
            .attr('x', chartWidth/2)
            .attr('y', chartHeight - 100)
            .attr('font-weight', '800')
            .attr('font-size', '32px')
            .attr('text-anchor', 'middle')
            .text(0)
            .attr('fill', '#a43931')
                  .transition('avgtext-in')
                  .duration(start)
                  .delay(delayShort)
                  .attr('fill', this.colorScale(data))
                  .tween("text", function(d, index) {
                        const that = select(this),
                        i = interpolateNumber(0, data);
                        return function(t) {that.text(format('d')(i(t))) };
                      })

  }

  updateVis(){

    const { data, difference, transition } = this.props,
          {delayLong, long} = transition


    this.chartArea
            .append('text')
            .attr('class', 'diff-text')
            .attr('x', this.chartWidth/1.6)
            .attr('y', 65)
            .attr('font-weight', '800')
            .attr('font-size', '32px')
            .attr('text-anchor', 'middle')
            .attr('fill', '#a43931')
            .attr('opacity', 0)
            .text(format('d')(difference))
              .transition('diff-text-add')
              .delay(2000)
              .duration(2000)
              .attr('opacity', 1)
              .attr('y', 45)
              .transition('diff-text-out')
              .duration(2000)
              .attr('opacity', 0)
              .attr('y', 25)
              .remove()


    this.chartArea.selectAll('.life-rect')
              .transition('life-update')
              .duration(2000)
              .delay(delayLong)
              .attr('width', this.xScale(data))
              .attr('fill', this.colorScale(data))

    this.chartArea.selectAll('.life-text')
            .transition('life-text-update')
            .duration(2000)
            .delay(delayLong)
            .attr('fill', this.colorScale(data))
            .tween("text", function(d, index) {
                  const that = select(this),
                  i = interpolateNumber(that.text(), data);
                  return function(t) {that.text(format('d')(i(t))) };
                  })

    //select('.diff-text').transition('diff-text-remove').duration(2000).delay(2500).attr('opacity', 0).attr('y', 25).remove()

  }

  render() {
    return (
        <svg ref={node => this.node = node}/>
    );
  }
}

LifeChart.defaultProps = {
  margin: {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
},
transition: {
  long: 1000,
  start: 5000,
  delayShort: 500,
  delayLong: 3000,
  verylong: 6000
}
}

export default LifeChart;
