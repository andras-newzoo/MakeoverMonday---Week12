import React, { Component } from 'react';
import './Chart.css';

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select, event as currentEvent } from 'd3-selection'
import { transition } from 'd3-transition'
import { format } from 'd3-format'
import { sum } from 'd3-array'
import { drag } from 'd3-drag'
import { interpolateNumber } from 'd3-interpolate'

import { updateSvg, appendArea, createUpdateYAxis, createUpdateXAxis } from './chartFunctions'

class Chart extends Component {

  handleDrag = (d, i, n) => {
    this.props.handleDrag(d, i, n)
  }

  componentDidMount(){
    //console.log(data)
    this.initVis()
  }


  componentDidUpdate(prevProps){

      const { filter } = this.props

      this.updateDragText()

      //console.log(prevProps.filter)

      if (filter) {
          this.showResults()
      }



    //console.log(countryGuess)

  }


  initVis(){

    const svg = select(this.node),
          { data, width, height, margin, transition} = this.props,
          { long, delayShort } = transition,
          { chartWidth, chartHeight } = updateSvg(svg, height, width, margin)

          console.log(chartHeight)

    appendArea(svg, 'country-chart-area', margin.left, margin.top)
    appendArea(svg, 'country-y-axis', margin.left, margin.top)
    appendArea(svg, 'country-x-axis', margin.left, margin.top + chartHeight)

    this.chartArea = svg.select('.country-chart-area')

    this.yAxis = select('.country-y-axis')
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, 100])
    this.yAxisCall = axisLeft(this.yScale).tickSizeOuter(0).tickSizeInner(5).tickFormat(format('d')).ticks(chartHeight/100)


    this.xAxis = select('.country-x-axis')
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d.country)).padding(.15)
    this.xAxisCall = axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(5)

    createUpdateYAxis( this.yAxis, this.yAxisCall)
    createUpdateXAxis( this.xAxis, this.xAxisCall )

    const dragRects = this.chartArea.selectAll('.dragRect').data(data),
          guessText = this.chartArea.selectAll('.guessText').data(data),
          resultRects = this.chartArea.selectAll('.resultRects').data(data)

    resultRects.enter()
            .append('rect')
            .attr('class', 'resultRects')
            .attr('x', d => this.xScale(d.country) + (this.xScale.bandwidth()/1.5)*.25)
            .attr('y', this.yScale(0))
            .attr('width', this.xScale.bandwidth()/1.5)
            .attr('height', 0)
            .attr('fill', 'steelblue')


    dragRects.enter()
            .append('rect')
            .attr('class', `dragRect`)
            .attr('x', d => this.xScale(d.country))
            .attr('y', d => this.yScale(0))
            .attr('dy', -7.5)
            .attr('rx', 5)
            .attr('stroke', '#000')
            .attr('stroke-width', 20)
            .attr('stroke-opacity', 0)
            .attr('width', this.xScale.bandwidth())
            .attr('height', 5)
            .attr('opacity', 0)
            .call(drag().on("drag", this.handleDrag))
            .attr('fill', '#333')
                .merge(dragRects)
                .transition('dragrects-in')
                .duration(long)
                .delay((d,i) => 500 + i * delayShort)
                .attr('y', d => this.yScale(50))
                .attr('opacity', 1)

    guessText.enter()
            .append('text')
            .attr('class', 'guessText')
            .attr('x', d => this.xScale(d.country) + this.xScale.bandwidth()/2)
            .attr('y', this.yScale(0))
            .attr('dy', -1)
            .attr('text-anchor', 'middle')
                  .merge(dragRects)
                  .transition('dragtexts-in')
                  .duration(long)
                  .delay((d,i) => 500 + i * delayShort)
                  .attr('y', this.yScale(50))
                  .tween("text", function(d, index) {
                        const that = select(this),
                        i = interpolateNumber(0, 50);
                        return function(t) {that.text(format('d')(i(t))) };
                      })

  }

  updateDragText(){

    const { data } = this.props,
          guessText = this.chartArea.selectAll('.guessText').data(data)


    guessText.text(d => format('d')(d.guess))
            .attr('y', d => this.yScale(d.guess))
            .attr('dy', d => d.guess <= 50 ? -1 : 17)



  }
  showResults(){

    const { data, filter } = this.props,
          resultRects = this.chartArea.selectAll('.resultRects').data(data)

    resultRects.transition('result-rects-in')
                .duration(2000)
                .attr('fill', d => d.result > d.guess ? 'green' : 'red')
                .attr('height', d => filter.includes(d.country) ? this.yScale(0) - this.yScale(d.result) : 0)
                .attr('y', d => filter.includes(d.country) ? this.yScale(d.result) : this.yScale(0) )
  }

  render() {
    return (
        <svg ref={node => this.node = node}/>
    );
  }
}

Chart.defaultProps = {
  margin: {
  top: 10,
  right: 10,
  bottom: 30,
  left: 30
},
transition: {
  long: 1500,
  start: 2000,
  delayShort: 300,
  delayLong: 1000
}
}

export default Chart;
