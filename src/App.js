import React, { Component } from 'react';
import './App.css';

import Chart from './components/Chart'
import data from './data/data.json'

class App extends Component {
  constructor(props){
        super(props)
        this.state = {

        }
    }

  render() {

    const countryData = data.filter(d => d.country !== 'G7 Average')


    return (
      <div className="App">
          <Chart
            data = {countryData}
            width = {1000}
            height = {600}
          />
      </div>
    );
  }
}

export default App;
