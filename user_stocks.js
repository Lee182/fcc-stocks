const api = require('./stocks_api.js')
const stocks_to_highcharts = require('./stocks_to_highcharts.js')
const moment = require('moment')
const events = require('./app/lib/eventSystem.js')()

var max_stocks = 20
var stocks = [
  {name: 'NASDAQ:AAPL'},
  {name: 'GOOGL'}
]
stocks_insert = function(o){
  if (stocks.length === max_stocks) {
    stocks.shift()
  }
  stocks.push(o)
}

function get_stock_index(name) {
  return stocks.findIndex(function(stock){
    return stock.name === name
  })
}

function add({name, ip}) {
  if (typeof stock !== 'string' && typeof ip !== 'string') {return}
  var i = get_stock_index(name)
  if (i !== -1) {return}

  stocks_insert({name, ip})
  events.emit('add', name)
  req_and_set_year_data({name})
}

function remove({name}) {
  var i = get_stock_index(name)
  if (i === -1) {return}

  stocks.splice(i, 1)
  events.emit('remove', name)
}

function req_and_set_year_data({name}) {
  var i = get_stock_index(name)
  if (i === -1) {return}

  var now = moment().format('YYYY-MM-DD')
  if (stocks[i].year_update === now) {return}

  return api(name,
    moment().subtract(1, 'year').format('YYYY-MM-DD'),
    now
  )
  .then(stocks_to_highcharts)
  .then(function(res){
    stocks[i].year_data = res.data
    stocks.year_update = now
    events.emit('set', name)
  })
}

function init() {
  return Promise.all(stocks.map(req_and_set_year_data))
}

function get({name}) {
  var i = get_stock_index(name)
  if (i === -1) {return undefined}
  return stocks[i]
}

module.exports = {
  add,
  remove,
  set: req_and_set_year_data,
  get,
  events, // add, remove, set
  max_stocks,
  init,
  stocks
}
