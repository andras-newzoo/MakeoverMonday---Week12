import React, { Component } from 'react';
import './App.css';

import { Button } from 'semantic-ui-react'

import Chart from './components/Chart'
import SingleChart from './components/SingleChart'
import data from './data/data.json'

import { select, event as currentEvent } from 'd3-selection'
import { mean } from 'd3-array'
import { scaleLinear } from 'd3-scale'

class App extends Component {
  constructor(props){
        super(props)
        this.state = {
          countryGuess: [
            {country: 'Canada', index: 280, result: 71},
            {country: 'France', index: 280, result: 71},
            {country: 'Germany', index: 280, result: 59},
            {country: 'Italy', index: 280, result: 57},
            {country: 'Japan', index: 280, result: 61},
            {country: 'United Kingdom', index: 280, result: 72},
            {country: 'United States', index: 280, result: 70}
          ],
          average: [{country: 'G7 Avg.', index:280, result: 66}],
          filter: [],
          country: ''
        }
    }


  handleDrag = (d, i, n) => {
      select(n[i]).attr("y", currentEvent.y > -1  && currentEvent.y < 560 ?  d.y = currentEvent.y : d.y = d.y);
      let country = d.country,
            copy = {...this.state},
            object = copy.countryGuess[i]

            copy.average[0].index = mean(copy.countryGuess, d => d.index)

            object.country === country ? object.index = d.y : object.index = object.index

            this.setState(copy)

            //console.log(this.state)
  }


  handleDblClick = (d, i, n) => {
    const copy = {...this.state}

          if (!copy.filter.includes(d.country)){
              copy.filter.push(d.country)
          }

          copy.country = d.country

          this.setState(copy)
    // console.log(this.state)

  }

  render() {

    const { countryGuess, average, filter, country } = this.state,
          scale = scaleLinear().range([0, 100]).domain([560, 0])

    countryGuess.forEach( d => {
        d.difference = Math.abs(scale(d.index)- d.result)
        d.guess = scale(d.index)
    })

    //console.log(countryGuess)
    //console.log(sort)

    return (
      <div className="App">
        <div>
          <Chart
            data = {countryGuess}
            width = {1000}
            height = {600}
            handleDrag = {this.handleDrag}
            handleDblClick = {this.handleDblClick}
            filter = {filter}
            country = {country}
          />
          <SingleChart
            data = {average}
            width = {150}
            height = {600}
          />
        </div>
      <div>

      </div>
      </div>
    );
  }
}

export default App;
