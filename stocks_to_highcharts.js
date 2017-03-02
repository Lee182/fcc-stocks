/*
  stock_plot =
    { date: 2017-02-22T00:00:00.000Z,
      open: 136.43,
      high: 137.12,
      low: 136.11,
      close: 137.11,
      volume: 20836932,
      symbol: 'NASDAQ:AAPL' }
  highchart_plot =
    [1452470400000,98.53]
*/

function convert_plot(stock_plot) {
  return [stock_plot.date.getTime(), stock_plot.close]
}

module.exports = function({data, inputs}){
  return {
    name: inputs.symbol,
    data: data.map(convert_plot)
  }
}
