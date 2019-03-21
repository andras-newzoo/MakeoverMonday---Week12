import React, { Component } from 'react';
import './Chart.css';

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select, event as currentEvent } from 'd3-selection'
import { transition } from 'd3-transition'
import { format } from 'd3-format'
import { drag } from 'd3-drag'
import { max } from 'd3-array'

import { updateSvg, appendArea, createUpdateYAxis, createUpdateXAxis } from './chartFunctions'

class Chart extends Component {

  handleDrag = (d, i, n) => {
    this.props.handleDrag(d, i, n)
  }

  componentDidMount(){
    const {data} = this.props

    //console.log(data)
    this.initVis()
  }


  componentDidUpdate(prevProps){
    const {countryGuess} = this.props


    this.updateDragText()

    console.log(countryGuess)
    // if(max(prevProps.countryGuess, d => d.index) !== max(countryGuess, d => d.index) ){
    //   console.log('updating')
    // }


  }




  initVis(){

    const svg = select(this.node),
          { data, countryGuess, width, height, margin, transition} = this.props,
          { long, delayShort } = transition,
          { chartWidth, chartHeight } = updateSvg(svg, height, width, margin)

    appendArea(svg, 'country-chart-area', margin.left, margin.top)
    appendArea(svg, 'country-y-axis', margin.left, margin.top)
    appendArea(svg, 'country-x-axis', margin.left, margin.top + chartHeight)

    this.chartArea = svg.select('.country-chart-area')

    this.yAxis = select('.country-y-axis')
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, 100])
    this.yAxisCall = axisLeft(this.yScale).tickSizeOuter(0).tickSizeInner(5).tickFormat(format('d')).ticks(chartHeight/100)
    this.textScale = scaleLinear().range([0, 100]).domain([chartHeight, 0])

    this.xAxis = select('.country-x-axis')
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d.country)).padding(.1)
    this.xAxisCall = axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(5)

    createUpdateYAxis( this.yAxis, this.yAxisCall)
    createUpdateXAxis( this.xAxis, this.xAxisCall )

    const dragRects = this.chartArea.selectAll('.dragrect').data(data),
          guessText = this.chartArea.selectAll('.guessText').data(countryGuess)


    dragRects.enter()
            .append('rect')
            .attr('class', `dragrect`)
            .attr('x', d => this.xScale(d.country))
            .attr('y', d => this.yScale(0))
            .attr('dy', -7.5)
            .attr('width', this.xScale.bandwidth())
            .attr('height', 0)
            .call(drag().on("drag", this.handleDrag))
            .attr('fill', '#333')
                .merge(dragRects)
                .transition('dragrects-in')
                .duration(long)
                .delay((d,i) => 500 + i * delayShort)
                .attr('y', d => this.yScale(50))
                .attr('height', 15)

    guessText.enter()
            .append('text')
            .attr('class', 'guessText')
            .attr('x', d => this.xScale(d.country) + this.xScale.bandwidth()/2)
            .attr('y', this.yScale(0))
            .attr('dy', 12.5)
            .attr('text-anchor', 'middle')
            .text(d => format('d')(this.textScale(d.index)))
                  .merge(dragRects)
                  .transition('dragtexts-in')
                  .duration(long)
                  .delay((d,i) => 500 + i * delayShort)
                  .attr('y', this.yScale(50))


  }

  updateDragText(){

    const { countryGuess } = this.props,
          guessText = this.chartArea.selectAll('.guessText').data(countryGuess)

    guessText.text(d => format('d')(this.textScale(d.index)))
            .attr('y', d => this.yScale((this.textScale(d.index))))
            // .attr('dy', 13)

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
  long: 1000,
  start: 2000,
  delayShort: 200,
  delayLong: 1000
}
}

export default Chart;
