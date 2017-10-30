export const chartConfig = {//react high stock chart initial configuration

    chart: {
      backgroundColor: '#f5efff',
      borderRadius: '10px',
      height:"45%",
      fontWeight: 'bold'
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
