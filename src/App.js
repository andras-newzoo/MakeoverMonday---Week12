import React, { Component } from 'react';
import './App.css';

import { List, Popup, Button } from 'semantic-ui-react'

import Chart from './components/Chart'
import SingleChart from './components/SingleChart'
import LifeChart from './components/LifeChart'

import legend from './data/legend.svg'

import { select, event as currentEvent } from 'd3-selection'
import { mean, sum } from 'd3-array'
import { scaleLinear } from 'd3-scale'

class App extends Component {
  constructor(props){
        super(props)
        this.state = {
          countryGuess: [
            {country: 'Canada', index: 205, result: 71},
            {country: 'France', index: 205, result: 71},
            {country: 'Germany', index: 205, result: 59},
            {country: 'Italy', index: 205, result: 57},
            {country: 'Japan', index: 205, result: 61},
            {country: 'United Kingdom', index: 205, result: 72},
            {country: 'United States', index: 205, result: 70}
          ],
          average: [{country: 'G7 Avg.', index:205, result: 66}],
          filter: [],
          life: 100,
          difference: 0,
          sum: [],
          country: '',
        }
    }


  handleDrag = (d, i, n) => {

    // console.log(this.state)
      if(this.state.life > 0 && !this.state.filter.includes(d.country)){
      select(n[i]).attr("y", currentEvent.y > -1  && currentEvent.y < 410 ?  d.y = currentEvent.y : d.y = d.y);
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

      if(copy.life > 0){
          if (copy.filter.length === 6){
            copy.life = copy.life - (d.difference + mean(this.state.countryGuess, d => d.difference))
            copy.difference = -d.difference - (mean(this.state.countryGuess, d => d.difference))
            copy.filter.push(d.country)
            copy.country = d.country
          } else if (!copy.filter.includes(d.country) && copy.life > 0){
              copy.filter.push(d.country)
              copy.life = copy.life - d.difference
              copy.difference = -d.difference
              copy.country = d.country
              copy.sum.push(d.difference)
          }

          if (copy.life < 0){
            copy.life = 0
          }}

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
            copy.difference = (-(d.difference * 7 + d.difference)) + sum(copy.sum)
          } else {
              copy.life = (copy.life- (d.difference * 7 + d.difference))
              copy.country = d.country
              copy.difference = (-(d.difference * 7 + d.difference)) + sum(copy.sum)
              copy.life < 0 ? copy.life = 0 : copy.life = copy.life
          }

          this.setState(copy)}

          //console.log(this.state)

  }

  render() {

    const { countryGuess, average, filter, life, difference, country} = this.state,
          scale = scaleLinear().range([0, 100]).domain([409, 0])

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
          <div className="text-section">
            <h1>How do we feel about women leaders?</h1>
            <p>Women Political Leaders (WPL), in cooperation with Kantar, have created The Reykjavik Index for Leadership to support the journey to equality for women and men. It was launched during the Women Leaders Global Forum in Iceland, in November 2018, and this inaugural report focuses on the G7 nations. So - how do people in these countries feel about women as leaders?
            A score of 100 would indicate that there is complete agreement that men and women are equally suited to leadership across the economy. Test your assumptions or knowledge with the visualization below! </p>
          </div>
          <div className="image-section">
            <img src={legend} alt="legend"></img>
          </div>
          <div className="life-chart">
            <LifeChart
              data = {life}
              width = {350}
              height = {210}
              difference = {difference}
              country = {country}
            />
            <div id='how-to'>
              <Popup trigger={<Button icon='question circle' />} content="
                  Set your assumptions with the horizontal bars for each country, and double click them to show the results. Be careful, because the further away your assumption is from the result, the more 'life points' you will lose.
                  In case you run out of them, the game ends and you will not be able to see the unvieled results. The average bar is calculated across your assumptions for the seven countries. You can show the result for
                   all countries by double clicking the bar for G7 Average!" />
            </div>
          </div>
        </div>
        <div className="chart-section">
          <Chart
            data = {countryGuess}
            width = {1100}
            height = {450}
            handleDrag = {this.handleDrag}
            handleDblClick = {this.handleDblClick}
            filter = {filter}
          />
          <SingleChart
            data = {average}
            width = {200}
            height = {450}
            filter = {filter}
            handleDblClick = {this.handleDblClickAvg}
          />
        </div>
        <div className='credit-section'>
          <List bulleted horizontal link>
              <List.Item href='https://twitter.com/AndSzesztai' target='_blank' as='a'>Built and designed by: Andras Szesztai</List.Item>
              <List.Item href='https://public.tableau.com/profile/zunaira.rasheed#!/vizhome/ReykjavikIndex-MakeoverMondayW12/ReykjavikIndex' target='_blank' as='a'>Inspired by: Zunaira Rasheed</List.Item>
              <List.Item href='https://www.makeovermonday.co.uk/' target='_blank' as='a'>#MakeoverMonday Week 12 2019</List.Item>
              <List.Item href='https://data.world/makeovermonday/2019w12' target='_blank' as='a'>Data: The Reykjavik Index for Leadership, World Economic Forum  </List.Item>
          </List>
        </div>
      <div>
      </div>
      </div>
    );
  }
}

export default App;
