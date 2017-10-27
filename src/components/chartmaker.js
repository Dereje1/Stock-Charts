import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import $ from "jquery";
import {findDOMNode} from 'react-dom';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {configuration:chartConfig}
  }
  componentDidMount() {
    //let chart = this.refs.chart.getChart();
    //chart.series[1].addPoint({x: 10, y: 12});
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    let msft = "https://www.highcharts.com/samples/data/jsonp.php?filename=MSFT-c.json&callback=?"
    let apple = "https://www.highcharts.com/samples/data/jsonp.php?filename=AAPL-c.json&callback=?"

    let allstocks=["MSFT", "GOOG","AAPL"]
    let seriesCollect=[]
    let stateCopy = {...this.state.configuration}
    console.log(stateCopy)
    allstocks.map((stock,idx)=>{

      let url="https://www.highcharts.com/samples/data/jsonp.php?filename="+stock+"-c.json&callback=?"

      $.getJSON(url,function(data){
        seriesCollect.push({
          name:stock,
          data:data
        })
        if(allstocks.length===seriesCollect.length){
          stateCopy.series = seriesCollect
          this.setState({
            configuration:stateCopy
          })
        }
        //
      }.bind(this))
    })
  }

  render() {
    //console.log(chartConfig)

      return (
      <ReactHighChart config={this.state.configuration}/>
      );
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
