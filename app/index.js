require('./lib/jonoShortcuts.js')
w.req = require('./lib/request.js')

w.highchart = require('./lib/highcharts.js') // id, data
w.chart = undefined

w.comms = require('../comms.client.js')('ws://localhost:3000')

vm = new Vue({
  el: '#app',
  data: {
    stocks: [],
    add_stock_input: ''
  },
  methods: {
    add_stock_change: function(e) {
      this.add_stock_input = e.target.value.trim().toUpperCase()
    },
    add_stock: function(){
      console.log('add 1')
      let vm = this
      comms.send({
        user_stocks: ['add', {name: vm.add_stock_input} ]
      })
      vm.add_stock_input = ''
    },
    remove_stock: function(name){
      console.log('remove 1')
      comms.send({
        user_stocks: ['remove', {name} ]
      })
    }
  }
})

comms.on('message', function(e){
  console.log('comm.message', e)
  if (Array.isArray(e['*']) === true) {
    vm.stocks = e['*']
    w.chart = highchart.draw_chart('chart', e['*'])
  }
  if (Array.isArray(e.user_stock) === true) {
    if (e.user_stock[0] === 'set') {
      highchart.add_data(w.chart, e.user_stock[1])
    }
    if (e.user_stock[0] === 'add') {
      vm.stocks.push({ name: e.user_stock[1] })
    }
    if (e.user_stock[0] === 'remove') {
      var i = vm.stocks.findIndex(function(stock){
        return stock.name === e.user_stock[1]
      })
      if (i !== -1) {
        vm.stocks.splice(i, 1)
      }
      highchart.remove_data(w.chart, e.user_stock[1])
    }
  }

})
// comms.send
// comms.on('connection')
// comms.on('message')
// comms.on('close')
// comms.reconnect()



// stock_add
