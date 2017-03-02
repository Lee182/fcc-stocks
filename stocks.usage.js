const stocks = require('./stocks.api.js')
const stocks_to_highcharts = require('./stocks.to.highcharts.js')
const sizeof = require('./sizeof.js')
const BSON = require('bson')
var bson = new BSON
// stocks('NASDAQ:AAPL', '2012-11-01', '2012-12-31')

stocks('GOOGL', '2011-01-01', '2012-12-31')
  .then(stocks_to_highcharts)
  .catch(function({err}){
    console.log('err', err)
  })
  .then(function(a){
    var data = bson.serialize(a)
    console.log('bson_size', data.length)
    console.log('sizeof:', sizeof(a))
  })
