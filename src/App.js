import React, { Component } from 'react';
import './App.css';

import Chart from './components/Chart'
import SingleChart from './components/SingleChart'
import LifeChart from './components/LifeChart'

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
          life: 100,
          difference: 0,
          country: ''
        }
    }


  handleDrag = (d, i, n) => {
      if(this.state.life > 0){
      select(n[i]).attr("y", currentEvent.y > -1  && currentEvent.y < 560 ?  d.y = currentEvent.y : d.y = d.y);
      let country = d.country,
            copy = {...this.state},
            object = copy.countryGuess[i]

            if(copy.life > 0){
              copy.average[0].index = mean(copy.countryGuess, d => d.index)
              object.country === country ? object.index = d.y : object.index = object.index
            }


            this.setState(copy)}

            //console.log(this.state)
  }


  handleDblClick = (d, i, n) => {
    const copy = {...this.state}

          if (!copy.filter.includes(d.country) && copy.life > 0){
              copy.filter.push(d.country)
              copy.life = copy.life - d.difference
              copy.difference = -d.difference
              copy.country = d.country
          }

          if (copy.filter.length === 7){
            copy.life = copy.life-mean(this.state.countryGuess, d => d.difference)
            copy.difference = -d.difference
            copy.country = d.country
          }

          if(copy.life < 0){
            copy.life = 0
            copy.difference = -d.difference
          }



          this.setState(copy)

  }

  handleDblClickAvg = (d, i, n) => {

    if(this.state.life > 0){
    const copy = {...this.state},

          countries = copy.countryGuess.map(d => d.country)

          copy.filter = ''
          copy.filter = countries

          if(copy.life < 0){
            copy.life = 0
          } else {
              copy.life = copy.life- (d.difference * 7 + d.difference)
              copy.country = d.country
              copy.difference = -(d.difference * 7 + d.difference)
              copy.life < 0 ? copy.life = 0 : copy.life = copy.life
          }

          this.setState(copy)}

          //console.log(this.state)

  }

  render() {

    const { countryGuess, average, filter, life, difference, country} = this.state,
          scale = scaleLinear().range([0, 100]).domain([560, 0])

    countryGuess.forEach( d => {
        d.difference = Math.abs(scale(d.index)- d.result)
        d.differenceSimple = scale(d.index)- d.resul
        d.guess = scale(d.index)
    })
    average.forEach( d => {
        d.difference = Math.abs(scale(d.index)- d.result)
        d.differenceSimple = scale(d.index)- d.resul
        d.guess = scale(d.index)
    })

    //console.log(filter)
    //console.log(sort)

    return (
      <div className="App">
        <div className="header-section">
          <div className="life-chart">
            <LifeChart
              data = {life}
              width = {350}
              height = {300}
              difference = {difference}
              country = {country}
            />
          </div>
        </div>
        <div>
          <Chart
            data = {countryGuess}
            width = {1200}
            height = {600}
            handleDrag = {this.handleDrag}
            handleDblClick = {this.handleDblClick}
            filter = {filter}
          />
          <SingleChart
            data = {average}
            width = {180}
            height = {600}
            filter = {filter}
            handleDblClick = {this.handleDblClickAvg}
          />
        </div>
      <div>

      </div>
      </div>
    );
  }
}

export default App;
