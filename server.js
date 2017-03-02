const express = require('express')
const compression = require('compression')
const http = require('http')
const app = express()

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(compression())
app.use('/', express.static(__dirname+'/dist'))
const comms = require('./comms.server.js')(server)
var user_stocks = require('./user_stocks.js')


comms.on('connection', function(ws){
  console.log('comm.connection', ws._socket.remotePort)
  // ip ws._socket.remoteAddress
  comms.send({ws, data: {'*': user_stocks.stocks} })

})

comms.on('message', function({data, ws}){
  if (typeof data.user_stocks === 'object' &&
      typeof user_stocks[data.user_stocks[0]] === 'function' &&
      typeof data.user_stocks[1] === 'object'
    ) {
    data.user_stocks[1].ip = ws._socket.remoteAddress
    user_stocks[data.user_stocks[0]](data.user_stocks[1])
    comms.send({ws, data: user_stocks.stocks})
  }
})

notify_events = ['add', 'remove', 'set']
notify_events.forEach(function(name){
  user_stocks.events.on(name, function(data){
    console.log('user_stock:', name, data)
    if (name === 'set') {
      data = user_stocks.get({name: data})
    }
    comms.sendAll({
      user_stock: [name, data]
    })
  })
})
user_stocks.init().then(function(){
  console.log('user_stocks init')
}).catch(function(err){
  console.log('user_stocks init_err', err)
})


server.listen(PORT, function() {
  console.log('listening on http://localhost:'+PORT);
})
