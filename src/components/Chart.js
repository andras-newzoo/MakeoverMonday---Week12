import React, { Component } from 'react';
import './Chart.css';

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import { updateSvg, appendArea, createUpdateYAxis, createUpdateXAxis } from './chartFunctions'

class Chart extends Component {


  componentDidMount(){
    const {data} = this.props

    console.log(data)
    this.initVis()
  }


  componentDidUpdate(){

  }

  initVis(){

    const svg = select(this.node),
          { data, width, height, margin } = this.props,
          { chartWidth, chartHeight } = updateSvg(svg, height, width, margin)

    appendArea(svg, 'country-chart-area', margin.left, margin.top)
    appendArea(svg, 'country-y-axis', margin.left, margin.top)
    appendArea(svg, 'country-x-axis', margin.left, margin.top + chartHeight)

    this.yAxis = select('.country-y-axis')
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, 100])
    this.yAxisCall = axisLeft(this.yScale).tickSizeOuter(0).tickSizeInner(5).tickFormat(format('d')).ticks(chartHeight/100)

    this.xAxis = select('.country-x-axis')
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d.country))
    this.xAxisCall = axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(5)

    createUpdateYAxis( this.yAxis, this.yAxisCall)
    createUpdateXAxis( this.xAxis, this.xAxisCall )


    //console.log(this.yScale.domain(), chartWidth)

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
}
}

export default Chart;
