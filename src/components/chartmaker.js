import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import $ from "jquery";


class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {whatever:false}
  }
  componentDidMount() {
    let chart = this.refs.chart.getChart();
    //chart.series[1].addPoint({x: 10, y: 12});
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    let testUrl = "https://www.highcharts.com/samples/data/jsonp.php?filename=MSFT-c.json&callback=?"
    $.getJSON(testUrl,function(data){
      chartConfig.series[0]={
        name:"MSFT",
        data:data
      }
      this.setState({whatever:true})
    }.bind(this))

  }

  render() {
    console.log(chartConfig)
    return (
    <ReactHighChart config={chartConfig} ref='chart'/>
    );
  }

}

const chartConfig = {

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

    series: []
};

export default Chart;
