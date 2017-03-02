w.Highcharts = require('highcharts/highstock')
require('./highcharts.darktheme.js')

var stocks = ['MSFT', 'AAPL', 'GOOG']
// data [
//  {name: 'GOOGL', data: [
//    [ 1487808000000, 136.53 ]
//  ]}
// ]
// var chart = highchart('chart', temp0['*'].map(h) )
// chart.series[0].setData([129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] );
function stock2HighChart(stock) {
  return {
    name: stock.name,
    data: stock.year_data
  }
}

function draw_chart(id, data) {
  data = data.map(stock2HighChart)
  return chart = Highcharts.stockChart(id, { // .stockChart
    rangeSelector: {
      selected: 4
    },
    yAxis: {
      labels: {
        formatter: function () {
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
    series: data
  })
}

function add_data(chart, data) {
  data = stock2HighChart(data)
  var i = chart.series.findIndex(function(x){
    return x.name === data.name
  })
  console.log(i, data)
  if (i === -1) {
    chart.addSeries(data)
    return
  }
  chart.series[i].setData(data.data)
}

function remove_data(chart, name) {
  var i = chart.series.findIndex(function(x){
    return x.name === name
  })
  if (i !== -1) {
    chart.series[i].remove()
  }
}

module.exports = {
  draw_chart,
  add_data,
  remove_data
}
