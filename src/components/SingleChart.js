import React, { Component } from 'react';
import './Chart.css';

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { select } from 'd3-selection'
import 'd3-transition'
import { format } from 'd3-format'
import { interpolateNumber } from 'd3-interpolate'

import { updateSvg, appendArea, createUpdateXAxis } from './chartFunctions'

class SingleChart extends Component {


  handleDblClick = (d, i, n) => {
    this.props.handleDblClick(d, i, n)
  }


  componentDidMount(){
    //console.log(data)
    this.initVis()
  }


  componentDidUpdate(prevProps){

    const {filter} = this.props

    this.updateDragText()

    if(filter.length === 7){
      this.finishAvg()
    }

    //console.log(average)
    // if(max(prevProps.countryGuess, d => d.index) !== max(countryGuess, d => d.index) ){
    //   console.log('updating')
    // }


  }


  initVis(){

    const svg = select(this.node),
          { data, width, height, margin, transition} = this.props,
          { start, delayLong } = transition,
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
          resultRect = this.chartArea.selectAll('.avg-result-rect').data(data),
          resultText = this.chartArea.selectAll('.avg-result-text').data(data)

    resultRect.enter()
          .append('rect')
          .attr('class', 'avg-result-rect')
          .attr('x', d => this.xScale(d.country) + (this.xScale.bandwidth()/1.5)*.25)
          .attr('y', this.yScale(0))
          .attr('width', this.xScale.bandwidth()/1.5)
          .attr('height', 0)
          .attr('fill', 'none')

    resultText.enter()
            .append('text')
            .attr('class', 'avg-result-text')
            .attr('x', d => this.xScale(d.country) + this.xScale.bandwidth()/2)
            .attr('y', this.yScale(0))
            .attr('dy', -2)
            .attr('text-anchor', 'middle')
            .attr('opacity', '0')
            .text(0)

    //
    rect.enter()
            .append('rect')
            .attr('class', `avg-rect`)
            .attr('x', d => this.xScale(d.country))
            .attr('y', d => this.yScale(0))
            .attr('dy', -7.5)
            .attr('width', this.xScale.bandwidth())
            .attr('height', 5)
            .attr('stroke', '#333')
            .attr('stroke-width', 20)
            .attr('stroke-opacity', 0)
            .attr('rx', 5)
            .attr('opacity', 0)
            .attr('fill', '#333')
            .on('dblclick', this.handleDblClick)
                .merge(rect)
                .transition('avgrect-in')
                .duration(start)
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
            .attr('opacity', 0)
            .text(0)
            .attr('text-anchor', 'middle')
                  .transition('avgtext-in')
                  .duration(start)
                  .delay(delayLong)
                  .attr('opacity', 1)
                  .attr('fill', '#333')
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

  finishAvg(){

    const { data, transition } = this.props,
          resultRect = this.chartArea.selectAll('.avg-result-rect').data(data),
          resultText = this.chartArea.selectAll('.avg-result-text').data(data)


      resultRect.transition('avg-result-rects-in')
                  .duration(transition.long)
                  .attr('fill', '#717b7f')
                  .attr('height', d => this.yScale(0) - this.yScale(d.result))
                  .attr('y', d => this.yScale(d.result))


      resultText.transition('avg-result-in')
                  .duration(transition.long)
                  .attr('fill', '#717b7f')
                  .attr('font-weight', '800')
                  .attr('y', d => this.yScale(d.result))
                  .attr('opacity',  d =>  1 )
                  .tween("text", function(d, index) {
                        const that = select(this),
                        i = interpolateNumber(that.text(), d.result);
                        return function(t) {that.text(format('d')(i(t))) };
                        })

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
  right: 20,
  bottom: 30,
  left: 25
},
transition: {
  long: 2000,
  start: 3000,
  delayShort: 2000,
  delayLong: 3000
}
}

export default SingleChart;
