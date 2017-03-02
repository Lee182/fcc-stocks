var market = require('google-finance')
var moment = require('moment')

module.exports = function(stock, from, to) {
  // validate dates
  from = from === undefined ? moment().subtract(7, 'days') : moment(from)
  to = to === undefined ? moment() : moment(to)
  if (from.isValid() !== true) {
    return Promise.reject('invalid "from" date')
  }
  if (to.isValid() !== true) {
    return Promise.reject('invalid "to" date')
  }

  var inputs = {
    symbol: stock,
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD'),
    // period: 'd'
    // period: 'd' || 'w' || 'm' || 'v' (dividends only)
  }

  return new Promise(function(resolve, reject){
    market.historical(inputs, function (err, data) {
      if (err) {return reject({err, inputs})}
      return resolve({data, inputs})
    })
  })
}
