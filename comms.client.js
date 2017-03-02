const BSON = require('bson')
const bson = new BSON()
const eventSystem = require('./app/lib/eventSystem.js')

function BlobtoJSON(blob) {
  return new Promise(function(resolve, reject){
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.on('loadend', function(){
      var data = bson.deserialize( ArrayBuffertoBuffer(reader.result) )
      resolve(data)
    })
  })
}
function ArrayBuffertoBuffer(ab) {
  var buf = new Buffer(ab.byteLength)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i]
  }
  return buf
}

module.exports = function(path) {
  var e = eventSystem()
  var o = {}
  function connect() {
    ws = new WebSocket(path) // 'ws://localhost:3000'
    ws.on('open', function() {
      e.emit('connection')
    })
    ws.on('message', function(ws_event) {
      if (ws_event.data.toString() !== '[object Blob]') {return}
      BlobtoJSON(ws_event.data).then(function(data){
        e.emit('message', data)
      })
    })
    o.ws = ws
  }
  o.reconnect = connect
  o.send = function(obj) {
    o.ws.send( bson.serialize(obj) )
  }
  o.on = e.on
  o.off = e.off
  connect()
  return o
}


// comms.send
// comms.on('connection')
// comms.on('message')
// comms.on('close')
// comms.reconnect()
