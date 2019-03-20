import React, { Component } from 'react';
import './App.css';

import Chart from './components/Chart'
import data from './data/data.json'

import { select, event as currentEvent } from 'd3-selection'

class App extends Component {
  constructor(props){
        super(props)
        this.state = {
          countryGuess: [
            {Canada: 50},
            {France: 50}
          ]

        }
    }


  handleDrag = (d, i, n) => {
      select(n[i]).attr("y", currentEvent.y > -7.5  && currentEvent.y < 560 ?  d.y = currentEvent.y : d.y = d.y);
      const country = d.country.replace(' ', ''),
            copy = {...this.state}
            // copy.countryGuess[country] = d.y
            // this.setState(copy)

            console.log(copy.countryGuess.Canada)
  }

  render() {

    const countryData = data.filter(d => d.country !== 'G7 Average'),
          { countryGuess } = this.state,
          datatest = []

    console.log(countryGuess)


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
