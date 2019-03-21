import React, { Component } from 'react';
import './Chart.css';

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { format } from 'd3-format'
import { interpolateNumber } from 'd3-interpolate'

import { updateSvg, appendArea, createUpdateXAxis } from './chartFunctions'

class SingleChart extends Component {

  handleDrag = (d, i, n) => {
    this.props.handleDrag(d, i, n)
  }

  componentDidMount(){
    //console.log(data)
    this.initVis()
  }


  componentDidUpdate(prevProps){

    this.updateDragText()

    //console.log(average)
    // if(max(prevProps.countryGuess, d => d.index) !== max(countryGuess, d => d.index) ){
    //   console.log('updating')
    // }


  }


  initVis(){

    const svg = select(this.node),
          { data, width, height, margin, transition} = this.props,
          { long, delayLong } = transition,
          { chartWidth, chartHeight } = updateSvg(svg, height, width, margin)
    //
    appendArea(svg, 'g7-chart-area', margin.left, margin.top)
    appendArea(svg, 'g7-y-axis', margin.left, margin.top)
    appendArea(svg, 'g7-x-axis', margin.left, margin.top + chartHeight)

    this.chartArea = svg.select('.g7-chart-area')


    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, 100])
    this.textScale = scaleLinear().range([0, 100]).domain([chartHeight, 0])

    this.xAxis = select('.g7-x-axis')
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d.country)).padding(.05)
    this.xAxisCall = axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(5)
    //
    createUpdateXAxis( this.xAxis, this.xAxisCall )

    //console.log(data)
    //
    const rect = this.chartArea.selectAll('.avg-rect').data(data),
          text = this.chartArea.selectAll('.avg-text').data(data),
          resultRect = this.chartArea.selectAll('.result-rect').data(data)

    resultRect.enter()
          .append('rect')


    //
    //
    rect.enter()
            .append('rect')
            .attr('class', `avg-rect`)
            .attr('x', d => this.xScale(d.country))
            .attr('y', d => this.yScale(0))
            .attr('dy', -7.5)
            .attr('width', this.xScale.bandwidth())
            .attr('height', 5)
            .attr('rx', 5)
            .attr('opacity', 0)
            .attr('fill', '#333')
                .merge(rect)
                .transition('avgrect-in')
                .duration(long)
                .delay(delayLong)
                .attr('y', d => this.yScale(50))
                .attr('opacity', 1)
    //
    text.enter()
            .append('text')
            .attr('class', 'avg-text')
            .attr('x', chartWidth/2)
            .attr('y', this.yScale(0))
            .attr('dy', -1)
            .attr('text-anchor', 'middle')
                  .merge(text)
                  .transition('avgtext-in')
                  .duration(long)
                  .delay(delayLong)
                  .attr('y', this.yScale(50))
                  .tween("text", function(d, index) {
                        const that = select(this),
                        i = interpolateNumber(0, 50);
                        return function(t) {that.text(format('d')(i(t))) };
                      })

  }

  updateDragText(){

    const { data } = this.props,
          rect = this.chartArea.selectAll('.avg-rect').data(data),
          text = this.chartArea.selectAll('.avg-text').data(data)

    text.text(d => format('d')(this.textScale(d.index)))
            .attr('y', d => this.yScale((this.textScale(d.index))))
            .attr('dy', d => (this.textScale(d.index)) <= 50 ? -1 : 17)

    rect.attr('y', d => this.yScale((this.textScale(d.index))))

  }

  render() {
    return (
        <svg ref={node => this.node = node}/>
    );
  }
}

SingleChart.defaultProps = {
  margin: {
  top: 10,
  right: 12,
  bottom: 30,
  left: 12
},
transition: {
  long: 3000,
  start: 3000,
  delayShort: 2000,
  delayLong: 3000
}
}

export default SingleChart;
