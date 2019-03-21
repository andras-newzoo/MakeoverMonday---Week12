import React, { Component } from 'react';
import './App.css';

import Chart from './components/Chart'
import data from './data/data.json'

import { select, event as currentEvent } from 'd3-selection'
import { mean } from 'd3-array'

class App extends Component {
  constructor(props){
        super(props)
        this.state = {
          countryGuess: [
            {country: 'Canada', index: 280},
            {country: 'France', index: 280},
            {country: 'Germany', index: 280},
            {country: 'Italy', index: 280},
            {country: 'Japan', index: 280},
            {country: 'United Kingdom', index: 280},
            {country: 'United States', index: 280}
          ],
          average: {country: 'G7', index:280}

        }
    }


  handleDrag = (d, i, n) => {
      select(n[i]).attr("y", currentEvent.y > -7.5  && currentEvent.y < 560 ?  d.y = currentEvent.y : d.y = d.y);
      let country = d.country,
            copy = {...this.state},
            object = copy.countryGuess[i]

            copy.average.index = mean(copy.countryGuess, d => d.index)

            object.country === country ? object.index = d.y : object.index = object.index

            this.setState(copy)

            //console.log(this.state)
  }

  render() {

    const countryData = data.filter(d => d.country !== 'G7 Average'),
          { countryGuess } = this.state

  // console.log(countryGuess)

    countryData.sort((a, b) => a.country.localeCompare(b.country));

    return (
      <div className="App">
          <Chart
            data = {countryData}
            width = {1000}
            height = {600}
            handleDrag = {this.handleDrag}
            countryGuess = {countryGuess}
          />
      </div>
    );
  }
}

export default App;
