import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import axios from 'axios';

import getAllStocks from './miscellaneous/dbstocks'

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration:chartConfig,
      loaded: false
    }
  }
  componentDidMount() {
    this.startupCharts()
  }
  startupCharts(){
    getAllStocks().then(function(allstocks){
      //let allstocks=["FB","GOOG","MSFT","AAPL"]
      let seriesCollect=[]
      let stateCopy = {...this.state.configuration}
      allstocks.map((stock,idx)=>{
        let url="https://www.highcharts.com/samples/data/jsonp.php?filename="+stock+"-c.json&callback=?"
        let localurl = "api/quand/"+stock
        axios.get(localurl).then(function(response){
          seriesCollect.push({
            name:response.data.name,
            data:response.data.data
          })
          if(allstocks.length===seriesCollect.length){
            stateCopy.series = seriesCollect
            this.setState({
              configuration:stateCopy,
              loaded:true
            })
          }
        }.bind(this))
        .catch(function(err){
          console.log(err)
        })
      })
    }.bind(this))
  }

  render() {
      if(this.state.loaded){
        return (
        <ReactHighChart config={this.state.configuration}/>
        );
      }
      else{
        return(<div className="loader"></div>)
      }

  }

}

const chartConfig = {
    chart: {
      height:"45%"

    },
    rangeSelector: {
        selected: 4
    },

    title: {
        text: 'Stock Chart'
    },

    yAxis: {
        labels: {
            formatter: function() {
                return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
        },
        plotLines: [{
            value: 0,
            width: 2,
            color: 'silver'
        }]
    },

    plotOptions: {
        series: {
            compare: 'percent',
            showInNavigator: true
        }
    },

    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
    },
    navigator:{
      height:80
    },
    series: []
};

export default Chart;
