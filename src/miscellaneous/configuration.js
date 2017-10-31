export const chartConfig = {//react high stock chart initial configuration look @ https://api.highcharts.com/highstock/

    chart: {
      backgroundColor: '#f5efff',
      borderRadius: '10px',
      height:"45%",
      fontWeight: 'bold'
    },
    credits:{
      enabled:false
    },
    rangeSelector: {
        selected: 4
    },

    title: {
        text: 'Relative Performance Stock Chart'
    },

    yAxis: {
        labels: {
            formatter: function() {
                return (this.value > 0 ? ' + ' : '') + this.value + '%';
            },
            format: '{value} %',

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
            showInNavigator: false
        }
    },
    scrollbar:{
      barBackgroundColor: 'gray',
      barBorderRadius: 7,
      barBorderWidth: 0,
      buttonBackgroundColor: 'gray',
      buttonBorderWidth: 0,
      buttonArrowColor: 'yellow',
      buttonBorderRadius: 7,
      rifleColor: 'yellow',
      trackBackgroundColor: 'white',
      trackBorderWidth: 1,
      trackBorderColor: 'silver',
      trackBorderRadius: 7
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
    },
    navigator:{
      enabled:false,
      height:80
    },
    series: []
};
