(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../comms.client.js":7,"./lib/highcharts.js":4,"./lib/jonoShortcuts.js":5,"./lib/request.js":6}],2:[function(require,module,exports){
module.exports = function(){
  var events = {}
  var eventsystem = {
    on: function (id, fn) {
      events[id] = events[id] || []
      events[id].push(fn)
    },
    off: function(id, fn) {
      if (events[id] === undefined) {return}
      var i = events[id].findIndex(function(g){
        return g = fn
      })
      if (i !== -1) {
        events[id].splice(i, 1)
      }
    },
    emit: function (id, data) {
      if (events[id]) {
        events[id].forEach(function(fn) {
          fn(data)
        })
      }
    }
  }
  eventsystem.events = events
  return eventsystem
}

},{}],3:[function(require,module,exports){
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme)

},{}],4:[function(require,module,exports){
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

},{"./highcharts.darktheme.js":3,"highcharts/highstock":27}],5:[function(require,module,exports){
// Base Browser stuff
window.w = window
w.D = Document
w.d = document

Element.prototype.qs = Element.prototype.querySelector
Element.prototype.qsa = Element.prototype.querySelectorAll
D.prototype.qs = Document.prototype.querySelector
D.prototype.qsa = Document.prototype.querySelectorAll

EventTarget.prototype.on = EventTarget.prototype.addEventListener
EventTarget.prototype.off = EventTarget.prototype.removeEventListener
EventTarget.prototype.emit = EventTarget.prototype.dispatchEvent

// http://stackoverflow.com/questions/11761881/javascript-dom-find-element-index-in-container
Element.prototype.getNodeIndex = function() {
  var node = this
  var index = 0;
  while ( (node = node.previousSibling) ) {
    if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
        index++;
    }
  }
  return index;
}

NodeList.prototype.toArray = function() {
  return Array.prototype.map.call(this, function(item){
    return item
  })
}

HTMLCollection.prototype.toArray = function() {
  return NodeList.prototype.toArray.call(this)
}

Node.prototype.prependChild = function(el) {
  var parentNode = this
  parentNode.insertBefore(el, parentNode.firstChild)
}



Element.prototype.qsP = function(query) {
  // qsP: querySelectorParent
  var el = this
  var do_break = false
  while (do_break === false) {
    parent = el.parentElement
    do_break = parent === null || parent.matches(query)
    // parentElement of html is null
  }
  if (parent === null) {return undefined}
  return parent
}

},{}],6:[function(require,module,exports){
module.exports = function({
  method,  // get, post, put, delete
  url,     // relative url or full path
  data,    // if post req sets body as data
  cookies,
  timeout,
  json,
  cb_progress,
  cb_readystate
}) {
  if (method === undefined) {method = 'get'}
  var req = new XMLHttpRequest()
  var p = new Promise(function(resolve, reject){
    var timer
    req.addEventListener('readystatechange', function(e){
      if (typeof cb_readystate === 'function') {
        cb_readystate(e)
      }
      if (req.readyState === 4) {
        clearTimeout(timer)
        if (json) {
          try {
            var res = JSON.parse(req.response)
          } catch(e) {
            // unable to parse res
            return reject(e)
          }
          return resolve(res)
        }
        return resolve(req.response)
      }
    })
    if (typeof cb_progress === 'function') {
      req.upload.addEventListener('progress', cb_progress)
    }
    req.addEventListener('error', function(e) {
      reject(e)
    })
    req.open(method, url, true)
    req.withCredentials = Boolean(cookies)
    if (json === true) {
      req.setRequestHeader('Content-Type', 'application/json')
    }

    if (isNaN(timeout) === false) {
      timer = setTimeout(function(){
        req.abort()
        reject(timeout+'ms timeout')
      },timeout)
    }
    if (data === undefined || data === null) {
      return req.send()
    }
    var d = (typeof data === 'string')? data : JSON.stringify(data)
    req.send(d)
  })
  p.req = req
  p.cancel = req.abort
  return p
}

},{}],7:[function(require,module,exports){
(function (Buffer){
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

}).call(this,require("buffer").Buffer)
},{"./app/lib/eventSystem.js":2,"bson":9,"buffer":29}],8:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 * @ignore
 */

// Test if we're in Node via presence of "global" not absence of "window"
// to support hybrid environments like Electron
if(typeof global !== 'undefined') {
  var Buffer = require('buffer').Buffer; // TODO just use global Buffer
}

/**
 * A class representation of the BSON Binary type.
 *
 * Sub types
 *  - **BSON.BSON_BINARY_SUBTYPE_DEFAULT**, default BSON type.
 *  - **BSON.BSON_BINARY_SUBTYPE_FUNCTION**, BSON function type.
 *  - **BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY**, BSON byte array type.
 *  - **BSON.BSON_BINARY_SUBTYPE_UUID**, BSON uuid type.
 *  - **BSON.BSON_BINARY_SUBTYPE_MD5**, BSON md5 type.
 *  - **BSON.BSON_BINARY_SUBTYPE_USER_DEFINED**, BSON user defined type.
 *
 * @class
 * @param {Buffer} buffer a buffer object containing the binary data.
 * @param {Number} [subType] the option binary type.
 * @return {Binary}
 */
function Binary(buffer, subType) {
  if(!(this instanceof Binary)) return new Binary(buffer, subType);

  this._bsontype = 'Binary';

  if(buffer instanceof Number) {
    this.sub_type = buffer;
    this.position = 0;
  } else {
    this.sub_type = subType == null ? BSON_BINARY_SUBTYPE_DEFAULT : subType;
    this.position = 0;
  }

  if(buffer != null && !(buffer instanceof Number)) {
    // Only accept Buffer, Uint8Array or Arrays
    if(typeof buffer == 'string') {
      // Different ways of writing the length of the string for the different types
      if(typeof Buffer != 'undefined') {
        this.buffer = new Buffer(buffer);
      } else if(typeof Uint8Array != 'undefined' || (Object.prototype.toString.call(buffer) == '[object Array]')) {
        this.buffer = writeStringToArray(buffer);
      } else {
        throw new Error("only String, Buffer, Uint8Array or Array accepted");
      }
    } else {
      this.buffer = buffer;
    }
    this.position = buffer.length;
  } else {
    if(typeof Buffer != 'undefined') {
      this.buffer =  new Buffer(Binary.BUFFER_SIZE);
    } else if(typeof Uint8Array != 'undefined'){
      this.buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE));
    } else {
      this.buffer = new Array(Binary.BUFFER_SIZE);
    }
    // Set position to start of buffer
    this.position = 0;
  }
};

/**
 * Updates this binary with byte_value.
 *
 * @method
 * @param {string} byte_value a single byte we wish to write.
 */
Binary.prototype.put = function put(byte_value) {
  // If it's a string and a has more than one character throw an error
  if(byte_value['length'] != null && typeof byte_value != 'number' && byte_value.length != 1) throw new Error("only accepts single character String, Uint8Array or Array");
  if(typeof byte_value != 'number' && byte_value < 0 || byte_value > 255) throw new Error("only accepts number in a valid unsigned byte range 0-255");

  // Decode the byte value once
  var decoded_byte = null;
  if(typeof byte_value == 'string') {
    decoded_byte = byte_value.charCodeAt(0);
  } else if(byte_value['length'] != null) {
    decoded_byte = byte_value[0];
  } else {
    decoded_byte = byte_value;
  }

  if(this.buffer.length > this.position) {
    this.buffer[this.position++] = decoded_byte;
  } else {
    if(typeof Buffer != 'undefined' && Buffer.isBuffer(this.buffer)) {
      // Create additional overflow buffer
      var buffer = new Buffer(Binary.BUFFER_SIZE + this.buffer.length);
      // Combine the two buffers together
      this.buffer.copy(buffer, 0, 0, this.buffer.length);
      this.buffer = buffer;
      this.buffer[this.position++] = decoded_byte;
    } else {
      var buffer = null;
      // Create a new buffer (typed or normal array)
      if(Object.prototype.toString.call(this.buffer) == '[object Uint8Array]') {
        buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE + this.buffer.length));
      } else {
        buffer = new Array(Binary.BUFFER_SIZE + this.buffer.length);
      }

      // We need to copy all the content to the new array
      for(var i = 0; i < this.buffer.length; i++) {
        buffer[i] = this.buffer[i];
      }

      // Reassign the buffer
      this.buffer = buffer;
      // Write the byte
      this.buffer[this.position++] = decoded_byte;
    }
  }
};

/**
 * Writes a buffer or string to the binary.
 *
 * @method
 * @param {(Buffer|string)} string a string or buffer to be written to the Binary BSON object.
 * @param {number} offset specify the binary of where to write the content.
 * @return {null}
 */
Binary.prototype.write = function write(string, offset) {
  offset = typeof offset == 'number' ? offset : this.position;

  // If the buffer is to small let's extend the buffer
  if(this.buffer.length < offset + string.length) {
    var buffer = null;
    // If we are in node.js
    if(typeof Buffer != 'undefined' && Buffer.isBuffer(this.buffer)) {
      buffer = new Buffer(this.buffer.length + string.length);
      this.buffer.copy(buffer, 0, 0, this.buffer.length);
    } else if(Object.prototype.toString.call(this.buffer) == '[object Uint8Array]') {
      // Create a new buffer
      buffer = new Uint8Array(new ArrayBuffer(this.buffer.length + string.length))
      // Copy the content
      for(var i = 0; i < this.position; i++) {
        buffer[i] = this.buffer[i];
      }
    }

    // Assign the new buffer
    this.buffer = buffer;
  }

  if(typeof Buffer != 'undefined' && Buffer.isBuffer(string) && Buffer.isBuffer(this.buffer)) {
    string.copy(this.buffer, offset, 0, string.length);
    this.position = (offset + string.length) > this.position ? (offset + string.length) : this.position;
    // offset = string.length
  } else if(typeof Buffer != 'undefined' && typeof string == 'string' && Buffer.isBuffer(this.buffer)) {
    this.buffer.write(string, offset, 'binary');
    this.position = (offset + string.length) > this.position ? (offset + string.length) : this.position;
    // offset = string.length;
  } else if(Object.prototype.toString.call(string) == '[object Uint8Array]'
    || Object.prototype.toString.call(string) == '[object Array]' && typeof string != 'string') {
    for(var i = 0; i < string.length; i++) {
      this.buffer[offset++] = string[i];
    }

    this.position = offset > this.position ? offset : this.position;
  } else if(typeof string == 'string') {
    for(var i = 0; i < string.length; i++) {
      this.buffer[offset++] = string.charCodeAt(i);
    }

    this.position = offset > this.position ? offset : this.position;
  }
};

/**
 * Reads **length** bytes starting at **position**.
 *
 * @method
 * @param {number} position read from the given position in the Binary.
 * @param {number} length the number of bytes to read.
 * @return {Buffer}
 */
Binary.prototype.read = function read(position, length) {
  length = length && length > 0
    ? length
    : this.position;

  // Let's return the data based on the type we have
  if(this.buffer['slice']) {
    return this.buffer.slice(position, position + length);
  } else {
    // Create a buffer to keep the result
    var buffer = typeof Uint8Array != 'undefined' ? new Uint8Array(new ArrayBuffer(length)) : new Array(length);
    for(var i = 0; i < length; i++) {
      buffer[i] = this.buffer[position++];
    }
  }
  // Return the buffer
  return buffer;
};

/**
 * Returns the value of this binary as a string.
 *
 * @method
 * @return {string}
 */
Binary.prototype.value = function value(asRaw) {
  asRaw = asRaw == null ? false : asRaw;

  // Optimize to serialize for the situation where the data == size of buffer
  if(asRaw && typeof Buffer != 'undefined' && Buffer.isBuffer(this.buffer) && this.buffer.length == this.position)
    return this.buffer;

  // If it's a node.js buffer object
  if(typeof Buffer != 'undefined' && Buffer.isBuffer(this.buffer)) {
    return asRaw ? this.buffer.slice(0, this.position) : this.buffer.toString('binary', 0, this.position);
  } else {
    if(asRaw) {
      // we support the slice command use it
      if(this.buffer['slice'] != null) {
        return this.buffer.slice(0, this.position);
      } else {
        // Create a new buffer to copy content to
        var newBuffer = Object.prototype.toString.call(this.buffer) == '[object Uint8Array]' ? new Uint8Array(new ArrayBuffer(this.position)) : new Array(this.position);
        // Copy content
        for(var i = 0; i < this.position; i++) {
          newBuffer[i] = this.buffer[i];
        }
        // Return the buffer
        return newBuffer;
      }
    } else {
      return convertArraytoUtf8BinaryString(this.buffer, 0, this.position);
    }
  }
};

/**
 * Length.
 *
 * @method
 * @return {number} the length of the binary.
 */
Binary.prototype.length = function length() {
  return this.position;
};

/**
 * @ignore
 */
Binary.prototype.toJSON = function() {
  return this.buffer != null ? this.buffer.toString('base64') : '';
}

/**
 * @ignore
 */
Binary.prototype.toString = function(format) {
  return this.buffer != null ? this.buffer.slice(0, this.position).toString(format) : '';
}

/**
 * Binary default subtype
 * @ignore
 */
var BSON_BINARY_SUBTYPE_DEFAULT = 0;

/**
 * @ignore
 */
var writeStringToArray = function(data) {
  // Create a buffer
  var buffer = typeof Uint8Array != 'undefined' ? new Uint8Array(new ArrayBuffer(data.length)) : new Array(data.length);
  // Write the content to the buffer
  for(var i = 0; i < data.length; i++) {
    buffer[i] = data.charCodeAt(i);
  }
  // Write the string to the buffer
  return buffer;
}

/**
 * Convert Array ot Uint8Array to Binary String
 *
 * @ignore
 */
var convertArraytoUtf8BinaryString = function(byteArray, startIndex, endIndex) {
  var result = "";
  for(var i = startIndex; i < endIndex; i++) {
   result = result + String.fromCharCode(byteArray[i]);
  }
  return result;
};

Binary.BUFFER_SIZE = 256;

/**
 * Default BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_DEFAULT = 0;
/**
 * Function BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_FUNCTION = 1;
/**
 * Byte Array BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_BYTE_ARRAY = 2;
/**
 * OLD UUID BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_UUID_OLD = 3;
/**
 * UUID BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_UUID = 4;
/**
 * MD5 BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_MD5 = 5;
/**
 * User BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_USER_DEFINED = 128;

/**
 * Expose.
 */
module.exports = Binary;
module.exports.Binary = Binary;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":29}],9:[function(require,module,exports){
(function (Buffer){
"use strict"

var writeIEEE754 = require('./float_parser').writeIEEE754,
	readIEEE754 = require('./float_parser').readIEEE754,
  Map = require('./map'),
	Long = require('./long'),
  Double = require('./double'),
  Timestamp = require('./timestamp'),
  ObjectID = require('./objectid'),
  BSONRegExp = require('./regexp'),
  Symbol = require('./symbol'),
	Int32 = require('./int_32'),
  Code = require('./code'),
	Decimal128 = require('./decimal128'),
  MinKey = require('./min_key'),
  MaxKey = require('./max_key'),
  DBRef = require('./db_ref'),
  Binary = require('./binary');

// Parts of the parser
var deserialize = require('./parser/deserializer'),
	serializer = require('./parser/serializer'),
	calculateObjectSize = require('./parser/calculate_size');

/**
 * @ignore
 * @api private
 */
// Max Size
var MAXSIZE = (1024*1024*17);
// Max Document Buffer size
var buffer = new Buffer(MAXSIZE);

var BSON = function() {
}

/**
 * Serialize a Javascript object.
 *
 * @param {Object} object the Javascript object to serialize.
 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @return {Buffer} returns the Buffer object containing the serialized object.
 * @api public
 */
BSON.prototype.serialize = function serialize(object, options) {
	options = options || {};
	// Unpack the options
	var checkKeys = typeof options.checkKeys == 'boolean'
		? options.checkKeys : false;
	var serializeFunctions = typeof options.serializeFunctions == 'boolean'
		? options.serializeFunctions : false;
	var ignoreUndefined = typeof options.ignoreUndefined == 'boolean'
		? options.ignoreUndefined : true;

	// Attempt to serialize
	var serializationIndex = serializer(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, []);
	// Create the final buffer
	var finishedBuffer = new Buffer(serializationIndex);
	// Copy into the finished buffer
	buffer.copy(finishedBuffer, 0, 0, finishedBuffer.length);
	// Return the buffer
	return finishedBuffer;
}

/**
 * Serialize a Javascript object using a predefined Buffer and index into the buffer, useful when pre-allocating the space for serialization.
 *
 * @param {Object} object the Javascript object to serialize.
 * @param {Buffer} buffer the Buffer you pre-allocated to store the serialized BSON object.
 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @param {Number} [options.index] the index in the buffer where we wish to start serializing into.
 * @return {Number} returns the index pointing to the last written byte in the buffer.
 * @api public
 */
BSON.prototype.serializeWithBufferAndIndex = function(object, finalBuffer, options) {
	options = options || {};
	// Unpack the options
	var checkKeys = typeof options.checkKeys == 'boolean'
		? options.checkKeys : false;
	var serializeFunctions = typeof options.serializeFunctions == 'boolean'
		? options.serializeFunctions : false;
	var ignoreUndefined = typeof options.ignoreUndefined == 'boolean'
		? options.ignoreUndefined : true;
	var startIndex = typeof options.index == 'number'
		? options.index : 0;

	// Attempt to serialize
	var serializationIndex = serializer(buffer, object, checkKeys, startIndex || 0, 0, serializeFunctions, ignoreUndefined);
	buffer.copy(finalBuffer, startIndex, 0, serializationIndex);

	// Return the index
	return serializationIndex - 1;
}

/**
 * Deserialize data as BSON.
 *
 * @param {Buffer} buffer the buffer containing the serialized set of BSON documents.
 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
 * @return {Object} returns the deserialized Javascript Object.
 * @api public
 */
BSON.prototype.deserialize = function(buffer, options) {
  return deserialize(buffer, options);
}

/**
 * Calculate the bson size for a passed in Javascript object.
 *
 * @param {Object} object the Javascript object to calculate the BSON byte size for.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @return {Number} returns the number of bytes the BSON object will take up.
 * @api public
 */
BSON.prototype.calculateObjectSize = function(object, options) {
	options = options || {};

	var serializeFunctions = typeof options.serializeFunctions == 'boolean'
		? options.serializeFunctions : false;
	var ignoreUndefined = typeof options.ignoreUndefined == 'boolean'
		? options.ignoreUndefined : true;

  return calculateObjectSize(object, serializeFunctions, ignoreUndefined);
}

/**
 * Deserialize stream data as BSON documents.
 *
 * @param {Buffer} data the buffer containing the serialized set of BSON documents.
 * @param {Number} startIndex the start index in the data Buffer where the deserialization is to start.
 * @param {Number} numberOfDocuments number of documents to deserialize.
 * @param {Array} documents an array where to store the deserialized documents.
 * @param {Number} docStartIndex the index in the documents array from where to start inserting documents.
 * @param {Object} [options] additional options used for the deserialization.
 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
 * @return {Number} returns the next index in the buffer after deserialization **x** numbers of documents.
 * @api public
 */
BSON.prototype.deserializeStream = function(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
  options = options != null ? options : {};
  var index = startIndex;
  // Loop over all documents
  for(var i = 0; i < numberOfDocuments; i++) {
    // Find size of the document
    var size = data[index] | data[index + 1] << 8 | data[index + 2] << 16 | data[index + 3] << 24;
    // Update options with index
    options['index'] = index;
    // Parse the document at this point
    documents[docStartIndex + i] = this.deserialize(data, options);
    // Adjust index by the document size
    index = index + size;
  }

  // Return object containing end index of parsing and list of documents
  return index;
}

/**
 * @ignore
 * @api private
 */
// BSON MAX VALUES
BSON.BSON_INT32_MAX = 0x7FFFFFFF;
BSON.BSON_INT32_MIN = -0x80000000;

BSON.BSON_INT64_MAX = Math.pow(2, 63) - 1;
BSON.BSON_INT64_MIN = -Math.pow(2, 63);

// JS MAX PRECISE VALUES
BSON.JS_INT_MAX = 0x20000000000000;  // Any integer up to 2^53 can be precisely represented by a double.
BSON.JS_INT_MIN = -0x20000000000000;  // Any integer down to -2^53 can be precisely represented by a double.

// Internal long versions
var JS_INT_MAX_LONG = Long.fromNumber(0x20000000000000);  // Any integer up to 2^53 can be precisely represented by a double.
var JS_INT_MIN_LONG = Long.fromNumber(-0x20000000000000);  // Any integer down to -2^53 can be precisely represented by a double.

/**
 * Number BSON Type
 *
 * @classconstant BSON_DATA_NUMBER
 **/
BSON.BSON_DATA_NUMBER = 1;
/**
 * String BSON Type
 *
 * @classconstant BSON_DATA_STRING
 **/
BSON.BSON_DATA_STRING = 2;
/**
 * Object BSON Type
 *
 * @classconstant BSON_DATA_OBJECT
 **/
BSON.BSON_DATA_OBJECT = 3;
/**
 * Array BSON Type
 *
 * @classconstant BSON_DATA_ARRAY
 **/
BSON.BSON_DATA_ARRAY = 4;
/**
 * Binary BSON Type
 *
 * @classconstant BSON_DATA_BINARY
 **/
BSON.BSON_DATA_BINARY = 5;
/**
 * ObjectID BSON Type
 *
 * @classconstant BSON_DATA_OID
 **/
BSON.BSON_DATA_OID = 7;
/**
 * Boolean BSON Type
 *
 * @classconstant BSON_DATA_BOOLEAN
 **/
BSON.BSON_DATA_BOOLEAN = 8;
/**
 * Date BSON Type
 *
 * @classconstant BSON_DATA_DATE
 **/
BSON.BSON_DATA_DATE = 9;
/**
 * null BSON Type
 *
 * @classconstant BSON_DATA_NULL
 **/
BSON.BSON_DATA_NULL = 10;
/**
 * RegExp BSON Type
 *
 * @classconstant BSON_DATA_REGEXP
 **/
BSON.BSON_DATA_REGEXP = 11;
/**
 * Code BSON Type
 *
 * @classconstant BSON_DATA_CODE
 **/
BSON.BSON_DATA_CODE = 13;
/**
 * Symbol BSON Type
 *
 * @classconstant BSON_DATA_SYMBOL
 **/
BSON.BSON_DATA_SYMBOL = 14;
/**
 * Code with Scope BSON Type
 *
 * @classconstant BSON_DATA_CODE_W_SCOPE
 **/
BSON.BSON_DATA_CODE_W_SCOPE = 15;
/**
 * 32 bit Integer BSON Type
 *
 * @classconstant BSON_DATA_INT
 **/
BSON.BSON_DATA_INT = 16;
/**
 * Timestamp BSON Type
 *
 * @classconstant BSON_DATA_TIMESTAMP
 **/
BSON.BSON_DATA_TIMESTAMP = 17;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_LONG
 **/
BSON.BSON_DATA_LONG = 18;
/**
 * MinKey BSON Type
 *
 * @classconstant BSON_DATA_MIN_KEY
 **/
BSON.BSON_DATA_MIN_KEY = 0xff;
/**
 * MaxKey BSON Type
 *
 * @classconstant BSON_DATA_MAX_KEY
 **/
BSON.BSON_DATA_MAX_KEY = 0x7f;

/**
 * Binary Default Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
 **/
BSON.BSON_BINARY_SUBTYPE_DEFAULT = 0;
/**
 * Binary Function Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
 **/
BSON.BSON_BINARY_SUBTYPE_FUNCTION = 1;
/**
 * Binary Byte Array Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
 **/
BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
/**
 * Binary UUID Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_UUID
 **/
BSON.BSON_BINARY_SUBTYPE_UUID = 3;
/**
 * Binary MD5 Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_MD5
 **/
BSON.BSON_BINARY_SUBTYPE_MD5 = 4;
/**
 * Binary User Defined Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
 **/
BSON.BSON_BINARY_SUBTYPE_USER_DEFINED = 128;

// Return BSON
module.exports = BSON;
module.exports.Code = Code;
module.exports.Map = Map;
module.exports.Symbol = Symbol;
module.exports.BSON = BSON;
module.exports.DBRef = DBRef;
module.exports.Binary = Binary;
module.exports.ObjectID = ObjectID;
module.exports.Long = Long;
module.exports.Timestamp = Timestamp;
module.exports.Double = Double;
module.exports.Int32 = Int32;
module.exports.MinKey = MinKey;
module.exports.MaxKey = MaxKey;
module.exports.BSONRegExp = BSONRegExp;
module.exports.Decimal128 = Decimal128;

}).call(this,require("buffer").Buffer)
},{"./binary":8,"./code":10,"./db_ref":11,"./decimal128":12,"./double":13,"./float_parser":14,"./int_32":15,"./long":16,"./map":17,"./max_key":18,"./min_key":19,"./objectid":20,"./parser/calculate_size":21,"./parser/deserializer":22,"./parser/serializer":23,"./regexp":24,"./symbol":25,"./timestamp":26,"buffer":29}],10:[function(require,module,exports){
/**
 * A class representation of the BSON Code type.
 *
 * @class
 * @param {(string|function)} code a string or function.
 * @param {Object} [scope] an optional scope for the function.
 * @return {Code}
 */
var Code = function Code(code, scope) {
  if(!(this instanceof Code)) return new Code(code, scope);
  this._bsontype = 'Code';
  this.code = code;
  this.scope = scope;
};

/**
 * @ignore
 */
Code.prototype.toJSON = function() {
  return {scope:this.scope, code:this.code};
}

module.exports = Code;
module.exports.Code = Code;

},{}],11:[function(require,module,exports){
/**
 * A class representation of the BSON DBRef type.
 *
 * @class
 * @param {string} namespace the collection name.
 * @param {ObjectID} oid the reference ObjectID.
 * @param {string} [db] optional db name, if omitted the reference is local to the current db.
 * @return {DBRef}
 */
function DBRef(namespace, oid, db) {
  if(!(this instanceof DBRef)) return new DBRef(namespace, oid, db);
  
  this._bsontype = 'DBRef';
  this.namespace = namespace;
  this.oid = oid;
  this.db = db;
};

/**
 * @ignore
 * @api private
 */
DBRef.prototype.toJSON = function() {
  return {
    '$ref':this.namespace,
    '$id':this.oid,
    '$db':this.db == null ? '' : this.db
  };
}

module.exports = DBRef;
module.exports.DBRef = DBRef;
},{}],12:[function(require,module,exports){
(function (Buffer){
"use strict"

var Long = require('./long');

var PARSE_STRING_REGEXP = /^(\+|\-)?(\d+|(\d*\.\d*))?(E|e)?([\-\+])?(\d+)?$/;
var PARSE_INF_REGEXP = /^(\+|\-)?(Infinity|inf)$/i;
var PARSE_NAN_REGEXP = /^(\+|\-)?NaN$/i;

var EXPONENT_MAX = 6111;
var EXPONENT_MIN = -6176;
var EXPONENT_BIAS = 6176;
var MAX_DIGITS = 34;

// Nan value bits as 32 bit values (due to lack of longs)
var NAN_BUFFER = [0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
// Infinity value bits 32 bit values (due to lack of longs)
var INF_NEGATIVE_BUFFER = [0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
var INF_POSITIVE_BUFFER = [0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();

var EXPONENT_REGEX = /^([\-\+])?(\d+)?$/;


// Detect if the value is a digit
var isDigit = function(value) {
  return !isNaN(parseInt(value, 10));
}

// Divide two uint128 values
var divideu128 = function(value) {
  var DIVISOR = Long.fromNumber(1000 * 1000 * 1000);
  var _rem = Long.fromNumber(0);
  var i = 0;

  if(!value.parts[0] && !value.parts[1] &&
     !value.parts[2] && !value.parts[3]) {
    return { quotient: value, rem: _rem };
  }

  for(var i = 0; i <= 3; i++) {
    // Adjust remainder to match value of next dividend
    _rem = _rem.shiftLeft(32);
    // Add the divided to _rem
    _rem = _rem.add(new Long(value.parts[i], 0));
    value.parts[i] = _rem.div(DIVISOR).low_;
    _rem = _rem.modulo(DIVISOR);
  }

  return { quotient: value, rem: _rem };
}

// Multiply two Long values and return the 128 bit value
var multiply64x2 = function(left, right) {
  if(!left && !right) {
    return {high: Long.fromNumber(0), low: Long.fromNumber(0)};
  }

  var leftHigh = left.shiftRightUnsigned(32);
  var leftLow = new Long(left.getLowBits(), 0);
  var rightHigh = right.shiftRightUnsigned(32);
  var rightLow = new Long(right.getLowBits(), 0);

  var productHigh = leftHigh.multiply(rightHigh);
  var productMid = leftHigh.multiply(rightLow);
  var productMid2 = leftLow.multiply(rightHigh);
  var productLow = leftLow.multiply(rightLow);

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  productMid = new Long(productMid.getLowBits(), 0)
                .add(productMid2)
                .add(productLow.shiftRightUnsigned(32));

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));

  // Return the 128 bit result
  return {high: productHigh, low: productLow};
}

var lessThan = function(left, right) {
  // Make values unsigned
  var uhleft = left.high_ >>> 0;
  var uhright = right.high_ >>> 0;

  // Compare high bits first
  if(uhleft < uhright) {
    return true
  } else if(uhleft == uhright) {
    var ulleft = left.low_ >>> 0;
    var ulright = right.low_ >>> 0;
    if(ulleft < ulright) return true;
  }

  return false;
}

var longtoHex = function(value) {
  var buffer = new Buffer(8);
  var index = 0;
  // Encode the low 64 bits of the decimal
  // Encode low bits
  buffer[index++] = value.low_ & 0xff;
  buffer[index++] = (value.low_ >> 8) & 0xff;
  buffer[index++] = (value.low_ >> 16) & 0xff;
  buffer[index++] = (value.low_ >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = value.high_ & 0xff;
  buffer[index++] = (value.high_ >> 8) & 0xff;
  buffer[index++] = (value.high_ >> 16) & 0xff;
  buffer[index++] = (value.high_ >> 24) & 0xff;
  return buffer.reverse().toString('hex');
}

var int32toHex = function(value) {
  var buffer = new Buffer(4);
  var index = 0;
  // Encode the low 64 bits of the decimal
  // Encode low bits
  buffer[index++] = value & 0xff;
  buffer[index++] = (value >> 8) & 0xff;
  buffer[index++] = (value >> 16) & 0xff;
  buffer[index++] = (value >> 24) & 0xff;
  return buffer.reverse().toString('hex');
}

var Decimal128 = function(bytes) {
  this._bsontype = 'Decimal128';
  this.bytes = bytes;
}

Decimal128.fromString = function(string) {
  // Parse state tracking
  var isNegative = false;
  var sawRadix = false;
  var foundNonZero = false;

  // Total number of significant digits (no leading or trailing zero)
  var significantDigits = 0;
  // Total number of significand digits read
  var nDigitsRead = 0;
  // Total number of digits (no leading zeros)
  var nDigits = 0;
  // The number of the digits after radix
  var radixPosition = 0;
  // The index of the first non-zero in *str*
  var firstNonZero = 0;

  // Digits Array
  var digits = [0];
  // The number of digits in digits
  var nDigitsStored = 0;
  // Insertion pointer for digits
  var digitsInsert = 0;
  // The index of the first non-zero digit
  var firstDigit = 0;
  // The index of the last digit
  var lastDigit = 0;

  // Exponent
  var exponent = 0;
  // loop index over array
  var i = 0;
  // The high 17 digits of the significand
  var significandHigh = [0, 0];
  // The low 17 digits of the significand
  var significandLow = [0, 0];
  // The biased exponent
  var biasedExponent = 0;

  // Read index
  var index = 0;

  // Trim the string
  string = string.trim();

  // Results
  var stringMatch = string.match(PARSE_STRING_REGEXP);
  var infMatch = string.match(PARSE_INF_REGEXP);
  var nanMatch = string.match(PARSE_NAN_REGEXP);

  // Validate the string
  if(!stringMatch
    && ! infMatch
    && ! nanMatch || string.length == 0) {
      throw new Error("" + string + " not a valid Decimal128 string");
  }

  // Check if we have an illegal exponent format
  if(stringMatch && stringMatch[4] && stringMatch[2] === undefined) {
    throw new Error("" + string + " not a valid Decimal128 string");
  }

  // Get the negative or positive sign
  if(string[index] == '+' || string[index] == '-') {
    isNegative = string[index++] == '-';
  }

  // Check if user passed Infinity or NaN
  if(!isDigit(string[index]) && string[index] != '.') {
    if(string[index] == 'i' || string[index] == 'I') {
      return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
    } else if(string[index] == 'N') {
      return new Decimal128(new Buffer(NAN_BUFFER));
    }
  }

  // Read all the digits
  while(isDigit(string[index]) || string[index] == '.') {
    if(string[index] == '.') {
      if(sawRadix) {
        return new Decimal128(new Buffer(NAN_BUFFER));
      }

      sawRadix = true;
      index = index + 1;
      continue;
    }

    if(nDigitsStored < 34) {
      if(string[index] != '0' || foundNonZero) {
        if(!foundNonZero) {
          firstNonZero = nDigitsRead;
        }

        foundNonZero = true;

        // Only store 34 digits
        digits[digitsInsert++] = parseInt(string[index], 10);
        nDigitsStored = nDigitsStored + 1;
      }
    }

    if(foundNonZero) {
      nDigits = nDigits + 1;
    }

    if(sawRadix) {
      radixPosition = radixPosition + 1;
    }

    nDigitsRead = nDigitsRead + 1;
    index = index + 1;
  }

  if(sawRadix && !nDigitsRead) {
    throw new Error("" + string + " not a valid Decimal128 string");
  }

  // Read exponent if exists
  if(string[index] == 'e' || string[index] == 'E') {
    // Read exponent digits
    var match = string.substr(++index).match(EXPONENT_REGEX);

    // No digits read
    if(!match || !match[2]) {
      return new Decimal128(new Buffer(NAN_BUFFER));
    }

    // Get exponent
    exponent = parseInt(match[0], 10);

    // Adjust the index
    index = index + match[0].length;
  }

  // Return not a number
  if(string[index]) {
    return new Decimal128(new Buffer(NAN_BUFFER));
  }

  // Done reading input
  // Find first non-zero digit in digits
  firstDigit = 0;

  if(!nDigitsStored) {
    firstDigit = 0;
    lastDigit = 0;
    digits[0] = 0;
    nDigits = 1;
    nDigitsStored = 1;
    significantDigits = 0;
  } else {
    lastDigit = nDigitsStored - 1;
    significantDigits = nDigits;

    if(exponent != 0 && significantDigits != 1) {
      while(string[firstNonZero + significantDigits - 1] == '0') {
        significantDigits = significantDigits - 1;
      }
    }
  }

  // Normalization of exponent
  // Correct exponent based on radix position, and shift significand as needed
  // to represent user input

  // Overflow prevention
  if(exponent <= radixPosition && radixPosition - exponent > (1 << 14)) {
    exponent = EXPONENT_MIN;
  } else {
    exponent = exponent - radixPosition;
  }

  // Attempt to normalize the exponent
  while(exponent > EXPONENT_MAX) {
    // Shift exponent to significand and decrease
    lastDigit = lastDigit + 1;

    if(lastDigit - firstDigit > MAX_DIGITS) {
      // Check if we have a zero then just hard clamp, otherwise fail
      var digitsString = digits.join('');
      if(digitsString.match(/^0+$/)) {
        exponent = EXPONENT_MAX;
        break;
      } else {
        return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
      }
    }

    exponent = exponent - 1;
  }

  while(exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
    // Shift last digit
    if(lastDigit == 0) {
      exponent = EXPONENT_MIN;
      significantDigits = 0;
      break;
    }

    if(nDigitsStored < nDigits) {
      // adjust to match digits not stored
      nDigits = nDigits - 1;
    } else {
      // adjust to round
      lastDigit = lastDigit - 1;
    }

    if(exponent < EXPONENT_MAX) {
      exponent = exponent + 1;
    } else {
      // Check if we have a zero then just hard clamp, otherwise fail
      var digitsString = digits.join('');
      if(digitsString.match(/^0+$/)) {
        exponent = EXPONENT_MAX;
        break;
      } else {
        return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER))
      }
    }
  }


  // Round
  // We've normalized the exponent, but might still need to round.
  if((lastDigit - firstDigit + 1 < significantDigits) && string[significantDigits] != '0') {
    var endOfString = nDigitsRead;

    // If we have seen a radix point, 'string' is 1 longer than we have
    // documented with ndigits_read, so inc the position of the first nonzero
    // digit and the position that digits are read to.
    if(sawRadix && exponent == EXPONENT_MIN) {
      firstNonZero = firstNonZero + 1;
      endOfString = endOfString + 1;
    }

    var roundDigit = parseInt(string[firstNonZero + lastDigit + 1], 10);
    var roundBit = 0;

    if(roundDigit >= 5) {
      roundBit = 1;

      if(roundDigit == 5) {
        roundBit = digits[lastDigit] % 2 == 1;

        for(var i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
          if(parseInt(string[i], 10)) {
            roundBit = 1;
            break;
          }
        }
      }
    }

    if(roundBit) {
      var dIdx = lastDigit;

      for(; dIdx >= 0; dIdx--) {
        if(++digits[dIdx] > 9) {
          digits[dIdx] = 0;

          // overflowed most significant digit
          if(dIdx == 0) {
            if(exponent < EXPONENT_MAX) {
              exponent = exponent + 1;
              digits[dIdx] = 1;
            } else {
              return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER))
            }
          }
        } else {
          break;
        }
      }
    }
  }

  // Encode significand
  // The high 17 digits of the significand
  significandHigh = Long.fromNumber(0);
  // The low 17 digits of the significand
  significandLow = Long.fromNumber(0);

  // read a zero
  if(significantDigits == 0) {
    significandHigh = Long.fromNumber(0);
    significandLow = Long.fromNumber(0);
  } else if(lastDigit - firstDigit < 17) {
    var dIdx = firstDigit;
    significandLow = Long.fromNumber(digits[dIdx++]);
    significandHigh = new Long(0, 0);

    for(; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  } else {
    var dIdx = firstDigit;
    significandHigh = Long.fromNumber(digits[dIdx++]);

    for(; dIdx <= lastDigit - 17; dIdx++) {
      significandHigh = significandHigh.multiply(Long.fromNumber(10));
      significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
    }

    significandLow = Long.fromNumber(digits[dIdx++]);

    for(; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  }

  var significand = multiply64x2(significandHigh, Long.fromString("100000000000000000"));

  significand.low = significand.low.add(significandLow);

  if(lessThan(significand.low, significandLow)) {
    significand.high = significand.high.add(Long.fromNumber(1));
  }

  // Biased exponent
  var biasedExponent = (exponent + EXPONENT_BIAS);
  var dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };

  // Encode combination, exponent, and significand.
  if(significand.high.shiftRightUnsigned(49).and(Long.fromNumber(1)).equals(Long.fromNumber)) {
    // Encode '11' into bits 1 to 3
    dec.high = dec.high.or(Long.fromNumber(0x3).shiftLeft(61));
    dec.high = dec.high.or(Long.fromNumber(biasedExponent).and(Long.fromNumber(0x3fff).shiftLeft(47)));
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x7fffffffffff)));
  } else {
    dec.high = dec.high.or(Long.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x1ffffffffffff)));
  }

  dec.low = significand.low;

  // Encode sign
  if(isNegative) {
    dec.high = dec.high.or(Long.fromString('9223372036854775808'));
  }

  // Encode into a buffer
  var buffer = new Buffer(16);
  var index = 0;

  // Encode the low 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.low.low_ & 0xff;
  buffer[index++] = (dec.low.low_ >> 8) & 0xff;
  buffer[index++] = (dec.low.low_ >> 16) & 0xff;
  buffer[index++] = (dec.low.low_ >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = dec.low.high_ & 0xff;
  buffer[index++] = (dec.low.high_ >> 8) & 0xff;
  buffer[index++] = (dec.low.high_ >> 16) & 0xff;
  buffer[index++] = (dec.low.high_ >> 24) & 0xff;

  // Encode the high 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.high.low_ & 0xff;
  buffer[index++] = (dec.high.low_ >> 8) & 0xff;
  buffer[index++] = (dec.high.low_ >> 16) & 0xff;
  buffer[index++] = (dec.high.low_ >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = dec.high.high_ & 0xff;
  buffer[index++] = (dec.high.high_ >> 8) & 0xff;
  buffer[index++] = (dec.high.high_ >> 16) & 0xff;
  buffer[index++] = (dec.high.high_ >> 24) & 0xff;

  // Return the new Decimal128
  return new Decimal128(buffer);
}

// Extract least significant 5 bits
var COMBINATION_MASK = 0x1f;
// Extract least significant 14 bits
var EXPONENT_MASK = 0x3fff;
// Value of combination field for Inf
var COMBINATION_INFINITY = 30;
// Value of combination field for NaN
var COMBINATION_NAN = 31;
// Value of combination field for NaN
var COMBINATION_SNAN = 32;
// decimal128 exponent bias
var EXPONENT_BIAS = 6176;

Decimal128.prototype.toString = function() {
  // Note: bits in this routine are referred to starting at 0,
  // from the sign bit, towards the coefficient.

  // bits 0 - 31
  var high;
  // bits 32 - 63
  var midh;
  // bits 64 - 95
  var midl;
  // bits 96 - 127
  var low;
  // bits 1 - 5
  var combination;
  // decoded biased exponent (14 bits)
  var biased_exponent;
  // the number of significand digits
  var significand_digits = 0;
  // the base-10 digits in the significand
  var significand = new Array(36);
  for(var i = 0; i < significand.length; i++) significand[i] = 0;
  // read pointer into significand
  var index = 0;

  // unbiased exponent
  var exponent;
  // the exponent if scientific notation is used
  var scientific_exponent;

  // true if the number is zero
  var is_zero = false;

  // the most signifcant significand bits (50-46)
  var significand_msb;
  // temporary storage for significand decoding
  var significand128 = {parts: new Array(4)};
  // indexing variables
  var i;
  var j, k;

  // Output string
  var string = [];

  // Unpack index
  var index = 0;

  // Buffer reference
  var buffer = this.bytes;

  // Unpack the low 64bits into a long
  low = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
  midl = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

  // Unpack the high 64bits into a long
  midh = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
  high = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

  // Unpack index
  var index = 0;

  // Create the state of the decimal
  var dec = {
    low: new Long(low, midl),
    high: new Long(midh, high) };

  if(dec.high.lessThan(Long.ZERO)) {
    string.push('-');
  }

  // Decode combination field and exponent
  combination = (high >> 26) & COMBINATION_MASK;

  if((combination >> 3) == 3) {
    // Check for 'special' values
    if(combination == COMBINATION_INFINITY) {
      return string.join('') + "Infinity";
    } else if(combination == COMBINATION_NAN) {
      return "NaN";
    } else {
      biased_exponent = (high >> 15) & EXPONENT_MASK;
      significand_msb = 0x08 + ((high >> 14) & 0x01);
    }
  } else {
    significand_msb = (high >> 14) & 0x07;
    biased_exponent = (high >> 17) & EXPONENT_MASK;
  }

  exponent = biased_exponent - EXPONENT_BIAS;

  // Create string of significand digits

  // Convert the 114-bit binary number represented by
  // (significand_high, significand_low) to at most 34 decimal
  // digits through modulo and division.
  significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
  significand128.parts[1] = midh;
  significand128.parts[2] = midl;
  significand128.parts[3] = low;

  if(significand128.parts[0] == 0 && significand128.parts[1] == 0
    && significand128.parts[2] == 0 && significand128.parts[3] == 0) {
      is_zero = true;
  } else {
    for(var k = 3; k >= 0; k--) {
      var least_digits = 0;
      // Peform the divide
      var result = divideu128(significand128);
      significand128 = result.quotient;
      least_digits = result.rem.low_;

      // We now have the 9 least significant digits (in base 2).
      // Convert and output to string.
      if(!least_digits) continue;

      for(var j = 8; j >= 0; j--) {
        // significand[k * 9 + j] = Math.round(least_digits % 10);
        significand[k * 9 + j] = least_digits % 10;
        // least_digits = Math.round(least_digits / 10);
        least_digits = Math.floor(least_digits / 10);
      }
    }
  }

  // Output format options:
  // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
  // Regular    - ddd.ddd

  if(is_zero) {
    significand_digits = 1;
    significand[index] = 0;
  } else {
    significand_digits = 36;
    var i = 0;

    while(!significand[index]) {
      i++;
      significand_digits = significand_digits - 1;
      index = index + 1;
    }
  }

  scientific_exponent = significand_digits - 1 + exponent;

  // The scientific exponent checks are dictated by the string conversion
  // specification and are somewhat arbitrary cutoffs.
  //
  // We must check exponent > 0, because if this is the case, the number
  // has trailing zeros.  However, we *cannot* output these trailing zeros,
  // because doing so would change the precision of the value, and would
  // change stored data if the string converted number is round tripped.

  if(scientific_exponent >= 34 || scientific_exponent <= -7 ||
    exponent > 0) {
    // Scientific format
    string.push(significand[index++]);
    significand_digits = significand_digits - 1;

    if(significand_digits) {
      string.push('.');
    }

    for(var i = 0; i < significand_digits; i++) {
      string.push(significand[index++]);
    }

    // Exponent
    string.push('E');
    if(scientific_exponent > 0) {
      string.push('+' + scientific_exponent);
    } else {
      string.push(scientific_exponent);
    }
  } else {
    // Regular format with no decimal place
    if(exponent >= 0) {
      for(var i = 0; i < significand_digits; i++) {
        string.push(significand[index++]);
      }
    } else {
      var radix_position = significand_digits + exponent;

      // non-zero digits before radix
      if(radix_position > 0) {
        for(var i = 0; i < radix_position; i++) {
          string.push(significand[index++]);
        }
      } else {
        string.push('0');
      }

      string.push('.');
      // add leading zeros after radix
      while(radix_position++ < 0) {
        string.push('0');
      }

      for(var i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
        string.push(significand[index++]);
      }
    }
  }

  return string.join('');
}

Decimal128.prototype.toJSON = function() {
  return { "$numberDecimal": this.toString() };
}

module.exports = Decimal128;
module.exports.Decimal128 = Decimal128;

}).call(this,require("buffer").Buffer)
},{"./long":16,"buffer":29}],13:[function(require,module,exports){
/**
 * A class representation of the BSON Double type.
 *
 * @class
 * @param {number} value the number we want to represent as a double.
 * @return {Double}
 */
function Double(value) {
  if(!(this instanceof Double)) return new Double(value);

  this._bsontype = 'Double';
  this.value = value;
}

/**
 * Access the number value.
 *
 * @method
 * @return {number} returns the wrapped double number.
 */
Double.prototype.valueOf = function() {
  return this.value;
};

/**
 * @ignore
 */
Double.prototype.toJSON = function() {
  return this.value;
}

module.exports = Double;
module.exports.Double = Double;

},{}],14:[function(require,module,exports){
// Copyright (c) 2008, Fair Oaks Labs, Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
//  * Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 
//  * Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
// 
//  * Neither the name of Fair Oaks Labs, Inc. nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
//
// Modifications to writeIEEE754 to support negative zeroes made by Brian White

var readIEEE754 = function(buffer, offset, endian, mLen, nBytes) {
  var e, m,
      bBE = (endian === 'big'),
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = bBE ? 0 : (nBytes - 1),
      d = bBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

var writeIEEE754 = function(buffer, value, offset, endian, mLen, nBytes) {
  var e, m, c,
      bBE = (endian === 'big'),
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = bBE ? (nBytes-1) : 0,
      d = bBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e+eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

exports.readIEEE754 = readIEEE754;
exports.writeIEEE754 = writeIEEE754;
},{}],15:[function(require,module,exports){
var Int32 = function(value) {
  if(!(this instanceof Int32)) return new Int32(value);

  this._bsontype = 'Int32';
  this.value = value;
}

/**
 * Access the number value.
 *
 * @method
 * @return {number} returns the wrapped int32 number.
 */
Int32.prototype.valueOf = function() {
  return this.value;
};

/**
 * @ignore
 */
Int32.prototype.toJSON = function() {
  return this.value;
}

module.exports = Int32;
module.exports.Int32 = Int32;

},{}],16:[function(require,module,exports){
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Copyright 2009 Google Inc. All Rights Reserved

/**
 * Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "Long". This
 * implementation is derived from LongLib in GWT.
 *
 * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
 * values as *signed* integers.  See the from* functions below for more
 * convenient ways of constructing Longs.
 *
 * The internal representation of a Long is the two given signed, 32-bit values.
 * We use 32-bit pieces because these are the size of integers on which
 * Javascript performs bit-operations.  For operations like addition and
 * multiplication, we split each number into 16-bit pieces, which can easily be
 * multiplied within Javascript's floating-point representation without overflow
 * or change in sign.
 *
 * In the algorithms below, we frequently reduce the negative case to the
 * positive case by negating the input(s) and then post-processing the result.
 * Note that we must ALWAYS check specially whether those values are MIN_VALUE
 * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
 * a positive number, it overflows back into a negative).  Not handling this
 * case would often result in infinite recursion.
 *
 * @class
 * @param {number} low  the low (signed) 32 bits of the Long.
 * @param {number} high the high (signed) 32 bits of the Long.
 * @return {Long}
 */
function Long(low, high) {
  if(!(this instanceof Long)) return new Long(low, high);
  
  this._bsontype = 'Long';
  /**
   * @type {number}
   * @ignore
   */
  this.low_ = low | 0;  // force into 32 signed bits.

  /**
   * @type {number}
   * @ignore
   */
  this.high_ = high | 0;  // force into 32 signed bits.
};

/**
 * Return the int value.
 *
 * @method
 * @return {number} the value, assuming it is a 32-bit integer.
 */
Long.prototype.toInt = function() {
  return this.low_;
};

/**
 * Return the Number value.
 *
 * @method
 * @return {number} the closest floating-point representation to this value.
 */
Long.prototype.toNumber = function() {
  return this.high_ * Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
};

/**
 * Return the JSON value.
 *
 * @method
 * @return {string} the JSON representation.
 */
Long.prototype.toJSON = function() {
  return this.toString();
}

/**
 * Return the String value.
 *
 * @method
 * @param {number} [opt_radix] the radix in which the text should be written.
 * @return {string} the textual representation of this value.
 */
Long.prototype.toString = function(opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (this.isZero()) {
    return '0';
  }

  if (this.isNegative()) {
    if (this.equals(Long.MIN_VALUE)) {
      // We need to change the Long value before it can be negated, so we remove
      // the bottom-most digit in this base and then recurse to do the rest.
      var radixLong = Long.fromNumber(radix);
      var div = this.div(radixLong);
      var rem = div.multiply(radixLong).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }

  // Do several (6) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Long.fromNumber(Math.pow(radix, 6));

  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
    var digits = intval.toString(radix);

    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
};

/**
 * Return the high 32-bits value.
 *
 * @method
 * @return {number} the high 32-bits as a signed value.
 */
Long.prototype.getHighBits = function() {
  return this.high_;
};

/**
 * Return the low 32-bits value.
 *
 * @method
 * @return {number} the low 32-bits as a signed value.
 */
Long.prototype.getLowBits = function() {
  return this.low_;
};

/**
 * Return the low unsigned 32-bits value.
 *
 * @method
 * @return {number} the low 32-bits as an unsigned value.
 */
Long.prototype.getLowBitsUnsigned = function() {
  return (this.low_ >= 0) ?
      this.low_ : Long.TWO_PWR_32_DBL_ + this.low_;
};

/**
 * Returns the number of bits needed to represent the absolute value of this Long.
 *
 * @method
 * @return {number} Returns the number of bits needed to represent the absolute value of this Long.
 */
Long.prototype.getNumBitsAbs = function() {
  if (this.isNegative()) {
    if (this.equals(Long.MIN_VALUE)) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & (1 << bit)) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
};

/**
 * Return whether this value is zero.
 *
 * @method
 * @return {boolean} whether this value is zero.
 */
Long.prototype.isZero = function() {
  return this.high_ == 0 && this.low_ == 0;
};

/**
 * Return whether this value is negative.
 *
 * @method
 * @return {boolean} whether this value is negative.
 */
Long.prototype.isNegative = function() {
  return this.high_ < 0;
};

/**
 * Return whether this value is odd.
 *
 * @method
 * @return {boolean} whether this value is odd.
 */
Long.prototype.isOdd = function() {
  return (this.low_ & 1) == 1;
};

/**
 * Return whether this Long equals the other
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long equals the other
 */
Long.prototype.equals = function(other) {
  return (this.high_ == other.high_) && (this.low_ == other.low_);
};

/**
 * Return whether this Long does not equal the other.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long does not equal the other.
 */
Long.prototype.notEquals = function(other) {
  return (this.high_ != other.high_) || (this.low_ != other.low_);
};

/**
 * Return whether this Long is less than the other.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long is less than the other.
 */
Long.prototype.lessThan = function(other) {
  return this.compare(other) < 0;
};

/**
 * Return whether this Long is less than or equal to the other.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long is less than or equal to the other.
 */
Long.prototype.lessThanOrEqual = function(other) {
  return this.compare(other) <= 0;
};

/**
 * Return whether this Long is greater than the other.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long is greater than the other.
 */
Long.prototype.greaterThan = function(other) {
  return this.compare(other) > 0;
};

/**
 * Return whether this Long is greater than or equal to the other.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} whether this Long is greater than or equal to the other.
 */
Long.prototype.greaterThanOrEqual = function(other) {
  return this.compare(other) >= 0;
};

/**
 * Compares this Long with the given one.
 *
 * @method
 * @param {Long} other Long to compare against.
 * @return {boolean} 0 if they are the same, 1 if the this is greater, and -1 if the given one is greater.
 */
Long.prototype.compare = function(other) {
  if (this.equals(other)) {
    return 0;
  }

  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }

  // at this point, the signs are the same, so subtraction will not overflow
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
};

/**
 * The negation of this value.
 *
 * @method
 * @return {Long} the negation of this value.
 */
Long.prototype.negate = function() {
  if (this.equals(Long.MIN_VALUE)) {
    return Long.MIN_VALUE;
  } else {
    return this.not().add(Long.ONE);
  }
};

/**
 * Returns the sum of this and the given Long.
 *
 * @method
 * @param {Long} other Long to add to this one.
 * @return {Long} the sum of this and the given Long.
 */
Long.prototype.add = function(other) {
  // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};

/**
 * Returns the difference of this and the given Long.
 *
 * @method
 * @param {Long} other Long to subtract from this.
 * @return {Long} the difference of this and the given Long.
 */
Long.prototype.subtract = function(other) {
  return this.add(other.negate());
};

/**
 * Returns the product of this and the given Long.
 *
 * @method
 * @param {Long} other Long to multiply with this.
 * @return {Long} the product of this and the other.
 */
Long.prototype.multiply = function(other) {
  if (this.isZero()) {
    return Long.ZERO;
  } else if (other.isZero()) {
    return Long.ZERO;
  }

  if (this.equals(Long.MIN_VALUE)) {
    return other.isOdd() ? Long.MIN_VALUE : Long.ZERO;
  } else if (other.equals(Long.MIN_VALUE)) {
    return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }

  // If both Longs are small, use float multiplication
  if (this.lessThan(Long.TWO_PWR_24_) &&
      other.lessThan(Long.TWO_PWR_24_)) {
    return Long.fromNumber(this.toNumber() * other.toNumber());
  }

  // Divide each Long into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};

/**
 * Returns this Long divided by the given one.
 *
 * @method
 * @param {Long} other Long by which to divide.
 * @return {Long} this Long divided by the given one.
 */
Long.prototype.div = function(other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return Long.ZERO;
  }

  if (this.equals(Long.MIN_VALUE)) {
    if (other.equals(Long.ONE) ||
        other.equals(Long.NEG_ONE)) {
      return Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
    } else if (other.equals(Long.MIN_VALUE)) {
      return Long.ONE;
    } else {
      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(Long.ZERO)) {
        return other.isNegative() ? Long.ONE : Long.NEG_ONE;
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(Long.MIN_VALUE)) {
    return Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }

  // Repeat the following until the remainder is less than other:  find a
  // floating-point that approximates remainder / other *from below*, add this
  // into the result, and subtract it from the remainder.  It is critical that
  // the approximate value is less than or equal to the real value so that the
  // remainder never becomes negative.
  var res = Long.ZERO;
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    // Approximate the result of division. This may be a little greater or
    // smaller than the actual value.
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

    // We will tweak the approximate result by changing it in the 48-th digit or
    // the smallest non-fractional digit, whichever is larger.
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

    // Decrease the approximation until it is smaller than the remainder.  Note
    // that if it is too large, the product overflows and is negative.
    var approxRes = Long.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = Long.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }

    // We know the answer can't be zero... and actually, zero would cause
    // infinite recursion since we would make no progress.
    if (approxRes.isZero()) {
      approxRes = Long.ONE;
    }

    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
};

/**
 * Returns this Long modulo the given one.
 *
 * @method
 * @param {Long} other Long by which to mod.
 * @return {Long} this Long modulo the given one.
 */
Long.prototype.modulo = function(other) {
  return this.subtract(this.div(other).multiply(other));
};

/**
 * The bitwise-NOT of this value.
 *
 * @method
 * @return {Long} the bitwise-NOT of this value.
 */
Long.prototype.not = function() {
  return Long.fromBits(~this.low_, ~this.high_);
};

/**
 * Returns the bitwise-AND of this Long and the given one.
 *
 * @method
 * @param {Long} other the Long with which to AND.
 * @return {Long} the bitwise-AND of this and the other.
 */
Long.prototype.and = function(other) {
  return Long.fromBits(this.low_ & other.low_, this.high_ & other.high_);
};

/**
 * Returns the bitwise-OR of this Long and the given one.
 *
 * @method
 * @param {Long} other the Long with which to OR.
 * @return {Long} the bitwise-OR of this and the other.
 */
Long.prototype.or = function(other) {
  return Long.fromBits(this.low_ | other.low_, this.high_ | other.high_);
};

/**
 * Returns the bitwise-XOR of this Long and the given one.
 *
 * @method
 * @param {Long} other the Long with which to XOR.
 * @return {Long} the bitwise-XOR of this and the other.
 */
Long.prototype.xor = function(other) {
  return Long.fromBits(this.low_ ^ other.low_, this.high_ ^ other.high_);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Long} this shifted to the left by the given amount.
 */
Long.prototype.shiftLeft = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return Long.fromBits(
                 low << numBits,
                 (high << numBits) | (low >>> (32 - numBits)));
    } else {
      return Long.fromBits(0, low << (numBits - 32));
    }
  }
};

/**
 * Returns this Long with bits shifted to the right by the given amount.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Long} this shifted to the right by the given amount.
 */
Long.prototype.shiftRight = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Long.fromBits(
                 (low >>> numBits) | (high << (32 - numBits)),
                 high >> numBits);
    } else {
      return Long.fromBits(
                 high >> (numBits - 32),
                 high >= 0 ? 0 : -1);
    }
  }
};

/**
 * Returns this Long with bits shifted to the right by the given amount, with the new top bits matching the current sign bit.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Long} this shifted to the right by the given amount, with zeros placed into the new leading bits.
 */
Long.prototype.shiftRightUnsigned = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Long.fromBits(
                 (low >>> numBits) | (high << (32 - numBits)),
                 high >>> numBits);
    } else if (numBits == 32) {
      return Long.fromBits(high, 0);
    } else {
      return Long.fromBits(high >>> (numBits - 32), 0);
    }
  }
};

/**
 * Returns a Long representing the given (32-bit) integer value.
 *
 * @method
 * @param {number} value the 32-bit integer in question.
 * @return {Long} the corresponding Long value.
 */
Long.fromInt = function(value) {
  if (-128 <= value && value < 128) {
    var cachedObj = Long.INT_CACHE_[value];
    if (cachedObj) {
      return cachedObj;
    }
  }

  var obj = new Long(value | 0, value < 0 ? -1 : 0);
  if (-128 <= value && value < 128) {
    Long.INT_CACHE_[value] = obj;
  }
  return obj;
};

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 *
 * @method
 * @param {number} value the number in question.
 * @return {Long} the corresponding Long value.
 */
Long.fromNumber = function(value) {
  if (isNaN(value) || !isFinite(value)) {
    return Long.ZERO;
  } else if (value <= -Long.TWO_PWR_63_DBL_) {
    return Long.MIN_VALUE;
  } else if (value + 1 >= Long.TWO_PWR_63_DBL_) {
    return Long.MAX_VALUE;
  } else if (value < 0) {
    return Long.fromNumber(-value).negate();
  } else {
    return new Long(
               (value % Long.TWO_PWR_32_DBL_) | 0,
               (value / Long.TWO_PWR_32_DBL_) | 0);
  }
};

/**
 * Returns a Long representing the 64-bit integer that comes by concatenating the given high and low bits. Each is assumed to use 32 bits.
 *
 * @method
 * @param {number} lowBits the low 32-bits.
 * @param {number} highBits the high 32-bits.
 * @return {Long} the corresponding Long value.
 */
Long.fromBits = function(lowBits, highBits) {
  return new Long(lowBits, highBits);
};

/**
 * Returns a Long representation of the given string, written using the given radix.
 *
 * @method
 * @param {string} str the textual representation of the Long.
 * @param {number} opt_radix the radix in which the text is written.
 * @return {Long} the corresponding Long value.
 */
Long.fromString = function(str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }

  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (str.charAt(0) == '-') {
    return Long.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }

  // Do several (8) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Long.fromNumber(Math.pow(radix, 8));

  var result = Long.ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = Long.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(Long.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(Long.fromNumber(value));
    }
  }
  return result;
};

// NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
// from* methods on which they depend.


/**
 * A cache of the Long representations of small integer values.
 * @type {Object}
 * @ignore
 */
Long.INT_CACHE_ = {};

// NOTE: the compiler should inline these constant values below and then remove
// these variables, so there should be no runtime penalty for these.

/**
 * Number used repeated below in calculations.  This must appear before the
 * first call to any from* function below.
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_16_DBL_ = 1 << 16;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_24_DBL_ = 1 << 24;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_32_DBL_ = Long.TWO_PWR_16_DBL_ * Long.TWO_PWR_16_DBL_;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_31_DBL_ = Long.TWO_PWR_32_DBL_ / 2;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_48_DBL_ = Long.TWO_PWR_32_DBL_ * Long.TWO_PWR_16_DBL_;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_64_DBL_ = Long.TWO_PWR_32_DBL_ * Long.TWO_PWR_32_DBL_;

/**
 * @type {number}
 * @ignore
 */
Long.TWO_PWR_63_DBL_ = Long.TWO_PWR_64_DBL_ / 2;

/** @type {Long} */
Long.ZERO = Long.fromInt(0);

/** @type {Long} */
Long.ONE = Long.fromInt(1);

/** @type {Long} */
Long.NEG_ONE = Long.fromInt(-1);

/** @type {Long} */
Long.MAX_VALUE =
    Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);

/** @type {Long} */
Long.MIN_VALUE = Long.fromBits(0, 0x80000000 | 0);

/**
 * @type {Long}
 * @ignore
 */
Long.TWO_PWR_24_ = Long.fromInt(1 << 24);

/**
 * Expose.
 */
module.exports = Long;
module.exports.Long = Long;
},{}],17:[function(require,module,exports){
(function (global){
"use strict"

// We have an ES6 Map available, return the native instance
if(typeof global.Map !== 'undefined') {
  module.exports = global.Map;
  module.exports.Map = global.Map;
} else {
  // We will return a polyfill
  var Map = function(array) {
    this._keys = [];
    this._values = {};

    for(var i = 0; i < array.length; i++) {
      if(array[i] == null) continue;  // skip null and undefined
      var entry = array[i];
      var key = entry[0];
      var value = entry[1];
      // Add the key to the list of keys in order
      this._keys.push(key);
      // Add the key and value to the values dictionary with a point
      // to the location in the ordered keys list
      this._values[key] = {v: value, i: this._keys.length - 1};
    }
  }

  Map.prototype.clear = function() {
    this._keys = [];
    this._values = {};
  }

  Map.prototype.delete = function(key) {
    var value = this._values[key];
    if(value == null) return false;
    // Delete entry
    delete this._values[key];
    // Remove the key from the ordered keys list
    this._keys.splice(value.i, 1);
    return true;
  }

  Map.prototype.entries = function() {
    var self = this;
    var index = 0;

    return {
      next: function() {
        var key = self._keys[index++];
        return {
          value: key !== undefined ? [key, self._values[key].v] : undefined,
          done: key !== undefined ? false : true
        }
      }
    };
  }

  Map.prototype.forEach = function(callback, self) {
    self = self || this;

    for(var i = 0; i < this._keys.length; i++) {
      var key = this._keys[i];
      // Call the forEach callback
      callback.call(self, this._values[key].v, key, self);
    }
  }

  Map.prototype.get = function(key) {
    return this._values[key] ? this._values[key].v : undefined;
  }

  Map.prototype.has = function(key) {
    return this._values[key] != null;
  }

  Map.prototype.keys = function(key) {
    var self = this;
    var index = 0;

    return {
      next: function() {
        var key = self._keys[index++];
        return {
          value: key !== undefined ? key : undefined,
          done: key !== undefined ? false : true
        }
      }
    };
  }

  Map.prototype.set = function(key, value) {
    if(this._values[key]) {
      this._values[key].v = value;
      return this;
    }

    // Add the key to the list of keys in order
    this._keys.push(key);
    // Add the key and value to the values dictionary with a point
    // to the location in the ordered keys list
    this._values[key] = {v: value, i: this._keys.length - 1};
    return this;
  }

  Map.prototype.values = function(key, value) {
    var self = this;
    var index = 0;

    return {
      next: function() {
        var key = self._keys[index++];
        return {
          value: key !== undefined ? self._values[key].v : undefined,
          done: key !== undefined ? false : true
        }
      }
    };
  }

  // Last ismaster
  Object.defineProperty(Map.prototype, 'size', {
    enumerable:true,
    get: function() { return this._keys.length; }
  });

  module.exports = Map;
  module.exports.Map = Map;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
/**
 * A class representation of the BSON MaxKey type.
 *
 * @class
 * @return {MaxKey} A MaxKey instance
 */
function MaxKey() {
  if(!(this instanceof MaxKey)) return new MaxKey();
  
  this._bsontype = 'MaxKey';  
}

module.exports = MaxKey;
module.exports.MaxKey = MaxKey;
},{}],19:[function(require,module,exports){
/**
 * A class representation of the BSON MinKey type.
 *
 * @class
 * @return {MinKey} A MinKey instance
 */
function MinKey() {
  if(!(this instanceof MinKey)) return new MinKey();
  
  this._bsontype = 'MinKey';
}

module.exports = MinKey;
module.exports.MinKey = MinKey;
},{}],20:[function(require,module,exports){
(function (process,Buffer){
/**
 * Machine id.
 *
 * Create a random 3-byte value (i.e. unique for this
 * process). Other drivers use a md5 of the machine id here, but
 * that would mean an asyc call to gethostname, so we don't bother.
 * @ignore
 */
var MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);

// Regular expression that checks for hex value
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
var hasBufferType = false;

// Check if buffer exists
try {
  if(Buffer && Buffer.from) hasBufferType = true;
} catch(err) {};

/**
* Create a new ObjectID instance
*
* @class
* @param {(string|number)} id Can be a 24 byte hex string, 12 byte binary string or a Number.
* @property {number} generationTime The generation time of this ObjectId instance
* @return {ObjectID} instance of ObjectID.
*/
var ObjectID = function ObjectID(id) {
  // Duck-typing to support ObjectId from different npm packages
  if(id instanceof ObjectID) return id;
  if(!(this instanceof ObjectID)) return new ObjectID(id);

  this._bsontype = 'ObjectID';

  // The most common usecase (blank id, new objectId instance)
  if(id == null || typeof id == 'number') {
    // Generate a new id
    this.id = this.generate(id);
    // If we are caching the hex string
    if(ObjectID.cacheHexString) this.__id = this.toString('hex');
    // Return the object
    return;
  }

  // Check if the passed in id is valid
  var valid = ObjectID.isValid(id);

  // Throw an error if it's not a valid setup
  if(!valid && id != null){
    throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
  } else if(valid && typeof id == 'string' && id.length == 24 && hasBufferType) {
    return new ObjectID(new Buffer(id, 'hex'));
  } else if(valid && typeof id == 'string' && id.length == 24) {
    return ObjectID.createFromHexString(id);
  } else if(id != null && id.length === 12) {
    // assume 12 byte string
    this.id = id;
  } else if(id != null && id.toHexString) {
    // Duck-typing to support ObjectId from different npm packages
    return id;
  } else {
    throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
  }

  if(ObjectID.cacheHexString) this.__id = this.toString('hex');
};

// Allow usage of ObjectId as well as ObjectID
var ObjectId = ObjectID;

// Precomputed hex table enables speedy hex string conversion
var hexTable = [];
for (var i = 0; i < 256; i++) {
  hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}

/**
* Return the ObjectID id as a 24 byte hex string representation
*
* @method
* @return {string} return the 24 byte hex string representation.
*/
ObjectID.prototype.toHexString = function() {
  if(ObjectID.cacheHexString && this.__id) return this.__id;

  var hexString = '';
  if(!this.id || !this.id.length) {
    throw new Error('invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' + JSON.stringify(this.id) + ']');
  }

  if(this.id instanceof _Buffer) {
    hexString = convertToHex(this.id);
    if(ObjectID.cacheHexString) this.__id = hexString;
    return hexString;
  }

  for (var i = 0; i < this.id.length; i++) {
    hexString += hexTable[this.id.charCodeAt(i)];
  }

  if(ObjectID.cacheHexString) this.__id = hexString;
  return hexString;
};

/**
* Update the ObjectID index used in generating new ObjectID's on the driver
*
* @method
* @return {number} returns next index value.
* @ignore
*/
ObjectID.prototype.get_inc = function() {
  return ObjectID.index = (ObjectID.index + 1) % 0xFFFFFF;
};

/**
* Update the ObjectID index used in generating new ObjectID's on the driver
*
* @method
* @return {number} returns next index value.
* @ignore
*/
ObjectID.prototype.getInc = function() {
  return this.get_inc();
};

/**
* Generate a 12 byte id buffer used in ObjectID's
*
* @method
* @param {number} [time] optional parameter allowing to pass in a second based timestamp.
* @return {Buffer} return the 12 byte id buffer string.
*/
ObjectID.prototype.generate = function(time) {
  if ('number' != typeof time) {
    time = ~~(Date.now()/1000);
  }

  // Use pid
  var pid = (typeof process === 'undefined' ? Math.floor(Math.random() * 100000) : process.pid) % 0xFFFF;
  var inc = this.get_inc();
  // Buffer used
  var buffer = new Buffer(12);
  // Encode time
  buffer[3] = time & 0xff;
  buffer[2] = (time >> 8) & 0xff;
  buffer[1] = (time >> 16) & 0xff;
  buffer[0] = (time >> 24) & 0xff;
  // Encode machine
  buffer[6] = MACHINE_ID & 0xff;
  buffer[5] = (MACHINE_ID >> 8) & 0xff;
  buffer[4] = (MACHINE_ID >> 16) & 0xff;
  // Encode pid
  buffer[8] = pid & 0xff;
  buffer[7] = (pid >> 8) & 0xff;
  // Encode index
  buffer[11] = inc & 0xff;
  buffer[10] = (inc >> 8) & 0xff;
  buffer[9] = (inc >> 16) & 0xff;
  // Return the buffer
  return buffer;
};

/**
* Converts the id into a 24 byte hex string for printing
*
* @param {String} format The Buffer toString format parameter.
* @return {String} return the 24 byte hex string representation.
* @ignore
*/
ObjectID.prototype.toString = function(format) {
  // Is the id a buffer then use the buffer toString method to return the format
  if(this.id && this.id.copy) {
    return this.id.toString(typeof format === 'string' ? format : 'hex');
  }

  // if(this.buffer )
  return this.toHexString();
};

/**
* Converts to a string representation of this Id.
*
* @return {String} return the 24 byte hex string representation.
* @ignore
*/
ObjectID.prototype.inspect = ObjectID.prototype.toString;

/**
* Converts to its JSON representation.
*
* @return {String} return the 24 byte hex string representation.
* @ignore
*/
ObjectID.prototype.toJSON = function() {
  return this.toHexString();
};

/**
* Compares the equality of this ObjectID with `otherID`.
*
* @method
* @param {object} otherID ObjectID instance to compare against.
* @return {boolean} the result of comparing two ObjectID's
*/
ObjectID.prototype.equals = function equals (otherId) {
  var id;

  if(otherId instanceof ObjectID) {
    return this.toString() == otherId.toString();
  } else if(typeof otherId == 'string' && ObjectID.isValid(otherId) && otherId.length == 12 && this.id instanceof _Buffer) {
    return otherId === this.id.toString('binary');
  } else if(typeof otherId == 'string' && ObjectID.isValid(otherId) && otherId.length == 24) {
    return otherId.toLowerCase() === this.toHexString();
  } else if(typeof otherId == 'string' && ObjectID.isValid(otherId) && otherId.length == 12) {
    return otherId === this.id;
  } else if(otherId != null && (otherId instanceof ObjectID || otherId.toHexString)) {
    return otherId.toHexString() === this.toHexString();
  } else {
    return false;
  }
}

/**
* Returns the generation date (accurate up to the second) that this ID was generated.
*
* @method
* @return {date} the generation date
*/
ObjectID.prototype.getTimestamp = function() {
  var timestamp = new Date();
  var time = this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24;
  timestamp.setTime(Math.floor(time) * 1000);
  return timestamp;
}

/**
* @ignore
*/
ObjectID.index = ~~(Math.random() * 0xFFFFFF);

/**
* @ignore
*/
ObjectID.createPk = function createPk () {
  return new ObjectID();
};

/**
* Creates an ObjectID from a second based number, with the rest of the ObjectID zeroed out. Used for comparisons or sorting the ObjectID.
*
* @method
* @param {number} time an integer number representing a number of seconds.
* @return {ObjectID} return the created ObjectID
*/
ObjectID.createFromTime = function createFromTime (time) {
  var buffer = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // Encode time into first 4 bytes
  buffer[3] = time & 0xff;
  buffer[2] = (time >> 8) & 0xff;
  buffer[1] = (time >> 16) & 0xff;
  buffer[0] = (time >> 24) & 0xff;
  // Return the new objectId
  return new ObjectID(buffer);
};

// Lookup tables
var encodeLookup = '0123456789abcdef'.split('')
var decodeLookup = []
var i = 0
while (i < 10) decodeLookup[0x30 + i] = i++
while (i < 16) decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++

var _Buffer = Buffer;
var convertToHex = function(bytes) {
  return bytes.toString('hex');
}

/**
* Creates an ObjectID from a hex string representation of an ObjectID.
*
* @method
* @param {string} hexString create a ObjectID from a passed in 24 byte hexstring.
* @return {ObjectID} return the created ObjectID
*/
ObjectID.createFromHexString = function createFromHexString (string) {
  // Throw an error if it's not a valid setup
  if(typeof string === 'undefined' || string != null && string.length != 24) {
    throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
  }

  // Use Buffer.from method if available
  if(hasBufferType) return new ObjectID(new Buffer(string, 'hex'));

  // Calculate lengths
  var array = new _Buffer(12);
  var n = 0;
  var i = 0;

  while (i < 24) {
    array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)]
  }

  return new ObjectID(array);
};

/**
* Checks if a value is a valid bson ObjectId
*
* @method
* @return {boolean} return true if the value is a valid bson ObjectId, return false otherwise.
*/
ObjectID.isValid = function isValid(id) {
  if(id == null) return false;

  if(typeof id == 'number') {
    return true;
  }

  if(typeof id == 'string') {
    return id.length == 12 || (id.length == 24 && checkForHexRegExp.test(id));
  }

  if(id instanceof ObjectID) {
    return true;
  }

  if(id instanceof _Buffer) {
    return true;
  }

  // Duck-Typing detection of ObjectId like objects
  if(id.toHexString) {
    return id.id.length == 12 || (id.id.length == 24 && checkForHexRegExp.test(id.id));
  }

  return false;
};

/**
* @ignore
*/
Object.defineProperty(ObjectID.prototype, "generationTime", {
   enumerable: true
 , get: function () {
     return this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24;
   }
 , set: function (value) {
     // Encode time into first 4 bytes
     this.id[3] = value & 0xff;
     this.id[2] = (value >> 8) & 0xff;
     this.id[1] = (value >> 16) & 0xff;
     this.id[0] = (value >> 24) & 0xff;
   }
});

/**
 * Expose.
 */
module.exports = ObjectID;
module.exports.ObjectID = ObjectID;
module.exports.ObjectId = ObjectID;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":32,"buffer":29}],21:[function(require,module,exports){
(function (Buffer){
"use strict"

var writeIEEE754 = require('../float_parser').writeIEEE754
	, readIEEE754 = require('../float_parser').readIEEE754
	, Long = require('../long').Long
  , Double = require('../double').Double
  , Timestamp = require('../timestamp').Timestamp
  , ObjectID = require('../objectid').ObjectID
  , Symbol = require('../symbol').Symbol
  , BSONRegExp = require('../regexp').BSONRegExp
  , Code = require('../code').Code
	, Decimal128 = require('../decimal128')
  , MinKey = require('../min_key').MinKey
  , MaxKey = require('../max_key').MaxKey
  , DBRef = require('../db_ref').DBRef
  , Binary = require('../binary').Binary;

// To ensure that 0.4 of node works correctly
var isDate = function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

var calculateObjectSize = function calculateObjectSize(object, serializeFunctions, ignoreUndefined) {
  var totalLength = (4 + 1);

  if(Array.isArray(object)) {
    for(var i = 0; i < object.length; i++) {
      totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined)
    }
  } else {
		// If we have toBSON defined, override the current object
		if(object.toBSON) {
			object = object.toBSON();
		}

		// Calculate size
    for(var key in object) {
      totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined)
    }
  }

  return totalLength;
}

/**
 * @ignore
 * @api private
 */
function calculateElement(name, value, serializeFunctions, isArray, ignoreUndefined) {
	// If we have toBSON defined, override the current object
  if(value && value.toBSON){
    value = value.toBSON();
  }

  switch(typeof value) {
    case 'string':
      return 1 + Buffer.byteLength(name, 'utf8') + 1 + 4 + Buffer.byteLength(value, 'utf8') + 1;
    case 'number':
      if(Math.floor(value) === value && value >= BSON.JS_INT_MIN && value <= BSON.JS_INT_MAX) {
        if(value >= BSON.BSON_INT32_MIN && value <= BSON.BSON_INT32_MAX) { // 32 bit
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (4 + 1);
        } else {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (8 + 1);
        }
      } else {  // 64 bit
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (8 + 1);
      }
    case 'undefined':
      if(isArray || !ignoreUndefined) return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (1);
      return 0;
    case 'boolean':
      return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (1 + 1);
    case 'object':
      if(value == null || value instanceof MinKey || value instanceof MaxKey || value['_bsontype'] == 'MinKey' || value['_bsontype'] == 'MaxKey') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (1);
      } else if(value instanceof ObjectID || value['_bsontype'] == 'ObjectID') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (12 + 1);
      } else if(value instanceof Date || isDate(value)) {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (8 + 1);
      } else if(typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (1 + 4 + 1) + value.length;
      } else if(value instanceof Long || value instanceof Double || value instanceof Timestamp
          || value['_bsontype'] == 'Long' || value['_bsontype'] == 'Double' || value['_bsontype'] == 'Timestamp') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (8 + 1);
			} else if(value instanceof Decimal128 || value['_bsontype'] == 'Decimal128') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (16 + 1);
      } else if(value instanceof Code || value['_bsontype'] == 'Code') {
        // Calculate size depending on the availability of a scope
        if(value.scope != null && Object.keys(value.scope).length > 0) {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + 4 + 4 + Buffer.byteLength(value.code.toString(), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
        } else {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + 4 + Buffer.byteLength(value.code.toString(), 'utf8') + 1;
        }
      } else if(value instanceof Binary || value['_bsontype'] == 'Binary') {
        // Check what kind of subtype we have
        if(value.sub_type == Binary.SUBTYPE_BYTE_ARRAY) {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (value.position + 1 + 4 + 1 + 4);
        } else {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + (value.position + 1 + 4 + 1);
        }
      } else if(value instanceof Symbol || value['_bsontype'] == 'Symbol') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + Buffer.byteLength(value.value, 'utf8') + 4 + 1 + 1;
      } else if(value instanceof DBRef || value['_bsontype'] == 'DBRef') {
        // Set up correct object for serialization
        var ordered_values = {
            '$ref': value.namespace
          , '$id' : value.oid
        };

        // Add db reference if it exists
        if(null != value.db) {
          ordered_values['$db'] = value.db;
        }

        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + calculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined);
      } else if(value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]') {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + Buffer.byteLength(value.source, 'utf8') + 1
            + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1
      } else if(value instanceof BSONRegExp || value['_bsontype'] == 'BSONRegExp') {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + Buffer.byteLength(value.pattern, 'utf8') + 1
            + Buffer.byteLength(value.options, 'utf8') + 1
      } else {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + calculateObjectSize(value, serializeFunctions, ignoreUndefined) + 1;
      }
    case 'function':
      // WTF for 0.4.X where typeof /someregexp/ === 'function'
      if(value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]' || String.call(value) == '[object RegExp]') {
        return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + Buffer.byteLength(value.source, 'utf8') + 1
          + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1
      } else {
        if(serializeFunctions && value.scope != null && Object.keys(value.scope).length > 0) {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + 4 + 4 + Buffer.byteLength(value.toString(), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
        } else if(serializeFunctions) {
          return (name != null ? (Buffer.byteLength(name, 'utf8') + 1) : 0) + 1 + 4 + Buffer.byteLength(value.toString(), 'utf8') + 1;
        }
      }
  }

  return 0;
}

var BSON = {};

// BSON MAX VALUES
BSON.BSON_INT32_MAX = 0x7FFFFFFF;
BSON.BSON_INT32_MIN = -0x80000000;

// JS MAX PRECISE VALUES
BSON.JS_INT_MAX = 0x20000000000000;  // Any integer up to 2^53 can be precisely represented by a double.
BSON.JS_INT_MIN = -0x20000000000000;  // Any integer down to -2^53 can be precisely represented by a double.

module.exports = calculateObjectSize;

}).call(this,require("buffer").Buffer)
},{"../binary":8,"../code":10,"../db_ref":11,"../decimal128":12,"../double":13,"../float_parser":14,"../long":16,"../max_key":18,"../min_key":19,"../objectid":20,"../regexp":24,"../symbol":25,"../timestamp":26,"buffer":29}],22:[function(require,module,exports){
(function (Buffer){
"use strict"

var readIEEE754 = require('../float_parser').readIEEE754,
	f = require('util').format,
	Long = require('../long').Long,
  Double = require('../double').Double,
  Timestamp = require('../timestamp').Timestamp,
  ObjectID = require('../objectid').ObjectID,
  Symbol = require('../symbol').Symbol,
  Code = require('../code').Code,
  MinKey = require('../min_key').MinKey,
  MaxKey = require('../max_key').MaxKey,
	Decimal128 = require('../decimal128'),
	Int32 = require('../int_32'),
  DBRef = require('../db_ref').DBRef,
  BSONRegExp = require('../regexp').BSONRegExp,
  Binary = require('../binary').Binary;

var deserialize = function(buffer, options, isArray) {
	options = options == null ? {} : options;
	var index = options && options.index ? options.index : 0;
	// Read the document size
  var size = buffer[index] | buffer[index+1] << 8 | buffer[index+2] << 16 | buffer[index+3] << 24;

	// Ensure buffer is valid size
  if(size < 5 || buffer.length < size || (size + index) > buffer.length) {
		throw new Error("corrupt bson message");
	}

	// Illegal end value
	if(buffer[index + size - 1] != 0) {
		throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
	}

	// Start deserializtion
	return deserializeObject(buffer, index, options, isArray);
}

var deserializeObject = function(buffer, index, options, isArray) {
	var evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
  var cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
  var cacheFunctionsCrc32 = options['cacheFunctionsCrc32'] == null ? false : options['cacheFunctionsCrc32'];
	var fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw'];

	// Return raw bson buffer instead of parsing it
	var raw = options['raw'] == null ? false : options['raw'];

	// Return BSONRegExp objects instead of native regular expressions
  var bsonRegExp = typeof options['bsonRegExp'] == 'boolean' ? options['bsonRegExp'] : false;

	// Controls the promotion of values vs wrapper classes
	var promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];
	var promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
	var promoteValues = options['promoteValues'] == null ? true : options['promoteValues'];

	// Set the start index
	var startIndex = index;

  // Validate that we have at least 4 bytes of buffer
  if(buffer.length < 5) throw new Error("corrupt bson message < 5 bytes long");

	// Read the document size
  var size = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

	// Ensure buffer is valid size
  if(size < 5 || size > buffer.length) throw new Error("corrupt bson message");

  // Create holding object
  var object = isArray ? [] : {};
	// Used for arrays to skip having to perform utf8 decoding
	var arrayIndex = 0;

  // While we have more left data left keep parsing
  while(true) {
    // Read the type
    var elementType = buffer[index++];
    // If we get a zero it's the last byte, exit
    if(elementType == 0) {
			break;
		}

		// Get the start search index
		var i = index;
		// Locate the end of the c string
		while(buffer[i] !== 0x00 && i < buffer.length) {
			i++
		}

		// If are at the end of the buffer there is a problem with the document
		if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
		var name = isArray ? arrayIndex++ : buffer.toString('utf8', index, i);

		index = i + 1;

		if(elementType == BSON.BSON_DATA_STRING) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      object[name] = buffer.toString('utf8', index, index + stringSize - 1);
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_OID) {
			var oid = new Buffer(12);
			buffer.copy(oid, 0, index, index + 12);
      object[name] = new ObjectID(oid);
      index = index + 12;
		} else if(elementType == BSON.BSON_DATA_INT && promoteValues == false) {
			object[name] = new Int32(buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24);
		} else if(elementType == BSON.BSON_DATA_INT) {
      object[name] = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
		} else if(elementType == BSON.BSON_DATA_NUMBER && promoteValues == false) {
			object[name] = new Double(buffer.readDoubleLE(index));
			index = index + 8;
		} else if(elementType == BSON.BSON_DATA_NUMBER) {
			object[name] = buffer.readDoubleLE(index);
      index = index + 8;
		} else if(elementType == BSON.BSON_DATA_DATE) {
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      object[name] = new Date(new Long(lowBits, highBits).toNumber());
		} else if(elementType == BSON.BSON_DATA_BOOLEAN) {
			if(buffer[index] != 0 && buffer[index] != 1) throw new Error('illegal boolean type value');
      object[name] = buffer[index++] == 1;
		} else if(elementType == BSON.BSON_DATA_OBJECT) {
			var _index = index;
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
			if(objectSize <= 0 || objectSize > (buffer.length - index)) throw new Error("bad embedded document length in bson");

			// We have a raw value
			if(raw) {
	      object[name] = buffer.slice(index, index + objectSize);
			} else {
	      object[name] = deserializeObject(buffer, _index, options, false);
			}

      index = index + objectSize;
		} else if(elementType == BSON.BSON_DATA_ARRAY) {
			var _index = index;
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
			var arrayOptions = options;

			// Stop index
			var stopIndex = index + objectSize;

			// All elements of array to be returned as raw bson
			if(fieldsAsRaw && fieldsAsRaw[name]) {
				arrayOptions = {};
				for(var n in options) arrayOptions[n] = options[n];
				arrayOptions['raw'] = true;
			}

      object[name] = deserializeObject(buffer, _index, arrayOptions, true);
      index = index + objectSize;

			if(buffer[index - 1] != 0) throw new Error('invalid array terminator byte');
			if(index != stopIndex) throw new Error('corrupted array bson');
		} else if(elementType == BSON.BSON_DATA_UNDEFINED) {
      object[name] = undefined;
		} else if(elementType == BSON.BSON_DATA_NULL) {
			object[name] = null;
		} else if(elementType == BSON.BSON_DATA_LONG) {
      // Unpack the low and high bits
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var long = new Long(lowBits, highBits);
      // Promote the long if possible
      if(promoteLongs && promoteValues == true) {
        object[name] = long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG) ? long.toNumber() : long;
      } else {
        object[name] = long;
      }
		} else if(elementType == BSON.BSON_DATA_DECIMAL128) {
			// Buffer to contain the decimal bytes
			var bytes = new Buffer(16);
			// Copy the next 16 bytes into the bytes buffer
			buffer.copy(bytes, 0, index, index + 16);
			// Update index
			index = index + 16;
			// Assign the new Decimal128 value
			var decimal128 = new Decimal128(bytes);
			// If we have an alternative mapper use that
			object[name] = decimal128.toObject ? decimal128.toObject() : decimal128;
		} else if(elementType == BSON.BSON_DATA_BINARY) {
      var binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			var totalBinarySize = binarySize;
      var subType = buffer[index++];

			// Did we have a negative binary size, throw
			if(binarySize < 0) throw new Error('Negative binary type element size found');

			// Is the length longer than the document
			if(binarySize > buffer.length) throw new Error('Binary type size larger than document size');

			// Decode as raw Buffer object if options specifies it
      if(buffer['slice'] != null) {
        // If we have subtype 2 skip the 4 bytes for the size
        if(subType == Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
					if(binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
					if(binarySize > (totalBinarySize - 4)) throw new Error('Binary type with subtype 0x02 contains to long binary size');
					if(binarySize < (totalBinarySize - 4)) throw new Error('Binary type with subtype 0x02 contains to short binary size');
        }

        if(promoteBuffers && promoteValues) {
          object[name] = buffer.slice(index, index + binarySize);
        } else {
          object[name] = new Binary(buffer.slice(index, index + binarySize), subType);
        }
      } else {
        var _buffer = typeof Uint8Array != 'undefined' ? new Uint8Array(new ArrayBuffer(binarySize)) : new Array(binarySize);
        // If we have subtype 2 skip the 4 bytes for the size
        if(subType == Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
					if(binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
					if(binarySize > (totalBinarySize - 4)) throw new Error('Binary type with subtype 0x02 contains to long binary size');
					if(binarySize < (totalBinarySize - 4)) throw new Error('Binary type with subtype 0x02 contains to short binary size');
        }

        // Copy the data
        for(var i = 0; i < binarySize; i++) {
          _buffer[i] = buffer[index + i];
        }

        if(promoteBuffers && promoteValues) {
          object[name] = _buffer;
        } else {
          object[name] = new Binary(_buffer, subType);
        }
      }

      // Update the index
      index = index + binarySize;
		} else if(elementType == BSON.BSON_DATA_REGEXP && bsonRegExp == false) {
			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var source = buffer.toString('utf8', index, i);
      // Create the regexp
			index = i + 1;

			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var regExpOptions = buffer.toString('utf8', index, i);
			index = i + 1;

      // For each option add the corresponding one for javascript
      var optionsArray = new Array(regExpOptions.length);

      // Parse options
      for(var i = 0; i < regExpOptions.length; i++) {
        switch(regExpOptions[i]) {
          case 'm':
            optionsArray[i] = 'm';
            break;
          case 's':
            optionsArray[i] = 'g';
            break;
          case 'i':
            optionsArray[i] = 'i';
            break;
        }
      }

      object[name] = new RegExp(source, optionsArray.join(''));
    } else if(elementType == BSON.BSON_DATA_REGEXP && bsonRegExp == true) {
			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var source = buffer.toString('utf8', index, i);
      index = i + 1;

			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var regExpOptions = buffer.toString('utf8', index, i);
      index = i + 1;

      // Set the object
      object[name] = new BSONRegExp(source, regExpOptions);
		} else if(elementType == BSON.BSON_DATA_SYMBOL) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      object[name] = new Symbol(buffer.toString('utf8', index, index + stringSize - 1));
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_TIMESTAMP) {
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      object[name] = new Timestamp(lowBits, highBits);
		} else if(elementType == BSON.BSON_DATA_MIN_KEY) {
      object[name] = new MinKey();
		} else if(elementType == BSON.BSON_DATA_MAX_KEY) {
      object[name] = new MaxKey();
		} else if(elementType == BSON.BSON_DATA_CODE) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      var functionString = buffer.toString('utf8', index, index + stringSize - 1);

      // If we are evaluating the functions
      if(evalFunctions) {
        var value = null;
        // If we have cache enabled let's look for the md5 of the function in the cache
        if(cacheFunctions) {
          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }
      } else {
        object[name]  = new Code(functionString);
      }

      // Update parse index position
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_CODE_W_SCOPE) {
      var totalSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

			// Element cannot be shorter than totalSize + stringSize + documentSize + terminator
			if(totalSize < (4 + 4 + 4 + 1)) {
				throw new Error("code_w_scope total size shorter minimum expected length");
			}

			// Get the code string size
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			// Check if we have a valid string
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");

      // Javascript function
      var functionString = buffer.toString('utf8', index, index + stringSize - 1);
      // Update parse index position
      index = index + stringSize;
      // Parse the element
			var _index = index;
      // Decode the size of the object document
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
      // Decode the scope object
      var scopeObject = deserializeObject(buffer, _index, options, false);
      // Adjust the index
      index = index + objectSize;

			// Check if field length is to short
			if(totalSize < (4 + 4 + objectSize + stringSize)) {
				throw new Error('code_w_scope total size is to short, truncating scope');
			}

			// Check if totalSize field is to long
			if(totalSize > (4 + 4 + objectSize + stringSize)) {
				throw new Error('code_w_scope total size is to long, clips outer document');
			}

      // If we are evaluating the functions
      if(evalFunctions) {
        // Contains the value we are going to set
        var value = null;
        // If we have cache enabled let's look for the md5 of the function in the cache
        if(cacheFunctions) {
          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }

        object[name].scope = scopeObject;
      } else {
        object[name]  = new Code(functionString, scopeObject);
      }
		} else if(elementType == BSON.BSON_DATA_DBPOINTER) {
			// Get the code string size
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			// Check if we have a valid string
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
			// Namespace
      var namespace = buffer.toString('utf8', index, index + stringSize - 1);
			// Update parse index position
      index = index + stringSize;

			// Read the oid
			var oidBuffer = new Buffer(12);
			buffer.copy(oidBuffer, 0, index, index + 12);
      var oid = new ObjectID(oidBuffer);

			// Update the index
			index = index + 12;

			// Split the namespace
			var parts = namespace.split('.');
			var db = parts.shift();
			var collection = parts.join('.');
			// Upgrade to DBRef type
			object[name] = new DBRef(collection, oid, db);
    } else {
			throw new Error("Detected unknown BSON type " + elementType.toString(16) + " for fieldname \"" + name + "\", are you using the latest BSON parser");
		}
  }

	// Check if the deserialization was against a valid array/object
	if(size != (index - startIndex)) {
		if(isArray) throw new Error('corrupt array bson');
		throw new Error('corrupt object bson');
	}

  // Check if we have a db ref object
  if(object['$id'] != null) object = new DBRef(object['$ref'], object['$id'], object['$db']);
  return object;
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
var isolateEvalWithHash = function(functionCache, hash, functionString, object) {
  // Contains the value we are going to set
  var value = null;

  // Check for cache hit, eval if missing and return cached function
  if(functionCache[hash] == null) {
    eval("value = " + functionString);
    functionCache[hash] = value;
  }
  // Set the object
  return functionCache[hash].bind(object);
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
var isolateEval = function(functionString) {
  // Contains the value we are going to set
  var value = null;
  // Eval the function
  eval("value = " + functionString);
  return value;
}

var BSON = {};

/**
 * Contains the function cache if we have that enable to allow for avoiding the eval step on each deserialization, comparison is by md5
 *
 * @ignore
 * @api private
 */
var functionCache = BSON.functionCache = {};

/**
 * Number BSON Type
 *
 * @classconstant BSON_DATA_NUMBER
 **/
BSON.BSON_DATA_NUMBER = 1;
/**
 * String BSON Type
 *
 * @classconstant BSON_DATA_STRING
 **/
BSON.BSON_DATA_STRING = 2;
/**
 * Object BSON Type
 *
 * @classconstant BSON_DATA_OBJECT
 **/
BSON.BSON_DATA_OBJECT = 3;
/**
 * Array BSON Type
 *
 * @classconstant BSON_DATA_ARRAY
 **/
BSON.BSON_DATA_ARRAY = 4;
/**
 * Binary BSON Type
 *
 * @classconstant BSON_DATA_BINARY
 **/
BSON.BSON_DATA_BINARY = 5;
/**
 * Binary BSON Type
 *
 * @classconstant BSON_DATA_UNDEFINED
 **/
BSON.BSON_DATA_UNDEFINED = 6;
/**
 * ObjectID BSON Type
 *
 * @classconstant BSON_DATA_OID
 **/
BSON.BSON_DATA_OID = 7;
/**
 * Boolean BSON Type
 *
 * @classconstant BSON_DATA_BOOLEAN
 **/
BSON.BSON_DATA_BOOLEAN = 8;
/**
 * Date BSON Type
 *
 * @classconstant BSON_DATA_DATE
 **/
BSON.BSON_DATA_DATE = 9;
/**
 * null BSON Type
 *
 * @classconstant BSON_DATA_NULL
 **/
BSON.BSON_DATA_NULL = 10;
/**
 * RegExp BSON Type
 *
 * @classconstant BSON_DATA_REGEXP
 **/
BSON.BSON_DATA_REGEXP = 11;
/**
 * Code BSON Type
 *
 * @classconstant BSON_DATA_DBPOINTER
 **/
BSON.BSON_DATA_DBPOINTER = 12;
/**
 * Code BSON Type
 *
 * @classconstant BSON_DATA_CODE
 **/
BSON.BSON_DATA_CODE = 13;
/**
 * Symbol BSON Type
 *
 * @classconstant BSON_DATA_SYMBOL
 **/
BSON.BSON_DATA_SYMBOL = 14;
/**
 * Code with Scope BSON Type
 *
 * @classconstant BSON_DATA_CODE_W_SCOPE
 **/
BSON.BSON_DATA_CODE_W_SCOPE = 15;
/**
 * 32 bit Integer BSON Type
 *
 * @classconstant BSON_DATA_INT
 **/
BSON.BSON_DATA_INT = 16;
/**
 * Timestamp BSON Type
 *
 * @classconstant BSON_DATA_TIMESTAMP
 **/
BSON.BSON_DATA_TIMESTAMP = 17;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_LONG
 **/
BSON.BSON_DATA_LONG = 18;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_DECIMAL128
 **/
BSON.BSON_DATA_DECIMAL128 = 19;
/**
 * MinKey BSON Type
 *
 * @classconstant BSON_DATA_MIN_KEY
 **/
BSON.BSON_DATA_MIN_KEY = 0xff;
/**
 * MaxKey BSON Type
 *
 * @classconstant BSON_DATA_MAX_KEY
 **/
BSON.BSON_DATA_MAX_KEY = 0x7f;

/**
 * Binary Default Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
 **/
BSON.BSON_BINARY_SUBTYPE_DEFAULT = 0;
/**
 * Binary Function Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
 **/
BSON.BSON_BINARY_SUBTYPE_FUNCTION = 1;
/**
 * Binary Byte Array Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
 **/
BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
/**
 * Binary UUID Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_UUID
 **/
BSON.BSON_BINARY_SUBTYPE_UUID = 3;
/**
 * Binary MD5 Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_MD5
 **/
BSON.BSON_BINARY_SUBTYPE_MD5 = 4;
/**
 * Binary User Defined Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
 **/
BSON.BSON_BINARY_SUBTYPE_USER_DEFINED = 128;

// BSON MAX VALUES
BSON.BSON_INT32_MAX = 0x7FFFFFFF;
BSON.BSON_INT32_MIN = -0x80000000;

BSON.BSON_INT64_MAX = Math.pow(2, 63) - 1;
BSON.BSON_INT64_MIN = -Math.pow(2, 63);

// JS MAX PRECISE VALUES
BSON.JS_INT_MAX = 0x20000000000000;  // Any integer up to 2^53 can be precisely represented by a double.
BSON.JS_INT_MIN = -0x20000000000000;  // Any integer down to -2^53 can be precisely represented by a double.

// Internal long versions
var JS_INT_MAX_LONG = Long.fromNumber(0x20000000000000);  // Any integer up to 2^53 can be precisely represented by a double.
var JS_INT_MIN_LONG = Long.fromNumber(-0x20000000000000);  // Any integer down to -2^53 can be precisely represented by a double.

module.exports = deserialize

}).call(this,require("buffer").Buffer)
},{"../binary":8,"../code":10,"../db_ref":11,"../decimal128":12,"../double":13,"../float_parser":14,"../int_32":15,"../long":16,"../max_key":18,"../min_key":19,"../objectid":20,"../regexp":24,"../symbol":25,"../timestamp":26,"buffer":29,"util":35}],23:[function(require,module,exports){
(function (Buffer){
"use strict"

var writeIEEE754 = require('../float_parser').writeIEEE754,
  readIEEE754 = require('../float_parser').readIEEE754,
  Long = require('../long').Long,
  Map = require('../map'),
  Double = require('../double').Double,
  Timestamp = require('../timestamp').Timestamp,
  ObjectID = require('../objectid').ObjectID,
  Symbol = require('../symbol').Symbol,
  Code = require('../code').Code,
  BSONRegExp = require('../regexp').BSONRegExp,
  Int32 = require('../int_32').Int32,
  MinKey = require('../min_key').MinKey,
  MaxKey = require('../max_key').MaxKey,
  Decimal128 = require('../decimal128'),
  DBRef = require('../db_ref').DBRef,
  Binary = require('../binary').Binary;

try {
  var _Buffer = Uint8Array;
} catch(e) {
  var _Buffer = Buffer;
}

var regexp = /\x00/

// To ensure that 0.4 of node works correctly
var isDate = function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

var isRegExp = function isRegExp(d) {
  return Object.prototype.toString.call(d) === '[object RegExp]';
}

var serializeString = function(buffer, key, value, index, isArray) {
  // Encode String type
  buffer[index++] = BSON.BSON_DATA_STRING;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes + 1;
  buffer[index - 1] = 0;
  // Write the string
  var size = buffer.write(value, index + 4, 'utf8');
  // Write the size of the string to buffer
  buffer[index + 3] = (size + 1 >> 24) & 0xff;
  buffer[index + 2] = (size + 1 >> 16) & 0xff;
  buffer[index + 1] = (size + 1 >> 8) & 0xff;
  buffer[index] = size + 1 & 0xff;
  // Update index
  index = index + 4 + size;
  // Write zero
  buffer[index++] = 0;
  return index;
}

var serializeNumber = function(buffer, key, value, index, isArray) {
  // We have an integer value
  if(Math.floor(value) === value && value >= BSON.JS_INT_MIN && value <= BSON.JS_INT_MAX) {
    // If the value fits in 32 bits encode as int, if it fits in a double
    // encode it as a double, otherwise long
    if(value >= BSON.BSON_INT32_MIN && value <= BSON.BSON_INT32_MAX) {
      // Set int type 32 bits or less
      buffer[index++] = BSON.BSON_DATA_INT;
      // Number of written bytes
      var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
      // Encode the name
      index = index + numberOfWrittenBytes;
      buffer[index++] = 0;
      // Write the int value
      buffer[index++] = value & 0xff;
      buffer[index++] = (value >> 8) & 0xff;
      buffer[index++] = (value >> 16) & 0xff;
      buffer[index++] = (value >> 24) & 0xff;
    } else if(value >= BSON.JS_INT_MIN && value <= BSON.JS_INT_MAX) {
      // Encode as double
      buffer[index++] = BSON.BSON_DATA_NUMBER;
      // Number of written bytes
      var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
      // Encode the name
      index = index + numberOfWrittenBytes;
      buffer[index++] = 0;
      // Write float
      writeIEEE754(buffer, value, index, 'little', 52, 8);
      // Ajust index
      index = index + 8;
    } else {
      // Set long type
      buffer[index++] = BSON.BSON_DATA_LONG;
      // Number of written bytes
      var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
      // Encode the name
      index = index + numberOfWrittenBytes;
      buffer[index++] = 0;
      var longVal = Long.fromNumber(value);
      var lowBits = longVal.getLowBits();
      var highBits = longVal.getHighBits();
      // Encode low bits
      buffer[index++] = lowBits & 0xff;
      buffer[index++] = (lowBits >> 8) & 0xff;
      buffer[index++] = (lowBits >> 16) & 0xff;
      buffer[index++] = (lowBits >> 24) & 0xff;
      // Encode high bits
      buffer[index++] = highBits & 0xff;
      buffer[index++] = (highBits >> 8) & 0xff;
      buffer[index++] = (highBits >> 16) & 0xff;
      buffer[index++] = (highBits >> 24) & 0xff;
    }
  } else {
    // Encode as double
    buffer[index++] = BSON.BSON_DATA_NUMBER;
    // Number of written bytes
    var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
    // Encode the name
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    // Write float
    writeIEEE754(buffer, value, index, 'little', 52, 8);
    // Ajust index
    index = index + 8;
  }

  return index;
}

var serializeNull = function(buffer, key, value, index, isArray) {
  // Set long type
  buffer[index++] = BSON.BSON_DATA_NULL;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  return index;
}

var serializeBoolean = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_BOOLEAN;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Encode the boolean value
  buffer[index++] = value ? 1 : 0;
  return index;
}

var serializeDate = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_DATE;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;

  // Write the date
  var dateInMilis = Long.fromNumber(value.getTime());
  var lowBits = dateInMilis.getLowBits();
  var highBits = dateInMilis.getHighBits();
  // Encode low bits
  buffer[index++] = lowBits & 0xff;
  buffer[index++] = (lowBits >> 8) & 0xff;
  buffer[index++] = (lowBits >> 16) & 0xff;
  buffer[index++] = (lowBits >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = highBits & 0xff;
  buffer[index++] = (highBits >> 8) & 0xff;
  buffer[index++] = (highBits >> 16) & 0xff;
  buffer[index++] = (highBits >> 24) & 0xff;
  return index;
}

var serializeRegExp = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_REGEXP;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  if (value.source && value.source.match(regexp) != null) {
    throw Error("value " + value.source + " must not contain null bytes");
  }
  // Adjust the index
  index = index + buffer.write(value.source, index, 'utf8');
  // Write zero
  buffer[index++] = 0x00;
  // Write the parameters
  if(value.global) buffer[index++] = 0x73; // s
  if(value.ignoreCase) buffer[index++] = 0x69; // i
  if(value.multiline) buffer[index++] = 0x6d; // m
  // Add ending zero
  buffer[index++] = 0x00;
  return index;
}

var serializeBSONRegExp = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_REGEXP;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;

  // Check the pattern for 0 bytes
  if (value.pattern.match(regexp) != null) {
    // The BSON spec doesn't allow keys with null bytes because keys are
    // null-terminated.
    throw Error("pattern " + value.pattern + " must not contain null bytes");
  }

  // Adjust the index
  index = index + buffer.write(value.pattern, index, 'utf8');
  // Write zero
  buffer[index++] = 0x00;
  // Write the options
  index = index + buffer.write(value.options.split('').sort().join(''), index, 'utf8');
  // Add ending zero
  buffer[index++] = 0x00;
  return index;
}

var serializeMinMax = function(buffer, key, value, index, isArray) {
  // Write the type of either min or max key
  if(value === null) {
    buffer[index++] = BSON.BSON_DATA_NULL;
  } else if(value instanceof MinKey) {
    buffer[index++] = BSON.BSON_DATA_MIN_KEY;
  } else {
    buffer[index++] = BSON.BSON_DATA_MAX_KEY;
  }

  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  return index;
}

var serializeObjectId = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_OID;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');

  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;

  // Write the objectId into the shared buffer
  if(typeof value.id == 'string') {
    buffer.write(value.id, index, 'binary')
  } else if(value.id && value.id.copy){
    value.id.copy(buffer, index, 0, 12);
  } else {
    throw new Error('object [' + JSON.stringify(value) + "] is not a valid ObjectId");
  }

  // Ajust index
  return index + 12;
}

var serializeBuffer = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_BINARY;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Get size of the buffer (current write point)
  var size = value.length;
  // Write the size of the string to buffer
  buffer[index++] = size & 0xff;
  buffer[index++] = (size >> 8) & 0xff;
  buffer[index++] = (size >> 16) & 0xff;
  buffer[index++] = (size >> 24) & 0xff;
  // Write the default subtype
  buffer[index++] = BSON.BSON_BINARY_SUBTYPE_DEFAULT;
  // Copy the content form the binary field to the buffer
  value.copy(buffer, index, 0, size);
  // Adjust the index
  index = index + size;
  return index;
}

var serializeObject = function(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray, path) {
  for(var i = 0; i < path.length; i++) {
    if(path[i] === value) throw new Error('cyclic dependency detected');
  }

  // Push value to stack
  path.push(value);
  // Write the type
  buffer[index++] = Array.isArray(value) ? BSON.BSON_DATA_ARRAY : BSON.BSON_DATA_OBJECT;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  var endIndex = serializeInto(buffer, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
  // Pop stack
  path.pop();
  // Write size
  var size = endIndex - index;
  return endIndex;
}

var serializeDecimal128 = function(buffer, key, value, index, isArray) {
  buffer[index++] = BSON.BSON_DATA_DECIMAL128;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Write the data from the value
  value.bytes.copy(buffer, index, 0, 16);
  return index + 16;
}

var serializeLong = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = value._bsontype == 'Long' ? BSON.BSON_DATA_LONG : BSON.BSON_DATA_TIMESTAMP;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Write the date
  var lowBits = value.getLowBits();
  var highBits = value.getHighBits();
  // Encode low bits
  buffer[index++] = lowBits & 0xff;
  buffer[index++] = (lowBits >> 8) & 0xff;
  buffer[index++] = (lowBits >> 16) & 0xff;
  buffer[index++] = (lowBits >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = highBits & 0xff;
  buffer[index++] = (highBits >> 8) & 0xff;
  buffer[index++] = (highBits >> 16) & 0xff;
  buffer[index++] = (highBits >> 24) & 0xff;
  return index;
}

var serializeInt32 = function(buffer, key, value, index, isArray) {
  // Set int type 32 bits or less
  buffer[index++] = BSON.BSON_DATA_INT;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Write the int value
  buffer[index++] = value & 0xff;
  buffer[index++] = (value >> 8) & 0xff;
  buffer[index++] = (value >> 16) & 0xff;
  buffer[index++] = (value >> 24) & 0xff;
  return index;
}

var serializeDouble = function(buffer, key, value, index, isArray) {
  // Encode as double
  buffer[index++] = BSON.BSON_DATA_NUMBER;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Write float
  writeIEEE754(buffer, value, index, 'little', 52, 8);
  // Ajust index
  index = index + 8;
  return index;
}

var serializeFunction = function(buffer, key, value, index, checkKeys, depth, isArray) {
  buffer[index++] = BSON.BSON_DATA_CODE;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Function string
  var functionString = value.toString();
  // Write the string
  var size = buffer.write(functionString, index + 4, 'utf8') + 1;
  // Write the size of the string to buffer
  buffer[index] = size & 0xff;
  buffer[index + 1] = (size >> 8) & 0xff;
  buffer[index + 2] = (size >> 16) & 0xff;
  buffer[index + 3] = (size >> 24) & 0xff;
  // Update index
  index = index + 4 + size - 1;
  // Write zero
  buffer[index++] = 0;
  return index;
}

var serializeCode = function(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray) {
  if(value.scope && typeof value.scope == 'object') {
    // Write the type
    buffer[index++] = BSON.BSON_DATA_CODE_W_SCOPE;
    // Number of written bytes
    var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
    // Encode the name
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;

    // Starting index
    var startIndex = index;

    // Serialize the function
    // Get the function string
    var functionString = typeof value.code == 'string' ? value.code : value.code.toString();
    // Index adjustment
    index = index + 4;
    // Write string into buffer
    var codeSize = buffer.write(functionString, index + 4, 'utf8') + 1;
    // Write the size of the string to buffer
    buffer[index] = codeSize & 0xff;
    buffer[index + 1] = (codeSize >> 8) & 0xff;
    buffer[index + 2] = (codeSize >> 16) & 0xff;
    buffer[index + 3] = (codeSize >> 24) & 0xff;
    // Write end 0
    buffer[index + 4 + codeSize - 1] = 0;
    // Write the
    index = index + codeSize + 4;

    //
    // Serialize the scope value
    var endIndex = serializeInto(buffer, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined)
    index = endIndex - 1;

    // Writ the total
    var totalSize = endIndex - startIndex;

    // Write the total size of the object
    buffer[startIndex++] = totalSize & 0xff;
    buffer[startIndex++] = (totalSize >> 8) & 0xff;
    buffer[startIndex++] = (totalSize >> 16) & 0xff;
    buffer[startIndex++] = (totalSize >> 24) & 0xff;
    // Write trailing zero
    buffer[index++] = 0;
  } else {
    buffer[index++] = BSON.BSON_DATA_CODE;
    // Number of written bytes
    var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
    // Encode the name
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    // Function string
    var functionString = value.code.toString();
    // Write the string
    var size = buffer.write(functionString, index + 4, 'utf8') + 1;
    // Write the size of the string to buffer
    buffer[index] = size & 0xff;
    buffer[index + 1] = (size >> 8) & 0xff;
    buffer[index + 2] = (size >> 16) & 0xff;
    buffer[index + 3] = (size >> 24) & 0xff;
    // Update index
    index = index + 4 + size - 1;
    // Write zero
    buffer[index++] = 0;
  }

  return index;
}

var serializeBinary = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_BINARY;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Extract the buffer
  var data = value.value(true);
  // Calculate size
  var size = value.position;
  // Add the deprecated 02 type 4 bytes of size to total
  if(value.sub_type == Binary.SUBTYPE_BYTE_ARRAY) size = size + 4;
  // Write the size of the string to buffer
  buffer[index++] = size & 0xff;
  buffer[index++] = (size >> 8) & 0xff;
  buffer[index++] = (size >> 16) & 0xff;
  buffer[index++] = (size >> 24) & 0xff;
  // Write the subtype to the buffer
  buffer[index++] = value.sub_type;

  // If we have binary type 2 the 4 first bytes are the size
  if(value.sub_type == Binary.SUBTYPE_BYTE_ARRAY) {
    size = size - 4;
    buffer[index++] = size & 0xff;
    buffer[index++] = (size >> 8) & 0xff;
    buffer[index++] = (size >> 16) & 0xff;
    buffer[index++] = (size >> 24) & 0xff;
  }

  // Write the data to the object
  data.copy(buffer, index, 0, value.position);
  // Adjust the index
  index = index + value.position;
  return index;
}

var serializeSymbol = function(buffer, key, value, index, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_SYMBOL;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');
  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;
  // Write the string
  var size = buffer.write(value.value, index + 4, 'utf8') + 1;
  // Write the size of the string to buffer
  buffer[index] = size & 0xff;
  buffer[index + 1] = (size >> 8) & 0xff;
  buffer[index + 2] = (size >> 16) & 0xff;
  buffer[index + 3] = (size >> 24) & 0xff;
  // Update index
  index = index + 4 + size - 1;
  // Write zero
  buffer[index++] = 0x00;
  return index;
}

var serializeDBRef = function(buffer, key, value, index, depth, serializeFunctions, isArray) {
  // Write the type
  buffer[index++] = BSON.BSON_DATA_OBJECT;
  // Number of written bytes
  var numberOfWrittenBytes = !isArray ? buffer.write(key, index, 'utf8') : buffer.write(key, index, 'ascii');

  // Encode the name
  index = index + numberOfWrittenBytes;
  buffer[index++] = 0;

  var startIndex = index;
  var endIndex;

  // Serialize object
  if(null != value.db) {
    endIndex = serializeInto(buffer, {
        '$ref': value.namespace
      , '$id' : value.oid
      , '$db' : value.db
    }, false, index, depth + 1, serializeFunctions);
  } else {
    endIndex = serializeInto(buffer, {
        '$ref': value.namespace
      , '$id' : value.oid
    }, false, index, depth + 1, serializeFunctions);
  }

  // Calculate object size
  var size = endIndex - startIndex;
  // Write the size
  buffer[startIndex++] = size & 0xff;
  buffer[startIndex++] = (size >> 8) & 0xff;
  buffer[startIndex++] = (size >> 16) & 0xff;
  buffer[startIndex++] = (size >> 24) & 0xff;
  // Set index
  return endIndex;
}

var serializeInto = function serializeInto(buffer, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
  startingIndex = startingIndex || 0;
  path = path || [];

  // Push the object to the path
  path.push(object);

  // Start place to serialize into
  var index = startingIndex + 4;
  var self = this;

  // Special case isArray
  if(Array.isArray(object)) {
    // Get object keys
    for(var i = 0; i < object.length; i++) {
      var key = "" + i;
      var value = object[i];

      // Is there an override value
      if(value && value.toBSON) {
        if(typeof value.toBSON != 'function') throw new Error("toBSON is not a function");
        value = value.toBSON();
      }

      var type = typeof value;
      if(type == 'string') {
        index = serializeString(buffer, key, value, index, true);
      } else if(type == 'number') {
        index = serializeNumber(buffer, key, value, index, true);
      } else if(type == 'boolean') {
        index = serializeBoolean(buffer, key, value, index, true);
      } else if(value instanceof Date || isDate(value)) {
        index = serializeDate(buffer, key, value, index, true);
      } else if(value === undefined) {
        index = serializeNull(buffer, key, value, index, true);
      } else if(value === null) {
        index = serializeNull(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'ObjectID') {
        index = serializeObjectId(buffer, key, value, index, true);
      } else if(Buffer.isBuffer(value)) {
        index = serializeBuffer(buffer, key, value, index, true);
      } else if(value instanceof RegExp || isRegExp(value)) {
        index = serializeRegExp(buffer, key, value, index, true);
      } else if(type == 'object' && value['_bsontype'] == null) {
        index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true, path);
      } else if(type == 'object' && value['_bsontype'] == 'Decimal128') {
        index = serializeDecimal128(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'Long' || value['_bsontype'] == 'Timestamp') {
        index = serializeLong(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'Double') {
        index = serializeDouble(buffer, key, value, index, true);
      } else if(typeof value == 'function' && serializeFunctions) {
        index = serializeFunction(buffer, key, value, index, checkKeys, depth, serializeFunctions, true);
      } else if(value['_bsontype'] == 'Code') {
        index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true);
      } else if(value['_bsontype'] == 'Binary') {
        index = serializeBinary(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'Symbol') {
        index = serializeSymbol(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'DBRef') {
        index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions, true);
      } else if(value['_bsontype'] == 'BSONRegExp') {
        index = serializeBSONRegExp(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'Int32') {
        index = serializeInt32(buffer, key, value, index, true);
      } else if(value['_bsontype'] == 'MinKey' || value['_bsontype'] == 'MaxKey') {
        index = serializeMinMax(buffer, key, value, index, true);
      }
    }
  } else if(object instanceof Map) {
    var iterator = object.entries();
    var done = false;

    while(!done) {
      // Unpack the next entry
      var entry = iterator.next();
      done = entry.done;
      // Are we done, then skip and terminate
      if(done) continue;

      // Get the entry values
      var key = entry.value[0];
      var value = entry.value[1];

      // Check the type of the value
      var type = typeof value;

      // Check the key and throw error if it's illegal
      if(key != '$db' && key != '$ref' && key != '$id') {
        if (key.match(regexp) != null) {
          // The BSON spec doesn't allow keys with null bytes because keys are
          // null-terminated.
          throw Error("key " + key + " must not contain null bytes");
        }

        if (checkKeys) {
          if('$' == key[0]) {
            throw Error("key " + key + " must not start with '$'");
          } else if (!!~key.indexOf('.')) {
            throw Error("key " + key + " must not contain '.'");
          }
        }
      }

      if(type == 'string') {
        index = serializeString(buffer, key, value, index);
      } else if(type == 'number') {
        index = serializeNumber(buffer, key, value, index);
      } else if(type == 'boolean') {
        index = serializeBoolean(buffer, key, value, index);
      } else if(value instanceof Date || isDate(value)) {
        index = serializeDate(buffer, key, value, index);
      } else if(value === undefined && ignoreUndefined == true) {
      } else if(value === null || value === undefined) {
        index = serializeNull(buffer, key, value, index);
      } else if(value['_bsontype'] == 'ObjectID') {
        index = serializeObjectId(buffer, key, value, index);
      } else if(Buffer.isBuffer(value)) {
        index = serializeBuffer(buffer, key, value, index);
      } else if(value instanceof RegExp || isRegExp(value)) {
        index = serializeRegExp(buffer, key, value, index);
      } else if(type == 'object' && value['_bsontype'] == null) {
        index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
      } else if(type == 'object' && value['_bsontype'] == 'Decimal128') {
        index = serializeDecimal128(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Long' || value['_bsontype'] == 'Timestamp') {
        index = serializeLong(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Double') {
        index = serializeDouble(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Code') {
        index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
      } else if(typeof value == 'function' && serializeFunctions) {
        index = serializeFunction(buffer, key, value, index, checkKeys, depth, serializeFunctions);
      } else if(value['_bsontype'] == 'Binary') {
        index = serializeBinary(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Symbol') {
        index = serializeSymbol(buffer, key, value, index);
      } else if(value['_bsontype'] == 'DBRef') {
        index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions);
      } else if(value['_bsontype'] == 'BSONRegExp') {
        index = serializeBSONRegExp(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Int32') {
        index = serializeInt32(buffer, key, value, index);
      } else if(value['_bsontype'] == 'MinKey' || value['_bsontype'] == 'MaxKey') {
        index = serializeMinMax(buffer, key, value, index);
      }
    }
  } else {
    // Did we provide a custom serialization method
    if(object.toBSON) {
      if(typeof object.toBSON != 'function') throw new Error("toBSON is not a function");
      object = object.toBSON();
      if(object != null && typeof object != 'object') throw new Error("toBSON function did not return an object");
    }

    // Iterate over all the keys
    for(var key in object) {
      var value = object[key];
      // Is there an override value
      if(value && value.toBSON) {
        if(typeof value.toBSON != 'function') throw new Error("toBSON is not a function");
        value = value.toBSON();
      }

      // Check the type of the value
      var type = typeof value;

      // Check the key and throw error if it's illegal
      if(key != '$db' && key != '$ref' && key != '$id') {
        if (key.match(regexp) != null) {
          // The BSON spec doesn't allow keys with null bytes because keys are
          // null-terminated.
          throw Error("key " + key + " must not contain null bytes");
        }

        if (checkKeys) {
          if('$' == key[0]) {
            throw Error("key " + key + " must not start with '$'");
          } else if (!!~key.indexOf('.')) {
            throw Error("key " + key + " must not contain '.'");
          }
        }
      }

      if(type == 'string') {
        index = serializeString(buffer, key, value, index);
      } else if(type == 'number') {
        index = serializeNumber(buffer, key, value, index);
      } else if(type == 'boolean') {
        index = serializeBoolean(buffer, key, value, index);
      } else if(value instanceof Date || isDate(value)) {
        index = serializeDate(buffer, key, value, index);
      } else if(value === undefined && ignoreUndefined == true) {
      } else if(value === null || value === undefined) {
        index = serializeNull(buffer, key, value, index);
      } else if(value['_bsontype'] == 'ObjectID') {
        index = serializeObjectId(buffer, key, value, index);
      } else if(Buffer.isBuffer(value)) {
        index = serializeBuffer(buffer, key, value, index);
      } else if(value instanceof RegExp || isRegExp(value)) {
        index = serializeRegExp(buffer, key, value, index);
      } else if(type == 'object' && value['_bsontype'] == null) {
        index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
      } else if(type == 'object' && value['_bsontype'] == 'Decimal128') {
        index = serializeDecimal128(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Long' || value['_bsontype'] == 'Timestamp') {
        index = serializeLong(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Double') {
        index = serializeDouble(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Code') {
        index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
      } else if(typeof value == 'function' && serializeFunctions) {
        index = serializeFunction(buffer, key, value, index, checkKeys, depth, serializeFunctions);
      } else if(value['_bsontype'] == 'Binary') {
        index = serializeBinary(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Symbol') {
        index = serializeSymbol(buffer, key, value, index);
      } else if(value['_bsontype'] == 'DBRef') {
        index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions);
      } else if(value['_bsontype'] == 'BSONRegExp') {
        index = serializeBSONRegExp(buffer, key, value, index);
      } else if(value['_bsontype'] == 'Int32') {
        index = serializeInt32(buffer, key, value, index);
      } else if(value['_bsontype'] == 'MinKey' || value['_bsontype'] == 'MaxKey') {
        index = serializeMinMax(buffer, key, value, index);
      }
    }
  }

  // Remove the path
  path.pop();

  // Final padding byte for object
  buffer[index++] = 0x00;

  // Final size
  var size = index - startingIndex;
  // Write the size of the object
  buffer[startingIndex++] = size & 0xff;
  buffer[startingIndex++] = (size >> 8) & 0xff;
  buffer[startingIndex++] = (size >> 16) & 0xff;
  buffer[startingIndex++] = (size >> 24) & 0xff;
  return index;
}

var BSON = {};

/**
 * Contains the function cache if we have that enable to allow for avoiding the eval step on each deserialization, comparison is by md5
 *
 * @ignore
 * @api private
 */
var functionCache = BSON.functionCache = {};

/**
 * Number BSON Type
 *
 * @classconstant BSON_DATA_NUMBER
 **/
BSON.BSON_DATA_NUMBER = 1;
/**
 * String BSON Type
 *
 * @classconstant BSON_DATA_STRING
 **/
BSON.BSON_DATA_STRING = 2;
/**
 * Object BSON Type
 *
 * @classconstant BSON_DATA_OBJECT
 **/
BSON.BSON_DATA_OBJECT = 3;
/**
 * Array BSON Type
 *
 * @classconstant BSON_DATA_ARRAY
 **/
BSON.BSON_DATA_ARRAY = 4;
/**
 * Binary BSON Type
 *
 * @classconstant BSON_DATA_BINARY
 **/
BSON.BSON_DATA_BINARY = 5;
/**
 * ObjectID BSON Type, deprecated
 *
 * @classconstant BSON_DATA_UNDEFINED
 **/
BSON.BSON_DATA_UNDEFINED = 6;
/**
 * ObjectID BSON Type
 *
 * @classconstant BSON_DATA_OID
 **/
BSON.BSON_DATA_OID = 7;
/**
 * Boolean BSON Type
 *
 * @classconstant BSON_DATA_BOOLEAN
 **/
BSON.BSON_DATA_BOOLEAN = 8;
/**
 * Date BSON Type
 *
 * @classconstant BSON_DATA_DATE
 **/
BSON.BSON_DATA_DATE = 9;
/**
 * null BSON Type
 *
 * @classconstant BSON_DATA_NULL
 **/
BSON.BSON_DATA_NULL = 10;
/**
 * RegExp BSON Type
 *
 * @classconstant BSON_DATA_REGEXP
 **/
BSON.BSON_DATA_REGEXP = 11;
/**
 * Code BSON Type
 *
 * @classconstant BSON_DATA_CODE
 **/
BSON.BSON_DATA_CODE = 13;
/**
 * Symbol BSON Type
 *
 * @classconstant BSON_DATA_SYMBOL
 **/
BSON.BSON_DATA_SYMBOL = 14;
/**
 * Code with Scope BSON Type
 *
 * @classconstant BSON_DATA_CODE_W_SCOPE
 **/
BSON.BSON_DATA_CODE_W_SCOPE = 15;
/**
 * 32 bit Integer BSON Type
 *
 * @classconstant BSON_DATA_INT
 **/
BSON.BSON_DATA_INT = 16;
/**
 * Timestamp BSON Type
 *
 * @classconstant BSON_DATA_TIMESTAMP
 **/
BSON.BSON_DATA_TIMESTAMP = 17;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_LONG
 **/
BSON.BSON_DATA_LONG = 18;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_DECIMAL128
 **/
BSON.BSON_DATA_DECIMAL128 = 19;
/**
 * MinKey BSON Type
 *
 * @classconstant BSON_DATA_MIN_KEY
 **/
BSON.BSON_DATA_MIN_KEY = 0xff;
/**
 * MaxKey BSON Type
 *
 * @classconstant BSON_DATA_MAX_KEY
 **/
BSON.BSON_DATA_MAX_KEY = 0x7f;
/**
 * Binary Default Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
 **/
BSON.BSON_BINARY_SUBTYPE_DEFAULT = 0;
/**
 * Binary Function Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
 **/
BSON.BSON_BINARY_SUBTYPE_FUNCTION = 1;
/**
 * Binary Byte Array Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
 **/
BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
/**
 * Binary UUID Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_UUID
 **/
BSON.BSON_BINARY_SUBTYPE_UUID = 3;
/**
 * Binary MD5 Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_MD5
 **/
BSON.BSON_BINARY_SUBTYPE_MD5 = 4;
/**
 * Binary User Defined Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
 **/
BSON.BSON_BINARY_SUBTYPE_USER_DEFINED = 128;

// BSON MAX VALUES
BSON.BSON_INT32_MAX = 0x7FFFFFFF;
BSON.BSON_INT32_MIN = -0x80000000;

BSON.BSON_INT64_MAX = Math.pow(2, 63) - 1;
BSON.BSON_INT64_MIN = -Math.pow(2, 63);

// JS MAX PRECISE VALUES
BSON.JS_INT_MAX = 0x20000000000000;  // Any integer up to 2^53 can be precisely represented by a double.
BSON.JS_INT_MIN = -0x20000000000000;  // Any integer down to -2^53 can be precisely represented by a double.

// Internal long versions
var JS_INT_MAX_LONG = Long.fromNumber(0x20000000000000);  // Any integer up to 2^53 can be precisely represented by a double.
var JS_INT_MIN_LONG = Long.fromNumber(-0x20000000000000);  // Any integer down to -2^53 can be precisely represented by a double.

module.exports = serializeInto;

}).call(this,require("buffer").Buffer)
},{"../binary":8,"../code":10,"../db_ref":11,"../decimal128":12,"../double":13,"../float_parser":14,"../int_32":15,"../long":16,"../map":17,"../max_key":18,"../min_key":19,"../objectid":20,"../regexp":24,"../symbol":25,"../timestamp":26,"buffer":29}],24:[function(require,module,exports){
/**
 * A class representation of the BSON RegExp type.
 *
 * @class
 * @return {BSONRegExp} A MinKey instance
 */
function BSONRegExp(pattern, options) {
  if(!(this instanceof BSONRegExp)) return new BSONRegExp();

  // Execute
  this._bsontype = 'BSONRegExp';
  this.pattern = pattern || '';
  this.options = options || '';

  // Validate options
  for(var i = 0; i < this.options.length; i++) {
    if(!(this.options[i] == 'i'
      || this.options[i] == 'm'
      || this.options[i] == 'x'
      || this.options[i] == 'l'
      || this.options[i] == 's'
      || this.options[i] == 'u'
    )) {
      throw new Error('the regular expression options [' + this.options[i] + "] is not supported");
    }
  }
}

module.exports = BSONRegExp;
module.exports.BSONRegExp = BSONRegExp;

},{}],25:[function(require,module,exports){
/**
 * A class representation of the BSON Symbol type.
 *
 * @class
 * @deprecated
 * @param {string} value the string representing the symbol.
 * @return {Symbol}
 */
function Symbol(value) {
  if(!(this instanceof Symbol)) return new Symbol(value);
  this._bsontype = 'Symbol';
  this.value = value;
}

/**
 * Access the wrapped string value.
 *
 * @method
 * @return {String} returns the wrapped string.
 */
Symbol.prototype.valueOf = function() {
  return this.value;
};

/**
 * @ignore
 */
Symbol.prototype.toString = function() {
  return this.value;
}

/**
 * @ignore
 */
Symbol.prototype.inspect = function() {
  return this.value;
}

/**
 * @ignore
 */
Symbol.prototype.toJSON = function() {
  return this.value;
}

module.exports = Symbol;
module.exports.Symbol = Symbol;
},{}],26:[function(require,module,exports){
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Copyright 2009 Google Inc. All Rights Reserved

/**
 * This type is for INTERNAL use in MongoDB only and should not be used in applications.
 * The appropriate corresponding type is the JavaScript Date type.
 * 
 * Defines a Timestamp class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "Timestamp". This
 * implementation is derived from TimestampLib in GWT.
 *
 * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
 * values as *signed* integers.  See the from* functions below for more
 * convenient ways of constructing Timestamps.
 *
 * The internal representation of a Timestamp is the two given signed, 32-bit values.
 * We use 32-bit pieces because these are the size of integers on which
 * Javascript performs bit-operations.  For operations like addition and
 * multiplication, we split each number into 16-bit pieces, which can easily be
 * multiplied within Javascript's floating-point representation without overflow
 * or change in sign.
 *
 * In the algorithms below, we frequently reduce the negative case to the
 * positive case by negating the input(s) and then post-processing the result.
 * Note that we must ALWAYS check specially whether those values are MIN_VALUE
 * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
 * a positive number, it overflows back into a negative).  Not handling this
 * case would often result in infinite recursion.
 *
 * @class
 * @param {number} low  the low (signed) 32 bits of the Timestamp.
 * @param {number} high the high (signed) 32 bits of the Timestamp.
 */
function Timestamp(low, high) {
  if(!(this instanceof Timestamp)) return new Timestamp(low, high);
  this._bsontype = 'Timestamp';
  /**
   * @type {number}
   * @ignore
   */
  this.low_ = low | 0;  // force into 32 signed bits.

  /**
   * @type {number}
   * @ignore
   */
  this.high_ = high | 0;  // force into 32 signed bits.
};

/**
 * Return the int value.
 *
 * @return {number} the value, assuming it is a 32-bit integer.
 */
Timestamp.prototype.toInt = function() {
  return this.low_;
};

/**
 * Return the Number value.
 *
 * @method
 * @return {number} the closest floating-point representation to this value.
 */
Timestamp.prototype.toNumber = function() {
  return this.high_ * Timestamp.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
};

/**
 * Return the JSON value.
 *
 * @method
 * @return {string} the JSON representation.
 */
Timestamp.prototype.toJSON = function() {
  return this.toString();
}

/**
 * Return the String value.
 *
 * @method
 * @param {number} [opt_radix] the radix in which the text should be written.
 * @return {string} the textual representation of this value.
 */
Timestamp.prototype.toString = function(opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (this.isZero()) {
    return '0';
  }

  if (this.isNegative()) {
    if (this.equals(Timestamp.MIN_VALUE)) {
      // We need to change the Timestamp value before it can be negated, so we remove
      // the bottom-most digit in this base and then recurse to do the rest.
      var radixTimestamp = Timestamp.fromNumber(radix);
      var div = this.div(radixTimestamp);
      var rem = div.multiply(radixTimestamp).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }

  // Do several (6) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Timestamp.fromNumber(Math.pow(radix, 6));

  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
    var digits = intval.toString(radix);

    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
};

/**
 * Return the high 32-bits value.
 *
 * @method
 * @return {number} the high 32-bits as a signed value.
 */
Timestamp.prototype.getHighBits = function() {
  return this.high_;
};

/**
 * Return the low 32-bits value.
 *
 * @method
 * @return {number} the low 32-bits as a signed value.
 */
Timestamp.prototype.getLowBits = function() {
  return this.low_;
};

/**
 * Return the low unsigned 32-bits value.
 *
 * @method
 * @return {number} the low 32-bits as an unsigned value.
 */
Timestamp.prototype.getLowBitsUnsigned = function() {
  return (this.low_ >= 0) ?
      this.low_ : Timestamp.TWO_PWR_32_DBL_ + this.low_;
};

/**
 * Returns the number of bits needed to represent the absolute value of this Timestamp.
 *
 * @method
 * @return {number} Returns the number of bits needed to represent the absolute value of this Timestamp.
 */
Timestamp.prototype.getNumBitsAbs = function() {
  if (this.isNegative()) {
    if (this.equals(Timestamp.MIN_VALUE)) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & (1 << bit)) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
};

/**
 * Return whether this value is zero.
 *
 * @method
 * @return {boolean} whether this value is zero.
 */
Timestamp.prototype.isZero = function() {
  return this.high_ == 0 && this.low_ == 0;
};

/**
 * Return whether this value is negative.
 *
 * @method
 * @return {boolean} whether this value is negative.
 */
Timestamp.prototype.isNegative = function() {
  return this.high_ < 0;
};

/**
 * Return whether this value is odd.
 *
 * @method
 * @return {boolean} whether this value is odd.
 */
Timestamp.prototype.isOdd = function() {
  return (this.low_ & 1) == 1;
};

/**
 * Return whether this Timestamp equals the other
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp equals the other
 */
Timestamp.prototype.equals = function(other) {
  return (this.high_ == other.high_) && (this.low_ == other.low_);
};

/**
 * Return whether this Timestamp does not equal the other.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp does not equal the other.
 */
Timestamp.prototype.notEquals = function(other) {
  return (this.high_ != other.high_) || (this.low_ != other.low_);
};

/**
 * Return whether this Timestamp is less than the other.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp is less than the other.
 */
Timestamp.prototype.lessThan = function(other) {
  return this.compare(other) < 0;
};

/**
 * Return whether this Timestamp is less than or equal to the other.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp is less than or equal to the other.
 */
Timestamp.prototype.lessThanOrEqual = function(other) {
  return this.compare(other) <= 0;
};

/**
 * Return whether this Timestamp is greater than the other.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp is greater than the other.
 */
Timestamp.prototype.greaterThan = function(other) {
  return this.compare(other) > 0;
};

/**
 * Return whether this Timestamp is greater than or equal to the other.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} whether this Timestamp is greater than or equal to the other.
 */
Timestamp.prototype.greaterThanOrEqual = function(other) {
  return this.compare(other) >= 0;
};

/**
 * Compares this Timestamp with the given one.
 *
 * @method
 * @param {Timestamp} other Timestamp to compare against.
 * @return {boolean} 0 if they are the same, 1 if the this is greater, and -1 if the given one is greater.
 */
Timestamp.prototype.compare = function(other) {
  if (this.equals(other)) {
    return 0;
  }

  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }

  // at this point, the signs are the same, so subtraction will not overflow
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
};

/**
 * The negation of this value.
 *
 * @method
 * @return {Timestamp} the negation of this value.
 */
Timestamp.prototype.negate = function() {
  if (this.equals(Timestamp.MIN_VALUE)) {
    return Timestamp.MIN_VALUE;
  } else {
    return this.not().add(Timestamp.ONE);
  }
};

/**
 * Returns the sum of this and the given Timestamp.
 *
 * @method
 * @param {Timestamp} other Timestamp to add to this one.
 * @return {Timestamp} the sum of this and the given Timestamp.
 */
Timestamp.prototype.add = function(other) {
  // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return Timestamp.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};

/**
 * Returns the difference of this and the given Timestamp.
 *
 * @method
 * @param {Timestamp} other Timestamp to subtract from this.
 * @return {Timestamp} the difference of this and the given Timestamp.
 */
Timestamp.prototype.subtract = function(other) {
  return this.add(other.negate());
};

/**
 * Returns the product of this and the given Timestamp.
 *
 * @method
 * @param {Timestamp} other Timestamp to multiply with this.
 * @return {Timestamp} the product of this and the other.
 */
Timestamp.prototype.multiply = function(other) {
  if (this.isZero()) {
    return Timestamp.ZERO;
  } else if (other.isZero()) {
    return Timestamp.ZERO;
  }

  if (this.equals(Timestamp.MIN_VALUE)) {
    return other.isOdd() ? Timestamp.MIN_VALUE : Timestamp.ZERO;
  } else if (other.equals(Timestamp.MIN_VALUE)) {
    return this.isOdd() ? Timestamp.MIN_VALUE : Timestamp.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }

  // If both Timestamps are small, use float multiplication
  if (this.lessThan(Timestamp.TWO_PWR_24_) &&
      other.lessThan(Timestamp.TWO_PWR_24_)) {
    return Timestamp.fromNumber(this.toNumber() * other.toNumber());
  }

  // Divide each Timestamp into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return Timestamp.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};

/**
 * Returns this Timestamp divided by the given one.
 *
 * @method
 * @param {Timestamp} other Timestamp by which to divide.
 * @return {Timestamp} this Timestamp divided by the given one.
 */
Timestamp.prototype.div = function(other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return Timestamp.ZERO;
  }

  if (this.equals(Timestamp.MIN_VALUE)) {
    if (other.equals(Timestamp.ONE) ||
        other.equals(Timestamp.NEG_ONE)) {
      return Timestamp.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
    } else if (other.equals(Timestamp.MIN_VALUE)) {
      return Timestamp.ONE;
    } else {
      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(Timestamp.ZERO)) {
        return other.isNegative() ? Timestamp.ONE : Timestamp.NEG_ONE;
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(Timestamp.MIN_VALUE)) {
    return Timestamp.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }

  // Repeat the following until the remainder is less than other:  find a
  // floating-point that approximates remainder / other *from below*, add this
  // into the result, and subtract it from the remainder.  It is critical that
  // the approximate value is less than or equal to the real value so that the
  // remainder never becomes negative.
  var res = Timestamp.ZERO;
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    // Approximate the result of division. This may be a little greater or
    // smaller than the actual value.
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

    // We will tweak the approximate result by changing it in the 48-th digit or
    // the smallest non-fractional digit, whichever is larger.
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

    // Decrease the approximation until it is smaller than the remainder.  Note
    // that if it is too large, the product overflows and is negative.
    var approxRes = Timestamp.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = Timestamp.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }

    // We know the answer can't be zero... and actually, zero would cause
    // infinite recursion since we would make no progress.
    if (approxRes.isZero()) {
      approxRes = Timestamp.ONE;
    }

    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
};

/**
 * Returns this Timestamp modulo the given one.
 *
 * @method
 * @param {Timestamp} other Timestamp by which to mod.
 * @return {Timestamp} this Timestamp modulo the given one.
 */
Timestamp.prototype.modulo = function(other) {
  return this.subtract(this.div(other).multiply(other));
};

/**
 * The bitwise-NOT of this value.
 *
 * @method
 * @return {Timestamp} the bitwise-NOT of this value.
 */
Timestamp.prototype.not = function() {
  return Timestamp.fromBits(~this.low_, ~this.high_);
};

/**
 * Returns the bitwise-AND of this Timestamp and the given one.
 *
 * @method
 * @param {Timestamp} other the Timestamp with which to AND.
 * @return {Timestamp} the bitwise-AND of this and the other.
 */
Timestamp.prototype.and = function(other) {
  return Timestamp.fromBits(this.low_ & other.low_, this.high_ & other.high_);
};

/**
 * Returns the bitwise-OR of this Timestamp and the given one.
 *
 * @method
 * @param {Timestamp} other the Timestamp with which to OR.
 * @return {Timestamp} the bitwise-OR of this and the other.
 */
Timestamp.prototype.or = function(other) {
  return Timestamp.fromBits(this.low_ | other.low_, this.high_ | other.high_);
};

/**
 * Returns the bitwise-XOR of this Timestamp and the given one.
 *
 * @method
 * @param {Timestamp} other the Timestamp with which to XOR.
 * @return {Timestamp} the bitwise-XOR of this and the other.
 */
Timestamp.prototype.xor = function(other) {
  return Timestamp.fromBits(this.low_ ^ other.low_, this.high_ ^ other.high_);
};

/**
 * Returns this Timestamp with bits shifted to the left by the given amount.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Timestamp} this shifted to the left by the given amount.
 */
Timestamp.prototype.shiftLeft = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return Timestamp.fromBits(
                 low << numBits,
                 (high << numBits) | (low >>> (32 - numBits)));
    } else {
      return Timestamp.fromBits(0, low << (numBits - 32));
    }
  }
};

/**
 * Returns this Timestamp with bits shifted to the right by the given amount.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Timestamp} this shifted to the right by the given amount.
 */
Timestamp.prototype.shiftRight = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Timestamp.fromBits(
                 (low >>> numBits) | (high << (32 - numBits)),
                 high >> numBits);
    } else {
      return Timestamp.fromBits(
                 high >> (numBits - 32),
                 high >= 0 ? 0 : -1);
    }
  }
};

/**
 * Returns this Timestamp with bits shifted to the right by the given amount, with the new top bits matching the current sign bit.
 *
 * @method
 * @param {number} numBits the number of bits by which to shift.
 * @return {Timestamp} this shifted to the right by the given amount, with zeros placed into the new leading bits.
 */
Timestamp.prototype.shiftRightUnsigned = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Timestamp.fromBits(
                 (low >>> numBits) | (high << (32 - numBits)),
                 high >>> numBits);
    } else if (numBits == 32) {
      return Timestamp.fromBits(high, 0);
    } else {
      return Timestamp.fromBits(high >>> (numBits - 32), 0);
    }
  }
};

/**
 * Returns a Timestamp representing the given (32-bit) integer value.
 *
 * @method
 * @param {number} value the 32-bit integer in question.
 * @return {Timestamp} the corresponding Timestamp value.
 */
Timestamp.fromInt = function(value) {
  if (-128 <= value && value < 128) {
    var cachedObj = Timestamp.INT_CACHE_[value];
    if (cachedObj) {
      return cachedObj;
    }
  }

  var obj = new Timestamp(value | 0, value < 0 ? -1 : 0);
  if (-128 <= value && value < 128) {
    Timestamp.INT_CACHE_[value] = obj;
  }
  return obj;
};

/**
 * Returns a Timestamp representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 *
 * @method
 * @param {number} value the number in question.
 * @return {Timestamp} the corresponding Timestamp value.
 */
Timestamp.fromNumber = function(value) {
  if (isNaN(value) || !isFinite(value)) {
    return Timestamp.ZERO;
  } else if (value <= -Timestamp.TWO_PWR_63_DBL_) {
    return Timestamp.MIN_VALUE;
  } else if (value + 1 >= Timestamp.TWO_PWR_63_DBL_) {
    return Timestamp.MAX_VALUE;
  } else if (value < 0) {
    return Timestamp.fromNumber(-value).negate();
  } else {
    return new Timestamp(
               (value % Timestamp.TWO_PWR_32_DBL_) | 0,
               (value / Timestamp.TWO_PWR_32_DBL_) | 0);
  }
};

/**
 * Returns a Timestamp representing the 64-bit integer that comes by concatenating the given high and low bits. Each is assumed to use 32 bits.
 *
 * @method
 * @param {number} lowBits the low 32-bits.
 * @param {number} highBits the high 32-bits.
 * @return {Timestamp} the corresponding Timestamp value.
 */
Timestamp.fromBits = function(lowBits, highBits) {
  return new Timestamp(lowBits, highBits);
};

/**
 * Returns a Timestamp representation of the given string, written using the given radix.
 *
 * @method
 * @param {string} str the textual representation of the Timestamp.
 * @param {number} opt_radix the radix in which the text is written.
 * @return {Timestamp} the corresponding Timestamp value.
 */
Timestamp.fromString = function(str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }

  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (str.charAt(0) == '-') {
    return Timestamp.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }

  // Do several (8) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Timestamp.fromNumber(Math.pow(radix, 8));

  var result = Timestamp.ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = Timestamp.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(Timestamp.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(Timestamp.fromNumber(value));
    }
  }
  return result;
};

// NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
// from* methods on which they depend.


/**
 * A cache of the Timestamp representations of small integer values.
 * @type {Object}
 * @ignore
 */
Timestamp.INT_CACHE_ = {};

// NOTE: the compiler should inline these constant values below and then remove
// these variables, so there should be no runtime penalty for these.

/**
 * Number used repeated below in calculations.  This must appear before the
 * first call to any from* function below.
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_16_DBL_ = 1 << 16;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_24_DBL_ = 1 << 24;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_32_DBL_ = Timestamp.TWO_PWR_16_DBL_ * Timestamp.TWO_PWR_16_DBL_;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_31_DBL_ = Timestamp.TWO_PWR_32_DBL_ / 2;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_48_DBL_ = Timestamp.TWO_PWR_32_DBL_ * Timestamp.TWO_PWR_16_DBL_;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_64_DBL_ = Timestamp.TWO_PWR_32_DBL_ * Timestamp.TWO_PWR_32_DBL_;

/**
 * @type {number}
 * @ignore
 */
Timestamp.TWO_PWR_63_DBL_ = Timestamp.TWO_PWR_64_DBL_ / 2;

/** @type {Timestamp} */
Timestamp.ZERO = Timestamp.fromInt(0);

/** @type {Timestamp} */
Timestamp.ONE = Timestamp.fromInt(1);

/** @type {Timestamp} */
Timestamp.NEG_ONE = Timestamp.fromInt(-1);

/** @type {Timestamp} */
Timestamp.MAX_VALUE =
    Timestamp.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);

/** @type {Timestamp} */
Timestamp.MIN_VALUE = Timestamp.fromBits(0, 0x80000000 | 0);

/**
 * @type {Timestamp}
 * @ignore
 */
Timestamp.TWO_PWR_24_ = Timestamp.fromInt(1 << 24);

/**
 * Expose.
 */
module.exports = Timestamp;
module.exports.Timestamp = Timestamp;
},{}],27:[function(require,module,exports){
/*
 Highstock JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(K,a){"object"===typeof module&&module.exports?module.exports=K.document?a(K):a:K.Highcharts=a(K)})("undefined"!==typeof window?window:this,function(K){K=function(){var a=window,E=a.document,D=a.navigator&&a.navigator.userAgent||"",H=E&&E.createElementNS&&!!E.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,I=/(edge|msie|trident)/i.test(D)&&!window.opera,v=!H,n=/Firefox/.test(D),m=n&&4>parseInt(D.split("Firefox/")[1],10);return a.Highcharts?a.Highcharts.error(16,!0):{product:"Highstock",
version:"5.0.7",deg2rad:2*Math.PI/360,doc:E,hasBidiBug:m,hasTouch:E&&void 0!==E.documentElement.ontouchstart,isMS:I,isWebKit:/AppleWebKit/.test(D),isFirefox:n,isTouchDevice:/(Mobile|Android|Windows Phone)/.test(D),SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},symbolSizes:{},svg:H,vml:v,win:a,charts:[],marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:function(){}}}();(function(a){var E=[],D=a.charts,H=a.doc,I=a.win;a.error=function(v,n){v=a.isNumber(v)?"Highcharts error #"+
v+": www.highcharts.com/errors/"+v:v;if(n)throw Error(v);I.console&&console.log(v)};a.Fx=function(a,n,m){this.options=n;this.elem=a;this.prop=m};a.Fx.prototype={dSetter:function(){var a=this.paths[0],n=this.paths[1],m=[],z=this.now,t=a.length,q;if(1===z)m=this.toD;else if(t===n.length&&1>z)for(;t--;)q=parseFloat(a[t]),m[t]=isNaN(q)?a[t]:z*parseFloat(n[t]-q)+q;else m=n;this.elem.attr("d",m,null,!0)},update:function(){var a=this.elem,n=this.prop,m=this.now,z=this.options.step;if(this[n+"Setter"])this[n+
"Setter"]();else a.attr?a.element&&a.attr(n,m,null,!0):a.style[n]=m+this.unit;z&&z.call(a,m,this)},run:function(a,n,m){var v=this,t=function(a){return t.stopped?!1:v.step(a)},q;this.startTime=+new Date;this.start=a;this.end=n;this.unit=m;this.now=this.start;this.pos=0;t.elem=this.elem;t.prop=this.prop;t()&&1===E.push(t)&&(t.timerId=setInterval(function(){for(q=0;q<E.length;q++)E[q]()||E.splice(q--,1);E.length||clearInterval(t.timerId)},13))},step:function(a){var n=+new Date,m,v=this.options;m=this.elem;
var t=v.complete,q=v.duration,e=v.curAnim,b;if(m.attr&&!m.element)m=!1;else if(a||n>=q+this.startTime){this.now=this.end;this.pos=1;this.update();a=e[this.prop]=!0;for(b in e)!0!==e[b]&&(a=!1);a&&t&&t.call(m);m=!1}else this.pos=v.easing((n-this.startTime)/q),this.now=this.start+(this.end-this.start)*this.pos,this.update(),m=!0;return m},initPath:function(v,n,m){function z(a){var d,f;for(F=a.length;F--;)d="M"===a[F]||"L"===a[F],f=/[a-zA-Z]/.test(a[F+3]),d&&f&&a.splice(F+1,0,a[F+1],a[F+2],a[F+1],a[F+
2])}function t(a,d){for(;a.length<l;){a[0]=d[l-a.length];var f=a.slice(0,k);[].splice.apply(a,[0,0].concat(f));r&&(f=a.slice(a.length-k),[].splice.apply(a,[a.length,0].concat(f)),F--)}a[0]="M"}function q(a,d){for(var f=(l-a.length)/k;0<f&&f--;)g=a.slice().splice(a.length/u-k,k*u),g[0]=d[l-k-f*k],w&&(g[k-6]=g[k-2],g[k-5]=g[k-1]),[].splice.apply(a,[a.length/u,0].concat(g)),r&&f--}n=n||"";var e,b=v.startX,p=v.endX,w=-1<n.indexOf("C"),k=w?7:3,l,g,F;n=n.split(" ");m=m.slice();var r=v.isArea,u=r?2:1,f;
w&&(z(n),z(m));if(b&&p){for(F=0;F<b.length;F++)if(b[F]===p[0]){e=F;break}else if(b[0]===p[p.length-b.length+F]){e=F;f=!0;break}void 0===e&&(n=[])}n.length&&a.isNumber(e)&&(l=m.length+e*u*k,f?(t(n,m),q(m,n)):(t(m,n),q(n,m)));return[n,m]}};a.extend=function(a,n){var m;a||(a={});for(m in n)a[m]=n[m];return a};a.merge=function(){var v,n=arguments,m,z={},t=function(q,e){var b,p;"object"!==typeof q&&(q={});for(p in e)e.hasOwnProperty(p)&&(b=e[p],a.isObject(b,!0)&&"renderTo"!==p&&"number"!==typeof b.nodeType?
q[p]=t(q[p]||{},b):q[p]=e[p]);return q};!0===n[0]&&(z=n[1],n=Array.prototype.slice.call(n,2));m=n.length;for(v=0;v<m;v++)z=t(z,n[v]);return z};a.pInt=function(a,n){return parseInt(a,n||10)};a.isString=function(a){return"string"===typeof a};a.isArray=function(a){a=Object.prototype.toString.call(a);return"[object Array]"===a||"[object Array Iterator]"===a};a.isObject=function(v,n){return v&&"object"===typeof v&&(!n||!a.isArray(v))};a.isNumber=function(a){return"number"===typeof a&&!isNaN(a)};a.erase=
function(a,n){for(var m=a.length;m--;)if(a[m]===n){a.splice(m,1);break}};a.defined=function(a){return void 0!==a&&null!==a};a.attr=function(v,n,m){var z,t;if(a.isString(n))a.defined(m)?v.setAttribute(n,m):v&&v.getAttribute&&(t=v.getAttribute(n));else if(a.defined(n)&&a.isObject(n))for(z in n)v.setAttribute(z,n[z]);return t};a.splat=function(v){return a.isArray(v)?v:[v]};a.syncTimeout=function(a,n,m){if(n)return setTimeout(a,n,m);a.call(0,m)};a.pick=function(){var a=arguments,n,m,z=a.length;for(n=
0;n<z;n++)if(m=a[n],void 0!==m&&null!==m)return m};a.css=function(v,n){a.isMS&&!a.svg&&n&&void 0!==n.opacity&&(n.filter="alpha(opacity\x3d"+100*n.opacity+")");a.extend(v.style,n)};a.createElement=function(v,n,m,z,t){v=H.createElement(v);var q=a.css;n&&a.extend(v,n);t&&q(v,{padding:0,border:"none",margin:0});m&&q(v,m);z&&z.appendChild(v);return v};a.extendClass=function(v,n){var m=function(){};m.prototype=new v;a.extend(m.prototype,n);return m};a.pad=function(a,n,m){return Array((n||2)+1-String(a).length).join(m||
0)+a};a.relativeLength=function(a,n){return/%$/.test(a)?n*parseFloat(a)/100:parseFloat(a)};a.wrap=function(a,n,m){var v=a[n];a[n]=function(){var a=Array.prototype.slice.call(arguments),q=arguments,e=this;e.proceed=function(){v.apply(e,arguments.length?arguments:q)};a.unshift(v);a=m.apply(this,a);e.proceed=null;return a}};a.getTZOffset=function(v){var n=a.Date;return 6E4*(n.hcGetTimezoneOffset&&n.hcGetTimezoneOffset(v)||n.hcTimezoneOffset||0)};a.dateFormat=function(v,n,m){if(!a.defined(n)||isNaN(n))return a.defaultOptions.lang.invalidDate||
"";v=a.pick(v,"%Y-%m-%d %H:%M:%S");var z=a.Date,t=new z(n-a.getTZOffset(n)),q,e=t[z.hcGetHours](),b=t[z.hcGetDay](),p=t[z.hcGetDate](),w=t[z.hcGetMonth](),k=t[z.hcGetFullYear](),l=a.defaultOptions.lang,g=l.weekdays,F=l.shortWeekdays,r=a.pad,z=a.extend({a:F?F[b]:g[b].substr(0,3),A:g[b],d:r(p),e:r(p,2," "),w:b,b:l.shortMonths[w],B:l.months[w],m:r(w+1),y:k.toString().substr(2,2),Y:k,H:r(e),k:e,I:r(e%12||12),l:e%12||12,M:r(t[z.hcGetMinutes]()),p:12>e?"AM":"PM",P:12>e?"am":"pm",S:r(t.getSeconds()),L:r(Math.round(n%
1E3),3)},a.dateFormats);for(q in z)for(;-1!==v.indexOf("%"+q);)v=v.replace("%"+q,"function"===typeof z[q]?z[q](n):z[q]);return m?v.substr(0,1).toUpperCase()+v.substr(1):v};a.formatSingle=function(v,n){var m=/\.([0-9])/,z=a.defaultOptions.lang;/f$/.test(v)?(m=(m=v.match(m))?m[1]:-1,null!==n&&(n=a.numberFormat(n,m,z.decimalPoint,-1<v.indexOf(",")?z.thousandsSep:""))):n=a.dateFormat(v,n);return n};a.format=function(v,n){for(var m="{",z=!1,t,q,e,b,p=[],w;v;){m=v.indexOf(m);if(-1===m)break;t=v.slice(0,
m);if(z){t=t.split(":");q=t.shift().split(".");b=q.length;w=n;for(e=0;e<b;e++)w=w[q[e]];t.length&&(w=a.formatSingle(t.join(":"),w));p.push(w)}else p.push(t);v=v.slice(m+1);m=(z=!z)?"}":"{"}p.push(v);return p.join("")};a.getMagnitude=function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))};a.normalizeTickInterval=function(v,n,m,z,t){var q,e=v;m=a.pick(m,1);q=v/m;n||(n=t?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===z&&(1===m?n=a.grep(n,function(a){return 0===a%1}):.1>=m&&(n=[1/m])));
for(z=0;z<n.length&&!(e=n[z],t&&e*m>=v||!t&&q<=(n[z]+(n[z+1]||n[z]))/2);z++);return e=a.correctFloat(e*m,-Math.round(Math.log(.001)/Math.LN10))};a.stableSort=function(a,n){var m=a.length,v,t;for(t=0;t<m;t++)a[t].safeI=t;a.sort(function(a,e){v=n(a,e);return 0===v?a.safeI-e.safeI:v});for(t=0;t<m;t++)delete a[t].safeI};a.arrayMin=function(a){for(var n=a.length,m=a[0];n--;)a[n]<m&&(m=a[n]);return m};a.arrayMax=function(a){for(var n=a.length,m=a[0];n--;)a[n]>m&&(m=a[n]);return m};a.destroyObjectProperties=
function(a,n){for(var m in a)a[m]&&a[m]!==n&&a[m].destroy&&a[m].destroy(),delete a[m]};a.discardElement=function(v){var n=a.garbageBin;n||(n=a.createElement("div"));v&&n.appendChild(v);n.innerHTML=""};a.correctFloat=function(a,n){return parseFloat(a.toPrecision(n||14))};a.setAnimation=function(v,n){n.renderer.globalAnimation=a.pick(v,n.options.chart.animation,!0)};a.animObject=function(v){return a.isObject(v)?a.merge(v):{duration:v?500:0}};a.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,
day:864E5,week:6048E5,month:24192E5,year:314496E5};a.numberFormat=function(v,n,m,z){v=+v||0;n=+n;var t=a.defaultOptions.lang,q=(v.toString().split(".")[1]||"").length,e,b;-1===n?n=Math.min(q,20):a.isNumber(n)||(n=2);b=(Math.abs(v)+Math.pow(10,-Math.max(n,q)-1)).toFixed(n);q=String(a.pInt(b));e=3<q.length?q.length%3:0;m=a.pick(m,t.decimalPoint);z=a.pick(z,t.thousandsSep);v=(0>v?"-":"")+(e?q.substr(0,e)+z:"");v+=q.substr(e).replace(/(\d{3})(?=\d)/g,"$1"+z);n&&(v+=m+b.slice(-n));return v};Math.easeInOutSine=
function(a){return-.5*(Math.cos(Math.PI*a)-1)};a.getStyle=function(v,n){return"width"===n?Math.min(v.offsetWidth,v.scrollWidth)-a.getStyle(v,"padding-left")-a.getStyle(v,"padding-right"):"height"===n?Math.min(v.offsetHeight,v.scrollHeight)-a.getStyle(v,"padding-top")-a.getStyle(v,"padding-bottom"):(v=I.getComputedStyle(v,void 0))&&a.pInt(v.getPropertyValue(n))};a.inArray=function(a,n){return n.indexOf?n.indexOf(a):[].indexOf.call(n,a)};a.grep=function(a,n){return[].filter.call(a,n)};a.find=function(a,
n){return[].find.call(a,n)};a.map=function(a,n){for(var m=[],z=0,t=a.length;z<t;z++)m[z]=n.call(a[z],a[z],z,a);return m};a.offset=function(a){var n=H.documentElement;a=a.getBoundingClientRect();return{top:a.top+(I.pageYOffset||n.scrollTop)-(n.clientTop||0),left:a.left+(I.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}};a.stop=function(a,n){for(var m=E.length;m--;)E[m].elem!==a||n&&n!==E[m].prop||(E[m].stopped=!0)};a.each=function(a,n,m){return Array.prototype.forEach.call(a,n,m)};a.addEvent=function(v,
n,m){function z(a){a.target=a.srcElement||I;m.call(v,a)}var t=v.hcEvents=v.hcEvents||{};v.addEventListener?v.addEventListener(n,m,!1):v.attachEvent&&(v.hcEventsIE||(v.hcEventsIE={}),v.hcEventsIE[m.toString()]=z,v.attachEvent("on"+n,z));t[n]||(t[n]=[]);t[n].push(m);return function(){a.removeEvent(v,n,m)}};a.removeEvent=function(v,n,m){function z(a,b){v.removeEventListener?v.removeEventListener(a,b,!1):v.attachEvent&&(b=v.hcEventsIE[b.toString()],v.detachEvent("on"+a,b))}function t(){var a,b;if(v.nodeName)for(b in n?
(a={},a[n]=!0):a=e,a)if(e[b])for(a=e[b].length;a--;)z(b,e[b][a])}var q,e=v.hcEvents,b;e&&(n?(q=e[n]||[],m?(b=a.inArray(m,q),-1<b&&(q.splice(b,1),e[n]=q),z(n,m)):(t(),e[n]=[])):(t(),v.hcEvents={}))};a.fireEvent=function(v,n,m,z){var t;t=v.hcEvents;var q,e;m=m||{};if(H.createEvent&&(v.dispatchEvent||v.fireEvent))t=H.createEvent("Events"),t.initEvent(n,!0,!0),a.extend(t,m),v.dispatchEvent?v.dispatchEvent(t):v.fireEvent(n,t);else if(t)for(t=t[n]||[],q=t.length,m.target||a.extend(m,{preventDefault:function(){m.defaultPrevented=
!0},target:v,type:n}),n=0;n<q;n++)(e=t[n])&&!1===e.call(v,m)&&m.preventDefault();z&&!m.defaultPrevented&&z(m)};a.animate=function(v,n,m){var z,t="",q,e,b;a.isObject(m)||(z=arguments,m={duration:z[2],easing:z[3],complete:z[4]});a.isNumber(m.duration)||(m.duration=400);m.easing="function"===typeof m.easing?m.easing:Math[m.easing]||Math.easeInOutSine;m.curAnim=a.merge(n);for(b in n)a.stop(v,b),e=new a.Fx(v,m,b),q=null,"d"===b?(e.paths=e.initPath(v,v.d,n.d),e.toD=n.d,z=0,q=1):v.attr?z=v.attr(b):(z=parseFloat(a.getStyle(v,
b))||0,"opacity"!==b&&(t="px")),q||(q=n[b]),q.match&&q.match("px")&&(q=q.replace(/px/g,"")),e.run(z,q,t)};a.seriesType=function(v,n,m,z,t){var q=a.getOptions(),e=a.seriesTypes;q.plotOptions[v]=a.merge(q.plotOptions[n],m);e[v]=a.extendClass(e[n]||function(){},z);e[v].prototype.type=v;t&&(e[v].prototype.pointClass=a.extendClass(a.Point,t));return e[v]};a.uniqueKey=function(){var a=Math.random().toString(36).substring(2,9),n=0;return function(){return"highcharts-"+a+"-"+n++}}();I.jQuery&&(I.jQuery.fn.highcharts=
function(){var v=[].slice.call(arguments);if(this[0])return v[0]?(new (a[a.isString(v[0])?v.shift():"Chart"])(this[0],v[0],v[1]),this):D[a.attr(this[0],"data-highcharts-chart")]});H&&!H.defaultView&&(a.getStyle=function(v,n){var m={width:"clientWidth",height:"clientHeight"}[n];if(v.style[n])return a.pInt(v.style[n]);"opacity"===n&&(n="filter");if(m)return v.style.zoom=1,Math.max(v[m]-2*a.getStyle(v,"padding"),0);v=v.currentStyle[n.replace(/\-(\w)/g,function(a,t){return t.toUpperCase()})];"filter"===
n&&(v=v.replace(/alpha\(opacity=([0-9]+)\)/,function(a,t){return t/100}));return""===v?1:a.pInt(v)});Array.prototype.forEach||(a.each=function(a,n,m){for(var z=0,t=a.length;z<t;z++)if(!1===n.call(m,a[z],z,a))return z});Array.prototype.indexOf||(a.inArray=function(a,n){var m,z=0;if(n)for(m=n.length;z<m;z++)if(n[z]===a)return z;return-1});Array.prototype.filter||(a.grep=function(a,n){for(var m=[],z=0,t=a.length;z<t;z++)n(a[z],z)&&m.push(a[z]);return m});Array.prototype.find||(a.find=function(a,n){var m,
z=a.length;for(m=0;m<z;m++)if(n(a[m],m))return a[m]})})(K);(function(a){var E=a.each,D=a.isNumber,H=a.map,I=a.merge,v=a.pInt;a.Color=function(n){if(!(this instanceof a.Color))return new a.Color(n);this.init(n)};a.Color.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[v(a[1]),v(a[2]),v(a[3]),parseFloat(a[4],10)]}},{regex:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(a){return[v(a[1],
16),v(a[2],16),v(a[3],16),1]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[v(a[1]),v(a[2]),v(a[3]),1]}}],names:{white:"#ffffff",black:"#000000"},init:function(n){var m,z,t,q;if((this.input=n=this.names[n]||n)&&n.stops)this.stops=H(n.stops,function(e){return new a.Color(e[1])});else for(t=this.parsers.length;t--&&!z;)q=this.parsers[t],(m=q.regex.exec(n))&&(z=q.parse(m));this.rgba=z||[]},get:function(a){var m=this.input,n=this.rgba,t;this.stops?
(t=I(m),t.stops=[].concat(t.stops),E(this.stops,function(q,e){t.stops[e]=[t.stops[e][0],q.get(a)]})):t=n&&D(n[0])?"rgb"===a||!a&&1===n[3]?"rgb("+n[0]+","+n[1]+","+n[2]+")":"a"===a?n[3]:"rgba("+n.join(",")+")":m;return t},brighten:function(a){var m,n=this.rgba;if(this.stops)E(this.stops,function(t){t.brighten(a)});else if(D(a)&&0!==a)for(m=0;3>m;m++)n[m]+=v(255*a),0>n[m]&&(n[m]=0),255<n[m]&&(n[m]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this}};a.color=function(n){return new a.Color(n)}})(K);
(function(a){var E,D,H=a.addEvent,I=a.animate,v=a.attr,n=a.charts,m=a.color,z=a.css,t=a.createElement,q=a.defined,e=a.deg2rad,b=a.destroyObjectProperties,p=a.doc,w=a.each,k=a.extend,l=a.erase,g=a.grep,F=a.hasTouch,r=a.inArray,u=a.isArray,f=a.isFirefox,B=a.isMS,d=a.isObject,x=a.isString,c=a.isWebKit,y=a.merge,L=a.noop,A=a.pick,J=a.pInt,h=a.removeEvent,G=a.stop,Q=a.svg,P=a.SVG_NS,N=a.symbolSizes,S=a.win;E=a.SVGElement=function(){return this};E.prototype={opacity:1,SVG_NS:P,textProps:"direction fontSize fontWeight fontFamily fontStyle color lineHeight width textDecoration textOverflow textOutline".split(" "),
init:function(a,h){this.element="span"===h?t(h):p.createElementNS(this.SVG_NS,h);this.renderer=a},animate:function(C,h,d){h=a.animObject(A(h,this.renderer.globalAnimation,!0));0!==h.duration?(d&&(h.complete=d),I(this,C,h)):this.attr(C,null,d);return this},colorGradient:function(C,h,d){var c=this.renderer,f,G,b,A,g,B,x,M,l,r,k,J=[],e;C.linearGradient?G="linearGradient":C.radialGradient&&(G="radialGradient");if(G){b=C[G];g=c.gradients;x=C.stops;r=d.radialReference;u(b)&&(C[G]=b={x1:b[0],y1:b[1],x2:b[2],
y2:b[3],gradientUnits:"userSpaceOnUse"});"radialGradient"===G&&r&&!q(b.gradientUnits)&&(A=b,b=y(b,c.getRadialAttr(r,A),{gradientUnits:"userSpaceOnUse"}));for(k in b)"id"!==k&&J.push(k,b[k]);for(k in x)J.push(x[k]);J=J.join(",");g[J]?r=g[J].attr("id"):(b.id=r=a.uniqueKey(),g[J]=B=c.createElement(G).attr(b).add(c.defs),B.radAttr=A,B.stops=[],w(x,function(C){0===C[1].indexOf("rgba")?(f=a.color(C[1]),M=f.get("rgb"),l=f.get("a")):(M=C[1],l=1);C=c.createElement("stop").attr({offset:C[0],"stop-color":M,
"stop-opacity":l}).add(B);B.stops.push(C)}));e="url("+c.url+"#"+r+")";d.setAttribute(h,e);d.gradient=J;C.toString=function(){return e}}},applyTextOutline:function(a){var C=this.element,h,d,c,f;-1!==a.indexOf("contrast")&&(a=a.replace(/contrast/g,this.renderer.getContrast(C.style.fill)));this.fakeTS=!0;this.ySetter=this.xSetter;h=[].slice.call(C.getElementsByTagName("tspan"));a=a.split(" ");d=a[a.length-1];(c=a[0])&&"none"!==c&&(c=c.replace(/(^[\d\.]+)(.*?)$/g,function(a,C,h){return 2*C+h}),w(h,function(a){"highcharts-text-outline"===
a.getAttribute("class")&&l(h,C.removeChild(a))}),f=C.firstChild,w(h,function(a,h){0===h&&(a.setAttribute("x",C.getAttribute("x")),h=C.getAttribute("y"),a.setAttribute("y",h||0),null===h&&C.setAttribute("y",0));a=a.cloneNode(1);v(a,{"class":"highcharts-text-outline",fill:d,stroke:d,"stroke-width":c,"stroke-linejoin":"round"});C.insertBefore(a,f)}))},attr:function(a,h,d,c){var C,f=this.element,b,y=this,A;"string"===typeof a&&void 0!==h&&(C=a,a={},a[C]=h);if("string"===typeof a)y=(this[a+"Getter"]||
this._defaultGetter).call(this,a,f);else{for(C in a)h=a[C],A=!1,c||G(this,C),this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(C)&&(b||(this.symbolAttr(a),b=!0),A=!0),!this.rotation||"x"!==C&&"y"!==C||(this.doTransform=!0),A||(A=this[C+"Setter"]||this._defaultSetter,A.call(this,h,C,f),this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(C)&&this.updateShadows(C,h,A));this.doTransform&&(this.updateTransform(),this.doTransform=!1)}d&&d();return y},updateShadows:function(a,
h,d){for(var C=this.shadows,c=C.length;c--;)d.call(C[c],"height"===a?Math.max(h-(C[c].cutHeight||0),0):"d"===a?this.d:h,a,C[c])},addClass:function(a,h){var C=this.attr("class")||"";-1===C.indexOf(a)&&(h||(a=(C+(C?" ":"")+a).replace("  "," ")),this.attr("class",a));return this},hasClass:function(a){return-1!==v(this.element,"class").indexOf(a)},removeClass:function(a){v(this.element,"class",(v(this.element,"class")||"").replace(a,""));return this},symbolAttr:function(a){var C=this;w("x y r start end width height innerR anchorX anchorY".split(" "),
function(h){C[h]=A(a[h],C[h])});C.attr({d:C.renderer.symbols[C.symbolName](C.x,C.y,C.width,C.height,C)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a,h){var C,d={},c;h=h||a.strokeWidth||0;c=Math.round(h)%2/2;a.x=Math.floor(a.x||this.x||0)+c;a.y=Math.floor(a.y||this.y||0)+c;a.width=Math.floor((a.width||this.width||0)-2*c);a.height=Math.floor((a.height||this.height||0)-2*c);q(a.strokeWidth)&&(a.strokeWidth=h);for(C in a)this[C]!==a[C]&&
(this[C]=d[C]=a[C]);return d},css:function(a){var C=this.styles,h={},d=this.element,c,f,G="";c=!C;var b=["textOverflow","width"];a&&a.color&&(a.fill=a.color);if(C)for(f in a)a[f]!==C[f]&&(h[f]=a[f],c=!0);if(c){c=this.textWidth=a&&a.width&&"text"===d.nodeName.toLowerCase()&&J(a.width)||this.textWidth;C&&(a=k(C,h));this.styles=a;c&&!Q&&this.renderer.forExport&&delete a.width;if(B&&!Q)z(this.element,a);else{C=function(a,C){return"-"+C.toLowerCase()};for(f in a)-1===r(f,b)&&(G+=f.replace(/([A-Z])/g,C)+
":"+a[f]+";");G&&v(d,"style",G)}this.added&&(c&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline))}return this},strokeWidth:function(){return this["stroke-width"]||0},on:function(a,h){var C=this,d=C.element;F&&"click"===a?(d.ontouchstart=function(a){C.touchEventFired=Date.now();a.preventDefault();h.call(d,a)},d.onclick=function(a){(-1===S.navigator.userAgent.indexOf("Android")||1100<Date.now()-(C.touchEventFired||0))&&h.call(d,a)}):d["on"+a]=h;return this},setRadialReference:function(a){var C=
this.renderer.gradients[this.element.gradient];this.element.radialReference=a;C&&C.radAttr&&C.animate(this.renderer.getRadialAttr(a,C.radAttr));return this},translate:function(a,h){return this.attr({translateX:a,translateY:h})},invert:function(a){this.inverted=a;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,h=this.translateY||0,d=this.scaleX,c=this.scaleY,f=this.inverted,G=this.rotation,b=this.element;f&&(a+=this.width,h+=this.height);a=["translate("+a+","+
h+")"];f?a.push("rotate(90) scale(-1,1)"):G&&a.push("rotate("+G+" "+(b.getAttribute("x")||0)+" "+(b.getAttribute("y")||0)+")");(q(d)||q(c))&&a.push("scale("+A(d,1)+" "+A(c,1)+")");a.length&&b.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,h,d){var C,c,f,G,b={};c=this.renderer;f=c.alignedObjects;var y,g;if(a){if(this.alignOptions=a,this.alignByTranslate=h,!d||x(d))this.alignTo=C=d||"renderer",l(f,this),f.push(this),
d=null}else a=this.alignOptions,h=this.alignByTranslate,C=this.alignTo;d=A(d,c[C],c);C=a.align;c=a.verticalAlign;f=(d.x||0)+(a.x||0);G=(d.y||0)+(a.y||0);"right"===C?y=1:"center"===C&&(y=2);y&&(f+=(d.width-(a.width||0))/y);b[h?"translateX":"x"]=Math.round(f);"bottom"===c?g=1:"middle"===c&&(g=2);g&&(G+=(d.height-(a.height||0))/g);b[h?"translateY":"y"]=Math.round(G);this[this.placed?"animate":"attr"](b);this.placed=!0;this.alignAttr=b;return this},getBBox:function(a,h){var C,d=this.renderer,c,f=this.element,
G=this.styles,b,y=this.textStr,g,B=d.cache,x=d.cacheKeys,r;h=A(h,this.rotation);c=h*e;b=G&&G.fontSize;void 0!==y&&(r=y.toString(),-1===r.indexOf("\x3c")&&(r=r.replace(/[0-9]/g,"0")),r+=["",h||0,b,G&&G.width,G&&G.textOverflow].join());r&&!a&&(C=B[r]);if(!C){if(f.namespaceURI===this.SVG_NS||d.forExport){try{(g=this.fakeTS&&function(a){w(f.querySelectorAll(".highcharts-text-outline"),function(C){C.style.display=a})})&&g("none"),C=f.getBBox?k({},f.getBBox()):{width:f.offsetWidth,height:f.offsetHeight},
g&&g("")}catch(U){}if(!C||0>C.width)C={width:0,height:0}}else C=this.htmlGetBBox();d.isSVG&&(a=C.width,d=C.height,G&&"11px"===G.fontSize&&17===Math.round(d)&&(C.height=d=14),h&&(C.width=Math.abs(d*Math.sin(c))+Math.abs(a*Math.cos(c)),C.height=Math.abs(d*Math.cos(c))+Math.abs(a*Math.sin(c))));if(r&&0<C.height){for(;250<x.length;)delete B[x.shift()];B[r]||x.push(r);B[r]=C}}return C},show:function(a){return this.attr({visibility:a?"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},
fadeOut:function(a){var C=this;C.animate({opacity:0},{duration:a||150,complete:function(){C.attr({y:-9999})}})},add:function(a){var C=this.renderer,h=this.element,d;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;void 0!==this.textStr&&C.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)d=this.zIndexSetter();d||(a?a.element:C.box).appendChild(h);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var h=a.parentNode;h&&h.removeChild(a)},destroy:function(){var a=
this.element||{},h=this.renderer.isSVG&&"SPAN"===a.nodeName&&this.parentGroup,d,c;a.onclick=a.onmouseout=a.onmouseover=a.onmousemove=a.point=null;G(this);this.clipPath&&(this.clipPath=this.clipPath.destroy());if(this.stops){for(c=0;c<this.stops.length;c++)this.stops[c]=this.stops[c].destroy();this.stops=null}this.safeRemoveChild(a);for(this.destroyShadows();h&&h.div&&0===h.div.childNodes.length;)a=h.parentGroup,this.safeRemoveChild(h.div),delete h.div,h=a;this.alignTo&&l(this.renderer.alignedObjects,
this);for(d in this)delete this[d];return null},shadow:function(a,h,d){var C=[],c,f,G=this.element,b,y,g,B;if(!a)this.destroyShadows();else if(!this.shadows){y=A(a.width,3);g=(a.opacity||.15)/y;B=this.parentInverted?"(-1,-1)":"("+A(a.offsetX,1)+", "+A(a.offsetY,1)+")";for(c=1;c<=y;c++)f=G.cloneNode(0),b=2*y+1-2*c,v(f,{isShadow:"true",stroke:a.color||"#000000","stroke-opacity":g*c,"stroke-width":b,transform:"translate"+B,fill:"none"}),d&&(v(f,"height",Math.max(v(f,"height")-b,0)),f.cutHeight=b),h?
h.element.appendChild(f):G.parentNode.insertBefore(f,G),C.push(f);this.shadows=C}return this},destroyShadows:function(){w(this.shadows||[],function(a){this.safeRemoveChild(a)},this);this.shadows=void 0},xGetter:function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)},_defaultGetter:function(a){a=A(this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,h,d){a&&a.join&&(a=
a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");d.setAttribute(h,a);this[h]=a},dashstyleSetter:function(a){var h,C=this["stroke-width"];"inherit"===C&&(C=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(h=a.length;h--;)a[h]=J(a[h])*C;a=a.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",
a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,h,d){this[h]=a;d.setAttribute(h,a)},titleSetter:function(a){var h=this.element.getElementsByTagName("title")[0];h||(h=p.createElementNS(this.SVG_NS,"title"),this.element.appendChild(h));h.firstChild&&h.removeChild(h.firstChild);h.appendChild(p.createTextNode(String(A(a),"").replace(/<[^>]*>/g,"")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,
this.textStr=a,this.added&&this.renderer.buildText(this))},fillSetter:function(a,h,d){"string"===typeof a?d.setAttribute(h,a):a&&this.colorGradient(a,h,d)},visibilitySetter:function(a,h,d){"inherit"===a?d.removeAttribute(h):d.setAttribute(h,a)},zIndexSetter:function(a,h){var C=this.renderer,d=this.parentGroup,c=(d||C).element||C.box,f,G=this.element,b;f=this.added;var y;q(a)&&(G.zIndex=a,a=+a,this[h]===a&&(f=!1),this[h]=a);if(f){(a=this.zIndex)&&d&&(d.handleZ=!0);h=c.childNodes;for(y=0;y<h.length&&
!b;y++)d=h[y],f=d.zIndex,d!==G&&(J(f)>a||!q(a)&&q(f)||0>a&&!q(f)&&c!==C.box)&&(c.insertBefore(G,d),b=!0);b||c.appendChild(G)}return b},_defaultSetter:function(a,h,d){d.setAttribute(h,a)}};E.prototype.yGetter=E.prototype.xGetter;E.prototype.translateXSetter=E.prototype.translateYSetter=E.prototype.rotationSetter=E.prototype.verticalAlignSetter=E.prototype.scaleXSetter=E.prototype.scaleYSetter=function(a,h){this[h]=a;this.doTransform=!0};E.prototype["stroke-widthSetter"]=E.prototype.strokeSetter=function(a,
h,d){this[h]=a;this.stroke&&this["stroke-width"]?(E.prototype.fillSetter.call(this,this.stroke,"stroke",d),d.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===h&&0===a&&this.hasStroke&&(d.removeAttribute("stroke"),this.hasStroke=!1)};D=a.SVGRenderer=function(){this.init.apply(this,arguments)};D.prototype={Element:E,SVG_NS:P,init:function(a,h,d,G,b,y){var C;G=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"}).css(this.getStyle(G));C=G.element;
a.appendChild(C);-1===a.innerHTML.indexOf("xmlns")&&v(C,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=C;this.boxWrapper=G;this.alignedObjects=[];this.url=(f||c)&&p.getElementsByTagName("base").length?S.location.href.replace(/#.*?$/,"").replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(p.createTextNode("Created with Highstock 5.0.7"));this.defs=this.createElement("defs").add();this.allowHTML=y;this.forExport=b;this.gradients=
{};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(h,d,!1);var A;f&&a.getBoundingClientRect&&(h=function(){z(a,{left:0,top:0});A=a.getBoundingClientRect();z(a,{left:Math.ceil(A.left)-A.left+"px",top:Math.ceil(A.top)-A.top+"px"})},h(),this.unSubPixelFix=H(S,"resize",h))},getStyle:function(a){return this.style=k({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},setStyle:function(a){this.boxWrapper.css(this.getStyle(a))},isHidden:function(){return!this.boxWrapper.getBBox().width},
destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();b(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=null},createElement:function(a){var h=new this.Element;h.init(this,a);return h},draw:L,getRadialAttr:function(a,h){return{cx:a[0]-a[2]/2+h.cx*a[2],cy:a[1]-a[2]/2+h.cy*a[2],r:h.r*a[2]}},buildText:function(a){var h=a.element,d=this,c=d.forExport,f=A(a.textStr,"").toString(),
C=-1!==f.indexOf("\x3c"),G=h.childNodes,b,y,B,r,x=v(h,"x"),l=a.styles,u=a.textWidth,k=l&&l.lineHeight,e=l&&l.textOutline,F=l&&"ellipsis"===l.textOverflow,L=l&&"nowrap"===l.whiteSpace,t=l&&l.fontSize,q,m=G.length,l=u&&!a.added&&this.box,n=function(a){var c;c=/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:t||d.style.fontSize||12;return k?J(k):d.fontMetrics(c,a.getAttribute("style")?a:h).h};q=[f,F,L,k,e,t,u].join();if(q!==a.textCache){for(a.textCache=q;m--;)h.removeChild(G[m]);C||e||F||u||-1!==
f.indexOf(" ")?(b=/<.*class="([^"]+)".*>/,y=/<.*style="([^"]+)".*>/,B=/<.*href="(http[^"]+)".*>/,l&&l.appendChild(h),f=C?f.replace(/<(b|strong)>/g,'\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g,'\x3cspan style\x3d"font-style:italic"\x3e').replace(/<a/g,"\x3cspan").replace(/<\/(b|strong|i|em|a)>/g,"\x3c/span\x3e").split(/<br.*?>/g):[f],f=g(f,function(a){return""!==a}),w(f,function(f,C){var G,A=0;f=f.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||\x3cspan").replace(/<\/span>/g,"\x3c/span\x3e|||");
G=f.split("|||");w(G,function(f){if(""!==f||1===G.length){var g={},l=p.createElementNS(d.SVG_NS,"tspan"),k,J;b.test(f)&&(k=f.match(b)[1],v(l,"class",k));y.test(f)&&(J=f.match(y)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),v(l,"style",J));B.test(f)&&!c&&(v(l,"onclick",'location.href\x3d"'+f.match(B)[1]+'"'),z(l,{cursor:"pointer"}));f=(f.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e");if(" "!==f){l.appendChild(p.createTextNode(f));A?g.dx=0:C&&null!==x&&(g.x=x);v(l,g);
h.appendChild(l);!A&&C&&(!Q&&c&&z(l,{display:"block"}),v(l,"dy",n(l)));if(u){g=f.replace(/([^\^])-/g,"$1- ").split(" ");k=1<G.length||C||1<g.length&&!L;for(var e,w,M=[],t=n(l),q=a.rotation,m=f,N=m.length;(k||F)&&(g.length||M.length);)a.rotation=0,e=a.getBBox(!0),w=e.width,!Q&&d.forExport&&(w=d.measureSpanWidth(l.firstChild.data,a.styles)),e=w>u,void 0===r&&(r=e),F&&r?(N/=2,""===m||!e&&.5>N?g=[]:(m=f.substring(0,m.length+(e?-1:1)*Math.ceil(N)),g=[m+(3<u?"\u2026":"")],l.removeChild(l.firstChild))):
e&&1!==g.length?(l.removeChild(l.firstChild),M.unshift(g.pop())):(g=M,M=[],g.length&&!L&&(l=p.createElementNS(P,"tspan"),v(l,{dy:t,x:x}),J&&v(l,"style",J),h.appendChild(l)),w>u&&(u=w)),g.length&&l.appendChild(p.createTextNode(g.join(" ").replace(/- /g,"-")));a.rotation=q}A++}}})}),r&&a.attr("title",a.textStr),l&&l.removeChild(h),e&&a.applyTextOutline&&a.applyTextOutline(e)):h.appendChild(p.createTextNode(f.replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e")))}},getContrast:function(a){a=m(a).rgba;return 510<
a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,h,d,f,c,G,b,g,A){var C=this.label(a,h,d,A,null,null,null,null,"button"),l=0;C.attr(y({padding:8,r:2},c));var r,x,u,J;c=y({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",cursor:"pointer",fontWeight:"normal"}},c);r=c.style;delete c.style;G=y(c,{fill:"#e6e6e6"},G);x=G.style;delete G.style;b=y(c,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},b);u=b.style;delete b.style;g=y(c,{style:{color:"#cccccc"}},g);J=g.style;
delete g.style;H(C.element,B?"mouseover":"mouseenter",function(){3!==l&&C.setState(1)});H(C.element,B?"mouseout":"mouseleave",function(){3!==l&&C.setState(l)});C.setState=function(a){1!==a&&(C.state=l=a);C.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][a||0]);C.attr([c,G,b,g][a||0]).css([r,x,u,J][a||0])};C.attr(c).css(k({cursor:"default"},r));return C.on("click",function(a){3!==l&&f.call(C,a)})},crispLine:function(a,
h){a[1]===a[4]&&(a[1]=a[4]=Math.round(a[1])-h%2/2);a[2]===a[5]&&(a[2]=a[5]=Math.round(a[2])+h%2/2);return a},path:function(a){var h={fill:"none"};u(a)?h.d=a:d(a)&&k(h,a);return this.createElement("path").attr(h)},circle:function(a,h,c){a=d(a)?a:{x:a,y:h,r:c};h=this.createElement("circle");h.xSetter=h.ySetter=function(a,h,d){d.setAttribute("c"+h,a)};return h.attr(a)},arc:function(a,h,c,f,G,b){d(a)&&(h=a.y,c=a.r,f=a.innerR,G=a.start,b=a.end,a=a.x);a=this.symbol("arc",a||0,h||0,c||0,c||0,{innerR:f||
0,start:G||0,end:b||0});a.r=c;return a},rect:function(a,h,c,f,G,b){G=d(a)?a.r:G;var C=this.createElement("rect");a=d(a)?a:void 0===a?{}:{x:a,y:h,width:Math.max(c,0),height:Math.max(f,0)};void 0!==b&&(a.strokeWidth=b,a=C.crisp(a));a.fill="none";G&&(a.r=G);C.rSetter=function(a,h,d){v(d,{rx:a,ry:a})};return C.attr(a)},setSize:function(a,h,d){var c=this.alignedObjects,f=c.length;this.width=a;this.height=h;for(this.boxWrapper.animate({width:a,height:h},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+
" "+this.attr("height")})},duration:A(d,!0)?void 0:0});f--;)c[f].align()},g:function(a){var h=this.createElement("g");return a?h.attr({"class":"highcharts-"+a}):h},image:function(a,h,d,c,f){var G={preserveAspectRatio:"none"};1<arguments.length&&k(G,{x:h,y:d,width:c,height:f});G=this.createElement("image").attr(G);G.element.setAttributeNS?G.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):G.element.setAttribute("hc-svg-href",a);return G},symbol:function(a,h,d,c,f,G){var b=this,C,y=this.symbols[a],
g=q(h)&&y&&this.symbols[a](Math.round(h),Math.round(d),c,f,G),l=/^url\((.*?)\)$/,B,r;y?(C=this.path(g),C.attr("fill","none"),k(C,{symbolName:a,x:h,y:d,width:c,height:f}),G&&k(C,G)):l.test(a)&&(B=a.match(l)[1],C=this.image(B),C.imgwidth=A(N[B]&&N[B].width,G&&G.width),C.imgheight=A(N[B]&&N[B].height,G&&G.height),r=function(){C.attr({width:C.width,height:C.height})},w(["width","height"],function(a){C[a+"Setter"]=function(a,h){var d={},c=this["img"+h],f="width"===h?"translateX":"translateY";this[h]=a;
q(c)&&(this.element&&this.element.setAttribute(h,c),this.alignByTranslate||(d[f]=((this[h]||0)-c)/2,this.attr(d)))}}),q(h)&&C.attr({x:h,y:d}),C.isImg=!0,q(C.imgwidth)&&q(C.imgheight)?r():(C.attr({width:0,height:0}),t("img",{onload:function(){var a=n[b.chartIndex];0===this.width&&(z(this,{position:"absolute",top:"-999em"}),p.body.appendChild(this));N[B]={width:this.width,height:this.height};C.imgwidth=this.width;C.imgheight=this.height;C.element&&r();this.parentNode&&this.parentNode.removeChild(this);
b.imgCount--;if(!b.imgCount&&a&&a.onload)a.onload()},src:B}),this.imgCount++));return C},symbols:{circle:function(a,h,d,c){return this.arc(a+d/2,h+c/2,d/2,c/2,{start:0,end:2*Math.PI,open:!1})},square:function(a,h,d,c){return["M",a,h,"L",a+d,h,a+d,h+c,a,h+c,"Z"]},triangle:function(a,h,d,c){return["M",a+d/2,h,"L",a+d,h+c,a,h+c,"Z"]},"triangle-down":function(a,h,d,c){return["M",a,h,"L",a+d,h,a+d/2,h+c,"Z"]},diamond:function(a,h,d,c){return["M",a+d/2,h,"L",a+d,h+c/2,a+d/2,h+c,a,h+c/2,"Z"]},arc:function(a,
h,d,c,f){var G=f.start,b=f.r||d,C=f.r||c||d,y=f.end-.001;d=f.innerR;c=f.open;var g=Math.cos(G),A=Math.sin(G),l=Math.cos(y),y=Math.sin(y);f=f.end-G<Math.PI?0:1;b=["M",a+b*g,h+C*A,"A",b,C,0,f,1,a+b*l,h+C*y];q(d)&&b.push(c?"M":"L",a+d*l,h+d*y,"A",d,d,0,f,0,a+d*g,h+d*A);b.push(c?"":"Z");return b},callout:function(a,h,d,c,f){var G=Math.min(f&&f.r||0,d,c),b=G+6,y=f&&f.anchorX;f=f&&f.anchorY;var g;g=["M",a+G,h,"L",a+d-G,h,"C",a+d,h,a+d,h,a+d,h+G,"L",a+d,h+c-G,"C",a+d,h+c,a+d,h+c,a+d-G,h+c,"L",a+G,h+c,"C",
a,h+c,a,h+c,a,h+c-G,"L",a,h+G,"C",a,h,a,h,a+G,h];y&&y>d?f>h+b&&f<h+c-b?g.splice(13,3,"L",a+d,f-6,a+d+6,f,a+d,f+6,a+d,h+c-G):g.splice(13,3,"L",a+d,c/2,y,f,a+d,c/2,a+d,h+c-G):y&&0>y?f>h+b&&f<h+c-b?g.splice(33,3,"L",a,f+6,a-6,f,a,f-6,a,h+G):g.splice(33,3,"L",a,c/2,y,f,a,c/2,a,h+G):f&&f>c&&y>a+b&&y<a+d-b?g.splice(23,3,"L",y+6,h+c,y,h+c+6,y-6,h+c,a+G,h+c):f&&0>f&&y>a+b&&y<a+d-b&&g.splice(3,3,"L",y-6,h,y,h-6,y+6,h,d-G,h);return g}},clipRect:function(h,d,c,f){var G=a.uniqueKey(),b=this.createElement("clipPath").attr({id:G}).add(this.defs);
h=this.rect(h,d,c,f,0).add(b);h.id=G;h.clipPath=b;h.count=0;return h},text:function(a,h,d,c){var f=!Q&&this.forExport,G={};if(c&&(this.allowHTML||!this.forExport))return this.html(a,h,d);G.x=Math.round(h||0);d&&(G.y=Math.round(d));if(a||0===a)G.text=a;a=this.createElement("text").attr(G);f&&a.css({position:"absolute"});c||(a.xSetter=function(a,h,d){var c=d.getElementsByTagName("tspan"),f,G=d.getAttribute(h),b;for(b=0;b<c.length;b++)f=c[b],f.getAttribute(h)===G&&f.setAttribute(h,a);d.setAttribute(h,
a)});return a},fontMetrics:function(a,h){a=a||h&&h.style&&h.style.fontSize||this.style&&this.style.fontSize;a=/px/.test(a)?J(a):/em/.test(a)?parseFloat(a)*(h?this.fontMetrics(null,h.parentNode).f:16):12;h=24>a?a+3:Math.round(1.2*a);return{h:h,b:Math.round(.8*h),f:a}},rotCorr:function(a,h,d){var c=a;h&&d&&(c=Math.max(c*Math.cos(h*e),4));return{x:-a/3*Math.sin(h*e),y:c}},label:function(a,d,c,f,G,b,g,A,l){var C=this,B=C.g("button"!==l&&"label"),r=B.text=C.text("",0,0,g).attr({zIndex:1}),x,u,J=0,e=3,
p=0,F,L,Q,P,t,m={},n,N,z=/^url\((.*?)\)$/.test(f),M=z,v,S,R,O;l&&B.addClass("highcharts-"+l);M=z;v=function(){return(n||0)%2/2};S=function(){var a=r.element.style,h={};u=(void 0===F||void 0===L||t)&&q(r.textStr)&&r.getBBox();B.width=(F||u.width||0)+2*e+p;B.height=(L||u.height||0)+2*e;N=e+C.fontMetrics(a&&a.fontSize,r).b;M&&(x||(B.box=x=C.symbols[f]||z?C.symbol(f):C.rect(),x.addClass(("button"===l?"":"highcharts-label-box")+(l?" highcharts-"+l+"-box":"")),x.add(B),a=v(),h.x=a,h.y=(A?-N:0)+a),h.width=
Math.round(B.width),h.height=Math.round(B.height),x.attr(k(h,m)),m={})};R=function(){var a=p+e,h;h=A?0:N;q(F)&&u&&("center"===t||"right"===t)&&(a+={center:.5,right:1}[t]*(F-u.width));if(a!==r.x||h!==r.y)r.attr("x",a),void 0!==h&&r.attr("y",h);r.x=a;r.y=h};O=function(a,h){x?x.attr(a,h):m[a]=h};B.onAdd=function(){r.add(B);B.attr({text:a||0===a?a:"",x:d,y:c});x&&q(G)&&B.attr({anchorX:G,anchorY:b})};B.widthSetter=function(a){F=a};B.heightSetter=function(a){L=a};B["text-alignSetter"]=function(a){t=a};
B.paddingSetter=function(a){q(a)&&a!==e&&(e=B.padding=a,R())};B.paddingLeftSetter=function(a){q(a)&&a!==p&&(p=a,R())};B.alignSetter=function(a){a={left:0,center:.5,right:1}[a];a!==J&&(J=a,u&&B.attr({x:Q}))};B.textSetter=function(a){void 0!==a&&r.textSetter(a);S();R()};B["stroke-widthSetter"]=function(a,h){a&&(M=!0);n=this["stroke-width"]=a;O(h,a)};B.strokeSetter=B.fillSetter=B.rSetter=function(a,h){"fill"===h&&a&&(M=!0);O(h,a)};B.anchorXSetter=function(a,h){G=a;O(h,Math.round(a)-v()-Q)};B.anchorYSetter=
function(a,h){b=a;O(h,a-P)};B.xSetter=function(a){B.x=a;J&&(a-=J*((F||u.width)+2*e));Q=Math.round(a);B.attr("translateX",Q)};B.ySetter=function(a){P=B.y=Math.round(a);B.attr("translateY",P)};var T=B.css;return k(B,{css:function(a){if(a){var h={};a=y(a);w(B.textProps,function(d){void 0!==a[d]&&(h[d]=a[d],delete a[d])});r.css(h)}return T.call(B,a)},getBBox:function(){return{width:u.width+2*e,height:u.height+2*e,x:u.x-e,y:u.y-e}},shadow:function(a){a&&(S(),x&&x.shadow(a));return B},destroy:function(){h(B.element,
"mouseenter");h(B.element,"mouseleave");r&&(r=r.destroy());x&&(x=x.destroy());E.prototype.destroy.call(B);B=C=S=R=O=null}})}};a.Renderer=D})(K);(function(a){var E=a.attr,D=a.createElement,H=a.css,I=a.defined,v=a.each,n=a.extend,m=a.isFirefox,z=a.isMS,t=a.isWebKit,q=a.pInt,e=a.SVGRenderer,b=a.win,p=a.wrap;n(a.SVGElement.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&"SPAN"===b.tagName&&a.width)delete a.width,this.textWidth=b,this.updateTransform();a&&"ellipsis"===a.textOverflow&&(a.whiteSpace=
"nowrap",a.overflow="hidden");this.styles=n(this.styles,a);H(this.element,a);return this},htmlGetBBox:function(){var a=this.element;"text"===a.nodeName&&(a.style.position="absolute");return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,l=this.translateX||0,g=this.translateY||0,e=this.x||0,r=this.y||0,u=this.textAlign||"left",f={left:0,center:.5,right:1}[u],B=this.styles;H(b,{marginLeft:l,marginTop:g});
this.shadows&&v(this.shadows,function(a){H(a,{marginLeft:l+1,marginTop:g+1})});this.inverted&&v(b.childNodes,function(d){a.invertChild(d,b)});if("SPAN"===b.tagName){var d=this.rotation,x=q(this.textWidth),c=B&&B.whiteSpace,y=[d,u,b.innerHTML,this.textWidth,this.textAlign].join();y!==this.cTT&&(B=a.fontMetrics(b.style.fontSize).b,I(d)&&this.setSpanRotation(d,f,B),H(b,{width:"",whiteSpace:c||"nowrap"}),b.offsetWidth>x&&/[ \-]/.test(b.textContent||b.innerText)&&H(b,{width:x+"px",display:"block",whiteSpace:c||
"normal"}),this.getSpanCorrection(b.offsetWidth,B,f,d,u));H(b,{left:e+(this.xCorr||0)+"px",top:r+(this.yCorr||0)+"px"});t&&(B=b.offsetHeight);this.cTT=y}}else this.alignOnAdd=!0},setSpanRotation:function(a,k,l){var g={},e=z?"-ms-transform":t?"-webkit-transform":m?"MozTransform":b.opera?"-o-transform":"";g[e]=g.transform="rotate("+a+"deg)";g[e+(m?"Origin":"-origin")]=g.transformOrigin=100*k+"% "+l+"px";H(this.element,g)},getSpanCorrection:function(a,b,l){this.xCorr=-a*l;this.yCorr=-b}});n(e.prototype,
{html:function(a,b,l){var g=this.createElement("span"),k=g.element,r=g.renderer,u=r.isSVG,f=function(a,d){v(["opacity","visibility"],function(f){p(a,f+"Setter",function(a,f,b,g){a.call(this,f,b,g);d[b]=f})})};g.textSetter=function(a){a!==k.innerHTML&&delete this.bBox;k.innerHTML=this.textStr=a;g.htmlUpdateTransform()};u&&f(g,g.element.style);g.xSetter=g.ySetter=g.alignSetter=g.rotationSetter=function(a,d){"align"===d&&(d="textAlign");g[d]=a;g.htmlUpdateTransform()};g.attr({text:a,x:Math.round(b),
y:Math.round(l)}).css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize,position:"absolute"});k.style.whiteSpace="nowrap";g.css=g.htmlCss;u&&(g.add=function(a){var d,b=r.box.parentNode,c=[];if(this.parentGroup=a){if(d=a.div,!d){for(;a;)c.push(a),a=a.parentGroup;v(c.reverse(),function(a){var y,A=E(a.element,"class");A&&(A={className:A});d=a.div=a.div||D("div",A,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&
a.styles.pointerEvents},d||b);y=d.style;n(a,{on:function(){g.on.apply({element:c[0].div},arguments);return a},translateXSetter:function(d,h){y.left=d+"px";a[h]=d;a.doTransform=!0},translateYSetter:function(d,h){y.top=d+"px";a[h]=d;a.doTransform=!0}});f(a,y)})}}else d=b;d.appendChild(k);g.added=!0;g.alignOnAdd&&g.htmlUpdateTransform();return g});return g}})})(K);(function(a){var E,D,H=a.createElement,I=a.css,v=a.defined,n=a.deg2rad,m=a.discardElement,z=a.doc,t=a.each,q=a.erase,e=a.extend;E=a.extendClass;
var b=a.isArray,p=a.isNumber,w=a.isObject,k=a.merge;D=a.noop;var l=a.pick,g=a.pInt,F=a.SVGElement,r=a.SVGRenderer,u=a.win;a.svg||(D={docMode8:z&&8===z.documentMode,init:function(a,b){var d=["\x3c",b,' filled\x3d"f" stroked\x3d"f"'],f=["position: ","absolute",";"],c="div"===b;("shape"===b||c)&&f.push("left:0;top:0;width:1px;height:1px;");f.push("visibility: ",c?"hidden":"visible");d.push(' style\x3d"',f.join(""),'"/\x3e');b&&(d=c||"span"===b||"img"===b?d.join(""):a.prepVML(d),this.element=H(d));this.renderer=
a},add:function(a){var f=this.renderer,d=this.element,b=f.box,c=a&&a.inverted,b=a?a.element||a:b;a&&(this.parentGroup=a);c&&f.invertChild(d,b);b.appendChild(d);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();this.className&&this.attr("class",this.className);return this},updateTransform:F.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=Math.cos(a*n),d=Math.sin(a*n);I(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11\x3d",
b,", M12\x3d",-d,", M21\x3d",d,", M22\x3d",b,", sizingMethod\x3d'auto expand')"].join(""):"none"})},getSpanCorrection:function(a,b,d,g,c){var f=g?Math.cos(g*n):1,B=g?Math.sin(g*n):0,A=l(this.elemHeight,this.element.offsetHeight),r;this.xCorr=0>f&&-a;this.yCorr=0>B&&-A;r=0>f*B;this.xCorr+=B*b*(r?1-d:d);this.yCorr-=f*b*(g?r?d:1-d:1);c&&"left"!==c&&(this.xCorr-=a*d*(0>f?-1:1),g&&(this.yCorr-=A*d*(0>B?-1:1)),I(this.element,{textAlign:c}))},pathToVML:function(a){for(var f=a.length,d=[];f--;)p(a[f])?d[f]=
Math.round(10*a[f])-5:"Z"===a[f]?d[f]="x":(d[f]=a[f],!a.isArc||"wa"!==a[f]&&"at"!==a[f]||(d[f+5]===d[f+7]&&(d[f+7]+=a[f+7]>a[f+5]?1:-1),d[f+6]===d[f+8]&&(d[f+8]+=a[f+8]>a[f+6]?1:-1)));return d.join(" ")||"x"},clip:function(a){var f=this,d;a?(d=a.members,q(d,f),d.push(f),f.destroyClip=function(){q(d,f)},a=a.getCSS(f)):(f.destroyClip&&f.destroyClip(),a={clip:f.docMode8?"inherit":"rect(auto)"});return f.css(a)},css:F.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&m(a)},destroy:function(){this.destroyClip&&
this.destroyClip();return F.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+a]=function(){var a=u.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var d;a=a.split(/[ ,]/);d=a.length;if(9===d||11===d)a[d-4]=a[d-2]=g(a[d-2])-10*b;return a.join(" ")},shadow:function(a,b,d){var f=[],c,y=this.element,r=this.renderer,A,B=y.style,h,G=y.path,u,k,e,p;G&&"string"!==typeof G.value&&(G="x");k=G;if(a){e=l(a.width,3);p=(a.opacity||.15)/e;for(c=1;3>=c;c++)u=2*e+1-2*c,d&&
(k=this.cutOffPath(G.value,u+.5)),h=['\x3cshape isShadow\x3d"true" strokeweight\x3d"',u,'" filled\x3d"false" path\x3d"',k,'" coordsize\x3d"10 10" style\x3d"',y.style.cssText,'" /\x3e'],A=H(r.prepVML(h),null,{left:g(B.left)+l(a.offsetX,1),top:g(B.top)+l(a.offsetY,1)}),d&&(A.cutOff=u+1),h=['\x3cstroke color\x3d"',a.color||"#000000",'" opacity\x3d"',p*c,'"/\x3e'],H(r.prepVML(h),null,null,A),b?b.element.appendChild(A):y.parentNode.insertBefore(A,y),f.push(A);this.shadows=f}return this},updateShadows:D,
setAttr:function(a,b){this.docMode8?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){(this.added?this.element:this).className=a},dashstyleSetter:function(a,b,d){(d.getElementsByTagName("stroke")[0]||H(this.renderer.prepVML(["\x3cstroke/\x3e"]),null,null,d))[b]=a||"solid";this[b]=a},dSetter:function(a,b,d){var f=this.shadows;a=a||[];this.d=a.join&&a.join(" ");d.path=a=this.pathToVML(a);if(f)for(d=f.length;d--;)f[d].path=f[d].cutOff?this.cutOffPath(a,f[d].cutOff):a;this.setAttr(b,
a)},fillSetter:function(a,b,d){var f=d.nodeName;"SPAN"===f?d.style.color=a:"IMG"!==f&&(d.filled="none"!==a,this.setAttr("fillcolor",this.renderer.color(a,d,b,this)))},"fill-opacitySetter":function(a,b,d){H(this.renderer.prepVML(["\x3c",b.split("-")[0],' opacity\x3d"',a,'"/\x3e']),null,null,d)},opacitySetter:D,rotationSetter:function(a,b,d){d=d.style;this[b]=d[b]=a;d.left=-Math.round(Math.sin(a*n)+1)+"px";d.top=Math.round(Math.cos(a*n))+"px"},strokeSetter:function(a,b,d){this.setAttr("strokecolor",
this.renderer.color(a,d,b,this))},"stroke-widthSetter":function(a,b,d){d.stroked=!!a;this[b]=a;p(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,d){"inherit"===a&&(a="visible");this.shadows&&t(this.shadows,function(d){d.style[b]=a});"DIV"===d.nodeName&&(a="hidden"===a?"-999em":0,this.docMode8||(d.style[b]=a?"visible":"hidden"),b="top");d.style[b]=a},xSetter:function(a,b,d){this[b]=a;"x"===b?b="left":"y"===b&&(b="top");this.updateClipping?
(this[b]=a,this.updateClipping()):d.style[b]=a},zIndexSetter:function(a,b,d){d.style[b]=a}},D["stroke-opacitySetter"]=D["fill-opacitySetter"],a.VMLElement=D=E(F,D),D.prototype.ySetter=D.prototype.widthSetter=D.prototype.heightSetter=D.prototype.xSetter,D={Element:D,isIE8:-1<u.navigator.userAgent.indexOf("MSIE 8.0"),init:function(a,b,d){var f,c;this.alignedObjects=[];f=this.createElement("div").css({position:"relative"});c=f.element;a.appendChild(f.element);this.isVML=!0;this.box=c;this.boxWrapper=
f;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(b,d,!1);if(!z.namespaces.hcv){z.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{z.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(y){z.styleSheets[0].cssText+="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},
clipRect:function(a,b,d,g){var c=this.createElement(),f=w(a);return e(c,{members:[],count:0,left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:d)-1,height:(f?a.height:g)-1,getCSS:function(a){var d=a.element,c=d.nodeName,h=a.inverted,b=this.top-("shape"===c?d.offsetTop:0),f=this.left,d=f+this.width,g=b+this.height,b={clip:"rect("+Math.round(h?f:b)+"px,"+Math.round(h?g:d)+"px,"+Math.round(h?d:g)+"px,"+Math.round(h?b:f)+"px)"};!h&&a.docMode8&&"DIV"===c&&e(b,{width:d+"px",height:g+"px"});return b},updateClipping:function(){t(c.members,
function(a){a.element&&a.css(c.getCSS(a))})}})},color:function(b,g,d,l){var c=this,f,r=/^rgba/,A,u,h="none";b&&b.linearGradient?u="gradient":b&&b.radialGradient&&(u="pattern");if(u){var G,x,k=b.linearGradient||b.radialGradient,e,B,C,p,F,w="";b=b.stops;var q,m=[],n=function(){A=['\x3cfill colors\x3d"'+m.join(",")+'" opacity\x3d"',C,'" o:opacity2\x3d"',B,'" type\x3d"',u,'" ',w,'focus\x3d"100%" method\x3d"any" /\x3e'];H(c.prepVML(A),null,null,g)};e=b[0];q=b[b.length-1];0<e[0]&&b.unshift([0,e[1]]);1>
q[0]&&b.push([1,q[1]]);t(b,function(h,d){r.test(h[1])?(f=a.color(h[1]),G=f.get("rgb"),x=f.get("a")):(G=h[1],x=1);m.push(100*h[0]+"% "+G);d?(C=x,p=G):(B=x,F=G)});if("fill"===d)if("gradient"===u)d=k.x1||k[0]||0,b=k.y1||k[1]||0,e=k.x2||k[2]||0,k=k.y2||k[3]||0,w='angle\x3d"'+(90-180*Math.atan((k-b)/(e-d))/Math.PI)+'"',n();else{var h=k.r,z=2*h,v=2*h,D=k.cx,E=k.cy,I=g.radialReference,K,h=function(){I&&(K=l.getBBox(),D+=(I[0]-K.x)/K.width-.5,E+=(I[1]-K.y)/K.height-.5,z*=I[2]/K.width,v*=I[2]/K.height);w=
'src\x3d"'+a.getOptions().global.VMLRadialGradientURL+'" size\x3d"'+z+","+v+'" origin\x3d"0.5,0.5" position\x3d"'+D+","+E+'" color2\x3d"'+F+'" ';n()};l.added?h():l.onAdd=h;h=p}else h=G}else r.test(b)&&"IMG"!==g.tagName?(f=a.color(b),l[d+"-opacitySetter"](f.get("a"),d,g),h=f.get("rgb")):(h=g.getElementsByTagName(d),h.length&&(h[0].opacity=1,h[0].type="solid"),h=b);return h},prepVML:function(a){var b=this.isIE8;a=a.join("");b?(a=a.replace("/\x3e",' xmlns\x3d"urn:schemas-microsoft-com:vml" /\x3e'),a=
-1===a.indexOf('style\x3d"')?a.replace("/\x3e",' style\x3d"display:inline-block;behavior:url(#default#VML);" /\x3e'):a.replace('style\x3d"','style\x3d"display:inline-block;behavior:url(#default#VML);')):a=a.replace("\x3c","\x3chcv:");return a},text:r.prototype.html,path:function(a){var f={coordsize:"10 10"};b(a)?f.d=a:w(a)&&e(f,a);return this.createElement("shape").attr(f)},circle:function(a,b,d){var f=this.symbol("circle");w(a)&&(d=a.r,b=a.y,a=a.x);f.isCircle=!0;f.r=d;return f.attr({x:a,y:b})},g:function(a){var b;
a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement("div").attr(b)},image:function(a,b,d,g,c){var f=this.createElement("img").attr({src:a});1<arguments.length&&f.attr({x:b,y:d,width:g,height:c});return f},createElement:function(a){return"rect"===a?this.symbol(a):r.prototype.createElement.call(this,a)},invertChild:function(a,b){var d=this;b=b.style;var f="IMG"===a.tagName&&a.style;I(a,{flip:"x",left:g(b.width)-(f?g(f.top):1),top:g(b.height)-(f?g(f.left):1),rotation:-90});
t(a.childNodes,function(b){d.invertChild(b,a)})},symbols:{arc:function(a,b,d,g,c){var f=c.start,l=c.end,A=c.r||d||g;d=c.innerR;g=Math.cos(f);var r=Math.sin(f),h=Math.cos(l),G=Math.sin(l);if(0===l-f)return["x"];f=["wa",a-A,b-A,a+A,b+A,a+A*g,b+A*r,a+A*h,b+A*G];c.open&&!d&&f.push("e","M",a,b);f.push("at",a-d,b-d,a+d,b+d,a+d*h,b+d*G,a+d*g,b+d*r,"x","e");f.isArc=!0;return f},circle:function(a,b,d,g,c){c&&v(c.r)&&(d=g=2*c.r);c&&c.isCircle&&(a-=d/2,b-=g/2);return["wa",a,b,a+d,b+g,a+d,b+g/2,a+d,b+g/2,"e"]},
rect:function(a,b,d,g,c){return r.prototype.symbols[v(c)&&c.r?"callout":"square"].call(0,a,b,d,g,c)}}},a.VMLRenderer=E=function(){this.init.apply(this,arguments)},E.prototype=k(r.prototype,D),a.Renderer=E);r.prototype.measureSpanWidth=function(a,b){var d=z.createElement("span");a=z.createTextNode(a);d.appendChild(a);I(d,b);this.box.appendChild(d);b=d.offsetWidth;m(d);return b}})(K);(function(a){function E(){var t=a.defaultOptions.global,q=z.moment;if(t.timezone){if(q)return function(a){return-q.tz(a,
t.timezone).utcOffset()};a.error(25)}return t.useUTC&&t.getTimezoneOffset}function D(){var t=a.defaultOptions.global,q,e=t.useUTC,b=e?"getUTC":"get",p=e?"setUTC":"set";a.Date=q=t.Date||z.Date;q.hcTimezoneOffset=e&&t.timezoneOffset;q.hcGetTimezoneOffset=E();q.hcMakeTime=function(a,b,l,g,p,r){var u;e?(u=q.UTC.apply(0,arguments),u+=v(u)):u=(new q(a,b,m(l,1),m(g,0),m(p,0),m(r,0))).getTime();return u};I("Minutes Hours Day Date Month FullYear".split(" "),function(a){q["hcGet"+a]=b+a});I("Milliseconds Seconds Minutes Hours Date Month FullYear".split(" "),
function(a){q["hcSet"+a]=p+a})}var H=a.color,I=a.each,v=a.getTZOffset,n=a.merge,m=a.pick,z=a.win;a.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{useUTC:!0,VMLRadialGradientURL:"http://code.highcharts.com/5.0.7/gfx/vml-radial-gradient.png"},chart:{borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",
align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",
width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:a.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",
month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:a.isTouchDevice?25:10,backgroundColor:H("#f7f7f7").setOpacity(.85).get(),borderWidth:1,headerFormat:'\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"http://www.highcharts.com",
position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};a.setOptions=function(t){a.defaultOptions=n(!0,a.defaultOptions,t);D();return a.defaultOptions};a.getOptions=function(){return a.defaultOptions};a.defaultPlotOptions=a.defaultOptions.plotOptions;D()})(K);(function(a){var E=a.arrayMax,D=a.arrayMin,H=a.defined,I=a.destroyObjectProperties,v=a.each,n=a.erase,m=a.merge,z=a.pick;a.PlotLineOrBand=function(a,q){this.axis=
a;q&&(this.options=q,this.id=q.id)};a.PlotLineOrBand.prototype={render:function(){var a=this,q=a.axis,e=q.horiz,b=a.options,p=b.label,w=a.label,k=b.to,l=b.from,g=b.value,F=H(l)&&H(k),r=H(g),u=a.svgElem,f=!u,B=[],d,x=b.color,c=z(b.zIndex,0),y=b.events,B={"class":"highcharts-plot-"+(F?"band ":"line ")+(b.className||"")},L={},A=q.chart.renderer,J=F?"bands":"lines",h=q.log2lin;q.isLog&&(l=h(l),k=h(k),g=h(g));r?(B={stroke:x,"stroke-width":b.width},b.dashStyle&&(B.dashstyle=b.dashStyle)):F&&(x&&(B.fill=
x),b.borderWidth&&(B.stroke=b.borderColor,B["stroke-width"]=b.borderWidth));L.zIndex=c;J+="-"+c;(x=q[J])||(q[J]=x=A.g("plot-"+J).attr(L).add());f&&(a.svgElem=u=A.path().attr(B).add(x));if(r)B=q.getPlotLinePath(g,u.strokeWidth());else if(F)B=q.getPlotBandPath(l,k,b);else return;if(f&&B&&B.length){if(u.attr({d:B}),y)for(d in b=function(h){u.on(h,function(b){y[h].apply(a,[b])})},y)b(d)}else u&&(B?(u.show(),u.animate({d:B})):(u.hide(),w&&(a.label=w=w.destroy())));p&&H(p.text)&&B&&B.length&&0<q.width&&
0<q.height&&!B.flat?(p=m({align:e&&F&&"center",x:e?!F&&4:10,verticalAlign:!e&&F&&"middle",y:e?F?16:10:F?6:-4,rotation:e&&!F&&90},p),this.renderLabel(p,B,F,c)):w&&w.hide();return a},renderLabel:function(a,q,e,b){var p=this.label,w=this.axis.chart.renderer;p||(p={align:a.textAlign||a.align,rotation:a.rotation,"class":"highcharts-plot-"+(e?"band":"line")+"-label "+(a.className||"")},p.zIndex=b,this.label=p=w.text(a.text,0,0,a.useHTML).attr(p).add(),p.css(a.style));b=[q[1],q[4],e?q[6]:q[1]];q=[q[2],q[5],
e?q[7]:q[2]];e=D(b);w=D(q);p.align(a,!1,{x:e,y:w,width:E(b)-e,height:E(q)-w});p.show()},destroy:function(){n(this.axis.plotLinesAndBands,this);delete this.axis;I(this)}};a.AxisPlotLineOrBandExtension={getPlotBandPath:function(a,q){q=this.getPlotLinePath(q,null,null,!0);(a=this.getPlotLinePath(a,null,null,!0))&&q?(a.flat=a.toString()===q.toString(),a.push(q[4],q[5],q[1],q[2],"z")):a=null;return a},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,
"plotLines")},addPlotBandOrLine:function(m,q){var e=(new a.PlotLineOrBand(this,m)).render(),b=this.userOptions;e&&(q&&(b[q]=b[q]||[],b[q].push(m)),this.plotLinesAndBands.push(e));return e},removePlotBandOrLine:function(a){for(var q=this.plotLinesAndBands,e=this.options,b=this.userOptions,p=q.length;p--;)q[p].id===a&&q[p].destroy();v([e.plotLines||[],b.plotLines||[],e.plotBands||[],b.plotBands||[]],function(b){for(p=b.length;p--;)b[p].id===a&&n(b,b[p])})}}})(K);(function(a){var E=a.correctFloat,D=
a.defined,H=a.destroyObjectProperties,I=a.isNumber,v=a.merge,n=a.pick,m=a.deg2rad;a.Tick=function(a,m,q,e){this.axis=a;this.pos=m;this.type=q||"";this.isNew=!0;q||e||this.addLabel()};a.Tick.prototype={addLabel:function(){var a=this.axis,m=a.options,q=a.chart,e=a.categories,b=a.names,p=this.pos,w=m.labels,k=a.tickPositions,l=p===k[0],g=p===k[k.length-1],b=e?n(e[p],b[p],p):p,e=this.label,k=k.info,F;a.isDatetimeAxis&&k&&(F=m.dateTimeLabelFormats[k.higherRanks[p]||k.unitName]);this.isFirst=l;this.isLast=
g;m=a.labelFormatter.call({axis:a,chart:q,isFirst:l,isLast:g,dateTimeLabelFormat:F,value:a.isLog?E(a.lin2log(b)):b});D(e)?e&&e.attr({text:m}):(this.labelLength=(this.label=e=D(m)&&w.enabled?q.renderer.text(m,0,0,w.useHTML).css(v(w.style)).add(a.labelGroup):null)&&e.getBBox().width,this.rotation=0)},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var t=this.axis,q=a.x,e=t.chart.chartWidth,b=t.chart.spacing,p=n(t.labelLeft,
Math.min(t.pos,b[3])),b=n(t.labelRight,Math.max(t.pos+t.len,e-b[1])),w=this.label,k=this.rotation,l={left:0,center:.5,right:1}[t.labelAlign],g=w.getBBox().width,F=t.getSlotWidth(),r=F,u=1,f,B={};if(k)0>k&&q-l*g<p?f=Math.round(q/Math.cos(k*m)-p):0<k&&q+l*g>b&&(f=Math.round((e-q)/Math.cos(k*m)));else if(e=q+(1-l)*g,q-l*g<p?r=a.x+r*(1-l)-p:e>b&&(r=b-a.x+r*l,u=-1),r=Math.min(F,r),r<F&&"center"===t.labelAlign&&(a.x+=u*(F-r-l*(F-Math.min(g,r)))),g>r||t.autoRotation&&(w.styles||{}).width)f=r;f&&(B.width=
f,(t.options.labels.style||{}).textOverflow||(B.textOverflow="ellipsis"),w.css(B))},getPosition:function(a,m,q,e){var b=this.axis,p=b.chart,w=e&&p.oldChartHeight||p.chartHeight;return{x:a?b.translate(m+q,null,null,e)+b.transB:b.left+b.offset+(b.opposite?(e&&p.oldChartWidth||p.chartWidth)-b.right-b.left:0),y:a?w-b.bottom+b.offset-(b.opposite?b.height:0):w-b.translate(m+q,null,null,e)-b.transB}},getLabelPosition:function(a,n,q,e,b,p,w,k){var l=this.axis,g=l.transA,F=l.reversed,r=l.staggerLines,u=l.tickRotCorr||
{x:0,y:0},f=b.y;D(f)||(f=0===l.side?q.rotation?-8:-q.getBBox().height:2===l.side?u.y+8:Math.cos(q.rotation*m)*(u.y-q.getBBox(!1,0).height/2));a=a+b.x+u.x-(p&&e?p*g*(F?-1:1):0);n=n+f-(p&&!e?p*g*(F?1:-1):0);r&&(q=w/(k||1)%r,l.opposite&&(q=r-q-1),n+=l.labelOffset/r*q);return{x:a,y:Math.round(n)}},getMarkPath:function(a,m,q,e,b,p){return p.crispLine(["M",a,m,"L",a+(b?0:-q),m+(b?q:0)],e)},render:function(a,m,q){var e=this.axis,b=e.options,p=e.chart.renderer,w=e.horiz,k=this.type,l=this.label,g=this.pos,
F=b.labels,r=this.gridLine,u=k?k+"Tick":"tick",f=e.tickSize(u),B=this.mark,d=!B,x=F.step,c={},y=!0,L=e.tickmarkOffset,A=this.getPosition(w,g,L,m),J=A.x,A=A.y,h=w&&J===e.pos+e.len||!w&&A===e.pos?-1:1,G=k?k+"Grid":"grid",Q=b[G+"LineWidth"],P=b[G+"LineColor"],t=b[G+"LineDashStyle"],G=n(b[u+"Width"],!k&&e.isXAxis?1:0),u=b[u+"Color"];q=n(q,1);this.isActive=!0;r||(c.stroke=P,c["stroke-width"]=Q,t&&(c.dashstyle=t),k||(c.zIndex=1),m&&(c.opacity=0),this.gridLine=r=p.path().attr(c).addClass("highcharts-"+(k?
k+"-":"")+"grid-line").add(e.gridGroup));if(!m&&r&&(g=e.getPlotLinePath(g+L,r.strokeWidth()*h,m,!0)))r[this.isNew?"attr":"animate"]({d:g,opacity:q});f&&(e.opposite&&(f[0]=-f[0]),d&&(this.mark=B=p.path().addClass("highcharts-"+(k?k+"-":"")+"tick").add(e.axisGroup),B.attr({stroke:u,"stroke-width":G})),B[d?"attr":"animate"]({d:this.getMarkPath(J,A,f[0],B.strokeWidth()*h,w,p),opacity:q}));l&&I(J)&&(l.xy=A=this.getLabelPosition(J,A,l,w,F,L,a,x),this.isFirst&&!this.isLast&&!n(b.showFirstLabel,1)||this.isLast&&
!this.isFirst&&!n(b.showLastLabel,1)?y=!1:!w||e.isRadial||F.step||F.rotation||m||0===q||this.handleOverflow(A),x&&a%x&&(y=!1),y&&I(A.y)?(A.opacity=q,l[this.isNew?"attr":"animate"](A)):l.attr("y",-9999),this.isNew=!1)},destroy:function(){H(this,this.axis)}}})(K);(function(a){var E=a.addEvent,D=a.animObject,H=a.arrayMax,I=a.arrayMin,v=a.AxisPlotLineOrBandExtension,n=a.color,m=a.correctFloat,z=a.defaultOptions,t=a.defined,q=a.deg2rad,e=a.destroyObjectProperties,b=a.each,p=a.extend,w=a.fireEvent,k=a.format,
l=a.getMagnitude,g=a.grep,F=a.inArray,r=a.isArray,u=a.isNumber,f=a.isString,B=a.merge,d=a.normalizeTickInterval,x=a.pick,c=a.PlotLineOrBand,y=a.removeEvent,L=a.splat,A=a.syncTimeout,J=a.Tick;a.Axis=function(){this.init.apply(this,arguments)};a.Axis.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,labels:{enabled:!0,style:{color:"#666666",cursor:"default",fontSize:"11px"},
x:0},minPadding:.01,maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",title:{align:"middle",style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"},defaultYAxisOptions:{endOnTick:!0,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},maxPadding:.05,
minPadding:.05,startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return a.numberFormat(this.total,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"#000000",textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],
x:0},title:{rotation:0}},init:function(a,b){var h=b.isX;this.chart=a;this.horiz=a.inverted?!h:h;this.isXAxis=h;this.coll=this.coll||(h?"xAxis":"yAxis");this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,c=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.reversed=d.reversed;this.visible=!1!==d.visible;this.zoomEnabled=!1!==d.zoomEnabled;this.hasNames=
"category"===c||!0===d.categories;this.categories=d.categories||this.hasNames;this.names=this.names||[];this.isLog="logarithmic"===c;this.isDatetimeAxis="datetime"===c;this.isLinked=t(d.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.stacksTouched=0;this.min=this.max=null;this.crosshair=x(d.crosshair,
L(a.options.tooltip.crosshairs)[h?0:1],!1);var G;b=this.options.events;-1===F(this,a.axes)&&(h?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];a.inverted&&h&&void 0===this.reversed&&(this.reversed=!0);this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(G in b)E(this,G,b[G]);this.isLog&&(this.val2lin=this.log2lin,this.lin2val=this.lin2log)},setOptions:function(a){this.options=B(this.defaultOptions,"yAxis"===this.coll&&this.defaultYAxisOptions,
[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],B(z[this.coll],a))},defaultLabelFormatter:function(){var h=this.axis,b=this.value,d=h.categories,c=this.dateTimeLabelFormat,f=z.lang,g=f.numericSymbols,f=f.numericSymbolMagnitude||1E3,y=g&&g.length,l,A=h.options.labels.format,h=h.isLog?b:h.tickInterval;if(A)l=k(A,this);else if(d)l=b;else if(c)l=a.dateFormat(c,b);else if(y&&1E3<=h)for(;y--&&void 0===l;)d=Math.pow(f,y+1),h>=
d&&0===10*b%d&&null!==g[y]&&0!==b&&(l=a.numberFormat(b/d,-1)+g[y]);void 0===l&&(l=1E4<=Math.abs(b)?a.numberFormat(b,-1):a.numberFormat(b,-1,void 0,""));return l},getSeriesExtremes:function(){var a=this,d=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();b(a.series,function(h){if(h.visible||!d.options.chart.ignoreHiddenSeries){var b=h.options,c=b.threshold,G;a.hasVisibleSeries=!0;a.isLog&&0>=c&&(c=null);if(a.isXAxis)b=h.xData,
b.length&&(h=I(b),u(h)||h instanceof Date||(b=g(b,function(a){return u(a)}),h=I(b)),a.dataMin=Math.min(x(a.dataMin,b[0]),h),a.dataMax=Math.max(x(a.dataMax,b[0]),H(b)));else if(h.getExtremes(),G=h.dataMax,h=h.dataMin,t(h)&&t(G)&&(a.dataMin=Math.min(x(a.dataMin,h),h),a.dataMax=Math.max(x(a.dataMax,G),G)),t(c)&&(a.threshold=c),!b.softThreshold||a.isLog)a.softThreshold=!1}})},translate:function(a,b,d,c,f,g){var h=this.linkedParent||this,G=1,y=0,l=c?h.oldTransA:h.transA;c=c?h.oldMin:h.min;var A=h.minPixelPadding;
f=(h.isOrdinal||h.isBroken||h.isLog&&f)&&h.lin2val;l||(l=h.transA);d&&(G*=-1,y=h.len);h.reversed&&(G*=-1,y-=G*(h.sector||h.len));b?(a=(a*G+y-A)/l+c,f&&(a=h.lin2val(a))):(f&&(a=h.val2lin(a)),a=G*(a-c)*l+y+G*A+(u(g)?l*g:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,d,c,f){var h=this.chart,G=this.left,g=this.top,y,l,A=d&&h.oldChartHeight||
h.chartHeight,r=d&&h.oldChartWidth||h.chartWidth,k;y=this.transB;var e=function(a,h,b){if(a<h||a>b)c?a=Math.min(Math.max(h,a),b):k=!0;return a};f=x(f,this.translate(a,null,null,d));a=d=Math.round(f+y);y=l=Math.round(A-f-y);u(f)?this.horiz?(y=g,l=A-this.bottom,a=d=e(a,G,G+this.width)):(a=G,d=r-this.right,y=l=e(y,g,g+this.height)):k=!0;return k&&!c?null:h.renderer.crispLine(["M",a,y,"L",d,l],b||1)},getLinearTickPositions:function(a,b,d){var h,c=m(Math.floor(b/a)*a),f=m(Math.ceil(d/a)*a),G=[];if(b===
d&&u(b))return[b];for(b=c;b<=f;){G.push(b);b=m(b+a);if(b===h)break;h=b}return G},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,d=this.minorTickInterval,c=[],f,g=this.pointRangePadding||0;f=this.min-g;var g=this.max+g,y=g-f;if(y&&y/d<this.len/3)if(this.isLog)for(g=b.length,f=1;f<g;f++)c=c.concat(this.getLogTickPositions(d,b[f-1],b[f],!0));else if(this.isDatetimeAxis&&"auto"===a.minorTickInterval)c=c.concat(this.getTimeTicks(this.normalizeTimeTickInterval(d),f,g,a.startOfWeek));
else for(b=f+(b[0]-f)%d;b<=g&&b!==c[0];b+=d)c.push(b);0!==c.length&&this.trimTicks(c,a.startOnTick,a.endOnTick);return c},adjustForMinRange:function(){var a=this.options,d=this.min,c=this.max,f,g=this.dataMax-this.dataMin>=this.minRange,y,l,A,r,u,k;this.isXAxis&&void 0===this.minRange&&!this.isLog&&(t(a.min)||t(a.max)?this.minRange=null:(b(this.series,function(a){r=a.xData;for(l=u=a.xIncrement?1:r.length-1;0<l;l--)if(A=r[l]-r[l-1],void 0===y||A<y)y=A}),this.minRange=Math.min(5*y,this.dataMax-this.dataMin)));
c-d<this.minRange&&(k=this.minRange,f=(k-c+d)/2,f=[d-f,x(a.min,d-f)],g&&(f[2]=this.isLog?this.log2lin(this.dataMin):this.dataMin),d=H(f),c=[d+k,x(a.max,d+k)],g&&(c[2]=this.isLog?this.log2lin(this.dataMax):this.dataMax),c=I(c),c-d<k&&(f[0]=c-k,f[1]=x(a.min,c-k),d=H(f)));this.min=d;this.max=c},getClosest:function(){var a;this.categories?a=1:b(this.series,function(h){var b=h.closestPointRange,d=h.visible||!h.chart.options.chart.ignoreHiddenSeries;!h.noSharedTooltip&&t(b)&&d&&(a=t(a)?Math.min(a,b):b)});
return a},nameToX:function(a){var h=r(this.categories),b=h?this.categories:this.names,d=a.options.x,c;a.series.requireSorting=!1;t(d)||(d=!1===this.options.uniqueNames?a.series.autoIncrement():F(a.name,b));-1===d?h||(c=b.length):c=d;this.names[c]=a.name;return c},updateNames:function(){var a=this;0<this.names.length&&(this.names.length=0,this.minRange=void 0,b(this.series||[],function(h){h.xIncrement=null;if(!h.points||h.isDirtyData)h.processData(),h.generatePoints();b(h.points,function(b,d){var c;
b.options&&(c=a.nameToX(b),c!==b.x&&(b.x=c,h.xData[d]=c))})}))},setAxisTranslation:function(a){var h=this,d=h.max-h.min,c=h.axisPointRange||0,g,y=0,l=0,A=h.linkedParent,r=!!h.categories,u=h.transA,k=h.isXAxis;if(k||r||c)g=h.getClosest(),A?(y=A.minPointOffset,l=A.pointRangePadding):b(h.series,function(a){var b=r?1:k?x(a.options.pointRange,g,0):h.axisPointRange||0;a=a.options.pointPlacement;c=Math.max(c,b);h.single||(y=Math.max(y,f(a)?0:b/2),l=Math.max(l,"on"===a?0:b))}),A=h.ordinalSlope&&g?h.ordinalSlope/
g:1,h.minPointOffset=y*=A,h.pointRangePadding=l*=A,h.pointRange=Math.min(c,d),k&&(h.closestPointRange=g);a&&(h.oldTransA=u);h.translationSlope=h.transA=u=h.len/(d+l||1);h.transB=h.horiz?h.left:h.bottom;h.minPixelPadding=u*y},minFromRange:function(){return this.max-this.range},setTickInterval:function(h){var c=this,f=c.chart,g=c.options,y=c.isLog,A=c.log2lin,r=c.isDatetimeAxis,k=c.isXAxis,e=c.isLinked,J=g.maxPadding,p=g.minPadding,B=g.tickInterval,F=g.tickPixelInterval,L=c.categories,q=c.threshold,
n=c.softThreshold,v,z,D,E;r||L||e||this.getTickAmount();D=x(c.userMin,g.min);E=x(c.userMax,g.max);e?(c.linkedParent=f[c.coll][g.linkedTo],f=c.linkedParent.getExtremes(),c.min=x(f.min,f.dataMin),c.max=x(f.max,f.dataMax),g.type!==c.linkedParent.options.type&&a.error(11,1)):(!n&&t(q)&&(c.dataMin>=q?(v=q,p=0):c.dataMax<=q&&(z=q,J=0)),c.min=x(D,v,c.dataMin),c.max=x(E,z,c.dataMax));y&&(!h&&0>=Math.min(c.min,x(c.dataMin,c.min))&&a.error(10,1),c.min=m(A(c.min),15),c.max=m(A(c.max),15));c.range&&t(c.max)&&
(c.userMin=c.min=D=Math.max(c.min,c.minFromRange()),c.userMax=E=c.max,c.range=null);w(c,"foundExtremes");c.beforePadding&&c.beforePadding();c.adjustForMinRange();!(L||c.axisPointRange||c.usePercentage||e)&&t(c.min)&&t(c.max)&&(A=c.max-c.min)&&(!t(D)&&p&&(c.min-=A*p),!t(E)&&J&&(c.max+=A*J));u(g.floor)?c.min=Math.max(c.min,g.floor):u(g.softMin)&&(c.min=Math.min(c.min,g.softMin));u(g.ceiling)?c.max=Math.min(c.max,g.ceiling):u(g.softMax)&&(c.max=Math.max(c.max,g.softMax));n&&t(c.dataMin)&&(q=q||0,!t(D)&&
c.min<q&&c.dataMin>=q?c.min=q:!t(E)&&c.max>q&&c.dataMax<=q&&(c.max=q));c.tickInterval=c.min===c.max||void 0===c.min||void 0===c.max?1:e&&!B&&F===c.linkedParent.options.tickPixelInterval?B=c.linkedParent.tickInterval:x(B,this.tickAmount?(c.max-c.min)/Math.max(this.tickAmount-1,1):void 0,L?1:(c.max-c.min)*F/Math.max(c.len,F));k&&!h&&b(c.series,function(a){a.processData(c.min!==c.oldMin||c.max!==c.oldMax)});c.setAxisTranslation(!0);c.beforeSetTickPositions&&c.beforeSetTickPositions();c.postProcessTickInterval&&
(c.tickInterval=c.postProcessTickInterval(c.tickInterval));c.pointRange&&!B&&(c.tickInterval=Math.max(c.pointRange,c.tickInterval));h=x(g.minTickInterval,c.isDatetimeAxis&&c.closestPointRange);!B&&c.tickInterval<h&&(c.tickInterval=h);r||y||B||(c.tickInterval=d(c.tickInterval,null,l(c.tickInterval),x(g.allowDecimals,!(.5<c.tickInterval&&5>c.tickInterval&&1E3<c.max&&9999>c.max)),!!this.tickAmount));this.tickAmount||(c.tickInterval=c.unsquish());this.setTickPositions()},setTickPositions:function(){var a=
this.options,c,b=a.tickPositions,d=a.tickPositioner,f=a.startOnTick,g=a.endOnTick,y;this.tickmarkOffset=this.categories&&"between"===a.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===a.minorTickInterval&&this.tickInterval?this.tickInterval/5:a.minorTickInterval;this.tickPositions=c=b&&b.slice();!c&&(c=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,
!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),c.length>this.len&&(c=[c[0],c.pop()]),this.tickPositions=c,d&&(d=d.apply(this,[this.min,this.max])))&&(this.tickPositions=c=d);this.trimTicks(c,f,g);this.isLinked||(this.min===this.max&&t(this.min)&&!this.tickAmount&&(y=!0,this.min-=.5,this.max+=.5),this.single=y,b||d||this.adjustTickAmount())},trimTicks:function(a,c,b){var h=a[0],d=a[a.length-1],f=this.minPointOffset||
0;if(!this.isLinked){if(c)this.min=h;else for(;this.min-f>a[0];)a.shift();if(b)this.max=d;else for(;this.max+f<a[a.length-1];)a.pop();0===a.length&&t(h)&&a.push((d+h)/2)}},alignToOthers:function(){var a={},c,d=this.options;!1===this.chart.options.chart.alignTicks||!1===d.alignTicks||this.isLog||b(this.chart[this.coll],function(h){var b=h.options,b=[h.horiz?b.left:b.top,b.width,b.height,b.pane].join();h.series.length&&(a[b]?c=!0:a[b]=1)});return c},getTickAmount:function(){var a=this.options,c=a.tickAmount,
b=a.tickPixelInterval;!t(a.tickInterval)&&this.len<b&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(c=2);!c&&this.alignToOthers()&&(c=Math.ceil(this.len/b)+1);4>c&&(this.finalTickAmt=c,c=5);this.tickAmount=c},adjustTickAmount:function(){var a=this.tickInterval,c=this.tickPositions,b=this.tickAmount,d=this.finalTickAmt,f=c&&c.length;if(f<b){for(;c.length<b;)c.push(m(c[c.length-1]+a));this.transA*=(f-1)/(b-1);this.max=c[c.length-1]}else f>b&&(this.tickInterval*=2,this.setTickPositions());
if(t(d)){for(a=b=c.length;a--;)(3===d&&1===a%2||2>=d&&0<a&&a<b-1)&&c.splice(a,1);this.finalTickAmt=void 0}},setScale:function(){var a,c;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();c=this.len!==this.oldAxisLength;b(this.series,function(h){if(h.isDirtyData||h.isDirty||h.xAxis.isDirty)a=!0});c||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()?(this.resetStacks&&this.resetStacks(),this.forceRedraw=
!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=c||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks()},setExtremes:function(a,c,d,f,g){var h=this,y=h.chart;d=x(d,!0);b(h.series,function(a){delete a.kdTree});g=p(g,{min:a,max:c});w(h,"setExtremes",g,function(){h.userMin=a;h.userMax=c;h.eventArgs=g;d&&y.redraw(f)})},zoom:function(a,c){var h=this.dataMin,b=this.dataMax,d=this.options,
f=Math.min(h,x(d.min,h)),d=Math.max(b,x(d.max,b));if(a!==this.min||c!==this.max)this.allowZoomOutside||(t(h)&&(a<f&&(a=f),a>d&&(a=d)),t(b)&&(c<f&&(c=f),c>d&&(c=d))),this.displayBtn=void 0!==a||void 0!==c,this.setExtremes(a,c,!1,void 0,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,c=this.options,b=c.offsets||[0,0,0,0],d=this.horiz,f=x(c.width,a.plotWidth-b[3]+b[1]),g=x(c.height,a.plotHeight-b[0]+b[2]),y=x(c.top,a.plotTop+b[0]),c=x(c.left,a.plotLeft+b[3]),b=/%$/;b.test(g)&&(g=
Math.round(parseFloat(g)/100*a.plotHeight));b.test(y)&&(y=Math.round(parseFloat(y)/100*a.plotHeight+a.plotTop));this.left=c;this.top=y;this.width=f;this.height=g;this.bottom=a.chartHeight-g-y;this.right=a.chartWidth-f-c;this.len=Math.max(d?f:g,0);this.pos=d?c:y},getExtremes:function(){var a=this.isLog,c=this.lin2log;return{min:a?m(c(this.min)):this.min,max:a?m(c(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var c=
this.isLog,h=this.lin2log,b=c?h(this.min):this.min,c=c?h(this.max):this.max;null===a?a=b:b>a?a=b:c<a&&(a=c);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(x(a,0)-90*this.side+720)%360;return 15<a&&165>a?"right":195<a&&345>a?"left":"center"},tickSize:function(a){var c=this.options,h=c[a+"Length"],b=x(c[a+"Width"],"tick"===a&&this.isXAxis?1:0);if(b&&h)return"inside"===c[a+"Position"]&&(h=-h),[h,b]},labelMetrics:function(){return this.chart.renderer.fontMetrics(this.options.labels.style&&
this.options.labels.style.fontSize,this.ticks[0]&&this.ticks[0].label)},unsquish:function(){var a=this.options.labels,c=this.horiz,d=this.tickInterval,f=d,g=this.len/(((this.categories?1:0)+this.max-this.min)/d),y,l=a.rotation,A=this.labelMetrics(),r,u=Number.MAX_VALUE,k,e=function(a){a/=g||1;a=1<a?Math.ceil(a):1;return a*d};c?(k=!a.staggerLines&&!a.step&&(t(l)?[l]:g<x(a.autoRotationLimit,80)&&a.autoRotation))&&b(k,function(a){var c;if(a===l||a&&-90<=a&&90>=a)r=e(Math.abs(A.h/Math.sin(q*a))),c=r+
Math.abs(a/360),c<u&&(u=c,y=a,f=r)}):a.step||(f=e(A.h));this.autoRotation=k;this.labelRotation=x(y,l);return f},getSlotWidth:function(){var a=this.chart,c=this.horiz,b=this.options.labels,d=Math.max(this.tickPositions.length-(this.categories?0:1),1),f=a.margin[3];return c&&2>(b.step||0)&&!b.rotation&&(this.staggerLines||1)*this.len/d||!c&&(f&&f-a.spacing[3]||.33*a.chartWidth)},renderUnsquish:function(){var a=this.chart,c=a.renderer,d=this.tickPositions,g=this.ticks,y=this.options.labels,l=this.horiz,
A=this.getSlotWidth(),r=Math.max(1,Math.round(A-2*(y.padding||5))),u={},k=this.labelMetrics(),e=y.style&&y.style.textOverflow,x,J=0,p,F;f(y.rotation)||(u.rotation=y.rotation||0);b(d,function(a){(a=g[a])&&a.labelLength>J&&(J=a.labelLength)});this.maxLabelLength=J;if(this.autoRotation)J>r&&J>k.h?u.rotation=this.labelRotation:this.labelRotation=0;else if(A&&(x={width:r+"px"},!e))for(x.textOverflow="clip",p=d.length;!l&&p--;)if(F=d[p],r=g[F].label)r.styles&&"ellipsis"===r.styles.textOverflow?r.css({textOverflow:"clip"}):
g[F].labelLength>A&&r.css({width:A+"px"}),r.getBBox().height>this.len/d.length-(k.h-k.f)&&(r.specCss={textOverflow:"ellipsis"});u.rotation&&(x={width:(J>.5*a.chartHeight?.33*a.chartHeight:a.chartHeight)+"px"},e||(x.textOverflow="ellipsis"));if(this.labelAlign=y.align||this.autoLabelAlign(this.labelRotation))u.align=this.labelAlign;b(d,function(a){var c=(a=g[a])&&a.label;c&&(c.attr(u),x&&c.css(B(x,c.specCss)),delete c.specCss,a.rotation=u.rotation)});this.tickRotCorr=c.rotCorr(k.b,this.labelRotation||
0,0!==this.side)},hasData:function(){return this.hasVisibleSeries||t(this.min)&&t(this.max)&&!!this.tickPositions},addTitle:function(a){var c=this.chart.renderer,b=this.horiz,h=this.opposite,d=this.options.title,f;this.axisTitle||((f=d.textAlign)||(f=(b?{low:"left",middle:"center",high:"right"}:{low:h?"right":"left",middle:"center",high:h?"left":"right"})[d.align]),this.axisTitle=c.text(d.text,0,0,d.useHTML).attr({zIndex:7,rotation:d.rotation||0,align:f}).addClass("highcharts-axis-title").css(d.style).add(this.axisGroup),
this.axisTitle.isNew=!0);this.axisTitle[a?"show":"hide"](!0)},generateTick:function(a){var c=this.ticks;c[a]?c[a].addLabel():c[a]=new J(this,a)},getOffset:function(){var a=this,c=a.chart,d=c.renderer,f=a.options,g=a.tickPositions,y=a.ticks,l=a.horiz,A=a.side,r=c.inverted?[1,0,3,2][A]:A,u,k,e=0,J,p=0,B=f.title,F=f.labels,w=0,L=c.axisOffset,c=c.clipOffset,m=[-1,1,1,-1][A],q,n=f.className,v=a.axisParent,z=this.tickSize("tick");u=a.hasData();a.showAxis=k=u||x(f.showEmpty,!0);a.staggerLines=a.horiz&&F.staggerLines;
a.axisGroup||(a.gridGroup=d.g("grid").attr({zIndex:f.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(n||"")).add(v),a.axisGroup=d.g("axis").attr({zIndex:f.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(n||"")).add(v),a.labelGroup=d.g("axis-labels").attr({zIndex:F.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels "+(n||"")).add(v));if(u||a.isLinked)b(g,function(c,b){a.generateTick(c,b)}),a.renderUnsquish(),!1===F.reserveSpace||0!==A&&2!==A&&
{1:"left",3:"right"}[A]!==a.labelAlign&&"center"!==a.labelAlign||b(g,function(a){w=Math.max(y[a].getLabelSize(),w)}),a.staggerLines&&(w*=a.staggerLines,a.labelOffset=w*(a.opposite?-1:1));else for(q in y)y[q].destroy(),delete y[q];B&&B.text&&!1!==B.enabled&&(a.addTitle(k),k&&(e=a.axisTitle.getBBox()[l?"height":"width"],J=B.offset,p=t(J)?0:x(B.margin,l?5:10)));a.renderLine();a.offset=m*x(f.offset,L[A]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};d=0===A?-a.labelMetrics().h:2===A?a.tickRotCorr.y:0;p=Math.abs(w)+
p;w&&(p=p-d+m*(l?x(F.y,a.tickRotCorr.y+8*m):F.x));a.axisTitleMargin=x(J,p);L[A]=Math.max(L[A],a.axisTitleMargin+e+m*a.offset,p,u&&g.length&&z?z[0]:0);f=f.offset?0:2*Math.floor(a.axisLine.strokeWidth()/2);c[r]=Math.max(c[r],f)},getLinePath:function(a){var c=this.chart,b=this.opposite,d=this.offset,h=this.horiz,f=this.left+(b?this.width:0)+d,d=c.chartHeight-this.bottom-(b?this.height:0)+d;b&&(a*=-1);return c.renderer.crispLine(["M",h?this.left:f,h?d:this.top,"L",h?c.chartWidth-this.right:f,h?d:c.chartHeight-
this.bottom],a)},renderLine:function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))},getTitlePosition:function(){var a=this.horiz,c=this.left,b=this.top,d=this.len,f=this.options.title,g=a?c:b,y=this.opposite,A=this.offset,l=f.x||0,r=f.y||0,u=this.chart.renderer.fontMetrics(f.style&&f.style.fontSize,this.axisTitle).f,d={low:g+(a?0:d),
middle:g+d/2,high:g+(a?d:0)}[f.align],c=(a?b+this.height:c)+(a?1:-1)*(y?-1:1)*this.axisTitleMargin+(2===this.side?u:0);return{x:a?d+l:c+(y?this.width:0)+A+l,y:a?c+r-(y?this.height:0)+A:d+r}},renderMinorTick:function(a){var c=this.chart.hasRendered&&u(this.oldMin),b=this.minorTicks;b[a]||(b[a]=new J(this,a,"minor"));c&&b[a].isNew&&b[a].render(null,!0);b[a].render(null,!1,1)},renderTick:function(a,c){var b=this.isLinked,d=this.ticks,h=this.chart.hasRendered&&u(this.oldMin);if(!b||a>=this.min&&a<=this.max)d[a]||
(d[a]=new J(this,a)),h&&d[a].isNew&&d[a].render(c,!0,.1),d[a].render(c)},render:function(){var a=this,d=a.chart,f=a.options,g=a.isLog,y=a.lin2log,l=a.isLinked,r=a.tickPositions,u=a.axisTitle,k=a.ticks,e=a.minorTicks,x=a.alternateBands,p=f.stackLabels,B=f.alternateGridColor,F=a.tickmarkOffset,w=a.axisLine,L=a.showAxis,m=D(d.renderer.globalAnimation),q,n;a.labelEdge.length=0;a.overlap=!1;b([k,e,x],function(a){for(var c in a)a[c].isActive=!1});if(a.hasData()||l)a.minorTickInterval&&!a.categories&&b(a.getMinorTickPositions(),
function(c){a.renderMinorTick(c)}),r.length&&(b(r,function(c,b){a.renderTick(c,b)}),F&&(0===a.min||a.single)&&(k[-1]||(k[-1]=new J(a,-1,null,!0)),k[-1].render(-1))),B&&b(r,function(b,h){n=void 0!==r[h+1]?r[h+1]+F:a.max-F;0===h%2&&b<a.max&&n<=a.max+(d.polar?-F:F)&&(x[b]||(x[b]=new c(a)),q=b+F,x[b].options={from:g?y(q):q,to:g?y(n):n,color:B},x[b].render(),x[b].isActive=!0)}),a._addedPlotLB||(b((f.plotLines||[]).concat(f.plotBands||[]),function(c){a.addPlotBandOrLine(c)}),a._addedPlotLB=!0);b([k,e,x],
function(a){var c,b,h=[],f=m.duration;for(c in a)a[c].isActive||(a[c].render(c,!1,0),a[c].isActive=!1,h.push(c));A(function(){for(b=h.length;b--;)a[h[b]]&&!a[h[b]].isActive&&(a[h[b]].destroy(),delete a[h[b]])},a!==x&&d.hasRendered&&f?f:0)});w&&(w[w.isPlaced?"animate":"attr"]({d:this.getLinePath(w.strokeWidth())}),w.isPlaced=!0,w[L?"show":"hide"](!0));u&&L&&(u[u.isNew?"attr":"animate"](a.getTitlePosition()),u.isNew=!1);p&&p.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){this.visible&&
(this.render(),b(this.plotLinesAndBands,function(a){a.render()}));b(this.series,function(a){a.isDirty=!0})},keepProps:"extKey hcEvents names series userMax userMin".split(" "),destroy:function(a){var c=this,d=c.stacks,h,f=c.plotLinesAndBands,g;a||y(c);for(h in d)e(d[h]),d[h]=null;b([c.ticks,c.minorTicks,c.alternateBands],function(a){e(a)});if(f)for(a=f.length;a--;)f[a].destroy();b("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "),function(a){c[a]&&(c[a]=c[a].destroy())});
for(g in c)c.hasOwnProperty(g)&&-1===F(g,c.keepProps)&&delete c[g]},drawCrosshair:function(a,c){var b,d=this.crosshair,h=x(d.snap,!0),f,g=this.cross;a||(a=this.cross&&this.cross.e);this.crosshair&&!1!==(t(c)||!h)?(h?t(c)&&(f=this.isXAxis?c.plotX:this.len-c.plotY):f=a&&(this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos),t(f)&&(b=this.getPlotLinePath(c&&(this.isXAxis?c.x:x(c.stackY,c.y)),null,null,null,f)||null),t(b)?(c=this.categories&&!this.isRadial,g||(this.cross=g=this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+
(c?"category ":"thin ")+d.className).attr({zIndex:x(d.zIndex,2)}).add(),g.attr({stroke:d.color||(c?n("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":x(d.width,1)}),d.dashStyle&&g.attr({dashstyle:d.dashStyle})),g.show().attr({d:b}),c&&!d.width&&g.attr({"stroke-width":this.transA}),this.cross.e=a):this.hideCrosshair()):this.hideCrosshair()},hideCrosshair:function(){this.cross&&this.cross.hide()}};p(a.Axis.prototype,v)})(K);(function(a){var E=a.Axis,D=a.Date,H=a.dateFormat,I=a.defaultOptions,
v=a.defined,n=a.each,m=a.extend,z=a.getMagnitude,t=a.getTZOffset,q=a.normalizeTickInterval,e=a.pick,b=a.timeUnits;E.prototype.getTimeTicks=function(a,w,k,l){var g=[],p={},r=I.global.useUTC,u,f=new D(w-t(w)),B=D.hcMakeTime,d=a.unitRange,x=a.count,c;if(v(w)){f[D.hcSetMilliseconds](d>=b.second?0:x*Math.floor(f.getMilliseconds()/x));if(d>=b.second)f[D.hcSetSeconds](d>=b.minute?0:x*Math.floor(f.getSeconds()/x));if(d>=b.minute)f[D.hcSetMinutes](d>=b.hour?0:x*Math.floor(f[D.hcGetMinutes]()/x));if(d>=b.hour)f[D.hcSetHours](d>=
b.day?0:x*Math.floor(f[D.hcGetHours]()/x));if(d>=b.day)f[D.hcSetDate](d>=b.month?1:x*Math.floor(f[D.hcGetDate]()/x));d>=b.month&&(f[D.hcSetMonth](d>=b.year?0:x*Math.floor(f[D.hcGetMonth]()/x)),u=f[D.hcGetFullYear]());if(d>=b.year)f[D.hcSetFullYear](u-u%x);if(d===b.week)f[D.hcSetDate](f[D.hcGetDate]()-f[D.hcGetDay]()+e(l,1));u=f[D.hcGetFullYear]();l=f[D.hcGetMonth]();var y=f[D.hcGetDate](),L=f[D.hcGetHours]();if(D.hcTimezoneOffset||D.hcGetTimezoneOffset)c=(!r||!!D.hcGetTimezoneOffset)&&(k-w>4*b.month||
t(w)!==t(k)),f=f.getTime(),f=new D(f+t(f));r=f.getTime();for(w=1;r<k;)g.push(r),r=d===b.year?B(u+w*x,0):d===b.month?B(u,l+w*x):!c||d!==b.day&&d!==b.week?c&&d===b.hour?B(u,l,y,L+w*x):r+d*x:B(u,l,y+w*x*(d===b.day?1:7)),w++;g.push(r);d<=b.hour&&1E4>g.length&&n(g,function(a){0===a%18E5&&"000000000"===H("%H%M%S%L",a)&&(p[a]="day")})}g.info=m(a,{higherRanks:p,totalRange:d*x});return g};E.prototype.normalizeTimeTickInterval=function(a,e){var k=e||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",
[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];e=k[k.length-1];var l=b[e[0]],g=e[1],p;for(p=0;p<k.length&&!(e=k[p],l=b[e[0]],g=e[1],k[p+1]&&a<=(l*g[g.length-1]+b[k[p+1][0]])/2);p++);l===b.year&&a<5*l&&(g=[1,2,5]);a=q(a/l,g,"year"===e[0]?Math.max(z(a/l),1):1);return{unitRange:l,count:a,unitName:e[0]}}})(K);(function(a){var E=a.Axis,D=a.getMagnitude,H=a.map,I=a.normalizeTickInterval,v=a.pick;E.prototype.getLogTickPositions=
function(a,m,z,t){var q=this.options,e=this.len,b=this.lin2log,p=this.log2lin,w=[];t||(this._minorAutoInterval=null);if(.5<=a)a=Math.round(a),w=this.getLinearTickPositions(a,m,z);else if(.08<=a)for(var e=Math.floor(m),k,l,g,F,r,q=.3<a?[1,2,4]:.15<a?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];e<z+1&&!r;e++)for(l=q.length,k=0;k<l&&!r;k++)g=p(b(e)*q[k]),g>m&&(!t||F<=z)&&void 0!==F&&w.push(F),F>z&&(r=!0),F=g;else m=b(m),z=b(z),a=q[t?"minorTickInterval":"tickInterval"],a=v("auto"===a?null:a,this._minorAutoInterval,
q.tickPixelInterval/(t?5:1)*(z-m)/((t?e/this.tickPositions.length:e)||1)),a=I(a,null,D(a)),w=H(this.getLinearTickPositions(a,m,z),p),t||(this._minorAutoInterval=a/5);t||(this.tickInterval=a);return w};E.prototype.log2lin=function(a){return Math.log(a)/Math.LN10};E.prototype.lin2log=function(a){return Math.pow(10,a)}})(K);(function(a){var E=a.dateFormat,D=a.each,H=a.extend,I=a.format,v=a.isNumber,n=a.map,m=a.merge,z=a.pick,t=a.splat,q=a.syncTimeout,e=a.timeUnits;a.Tooltip=function(){this.init.apply(this,
arguments)};a.Tooltip.prototype={init:function(a,e){this.chart=a;this.options=e;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=e.split&&!a.inverted;this.shared=e.shared||this.split},cleanSplit:function(a){D(this.chart.series,function(b){var e=b&&b.tt;e&&(!e.isActive||a?b.tt=e.destroy():e.isActive=!1)})},getLabel:function(){var a=this.chart.renderer,e=this.options;this.label||(this.split?this.label=a.g("tooltip"):(this.label=a.label("",0,0,e.shape||"callout",null,null,e.useHTML,
null,"tooltip").attr({padding:e.padding,r:e.borderRadius}),this.label.attr({fill:e.backgroundColor,"stroke-width":e.borderWidth}).css(e.style).shadow(e.shadow)),this.label.attr({zIndex:8}).add());return this.label},update:function(a){this.destroy();this.init(this.chart,m(!0,this.options,a))},destroy:function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},
move:function(a,e,w,k){var b=this,g=b.now,p=!1!==b.options.animation&&!b.isHidden&&(1<Math.abs(a-g.x)||1<Math.abs(e-g.y)),r=b.followPointer||1<b.len;H(g,{x:p?(2*g.x+a)/3:a,y:p?(g.y+e)/2:e,anchorX:r?void 0:p?(2*g.anchorX+w)/3:w,anchorY:r?void 0:p?(g.anchorY+k)/2:k});b.getLabel().attr(g);p&&(clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){b&&b.move(a,e,w,k)},32))},hide:function(a){var b=this;clearTimeout(this.hideTimer);a=z(a,this.options.hideDelay,500);this.isHidden||(this.hideTimer=
q(function(){b.getLabel()[a?"fadeOut":"hide"]();b.isHidden=!0},a))},getAnchor:function(a,e){var b,k=this.chart,l=k.inverted,g=k.plotTop,p=k.plotLeft,r=0,u=0,f,B;a=t(a);b=a[0].tooltipPos;this.followPointer&&e&&(void 0===e.chartX&&(e=k.pointer.normalize(e)),b=[e.chartX-k.plotLeft,e.chartY-g]);b||(D(a,function(a){f=a.series.yAxis;B=a.series.xAxis;r+=a.plotX+(!l&&B?B.left-p:0);u+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!l&&f?f.top-g:0)}),r/=a.length,u/=a.length,b=[l?k.plotWidth-u:r,this.shared&&
!l&&1<a.length&&e?e.chartY-g:l?k.plotHeight-r:u]);return n(b,Math.round)},getPosition:function(a,e,w){var b=this.chart,l=this.distance,g={},p=w.h||0,r,u=["y",b.chartHeight,e,w.plotY+b.plotTop,b.plotTop,b.plotTop+b.plotHeight],f=["x",b.chartWidth,a,w.plotX+b.plotLeft,b.plotLeft,b.plotLeft+b.plotWidth],B=!this.followPointer&&z(w.ttBelow,!b.inverted===!!w.negative),d=function(a,c,b,d,f,y){var h=b<d-l,A=d+l+b<c,r=d-l-b;d+=l;if(B&&A)g[a]=d;else if(!B&&h)g[a]=r;else if(h)g[a]=Math.min(y-b,0>r-p?r:r-p);
else if(A)g[a]=Math.max(f,d+p+b>c?d:d+p);else return!1},x=function(a,c,b,d){var h;d<l||d>c-l?h=!1:g[a]=d<b/2?1:d>c-b/2?c-b-2:d-b/2;return h},c=function(a){var c=u;u=f;f=c;r=a},y=function(){!1!==d.apply(0,u)?!1!==x.apply(0,f)||r||(c(!0),y()):r?g.x=g.y=0:(c(!0),y())};(b.inverted||1<this.len)&&c();y();return g},defaultFormatter:function(a){var b=this.points||t(this),e;e=[a.tooltipFooterHeaderFormatter(b[0])];e=e.concat(a.bodyFormatter(b));e.push(a.tooltipFooterHeaderFormatter(b[0],!0));return e},refresh:function(a,
e){var b=this.chart,k,l=this.options,g,p,r={},u=[];k=l.formatter||this.defaultFormatter;var r=b.hoverPoints,f=this.shared;clearTimeout(this.hideTimer);this.followPointer=t(a)[0].series.tooltipOptions.followPointer;p=this.getAnchor(a,e);e=p[0];g=p[1];!f||a.series&&a.series.noSharedTooltip?r=a.getLabelConfig():(b.hoverPoints=a,r&&D(r,function(a){a.setState()}),D(a,function(a){a.setState("hover");u.push(a.getLabelConfig())}),r={x:a[0].category,y:a[0].y},r.points=u,a=a[0]);this.len=u.length;r=k.call(r,
this);f=a.series;this.distance=z(f.tooltipOptions.distance,16);!1===r?this.hide():(k=this.getLabel(),this.isHidden&&k.attr({opacity:1}).show(),this.split?this.renderSplit(r,b.hoverPoints):(k.attr({text:r&&r.join?r.join(""):r}),k.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+z(a.colorIndex,f.colorIndex)),k.attr({stroke:l.borderColor||a.color||f.color||"#666666"}),this.updatePosition({plotX:e,plotY:g,negative:a.negative,ttBelow:a.ttBelow,h:p[2]||0})),this.isHidden=!1)},renderSplit:function(b,
e){var p=this,k=[],l=this.chart,g=l.renderer,F=!0,r=this.options,u,f=this.getLabel();D(b.slice(0,e.length+1),function(a,b){b=e[b-1]||{isHeader:!0,plotX:e[0].plotX};var d=b.series||p,c=d.tt,y=b.series||{},B="highcharts-color-"+z(b.colorIndex,y.colorIndex,"none");c||(d.tt=c=g.label(null,null,null,"callout").addClass("highcharts-tooltip-box "+B).attr({padding:r.padding,r:r.borderRadius,fill:r.backgroundColor,stroke:b.color||y.color||"#333333","stroke-width":r.borderWidth}).add(f));c.isActive=!0;c.attr({text:a});
c.css(r.style);a=c.getBBox();y=a.width+c.strokeWidth();b.isHeader?(u=a.height,y=Math.max(0,Math.min(b.plotX+l.plotLeft-y/2,l.chartWidth-y))):y=b.plotX+l.plotLeft-z(r.distance,16)-y;0>y&&(F=!1);a=(b.series&&b.series.yAxis&&b.series.yAxis.pos)+(b.plotY||0);a-=l.plotTop;k.push({target:b.isHeader?l.plotHeight+u:a,rank:b.isHeader?1:0,size:d.tt.getBBox().height+1,point:b,x:y,tt:c})});this.cleanSplit();a.distribute(k,l.plotHeight+u);D(k,function(a){var b=a.point,f=b.series;a.tt.attr({visibility:void 0===
a.pos?"hidden":"inherit",x:F||b.isHeader?a.x:b.plotX+l.plotLeft+z(r.distance,16),y:a.pos+l.plotTop,anchorX:b.isHeader?b.plotX+l.plotLeft:b.plotX+f.xAxis.pos,anchorY:b.isHeader?a.pos+l.plotTop-15:b.plotY+f.yAxis.pos})})},updatePosition:function(a){var b=this.chart,e=this.getLabel(),e=(this.options.positioner||this.getPosition).call(this,e.width,e.height,a);this.move(Math.round(e.x),Math.round(e.y||0),a.plotX+b.plotLeft,a.plotY+b.plotTop)},getDateFormat:function(a,p,w,k){var b=E("%m-%d %H:%M:%S.%L",
p),g,F,r={millisecond:15,second:12,minute:9,hour:6,day:3},u="millisecond";for(F in e){if(a===e.week&&+E("%w",p)===w&&"00:00:00.000"===b.substr(6)){F="week";break}if(e[F]>a){F=u;break}if(r[F]&&b.substr(r[F])!=="01-01 00:00:00.000".substr(r[F]))break;"week"!==F&&(u=F)}F&&(g=k[F]);return g},getXDateFormat:function(a,e,w){e=e.dateTimeLabelFormats;var b=w&&w.closestPointRange;return(b?this.getDateFormat(b,a.x,w.options.startOfWeek,e):e.day)||e.year},tooltipFooterHeaderFormatter:function(a,e){var b=e?"footer":
"header";e=a.series;var k=e.tooltipOptions,l=k.xDateFormat,g=e.xAxis,F=g&&"datetime"===g.options.type&&v(a.key),b=k[b+"Format"];F&&!l&&(l=this.getXDateFormat(a,k,g));F&&l&&(b=b.replace("{point.key}","{point.key:"+l+"}"));return I(b,{point:a,series:e})},bodyFormatter:function(a){return n(a,function(a){var b=a.series.tooltipOptions;return(b.pointFormatter||a.point.tooltipFormatter).call(a.point,b.pointFormat)})}}})(K);(function(a){var E=a.addEvent,D=a.attr,H=a.charts,I=a.color,v=a.css,n=a.defined,m=
a.doc,z=a.each,t=a.extend,q=a.fireEvent,e=a.offset,b=a.pick,p=a.removeEvent,w=a.splat,k=a.Tooltip,l=a.win;a.Pointer=function(a,b){this.init(a,b)};a.Pointer.prototype={init:function(a,l){this.options=l;this.chart=a;this.runChartClick=l.chart.events&&!!l.chart.events.click;this.pinchDown=[];this.lastValidTouch={};k&&l.tooltip.enabled&&(a.tooltip=new k(a,l.tooltip),this.followTouchMove=b(l.tooltip.followTouchMove,!0));this.setDOMEvents()},zoomOption:function(a){var g=this.chart,l=g.options.chart,e=l.zoomType||
"",g=g.inverted;/touch/.test(a.type)&&(e=b(l.pinchType,e));this.zoomX=a=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=a&&!g||e&&g;this.zoomVert=e&&!g||a&&g;this.hasZoom=a||e},normalize:function(a,b){var g,u;a=a||l.event;a.target||(a.target=a.srcElement);u=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;b||(this.chartPosition=b=e(this.chart.container));void 0===u.pageX?(g=Math.max(a.x,a.clientX-b.left),b=a.y):(g=u.pageX-b.left,b=u.pageY-b.top);return t(a,{chartX:Math.round(g),
chartY:Math.round(b)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};z(this.chart.axes,function(g){b[g.isXAxis?"xAxis":"yAxis"].push({axis:g,value:g.toValue(a[g.horiz?"chartX":"chartY"])})});return b},runPointActions:function(g){var l=this.chart,r=l.series,e=l.tooltip,f=e?e.shared:!1,k=!0,d=l.hoverPoint,x=l.hoverSeries,c,y,p,A=[],J;if(!f&&!x)for(c=0;c<r.length;c++)if(r[c].directTouch||!r[c].options.stickyTracking)r=[];x&&(f?x.noSharedTooltip:x.directTouch)&&d?A=[d]:(f||!x||x.options.stickyTracking||
(r=[x]),z(r,function(a){y=a.noSharedTooltip&&f;p=!f&&a.directTouch;a.visible&&!y&&!p&&b(a.options.enableMouseTracking,!0)&&(J=a.searchPoint(g,!y&&1===a.kdDimensions))&&J.series&&A.push(J)}),A.sort(function(a,c){var b=a.distX-c.distX,d=a.dist-c.dist,h=(c.series.group&&c.series.group.zIndex)-(a.series.group&&a.series.group.zIndex);return 0!==b&&f?b:0!==d?d:0!==h?h:a.series.index>c.series.index?-1:1}));if(f)for(c=A.length;c--;)(A[c].x!==A[0].x||A[c].series.noSharedTooltip)&&A.splice(c,1);if(A[0]&&(A[0]!==
this.prevKDPoint||e&&e.isHidden)){if(f&&!A[0].series.noSharedTooltip){for(c=0;c<A.length;c++)A[c].onMouseOver(g,A[c]!==(x&&x.directTouch&&d||A[0]));A.length&&e&&e.refresh(A.sort(function(a,c){return a.series.index-c.series.index}),g)}else if(e&&e.refresh(A[0],g),!x||!x.directTouch)A[0].onMouseOver(g);this.prevKDPoint=A[0];k=!1}k&&(r=x&&x.tooltipOptions.followPointer,e&&r&&!e.isHidden&&(r=e.getAnchor([{}],g),e.updatePosition({plotX:r[0],plotY:r[1]})));this.unDocMouseMove||(this.unDocMouseMove=E(m,
"mousemove",function(c){if(H[a.hoverChartIndex])H[a.hoverChartIndex].pointer.onDocumentMouseMove(c)}));z(f?A:[b(d,A[0])],function(a){z(l.axes,function(c){(!a||a.series&&a.series[c.coll]===c)&&c.drawCrosshair(g,a)})})},reset:function(a,b){var g=this.chart,l=g.hoverSeries,f=g.hoverPoint,e=g.hoverPoints,d=g.tooltip,k=d&&d.shared?e:f;a&&k&&z(w(k),function(c){c.series.isCartesian&&void 0===c.plotX&&(a=!1)});if(a)d&&k&&(d.refresh(k),f&&(f.setState(f.state,!0),z(g.axes,function(a){a.crosshair&&a.drawCrosshair(null,
f)})));else{if(f)f.onMouseOut();e&&z(e,function(a){a.setState()});if(l)l.onMouseOut();d&&d.hide(b);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());z(g.axes,function(a){a.hideCrosshair()});this.hoverX=this.prevKDPoint=g.hoverPoints=g.hoverPoint=null}},scaleGroups:function(a,b){var g=this.chart,l;z(g.series,function(f){l=a||f.getPlotBox();f.xAxis&&f.xAxis.zoomEnabled&&f.group&&(f.group.attr(l),f.markerGroup&&(f.markerGroup.attr(l),f.markerGroup.clip(b?g.clipRect:null)),f.dataLabelsGroup&&
f.dataLabelsGroup.attr(l))});g.clipRect.attr(b||g.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,g=b.options.chart,l=a.chartX,f=a.chartY,e=this.zoomHor,d=this.zoomVert,k=b.plotLeft,c=b.plotTop,y=b.plotWidth,p=b.plotHeight,A,J=this.selectionMarker,h=this.mouseDownX,q=this.mouseDownY,w=g.panKey&&a[g.panKey+"Key"];J&&J.touch||(l<k?l=k:l>k+y&&(l=k+y),f<
c?f=c:f>c+p&&(f=c+p),this.hasDragged=Math.sqrt(Math.pow(h-l,2)+Math.pow(q-f,2)),10<this.hasDragged&&(A=b.isInsidePlot(h-k,q-c),b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&A&&!w&&!J&&(this.selectionMarker=J=b.renderer.rect(k,c,e?1:y,d?1:p,0).attr({fill:g.selectionMarkerFill||I("#335cad").setOpacity(.25).get(),"class":"highcharts-selection-marker",zIndex:7}).add()),J&&e&&(l-=h,J.attr({width:Math.abs(l),x:(0<l?0:l)+h})),J&&d&&(l=f-q,J.attr({height:Math.abs(l),y:(0<l?0:l)+q})),A&&!J&&g.panning&&b.pan(a,
g.panning)))},drop:function(a){var b=this,g=this.chart,l=this.hasPinched;if(this.selectionMarker){var f={originalEvent:a,xAxis:[],yAxis:[]},e=this.selectionMarker,d=e.attr?e.attr("x"):e.x,k=e.attr?e.attr("y"):e.y,c=e.attr?e.attr("width"):e.width,y=e.attr?e.attr("height"):e.height,p;if(this.hasDragged||l)z(g.axes,function(g){if(g.zoomEnabled&&n(g.min)&&(l||b[{xAxis:"zoomX",yAxis:"zoomY"}[g.coll]])){var e=g.horiz,h="touchend"===a.type?g.minPixelPadding:0,A=g.toValue((e?d:k)+h),e=g.toValue((e?d+c:k+
y)-h);f[g.coll].push({axis:g,min:Math.min(A,e),max:Math.max(A,e)});p=!0}}),p&&q(g,"selection",f,function(a){g.zoom(t(a,l?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();l&&this.scaleGroups()}g&&(v(g.container,{cursor:g._cursor}),g.cancelClick=10<this.hasDragged,g.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])},onContainerMouseDown:function(a){a=this.normalize(a);this.zoomOption(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(b){H[a.hoverChartIndex]&&
H[a.hoverChartIndex].pointer.drop(b)},onDocumentMouseMove:function(a){var b=this.chart,g=this.chartPosition;a=this.normalize(a,g);!g||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||this.reset()},onContainerMouseLeave:function(b){var g=H[a.hoverChartIndex];g&&(b.relatedTarget||b.toElement)&&(g.pointer.reset(),g.pointer.chartPosition=null)},onContainerMouseMove:function(b){var g=this.chart;n(a.hoverChartIndex)&&H[a.hoverChartIndex]&&H[a.hoverChartIndex].mouseIsDown||
(a.hoverChartIndex=g.index);b=this.normalize(b);b.returnValue=!1;"mousedown"===g.mouseIsDown&&this.drag(b);!this.inClass(b.target,"highcharts-tracker")&&!g.isInsidePlot(b.chartX-g.plotLeft,b.chartY-g.plotTop)||g.openMenu||this.runPointActions(b)},inClass:function(a,b){for(var g;a;){if(g=D(a,"class")){if(-1!==g.indexOf(b))return!0;if(-1!==g.indexOf("highcharts-container"))return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;if(!(!b||!a||
b.options.stickyTracking||this.inClass(a,"highcharts-tooltip")||this.inClass(a,"highcharts-series-"+b.index)&&this.inClass(a,"highcharts-tracker")))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,g=b.hoverPoint,l=b.plotLeft,f=b.plotTop;a=this.normalize(a);b.cancelClick||(g&&this.inClass(a.target,"highcharts-tracker")?(q(g.series,"click",t(a,{point:g})),b.hoverPoint&&g.firePointEvent("click",a)):(t(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-l,a.chartY-f)&&q(b,"click",a)))},setDOMEvents:function(){var b=
this,l=b.chart.container;l.onmousedown=function(a){b.onContainerMouseDown(a)};l.onmousemove=function(a){b.onContainerMouseMove(a)};l.onclick=function(a){b.onContainerClick(a)};E(l,"mouseleave",b.onContainerMouseLeave);1===a.chartCount&&E(m,"mouseup",b.onDocumentMouseUp);a.hasTouch&&(l.ontouchstart=function(a){b.onContainerTouchStart(a)},l.ontouchmove=function(a){b.onContainerTouchMove(a)},1===a.chartCount&&E(m,"touchend",b.onDocumentTouchEnd))},destroy:function(){var b;p(this.chart.container,"mouseleave",
this.onContainerMouseLeave);a.chartCount||(p(m,"mouseup",this.onDocumentMouseUp),p(m,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(b in this)this[b]=null}}})(K);(function(a){var E=a.charts,D=a.each,H=a.extend,I=a.map,v=a.noop,n=a.pick;H(a.Pointer.prototype,{pinchTranslate:function(a,n,t,q,e,b){this.zoomHor&&this.pinchTranslateDirection(!0,a,n,t,q,e,b);this.zoomVert&&this.pinchTranslateDirection(!1,a,n,t,q,e,b)},pinchTranslateDirection:function(a,n,t,q,e,b,p,w){var k=
this.chart,l=a?"x":"y",g=a?"X":"Y",m="chart"+g,r=a?"width":"height",u=k["plot"+(a?"Left":"Top")],f,B,d=w||1,x=k.inverted,c=k.bounds[a?"h":"v"],y=1===n.length,L=n[0][m],A=t[0][m],J=!y&&n[1][m],h=!y&&t[1][m],G;t=function(){!y&&20<Math.abs(L-J)&&(d=w||Math.abs(A-h)/Math.abs(L-J));B=(u-A)/d+L;f=k["plot"+(a?"Width":"Height")]/d};t();n=B;n<c.min?(n=c.min,G=!0):n+f>c.max&&(n=c.max-f,G=!0);G?(A-=.8*(A-p[l][0]),y||(h-=.8*(h-p[l][1])),t()):p[l]=[A,h];x||(b[l]=B-u,b[r]=f);b=x?1/d:d;e[r]=f;e[l]=n;q[x?a?"scaleY":
"scaleX":"scale"+g]=d;q["translate"+g]=b*u+(A-b*L)},pinch:function(a){var m=this,t=m.chart,q=m.pinchDown,e=a.touches,b=e.length,p=m.lastValidTouch,w=m.hasZoom,k=m.selectionMarker,l={},g=1===b&&(m.inClass(a.target,"highcharts-tracker")&&t.runTrackerClick||m.runChartClick),F={};1<b&&(m.initiated=!0);w&&m.initiated&&!g&&a.preventDefault();I(e,function(a){return m.normalize(a)});"touchstart"===a.type?(D(e,function(a,b){q[b]={chartX:a.chartX,chartY:a.chartY}}),p.x=[q[0].chartX,q[1]&&q[1].chartX],p.y=[q[0].chartY,
q[1]&&q[1].chartY],D(t.axes,function(a){if(a.zoomEnabled){var b=t.bounds[a.horiz?"h":"v"],f=a.minPixelPadding,g=a.toPixels(n(a.options.min,a.dataMin)),d=a.toPixels(n(a.options.max,a.dataMax)),l=Math.max(g,d);b.min=Math.min(a.pos,Math.min(g,d)-f);b.max=Math.max(a.pos+a.len,l+f)}}),m.res=!0):m.followTouchMove&&1===b?this.runPointActions(m.normalize(a)):q.length&&(k||(m.selectionMarker=k=H({destroy:v,touch:!0},t.plotBox)),m.pinchTranslate(q,e,l,k,F,p),m.hasPinched=w,m.scaleGroups(l,F),m.res&&(m.res=
!1,this.reset(!1,0)))},touch:function(m,v){var t=this.chart,q,e;if(t.index!==a.hoverChartIndex)this.onContainerMouseLeave({relatedTarget:!0});a.hoverChartIndex=t.index;1===m.touches.length?(m=this.normalize(m),(e=t.isInsidePlot(m.chartX-t.plotLeft,m.chartY-t.plotTop))&&!t.openMenu?(v&&this.runPointActions(m),"touchmove"===m.type&&(v=this.pinchDown,q=v[0]?4<=Math.sqrt(Math.pow(v[0].chartX-m.chartX,2)+Math.pow(v[0].chartY-m.chartY,2)):!1),n(q,!0)&&this.pinch(m)):v&&this.reset()):2===m.touches.length&&
this.pinch(m)},onContainerTouchStart:function(a){this.zoomOption(a);this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(m){E[a.hoverChartIndex]&&E[a.hoverChartIndex].pointer.drop(m)}})})(K);(function(a){var E=a.addEvent,D=a.charts,H=a.css,I=a.doc,v=a.extend,n=a.noop,m=a.Pointer,z=a.removeEvent,t=a.win,q=a.wrap;if(t.PointerEvent||t.MSPointerEvent){var e={},b=!!t.PointerEvent,p=function(){var a,b=[];b.item=function(a){return this[a]};for(a in e)e.hasOwnProperty(a)&&
b.push({pageX:e[a].pageX,pageY:e[a].pageY,target:e[a].target});return b},w=function(b,l,g,e){"touch"!==b.pointerType&&b.pointerType!==b.MSPOINTER_TYPE_TOUCH||!D[a.hoverChartIndex]||(e(b),e=D[a.hoverChartIndex].pointer,e[l]({type:g,target:b.currentTarget,preventDefault:n,touches:p()}))};v(m.prototype,{onContainerPointerDown:function(a){w(a,"onContainerTouchStart","touchstart",function(a){e[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){w(a,"onContainerTouchMove",
"touchmove",function(a){e[a.pointerId]={pageX:a.pageX,pageY:a.pageY};e[a.pointerId].target||(e[a.pointerId].target=a.currentTarget)})},onDocumentPointerUp:function(a){w(a,"onDocumentTouchEnd","touchend",function(a){delete e[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,b?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,b?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(I,b?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});q(m.prototype,
"init",function(a,b,g){a.call(this,b,g);this.hasZoom&&H(b.container,{"-ms-touch-action":"none","touch-action":"none"})});q(m.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(E)});q(m.prototype,"destroy",function(a){this.batchMSEvents(z);a.call(this)})}})(K);(function(a){var E,D=a.addEvent,H=a.css,I=a.discardElement,v=a.defined,n=a.each,m=a.extend,z=a.isFirefox,t=a.marginNames,q=a.merge,e=a.pick,b=a.setAnimation,p=a.stableSort,w=a.win,k=a.wrap;
E=a.Legend=function(a,b){this.init(a,b)};E.prototype={init:function(a,b){this.chart=a;this.setOptions(b);b.enabled&&(this.render(),D(this.chart,"endResize",function(){this.legend.positionCheckboxes()}))},setOptions:function(a){var b=e(a.padding,8);this.options=a;this.itemStyle=a.itemStyle;this.itemHiddenStyle=q(this.itemStyle,a.itemHiddenStyle);this.itemMarginTop=a.itemMarginTop||0;this.initialItemX=this.padding=b;this.initialItemY=b-5;this.itemHeight=this.maxItemWidth=0;this.symbolWidth=e(a.symbolWidth,
16);this.pages=[]},update:function(a,b){var g=this.chart;this.setOptions(q(!0,this.options,a));this.destroy();g.isDirtyLegend=g.isDirtyBox=!0;e(b,!0)&&g.redraw()},colorizeItem:function(a,b){a.legendGroup[b?"removeClass":"addClass"]("highcharts-legend-item-hidden");var g=this.options,e=a.legendItem,l=a.legendLine,f=a.legendSymbol,k=this.itemHiddenStyle.color,g=b?g.itemStyle.color:k,d=b?a.color||k:k,x=a.options&&a.options.marker,c={fill:d},y;e&&e.css({fill:g,color:g});l&&l.attr({stroke:d});if(f){if(x&&
f.isMarker&&(c=a.pointAttribs(),!b))for(y in c)c[y]=k;f.attr(c)}},positionItem:function(a){var b=this.options,e=b.symbolPadding,b=!b.rtl,l=a._legendItemPos,k=l[0],l=l[1],f=a.checkbox;(a=a.legendGroup)&&a.element&&a.translate(b?k:this.legendWidth-k-2*e-4,l);f&&(f.x=k,f.y=l)},destroyItem:function(a){var b=a.checkbox;n(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&I(a.checkbox)},destroy:function(){function a(a){this[a]&&(this[a]=this[a].destroy())}
n(this.getAllItems(),function(b){n(["legendItem","legendGroup"],a,b)});n(["box","title","group"],a,this);this.display=null},positionCheckboxes:function(a){var b=this.group&&this.group.alignAttr,e,l=this.clipHeight||this.legendHeight,k=this.titleHeight;b&&(e=b.translateY,n(this.allItems,function(f){var g=f.checkbox,d;g&&(d=e+k+g.y+(a||0)+3,H(g,{left:b.translateX+f.checkboxOffset+g.x-20+"px",top:d+"px",display:d>e-6&&d<e+l-6?"":"none"}))}))},renderTitle:function(){var a=this.padding,b=this.options.title,
e=0;b.text&&(this.title||(this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group)),a=this.title.getBBox(),e=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:e}));this.titleHeight=e},setText:function(b){var g=this.options;b.legendItem.attr({text:g.labelFormat?a.format(g.labelFormat,b):g.labelFormatter.call(b)})},renderItem:function(a){var b=this.chart,l=b.renderer,k=this.options,u="horizontal"===
k.layout,f=this.symbolWidth,p=k.symbolPadding,d=this.itemStyle,x=this.itemHiddenStyle,c=this.padding,y=u?e(k.itemDistance,20):0,m=!k.rtl,A=k.width,J=k.itemMarginBottom||0,h=this.itemMarginTop,w=this.initialItemX,n=a.legendItem,t=!a.series,v=!t&&a.series.drawLegendSymbol?a.series:a,z=v.options,z=this.createCheckboxForItem&&z&&z.showCheckbox,C=k.useHTML;n||(a.legendGroup=l.g("legend-item").addClass("highcharts-"+v.type+"-series highcharts-color-"+a.colorIndex+(a.options.className?" "+a.options.className:
"")+(t?" highcharts-series-"+a.index:"")).attr({zIndex:1}).add(this.scrollGroup),a.legendItem=n=l.text("",m?f+p:-p,this.baseline||0,C).css(q(a.visible?d:x)).attr({align:m?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(d=d.fontSize,this.fontMetrics=l.fontMetrics(d,n),this.baseline=this.fontMetrics.f+3+h,n.attr("y",this.baseline)),this.symbolHeight=k.symbolHeight||this.fontMetrics.f,v.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,n,C),z&&this.createCheckboxForItem(a));
this.colorizeItem(a,a.visible);this.setText(a);l=n.getBBox();f=a.checkboxOffset=k.itemWidth||a.legendItemWidth||f+p+l.width+y+(z?20:0);this.itemHeight=p=Math.round(a.legendItemHeight||l.height);u&&this.itemX-w+f>(A||b.chartWidth-2*c-w-k.x)&&(this.itemX=w,this.itemY+=h+this.lastLineHeight+J,this.lastLineHeight=0);this.maxItemWidth=Math.max(this.maxItemWidth,f);this.lastItemY=h+this.itemY+J;this.lastLineHeight=Math.max(p,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];u?this.itemX+=f:
(this.itemY+=h+p+J,this.lastLineHeight=p);this.offsetWidth=A||Math.max((u?this.itemX-w-y:f)+c,this.offsetWidth)},getAllItems:function(){var a=[];n(this.chart.series,function(b){var g=b&&b.options;b&&e(g.showInLegend,v(g.linkedTo)?!1:void 0,!0)&&(a=a.concat(b.legendItems||("point"===g.legendType?b.data:b)))});return a},adjustMargins:function(a,b){var g=this.chart,l=this.options,k=l.align.charAt(0)+l.verticalAlign.charAt(0)+l.layout.charAt(0);l.floating||n([/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,
/(lbv|lm|ltv)/],function(f,r){f.test(k)&&!v(a[r])&&(g[t[r]]=Math.max(g[t[r]],g.legend[(r+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][r]*l[r%2?"x":"y"]+e(l.margin,12)+b[r]))})},render:function(){var a=this,b=a.chart,e=b.renderer,k=a.group,u,f,B,d,x=a.box,c=a.options,y=a.padding;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;k||(a.group=k=e.g("legend").attr({zIndex:7}).add(),a.contentGroup=e.g().attr({zIndex:1}).add(k),a.scrollGroup=e.g().add(a.contentGroup));a.renderTitle();
u=a.getAllItems();p(u,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});c.reversed&&u.reverse();a.allItems=u;a.display=f=!!u.length;a.lastLineHeight=0;n(u,function(b){a.renderItem(b)});B=(c.width||a.offsetWidth)+y;d=a.lastItemY+a.lastLineHeight+a.titleHeight;d=a.handleOverflow(d);d+=y;x||(a.box=x=e.rect().addClass("highcharts-legend-box").attr({r:c.borderRadius}).add(k),x.isNew=!0);x.attr({stroke:c.borderColor,"stroke-width":c.borderWidth||0,fill:c.backgroundColor||
"none"}).shadow(c.shadow);0<B&&0<d&&(x[x.isNew?"attr":"animate"](x.crisp({x:0,y:0,width:B,height:d},x.strokeWidth())),x.isNew=!1);x[f?"show":"hide"]();a.legendWidth=B;a.legendHeight=d;n(u,function(b){a.positionItem(b)});f&&k.align(m({width:B,height:d},c),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,l=this.chart,k=l.renderer,u=this.options,f=u.y,l=l.spacingBox.height+("top"===u.verticalAlign?-f:f)-this.padding,f=u.maxHeight,p,d=this.clipRect,x=u.navigation,
c=e(x.animation,!0),y=x.arrowSize||12,w=this.nav,A=this.pages,J=this.padding,h,m=this.allItems,q=function(a){a?d.attr({height:a}):d&&(b.clipRect=d.destroy(),b.contentGroup.clip());b.contentGroup.div&&(b.contentGroup.div.style.clip=a?"rect("+J+"px,9999px,"+(J+a)+"px,0)":"auto")};"horizontal"!==u.layout||"middle"===u.verticalAlign||u.floating||(l/=2);f&&(l=Math.min(l,f));A.length=0;a>l&&!1!==x.enabled?(this.clipHeight=p=Math.max(l-20-this.titleHeight-J,0),this.currentPage=e(this.currentPage,1),this.fullHeight=
a,n(m,function(a,b){var c=a._legendItemPos[1];a=Math.round(a.legendItem.getBBox().height);var d=A.length;if(!d||c-A[d-1]>p&&(h||c)!==A[d-1])A.push(h||c),d++;b===m.length-1&&c+a-A[d-1]>p&&A.push(c);c!==h&&(h=c)}),d||(d=b.clipRect=k.clipRect(0,J,9999,0),b.contentGroup.clip(d)),q(p),w||(this.nav=w=k.g().attr({zIndex:1}).add(this.group),this.up=k.symbol("triangle",0,0,y,y).on("click",function(){b.scroll(-1,c)}).add(w),this.pager=k.text("",15,10).addClass("highcharts-legend-navigation").css(x.style).add(w),
this.down=k.symbol("triangle-down",0,0,y,y).on("click",function(){b.scroll(1,c)}).add(w)),b.scroll(0),a=l):w&&(q(),w.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return a},scroll:function(a,g){var e=this.pages,k=e.length;a=this.currentPage+a;var l=this.clipHeight,f=this.options.navigation,p=this.pager,d=this.padding;a>k&&(a=k);0<a&&(void 0!==g&&b(g,this.chart),this.nav.attr({translateX:d,translateY:l+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({"class":1===
a?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),p.attr({text:a+"/"+k}),this.down.attr({x:18+this.pager.getBBox().width,"class":a===k?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),this.up.attr({fill:1===a?f.inactiveColor:f.activeColor}).css({cursor:1===a?"default":"pointer"}),this.down.attr({fill:a===k?f.inactiveColor:f.activeColor}).css({cursor:a===k?"default":"pointer"}),g=-e[a-1]+this.initialItemY,this.scrollGroup.animate({translateY:g}),this.currentPage=
a,this.positionCheckboxes(g))}};a.LegendSymbolMixin={drawRectangle:function(a,b){var g=a.symbolHeight,k=a.options.squareSymbol;b.legendSymbol=this.chart.renderer.rect(k?(a.symbolWidth-g)/2:0,a.baseline-g+1,k?g:a.symbolWidth,g,e(a.options.symbolRadius,g/2)).addClass("highcharts-point").attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,k=b.marker,l=a.symbolWidth,u=a.symbolHeight,f=u/2,p=this.chart.renderer,d=this.legendGroup;a=a.baseline-Math.round(.3*a.fontMetrics.b);
var x;x={"stroke-width":b.lineWidth||0};b.dashStyle&&(x.dashstyle=b.dashStyle);this.legendLine=p.path(["M",0,a,"L",l,a]).addClass("highcharts-graph").attr(x).add(d);k&&!1!==k.enabled&&(b=Math.min(e(k.radius,f),f),0===this.symbol.indexOf("url")&&(k=q(k,{width:u,height:u}),b=0),this.legendSymbol=k=p.symbol(this.symbol,l/2-b,a-b,2*b,2*b,k).addClass("highcharts-point").add(d),k.isMarker=!0)}};(/Trident\/7\.0/.test(w.navigator.userAgent)||z)&&k(E.prototype,"positionItem",function(a,b){var e=this,g=function(){b._legendItemPos&&
a.call(e,b)};g();setTimeout(g)})})(K);(function(a){var E=a.addEvent,D=a.animate,H=a.animObject,I=a.attr,v=a.doc,n=a.Axis,m=a.createElement,z=a.defaultOptions,t=a.discardElement,q=a.charts,e=a.css,b=a.defined,p=a.each,w=a.extend,k=a.find,l=a.fireEvent,g=a.getStyle,F=a.grep,r=a.isNumber,u=a.isObject,f=a.isString,B=a.Legend,d=a.marginNames,x=a.merge,c=a.Pointer,y=a.pick,L=a.pInt,A=a.removeEvent,J=a.seriesTypes,h=a.splat,G=a.svg,Q=a.syncTimeout,P=a.win,N=a.Renderer,S=a.Chart=function(){this.getArgs.apply(this,
arguments)};a.chart=function(a,b,c){return new S(a,b,c)};S.prototype={callbacks:[],getArgs:function(){var a=[].slice.call(arguments);if(f(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(b,c){var d,h=b.series;b.series=null;d=x(z,b);d.series=b.series=h;this.userOptions=b;this.respRules=[];b=d.chart;h=b.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.callback=c;this.isResizing=0;this.options=d;this.axes=[];this.series=[];this.hasCartesianSeries=b.showAxes;
var f;this.index=q.length;q.push(this);a.chartCount++;if(h)for(f in h)E(this,f,h[f]);this.xAxis=[];this.yAxis=[];this.pointCount=this.colorCounter=this.symbolCounter=0;this.firstRender()},initSeries:function(b){var c=this.options.chart;(c=J[b.type||c.type||c.defaultSeriesType])||a.error(17,!0);c=new c;c.init(this,b);return c},orderSeries:function(a){var b=this.series;for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].name||"Series "+(b[a].index+1))},isInsidePlot:function(a,b,c){var d=c?
b:a;a=c?a:b;return 0<=d&&d<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(b){var c=this.axes,d=this.series,h=this.pointer,f=this.legend,e=this.isDirtyLegend,y,g,A=this.hasCartesianSeries,k=this.isDirtyBox,u=d.length,r=u,x=this.renderer,J=x.isHidden(),C=[];this.setResponsive&&this.setResponsive(!1);a.setAnimation(b,this);J&&this.cloneRenderTo();for(this.layOutTitles();r--;)if(b=d[r],b.options.stacking&&(y=!0,b.isDirty)){g=!0;break}if(g)for(r=u;r--;)b=d[r],b.options.stacking&&(b.isDirty=
!0);p(d,function(a){a.isDirty&&"point"===a.options.legendType&&(a.updateTotals&&a.updateTotals(),e=!0);a.isDirtyData&&l(a,"updatedData")});e&&f.options.enabled&&(f.render(),this.isDirtyLegend=!1);y&&this.getStacks();A&&p(c,function(a){a.updateNames();a.setScale()});this.getMargins();A&&(p(c,function(a){a.isDirty&&(k=!0)}),p(c,function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,C.push(function(){l(a,"afterSetExtremes",w(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(k||y)&&a.redraw()}));
k&&this.drawChartBox();l(this,"predraw");p(d,function(a){(k||a.isDirty)&&a.visible&&a.redraw();a.isDirtyData=!1});h&&h.reset(!0);x.draw();l(this,"redraw");l(this,"render");J&&this.cloneRenderTo(!0);p(C,function(a){a.call()})},get:function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var c,d=this.series,h;c=k(this.axes,b)||k(this.series,b);for(h=0;!c&&h<d.length;h++)c=k(d[h].points||[],b);return c},getAxes:function(){var a=this,b=this.options,c=b.xAxis=h(b.xAxis||{}),b=b.yAxis=h(b.yAxis||
{});p(c,function(a,b){a.index=b;a.isX=!0});p(b,function(a,b){a.index=b});c=c.concat(b);p(c,function(b){new n(a,b)})},getSelectedPoints:function(){var a=[];p(this.series,function(b){a=a.concat(F(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return F(this.series,function(a){return a.selected})},setTitle:function(a,b,c){var d=this,h=d.options,f;f=h.title=x({style:{color:"#333333",fontSize:h.isStock?"16px":"18px"}},h.title,a);h=h.subtitle=x({style:{color:"#666666"}},
h.subtitle,b);p([["title",a,f],["subtitle",b,h]],function(a,b){var c=a[0],h=d[c],f=a[1];a=a[2];h&&f&&(d[c]=h=h.destroy());a&&a.text&&!h&&(d[c]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+c,zIndex:a.zIndex||4}).add(),d[c].update=function(a){d.setTitle(!b&&a,b&&a)},d[c].css(a.style))});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c,d=this.renderer,h=this.spacingBox;p(["title","subtitle"],function(a){var c=this[a],f=this.options[a],e;c&&(e=f.style.fontSize,
e=d.fontMetrics(e,c).b,c.css({width:(f.width||h.width+f.widthAdjust)+"px"}).align(w({y:b+e+("title"===a?-3:2)},f),!1,"spacingBox"),f.floating||f.verticalAlign||(b=Math.ceil(b+c.getBBox().height)))},this);c=this.titleOffset!==b;this.titleOffset=b;!this.isDirtyBox&&c&&(this.isDirtyBox=c,this.hasRendered&&y(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var a=this.options.chart,c=a.width,a=a.height,d=this.renderToClone||this.renderTo;b(c)||(this.containerWidth=g(d,"width"));b(a)||(this.containerHeight=
g(d,"height"));this.chartWidth=Math.max(0,c||this.containerWidth||600);this.chartHeight=Math.max(0,a||this.containerHeight||400)},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;if(a){if(b){for(;b.childNodes.length;)this.renderTo.appendChild(b.firstChild);t(b);delete this.renderToClone}}else c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),e(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&
b.style.setProperty("display","block","important"),v.body.appendChild(b),c&&b.appendChild(c)},setClassName:function(a){this.container.className="highcharts-container "+(a||"")},getContainer:function(){var b,c=this.options,d=c.chart,h,e;b=this.renderTo;var y=a.uniqueKey(),g;b||(this.renderTo=b=d.renderTo);f(b)&&(this.renderTo=b=v.getElementById(b));b||a.error(13,!0);h=L(I(b,"data-highcharts-chart"));r(h)&&q[h]&&q[h].hasRendered&&q[h].destroy();I(b,"data-highcharts-chart",this.index);b.innerHTML="";
d.skipClone||b.offsetWidth||this.cloneRenderTo();this.getChartSize();h=this.chartWidth;e=this.chartHeight;g=w({position:"relative",overflow:"hidden",width:h+"px",height:e+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},d.style);this.container=b=m("div",{id:y},g,this.renderToClone||b);this._cursor=b.style.cursor;this.renderer=new (a[d.renderer]||N)(b,h,e,null,d.forExport,c.exporting&&c.exporting.allowHTML);this.setClassName(d.className);this.renderer.setStyle(d.style);
this.renderer.chartIndex=this.index},getMargins:function(a){var c=this.spacing,d=this.margin,h=this.titleOffset;this.resetMargins();h&&!b(d[0])&&(this.plotTop=Math.max(this.plotTop,h+this.options.title.margin+c[0]));this.legend.display&&this.legend.adjustMargins(d,c);this.extraMargin&&(this[this.extraMargin.type]=(this[this.extraMargin.type]||0)+this.extraMargin.value);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);a||this.getAxisMargins()},getAxisMargins:function(){var a=this,c=a.axisOffset=
[0,0,0,0],h=a.margin;a.hasCartesianSeries&&p(a.axes,function(a){a.visible&&a.getOffset()});p(d,function(d,f){b(h[f])||(a[d]+=c[f])});a.setChartSize()},reflow:function(a){var c=this,d=c.options.chart,h=c.renderTo,f=b(d.width),e=d.width||g(h,"width"),d=d.height||g(h,"height"),h=a?a.target:P;if(!f&&!c.isPrinting&&e&&d&&(h===P||h===v)){if(e!==c.containerWidth||d!==c.containerHeight)clearTimeout(c.reflowTimeout),c.reflowTimeout=Q(function(){c.container&&c.setSize(void 0,void 0,!1)},a?100:0);c.containerWidth=
e;c.containerHeight=d}},initReflow:function(){var a=this,b;b=E(P,"resize",function(b){a.reflow(b)});E(a,"destroy",b)},setSize:function(b,c,d){var h=this,f=h.renderer;h.isResizing+=1;a.setAnimation(d,h);h.oldChartHeight=h.chartHeight;h.oldChartWidth=h.chartWidth;void 0!==b&&(h.options.chart.width=b);void 0!==c&&(h.options.chart.height=c);h.getChartSize();b=f.globalAnimation;(b?D:e)(h.container,{width:h.chartWidth+"px",height:h.chartHeight+"px"},b);h.setChartSize(!0);f.setSize(h.chartWidth,h.chartHeight,
d);p(h.axes,function(a){a.isDirty=!0;a.setScale()});h.isDirtyLegend=!0;h.isDirtyBox=!0;h.layOutTitles();h.getMargins();h.redraw(d);h.oldChartHeight=null;l(h,"resize");Q(function(){h&&l(h,"endResize",null,function(){--h.isResizing})},H(b).duration)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,h=this.chartHeight,f=this.options.chart,e=this.spacing,y=this.clipOffset,g,A,k,l;this.plotLeft=g=Math.round(this.plotLeft);this.plotTop=A=Math.round(this.plotTop);this.plotWidth=
k=Math.max(0,Math.round(d-g-this.marginRight));this.plotHeight=l=Math.max(0,Math.round(h-A-this.marginBottom));this.plotSizeX=b?l:k;this.plotSizeY=b?k:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:e[3],y:e[0],width:d-e[3]-e[1],height:h-e[0]-e[2]};this.plotBox=c.plotBox={x:g,y:A,width:k,height:l};d=2*Math.floor(this.plotBorderWidth/2);b=Math.ceil(Math.max(d,y[3])/2);c=Math.ceil(Math.max(d,y[0])/2);this.clipBox={x:b,y:c,width:Math.floor(this.plotSizeX-Math.max(d,y[1])/
2-b),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(d,y[2])/2-c))};a||p(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},resetMargins:function(){var a=this,b=a.options.chart;p(["margin","spacing"],function(c){var d=b[c],h=u(d)?d:[d,d,d,d];p(["Top","Right","Bottom","Left"],function(d,f){a[c][f]=y(b[c+d],h[f])})});p(d,function(b,c){a[b]=y(a.margin[c],a.spacing[c])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=
this.chartWidth,d=this.chartHeight,h=this.chartBackground,f=this.plotBackground,e=this.plotBorder,y,g=this.plotBGImage,A=a.backgroundColor,k=a.plotBackgroundColor,l=a.plotBackgroundImage,u,r=this.plotLeft,x=this.plotTop,J=this.plotWidth,p=this.plotHeight,w=this.plotBox,m=this.clipRect,q=this.clipBox,B="animate";h||(this.chartBackground=h=b.rect().addClass("highcharts-background").add(),B="attr");y=a.borderWidth||0;u=y+(a.shadow?8:0);A={fill:A||"none"};if(y||h["stroke-width"])A.stroke=a.borderColor,
A["stroke-width"]=y;h.attr(A).shadow(a.shadow);h[B]({x:u/2,y:u/2,width:c-u-y%2,height:d-u-y%2,r:a.borderRadius});B="animate";f||(B="attr",this.plotBackground=f=b.rect().addClass("highcharts-plot-background").add());f[B](w);f.attr({fill:k||"none"}).shadow(a.plotShadow);l&&(g?g.animate(w):this.plotBGImage=b.image(l,r,x,J,p).add());m?m.animate({width:q.width,height:q.height}):this.clipRect=b.clipRect(q);B="animate";e||(B="attr",this.plotBorder=e=b.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());
e.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});e[B](e.crisp({x:r,y:x,width:J,height:p},-e.strokeWidth()));this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,h,f;p(["inverted","angular","polar"],function(e){c=J[b.type||b.defaultSeriesType];f=b[e]||c&&c.prototype[e];for(h=d&&d.length;!f&&h--;)(c=J[d[h].type])&&c.prototype[e]&&(f=!0);a[e]=f})},linkSeries:function(){var a=this,b=a.series;p(b,function(a){a.linkedSeries.length=
0});p(b,function(b){var c=b.options.linkedTo;f(c)&&(c=":previous"===c?a.series[b.index-1]:a.get(c))&&c.linkedParent!==b&&(c.linkedSeries.push(b),b.linkedParent=c,b.visible=y(b.options.visible,c.options.visible,b.visible))})},renderSeries:function(){p(this.series,function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&p(b.items,function(c){var d=w(b.style,c.style),h=L(d.left)+a.plotLeft,f=L(d.top)+a.plotTop+12;delete d.left;delete d.top;a.renderer.text(c.html,
h,f).attr({zIndex:2}).css(d).add()})},render:function(){var a=this.axes,b=this.renderer,c=this.options,d,h,f;this.setTitle();this.legend=new B(this,c.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();c=this.plotWidth;d=this.plotHeight-=21;p(a,function(a){a.setScale()});this.getAxisMargins();h=1.1<c/this.plotWidth;f=1.05<d/this.plotHeight;if(h||f)p(a,function(a){(a.horiz&&h||!a.horiz&&f)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&
p(a,function(a){a.visible&&a.render()});this.seriesGroup||(this.seriesGroup=b.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.hasRendered=!0},addCredits:function(a){var b=this;a=x(!0,this.options.credits,a);a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){a.href&&(P.location.href=a.href)}).attr({align:a.position.align,
zIndex:8}).css(a.style).add().align(a.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a)})},destroy:function(){var b=this,c=b.axes,d=b.series,h=b.container,f,e=h&&h.parentNode;l(b,"destroy");q[b.index]=void 0;a.chartCount--;b.renderTo.removeAttribute("data-highcharts-chart");A(b);for(f=c.length;f--;)c[f]=c[f].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(f=d.length;f--;)d[f]=d[f].destroy();p("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "),
function(a){var c=b[a];c&&c.destroy&&(b[a]=c.destroy())});h&&(h.innerHTML="",A(h),e&&t(h));for(f in b)delete b[f]},isReadyToRender:function(){var a=this;return G||P!=P.top||"complete"===v.readyState?!0:(v.attachEvent("onreadystatechange",function(){v.detachEvent("onreadystatechange",a.firstRender);"complete"===v.readyState&&a.firstRender()}),!1)},firstRender:function(){var a=this,b=a.options;if(a.isReadyToRender()){a.getContainer();l(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();
a.getAxes();p(b.series||[],function(b){a.initSeries(b)});a.linkSeries();l(a,"beforeRender");c&&(a.pointer=new c(a,b));a.render();if(!a.renderer.imgCount&&a.onload)a.onload();a.cloneRenderTo(!0)}},onload:function(){p([this.callback].concat(this.callbacks),function(a){a&&void 0!==this.index&&a.apply(this,[this])},this);l(this,"load");l(this,"render");b(this.index)&&!1!==this.options.chart.reflow&&this.initReflow();this.onload=null}}})(K);(function(a){var E,D=a.each,H=a.extend,I=a.erase,v=a.fireEvent,
n=a.format,m=a.isArray,z=a.isNumber,t=a.pick,q=a.removeEvent;E=a.Point=function(){};E.prototype={init:function(a,b,p){this.series=a;this.color=a.color;this.applyOptions(b,p);a.options.colorByPoint?(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter],b=b.length,p=a.colorCounter,a.colorCounter++,a.colorCounter===b&&(a.colorCounter=0)):p=a.colorIndex;this.colorIndex=t(this.colorIndex,p);a.chart.pointCount++;return this},applyOptions:function(a,b){var e=this.series,w=e.options.pointValKey||
e.pointValKey;a=E.prototype.optionsToObject.call(this,a);H(this,a);this.options=this.options?H(this.options,a):a;a.group&&delete this.group;w&&(this.y=this[w]);this.isNull=t(this.isValid&&!this.isValid(),null===this.x||!z(this.y,!0));this.selected&&(this.state="select");"name"in this&&void 0===b&&e.xAxis&&e.xAxis.hasNames&&(this.x=e.xAxis.nameToX(this));void 0===this.x&&e&&(this.x=void 0===b?e.autoIncrement(this):b);return this},optionsToObject:function(a){var b={},e=this.series,w=e.options.keys,
k=w||e.pointArrayMap||["y"],l=k.length,g=0,q=0;if(z(a)||null===a)b[k[0]]=a;else if(m(a))for(!w&&a.length>l&&(e=typeof a[0],"string"===e?b.name=a[0]:"number"===e&&(b.x=a[0]),g++);q<l;)w&&void 0===a[g]||(b[k[q]]=a[g]),g++,q++;else"object"===typeof a&&(b=a,a.dataLabels&&(e._hasPointLabels=!0),a.marker&&(e._hasPointMarkers=!0));return b},getClassName:function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":
"")+(void 0!==this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")},getZone:function(){var a=this.series,b=a.zones,a=a.zoneAxis||"y",p=0,w;for(w=b[p];this[a]>=w.value;)w=b[++p];w&&w.color&&!this.options.color&&(this.color=w.color);return w},destroy:function(){var a=this.series.chart,b=a.hoverPoints,p;a.pointCount--;b&&(this.setState(),I(b,this),b.length||
(a.hoverPoints=null));if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)q(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(p in this)this[p]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],b,p=6;p--;)b=a[p],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,
point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,e=b.tooltipOptions,w=t(e.valueDecimals,""),k=e.valuePrefix||"",l=e.valueSuffix||"";D(b.pointArrayMap||["y"],function(b){b="{point."+b;if(k||l)a=a.replace(b+"}",k+b+"}"+l);a=a.replace(b+"}",b+":,."+w+"f}")});return n(a,{point:this,series:this.series})},firePointEvent:function(a,b,p){var e=this,k=this.series.options;(k.point.events[a]||e.options&&e.options.events&&e.options.events[a])&&
this.importEvents();"click"===a&&k.allowPointSelect&&(p=function(a){e.select&&e.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});v(this,a,b,p)},visible:!0}})(K);(function(a){var E=a.addEvent,D=a.animObject,H=a.arrayMax,I=a.arrayMin,v=a.correctFloat,n=a.Date,m=a.defaultOptions,z=a.defaultPlotOptions,t=a.defined,q=a.each,e=a.erase,b=a.extend,p=a.fireEvent,w=a.grep,k=a.isArray,l=a.isNumber,g=a.isString,F=a.merge,r=a.pick,u=a.removeEvent,f=a.splat,B=a.SVGElement,d=a.syncTimeout,x=a.win;a.Series=a.seriesType("line",
null,{lineWidth:2,allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{lineWidth:0,lineColor:"#ffffff",radius:4,states:{hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===this.y?"":a.numberFormat(this.y,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",
x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{hover:{lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3},{isCartesian:!0,pointClass:a.Point,sorted:!0,requireSorting:!0,directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],coll:"series",init:function(a,d){var c=this,f,e,h=a.series,y;c.chart=a;c.options=d=c.setOptions(d);c.linkedSeries=[];c.bindAxes();b(c,{name:d.name,state:"",visible:!1!==
d.visible,selected:!0===d.selected});e=d.events;for(f in e)E(c,f,e[f]);if(e&&e.click||d.point&&d.point.events&&d.point.events.click||d.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();q(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(d.data,!1);c.isCartesian&&(a.hasCartesianSeries=!0);h.length&&(y=h[h.length-1]);c._i=r(y&&y._i,-1)+1;a.orderSeries(this.insert(h))},insert:function(a){var b=this.options.index,c;if(l(b)){for(c=a.length;c--;)if(b>=r(a[c].options.index,a[c]._i)){a.splice(c+
1,0,this);break}-1===c&&a.unshift(this);c+=1}else a.push(this);return r(c,a.length-1)},bindAxes:function(){var b=this,d=b.options,f=b.chart,e;q(b.axisTypes||[],function(c){q(f[c],function(a){e=a.options;if(d[c]===e.index||void 0!==d[c]&&d[c]===e.id||void 0===d[c]&&0===e.index)b.insert(a.series),b[c]=a,a.isDirty=!0});b[c]||b.optionalAxis===c||a.error(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments,f=l(b)?function(d){var h="y"===d&&c.toYData?c.toYData(a):a[d];c[d+"Data"][b]=
h}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))};q(c.parallelArrays,f)},autoIncrement:function(){var a=this.options,b=this.xIncrement,d,f=a.pointIntervalUnit,b=r(b,a.pointStart,0);this.pointInterval=d=r(this.pointInterval,a.pointInterval,1);f&&(a=new n(b),"day"===f?a=+a[n.hcSetDate](a[n.hcGetDate]()+d):"month"===f?a=+a[n.hcSetMonth](a[n.hcGetMonth]()+d):"year"===f&&(a=+a[n.hcSetFullYear](a[n.hcGetFullYear]()+d)),d=a-b);this.xIncrement=b+d;return b},setOptions:function(a){var b=
this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},f=c[this.type];this.userOptions=a;c=F(f,c.series,a);this.tooltipOptions=F(m.tooltip,m.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);null===f.marker&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();!c.negativeColor&&!c.negativeFillColor||c.zones||a.push({value:c[this.zoneAxis+"Threshold"]||c.threshold||0,className:"highcharts-negative",
color:c.negativeColor,fillColor:c.negativeFillColor});a.length&&t(a[a.length-1].value)&&a.push({color:this.color,fillColor:this.fillColor});return c},getCyclic:function(a,b,d){var c,f=this.chart,h=this.userOptions,e=a+"Index",g=a+"Counter",y=d?d.length:r(f.options.chart[a+"Count"],f[a+"Count"]);b||(c=r(h[e],h["_"+e]),t(c)||(f.series.length||(f[g]=0),h["_"+e]=c=f[g]%y,f[g]+=1),d&&(b=d[c]));void 0!==c&&(this[e]=c);this[a]=b},getColor:function(){this.options.colorByPoint?this.options.color=null:this.getCyclic("color",
this.options.color||z[this.type].color,this.chart.options.colors)},getSymbol:function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)},drawLegendSymbol:a.LegendSymbolMixin.drawLineMarker,setData:function(b,d,f,e){var c=this,h=c.points,y=h&&h.length||0,A,u=c.options,x=c.chart,p=null,w=c.xAxis,m=u.turboThreshold,B=this.xData,n=this.yData,t=(A=c.pointArrayMap)&&A.length;b=b||[];A=b.length;d=r(d,!0);if(!1!==e&&A&&y===A&&!c.cropped&&!c.hasGroupedData&&c.visible)q(b,function(a,
b){h[b].update&&a!==u.data[b]&&h[b].update(a,!1,null,!1)});else{c.xIncrement=null;c.colorCounter=0;q(this.parallelArrays,function(a){c[a+"Data"].length=0});if(m&&A>m){for(f=0;null===p&&f<A;)p=b[f],f++;if(l(p))for(f=0;f<A;f++)B[f]=this.autoIncrement(),n[f]=b[f];else if(k(p))if(t)for(f=0;f<A;f++)p=b[f],B[f]=p[0],n[f]=p.slice(1,t+1);else for(f=0;f<A;f++)p=b[f],B[f]=p[0],n[f]=p[1];else a.error(12)}else for(f=0;f<A;f++)void 0!==b[f]&&(p={series:c},c.pointClass.prototype.applyOptions.apply(p,[b[f]]),c.updateParallelArrays(p,
f));g(n[0])&&a.error(14,!0);c.data=[];c.options.data=c.userOptions.data=b;for(f=y;f--;)h[f]&&h[f].destroy&&h[f].destroy();w&&(w.minRange=w.userMinRange);c.isDirty=x.isDirtyBox=!0;c.isDirtyData=!!h;f=!1}"point"===u.legendType&&(this.processData(),this.generatePoints());d&&x.redraw(f)},processData:function(b){var c=this.xData,d=this.yData,f=c.length,e;e=0;var h,g,k=this.xAxis,l,u=this.options;l=u.cropThreshold;var r=this.getExtremesFromAll||u.getExtremesFromAll,x=this.isCartesian,u=k&&k.val2lin,p=k&&
k.isLog,q,w;if(x&&!this.isDirty&&!k.isDirty&&!this.yAxis.isDirty&&!b)return!1;k&&(b=k.getExtremes(),q=b.min,w=b.max);if(x&&this.sorted&&!r&&(!l||f>l||this.forceCrop))if(c[f-1]<q||c[0]>w)c=[],d=[];else if(c[0]<q||c[f-1]>w)e=this.cropData(this.xData,this.yData,q,w),c=e.xData,d=e.yData,e=e.start,h=!0;for(l=c.length||1;--l;)f=p?u(c[l])-u(c[l-1]):c[l]-c[l-1],0<f&&(void 0===g||f<g)?g=f:0>f&&this.requireSorting&&a.error(15);this.cropped=h;this.cropStart=e;this.processedXData=c;this.processedYData=d;this.closestPointRange=
g},cropData:function(a,b,d,f){var c=a.length,h=0,e=c,g=r(this.cropShoulder,1),y;for(y=0;y<c;y++)if(a[y]>=d){h=Math.max(0,y-g);break}for(d=y;d<c;d++)if(a[d]>f){e=d+g;break}return{xData:a.slice(h,e),yData:b.slice(h,e),start:h,end:e}},generatePoints:function(){var a=this.options.data,b=this.data,d,e=this.processedXData,g=this.processedYData,h=this.pointClass,k=e.length,l=this.cropStart||0,u,r=this.hasGroupedData,x,p=[],q;b||r||(b=[],b.length=a.length,b=this.data=b);for(q=0;q<k;q++)u=l+q,r?(x=(new h).init(this,
[e[q]].concat(f(g[q]))),x.dataGroup=this.groupMap[q]):(x=b[u])||void 0===a[u]||(b[u]=x=(new h).init(this,a[u],e[q])),x.index=u,p[q]=x;if(b&&(k!==(d=b.length)||r))for(q=0;q<d;q++)q!==l||r||(q+=k),b[q]&&(b[q].destroyElements(),b[q].plotX=void 0);this.data=b;this.points=p},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,f=[],h=0;d=this.xAxis.getExtremes();var e=d.min,g=d.max,u,r,x,p;a=a||this.stackedYData||this.processedYData||[];d=a.length;for(p=0;p<d;p++)if(r=c[p],x=a[p],u=(l(x,!0)||
k(x))&&(!b.isLog||x.length||0<x),r=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(c[p+1]||r)>=e&&(c[p-1]||r)<=g,u&&r)if(u=x.length)for(;u--;)null!==x[u]&&(f[h++]=x[u]);else f[h++]=x;this.dataMin=I(f);this.dataMax=H(f)},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,b=a.stacking,d=this.xAxis,f=d.categories,e=this.yAxis,h=this.points,g=h.length,k=!!this.modifyValue,u=a.pointPlacement,x="between"===u||l(u),p=a.threshold,
q=a.startFromThreshold?p:0,w,m,B,n,F=Number.MAX_VALUE;"between"===u&&(u=.5);l(u)&&(u*=r(a.pointRange||d.pointRange));for(a=0;a<g;a++){var z=h[a],D=z.x,E=z.y;m=z.low;var I=b&&e.stacks[(this.negStacks&&E<(q?0:p)?"-":"")+this.stackKey],H;e.isLog&&null!==E&&0>=E&&(z.isNull=!0);z.plotX=w=v(Math.min(Math.max(-1E5,d.translate(D,0,0,0,1,u,"flags"===this.type)),1E5));b&&this.visible&&!z.isNull&&I&&I[D]&&(n=this.getStackIndicator(n,D,this.index),H=I[D],E=H.points[n.key],m=E[0],E=E[1],m===q&&n.key===I[D].base&&
(m=r(p,e.min)),e.isLog&&0>=m&&(m=null),z.total=z.stackTotal=H.total,z.percentage=H.total&&z.y/H.total*100,z.stackY=E,H.setOffset(this.pointXOffset||0,this.barW||0));z.yBottom=t(m)?e.translate(m,0,1,0,1):null;k&&(E=this.modifyValue(E,z));z.plotY=m="number"===typeof E&&Infinity!==E?Math.min(Math.max(-1E5,e.translate(E,0,1,0,1)),1E5):void 0;z.isInside=void 0!==m&&0<=m&&m<=e.len&&0<=w&&w<=d.len;z.clientX=x?v(d.translate(D,0,0,0,1,u)):w;z.negative=z.y<(p||0);z.category=f&&void 0!==f[z.x]?f[z.x]:z.x;z.isNull||
(void 0!==B&&(F=Math.min(F,Math.abs(w-B))),B=w);z.zone=this.zones.length&&z.getZone()}this.closestPointRangePx=F},getValidPoints:function(a,b){var c=this.chart;return w(a||this.points||[],function(a){return b&&!c.isInsidePlot(a.plotX,a.plotY,c.inverted)?!1:!a.isNull})},setClip:function(a){var b=this.chart,c=this.options,d=b.renderer,f=b.inverted,h=this.clipBox,e=h||b.clipBox,g=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,e.height,c.xAxis,c.yAxis].join(),k=b[g],l=b[g+"m"];k||(a&&(e.width=
0,b[g+"m"]=l=d.clipRect(-99,f?-b.plotLeft:-b.plotTop,99,f?b.chartWidth:b.chartHeight)),b[g]=k=d.clipRect(e),k.count={length:0});a&&!k.count[this.index]&&(k.count[this.index]=!0,k.count.length+=1);!1!==c.clip&&(this.group.clip(a||h?k:b.clipRect),this.markerGroup.clip(l),this.sharedClipKey=g);a||(k.count[this.index]&&(delete k.count[this.index],--k.count.length),0===k.count.length&&g&&b[g]&&(h||(b[g]=b[g].destroy()),b[g+"m"]&&(this.markerGroup.clip(),b[g+"m"]=b[g+"m"].destroy())))},animate:function(a){var b=
this.chart,c=D(this.options.animation),d;a?this.setClip(c):(d=this.sharedClipKey,(a=b[d])&&a.animate({width:b.plotSizeX},c),b[d+"m"]&&b[d+"m"].animate({width:b.plotSizeX+99},c),this.animate=null)},afterAnimate:function(){this.setClip();p(this,"afterAnimate")},drawPoints:function(){var a=this.points,b=this.chart,d,f,e,h,g=this.options.marker,k,u,x,p,q=this.markerGroup,w=r(g.enabled,this.xAxis.isRadial?!0:null,this.closestPointRangePx>2*g.radius);if(!1!==g.enabled||this._hasPointMarkers)for(f=0;f<a.length;f++)e=
a[f],d=e.plotY,h=e.graphic,k=e.marker||{},u=!!e.marker,x=w&&void 0===k.enabled||k.enabled,p=e.isInside,x&&l(d)&&null!==e.y?(d=r(k.symbol,this.symbol),e.hasImage=0===d.indexOf("url"),x=this.markerAttribs(e,e.selected&&"select"),h?h[p?"show":"hide"](!0).animate(x):p&&(0<x.width||e.hasImage)&&(e.graphic=h=b.renderer.symbol(d,x.x,x.y,x.width,x.height,u?k:g).add(q)),h&&h.attr(this.pointAttribs(e,e.selected&&"select")),h&&h.addClass(e.getClassName(),!0)):h&&(e.graphic=h.destroy())},markerAttribs:function(a,
b){var c=this.options.marker,d=a.marker||{},f=r(d.radius,c.radius);b&&(c=c.states[b],b=d.states&&d.states[b],f=r(b&&b.radius,c&&c.radius,f+(c&&c.radiusPlus||0)));a.hasImage&&(f=0);a={x:Math.floor(a.plotX)-f,y:a.plotY-f};f&&(a.width=a.height=2*f);return a},pointAttribs:function(a,b){var c=this.options.marker,d=a&&a.options,f=d&&d.marker||{},h=this.color,e=d&&d.color,g=a&&a.color,d=r(f.lineWidth,c.lineWidth);a=a&&a.zone&&a.zone.color;h=e||a||g||h;a=f.fillColor||c.fillColor||h;h=f.lineColor||c.lineColor||
h;b&&(c=c.states[b],b=f.states&&f.states[b]||{},d=r(b.lineWidth,c.lineWidth,d+r(b.lineWidthPlus,c.lineWidthPlus,0)),a=b.fillColor||c.fillColor||a,h=b.lineColor||c.lineColor||h);return{stroke:h,"stroke-width":d,fill:a}},destroy:function(){var a=this,b=a.chart,d=/AppleWebKit\/533/.test(x.navigator.userAgent),f,g=a.data||[],h,k,l;p(a,"destroy");u(a);q(a.axisTypes||[],function(b){(l=a[b])&&l.series&&(e(l.series,a),l.isDirty=l.forceRedraw=!0)});a.legendItem&&a.chart.legend.destroyItem(a);for(f=g.length;f--;)(h=
g[f])&&h.destroy&&h.destroy();a.points=null;clearTimeout(a.animationTimeout);for(k in a)a[k]instanceof B&&!a[k].survive&&(f=d&&"group"===k?"hide":"destroy",a[k][f]());b.hoverSeries===a&&(b.hoverSeries=null);e(b.series,a);b.orderSeries();for(k in a)delete a[k]},getGraphPath:function(a,b,d){var c=this,f=c.options,h=f.step,e,g=[],k=[],l;a=a||c.points;(e=a.reversed)&&a.reverse();(h={right:1,center:2}[h]||h&&3)&&e&&(h=4-h);!f.connectNulls||b||d||(a=this.getValidPoints(a));q(a,function(e,y){var u=e.plotX,
A=e.plotY,x=a[y-1];(e.leftCliff||x&&x.rightCliff)&&!d&&(l=!0);e.isNull&&!t(b)&&0<y?l=!f.connectNulls:e.isNull&&!b?l=!0:(0===y||l?y=["M",e.plotX,e.plotY]:c.getPointSpline?y=c.getPointSpline(a,e,y):h?(y=1===h?["L",x.plotX,A]:2===h?["L",(x.plotX+u)/2,x.plotY,"L",(x.plotX+u)/2,A]:["L",u,x.plotY],y.push("L",u,A)):y=["L",u,A],k.push(e.x),h&&k.push(e.x),g.push.apply(g,y),l=!1)});g.xMap=k;return c.graphPath=g},drawGraph:function(){var a=this,b=this.options,d=(this.gappedPath||this.getGraphPath).call(this),
f=[["graph","highcharts-graph",b.lineColor||this.color,b.dashStyle]];q(this.zones,function(c,d){f.push(["zone-graph-"+d,"highcharts-graph highcharts-zone-graph-"+d+" "+(c.className||""),c.color||a.color,c.dashStyle||b.dashStyle])});q(f,function(c,f){var h=c[0],e=a[h];e?(e.endX=d.xMap,e.animate({d:d})):d.length&&(a[h]=a.chart.renderer.path(d).addClass(c[1]).attr({zIndex:1}).add(a.group),e={stroke:c[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},c[3]?e.dashstyle=c[3]:"square"!==b.linecap&&
(e["stroke-linecap"]=e["stroke-linejoin"]="round"),e=a[h].attr(e).shadow(2>f&&b.shadow));e&&(e.startX=d.xMap,e.isArea=d.isArea)})},applyZones:function(){var a=this,b=this.chart,d=b.renderer,f=this.zones,e,h,g=this.clips||[],k,l=this.graph,u=this.area,x=Math.max(b.chartWidth,b.chartHeight),p=this[(this.zoneAxis||"y")+"Axis"],w,m,B=b.inverted,n,t,v,F,z=!1;f.length&&(l||u)&&p&&void 0!==p.min&&(m=p.reversed,n=p.horiz,l&&l.hide(),u&&u.hide(),w=p.getExtremes(),q(f,function(c,f){e=m?n?b.plotWidth:0:n?0:
p.toPixels(w.min);e=Math.min(Math.max(r(h,e),0),x);h=Math.min(Math.max(Math.round(p.toPixels(r(c.value,w.max),!0)),0),x);z&&(e=h=p.toPixels(w.max));t=Math.abs(e-h);v=Math.min(e,h);F=Math.max(e,h);p.isXAxis?(k={x:B?F:v,y:0,width:t,height:x},n||(k.x=b.plotHeight-k.x)):(k={x:0,y:B?F:v,width:x,height:t},n&&(k.y=b.plotWidth-k.y));B&&d.isVML&&(k=p.isXAxis?{x:0,y:m?v:F,height:k.width,width:b.chartWidth}:{x:k.y-b.plotLeft-b.spacingBox.x,y:0,width:k.height,height:b.chartHeight});g[f]?g[f].animate(k):(g[f]=
d.clipRect(k),l&&a["zone-graph-"+f].clip(g[f]),u&&a["zone-area-"+f].clip(g[f]));z=c.value>w.max}),this.clips=g)},invertGroups:function(a){function b(){q(["group","markerGroup"],function(b){c[b]&&(c[b].width=c.yAxis.len,c[b].height=c.xAxis.len,c[b].invert(a))})}var c=this,d;c.xAxis&&(d=E(c.chart,"resize",b),E(c,"destroy",d),b(a),c.invertGroups=b)},plotGroup:function(a,b,d,f,e){var c=this[a],g=!c;g&&(this[a]=c=this.chart.renderer.g(b).attr({zIndex:f||.1}).add(e),c.addClass("highcharts-series-"+this.index+
" highcharts-"+this.type+"-series highcharts-color-"+this.colorIndex+" "+(this.options.className||"")));c.attr({visibility:d})[g?"attr":"animate"](this.getPlotBox());return c},getPlotBox:function(){var a=this.chart,b=this.xAxis,d=this.yAxis;a.inverted&&(b=d,d=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:d?d.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,f,e=a.options,g=!!a.animate&&b.renderer.isSVG&&D(e.animation).duration,h=a.visible?"inherit":"hidden",k=
e.zIndex,l=a.hasRendered,u=b.seriesGroup,x=b.inverted;f=a.plotGroup("group","series",h,k,u);a.markerGroup=a.plotGroup("markerGroup","markers",h,k,u);g&&a.animate(!0);f.inverted=a.isCartesian?x:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(x);!1===e.clip||a.sharedClipKey||l||f.clip(b.clipRect);g&&a.animate();l||(a.animationTimeout=d(function(){a.afterAnimate()},
g));a.isDirty=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,d=this.group,f=this.xAxis,e=this.yAxis;d&&(a.inverted&&d.attr({width:a.plotWidth,height:a.plotHeight}),d.animate({translateX:r(f&&f.left,a.plotLeft),translateY:r(e&&e.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree},kdDimensions:1,kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,d=this.yAxis,f=this.chart.inverted;return this.searchKDTree({clientX:f?
c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:f?d.len-a.chartX+d.pos:a.chartY-d.pos},b)},buildKDTree:function(){function a(d,c,f){var h,e;if(e=d&&d.length)return h=b.kdAxisArray[c%f],d.sort(function(a,b){return a[h]-b[h]}),e=Math.floor(e/2),{point:d[e],left:a(d.slice(0,e),c+1,f),right:a(d.slice(e+1),c+1,f)}}this.buildingKdTree=!0;var b=this,f=b.kdDimensions;delete b.kdTree;d(function(){b.kdTree=a(b.getValidPoints(null,!b.directTouch),f,f);b.buildingKdTree=!1},b.options.kdNow?0:1)},searchKDTree:function(a,
b){function d(a,b,g,k){var l=b.point,u=c.kdAxisArray[g%k],x,y,A=l;y=t(a[f])&&t(l[f])?Math.pow(a[f]-l[f],2):null;x=t(a[h])&&t(l[h])?Math.pow(a[h]-l[h],2):null;x=(y||0)+(x||0);l.dist=t(x)?Math.sqrt(x):Number.MAX_VALUE;l.distX=t(y)?Math.sqrt(y):Number.MAX_VALUE;u=a[u]-l[u];x=0>u?"left":"right";y=0>u?"right":"left";b[x]&&(x=d(a,b[x],g+1,k),A=x[e]<A[e]?x:l);b[y]&&Math.sqrt(u*u)<A[e]&&(a=d(a,b[y],g+1,k),A=a[e]<A[e]?a:A);return A}var c=this,f=this.kdAxisArray[0],h=this.kdAxisArray[1],e=b?"distX":"dist";
this.kdTree||this.buildingKdTree||this.buildKDTree();if(this.kdTree)return d(a,this.kdTree,this.kdDimensions,this.kdDimensions)}})})(K);(function(a){function E(a,e,b,p,w){var k=a.chart.inverted;this.axis=a;this.isNegative=b;this.options=e;this.x=p;this.total=null;this.points={};this.stack=w;this.rightCliff=this.leftCliff=0;this.alignOptions={align:e.align||(k?b?"left":"right":"center"),verticalAlign:e.verticalAlign||(k?"middle":b?"bottom":"top"),y:t(e.y,k?4:b?14:-6),x:t(e.x,k?b?-6:6:0)};this.textAlign=
e.textAlign||(k?b?"right":"left":"center")}var D=a.Axis,H=a.Chart,I=a.correctFloat,v=a.defined,n=a.destroyObjectProperties,m=a.each,z=a.format,t=a.pick;a=a.Series;E.prototype={destroy:function(){n(this,this.axis)},render:function(a){var e=this.options,b=e.format,b=b?z(b,this):e.formatter.call(this);this.label?this.label.attr({text:b,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(b,null,null,e.useHTML).css(e.style).attr({align:this.textAlign,rotation:e.rotation,visibility:"hidden"}).add(a)},
setOffset:function(a,e){var b=this.axis,p=b.chart,w=p.inverted,k=b.reversed,k=this.isNegative&&!k||!this.isNegative&&k,l=b.translate(b.usePercentage?100:this.total,0,0,0,1),b=b.translate(0),b=Math.abs(l-b);a=p.xAxis[0].translate(this.x)+a;var g=p.plotHeight,w={x:w?k?l:l-b:a,y:w?g-a-e:k?g-l-b:g-l,width:w?b:e,height:w?e:b};if(e=this.label)e.align(this.alignOptions,null,w),w=e.alignAttr,e[!1===this.options.crop||p.isInsidePlot(w.x,w.y)?"show":"hide"](!0)}};H.prototype.getStacks=function(){var a=this;
m(a.yAxis,function(a){a.stacks&&a.hasVisibleSeries&&(a.oldStacks=a.stacks)});m(a.series,function(e){!e.options.stacking||!0!==e.visible&&!1!==a.options.chart.ignoreHiddenSeries||(e.stackKey=e.type+t(e.options.stack,""))})};D.prototype.buildStacks=function(){var a=this.series,e,b=t(this.options.reversedStacks,!0),p=a.length,w;if(!this.isXAxis){this.usePercentage=!1;for(w=p;w--;)a[b?w:p-w-1].setStackedPoints();for(w=p;w--;)e=a[b?w:p-w-1],e.setStackCliffs&&e.setStackCliffs();if(this.usePercentage)for(w=
0;w<p;w++)a[w].setPercentStacks()}};D.prototype.renderStackTotals=function(){var a=this.chart,e=a.renderer,b=this.stacks,p,w,k=this.stackTotalGroup;k||(this.stackTotalGroup=k=e.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());k.translate(a.plotLeft,a.plotTop);for(p in b)for(w in a=b[p],a)a[w].render(k)};D.prototype.resetStacks=function(){var a=this.stacks,e,b;if(!this.isXAxis)for(e in a)for(b in a[e])a[e][b].touched<this.stacksTouched?(a[e][b].destroy(),delete a[e][b]):(a[e][b].total=
null,a[e][b].cum=null)};D.prototype.cleanStacks=function(){var a,e,b;if(!this.isXAxis)for(e in this.oldStacks&&(a=this.stacks=this.oldStacks),a)for(b in a[e])a[e][b].cum=a[e][b].total};a.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var a=this.processedXData,e=this.processedYData,b=[],p=e.length,w=this.options,k=w.threshold,l=w.startFromThreshold?k:0,g=w.stack,w=w.stacking,m=this.stackKey,r="-"+m,u=this.negStacks,
f=this.yAxis,B=f.stacks,d=f.oldStacks,x,c,y,n,A,J,h;f.stacksTouched+=1;for(A=0;A<p;A++)J=a[A],h=e[A],x=this.getStackIndicator(x,J,this.index),n=x.key,y=(c=u&&h<(l?0:k))?r:m,B[y]||(B[y]={}),B[y][J]||(d[y]&&d[y][J]?(B[y][J]=d[y][J],B[y][J].total=null):B[y][J]=new E(f,f.options.stackLabels,c,J,g)),y=B[y][J],null!==h&&(y.points[n]=y.points[this.index]=[t(y.cum,l)],v(y.cum)||(y.base=n),y.touched=f.stacksTouched,0<x.index&&!1===this.singleStacks&&(y.points[n][0]=y.points[this.index+","+J+",0"][0])),"percent"===
w?(c=c?m:r,u&&B[c]&&B[c][J]?(c=B[c][J],y.total=c.total=Math.max(c.total,y.total)+Math.abs(h)||0):y.total=I(y.total+(Math.abs(h)||0))):y.total=I(y.total+(h||0)),y.cum=t(y.cum,l)+(h||0),null!==h&&(y.points[n].push(y.cum),b[A]=y.cum);"percent"===w&&(f.usePercentage=!0);this.stackedYData=b;f.oldStacks={}}};a.prototype.setPercentStacks=function(){var a=this,e=a.stackKey,b=a.yAxis.stacks,p=a.processedXData,w;m([e,"-"+e],function(e){for(var k=p.length,g,m;k--;)if(g=p[k],w=a.getStackIndicator(w,g,a.index,
e),g=(m=b[e]&&b[e][g])&&m.points[w.key])m=m.total?100/m.total:0,g[0]=I(g[0]*m),g[1]=I(g[1]*m),a.stackedYData[k]=g[1]})};a.prototype.getStackIndicator=function(a,e,b,p){!v(a)||a.x!==e||p&&a.key!==p?a={x:e,index:0,key:p}:a.index++;a.key=[b,e,a.index].join();return a}})(K);(function(a){var E=a.addEvent,D=a.animate,H=a.Axis,I=a.createElement,v=a.css,n=a.defined,m=a.each,z=a.erase,t=a.extend,q=a.fireEvent,e=a.inArray,b=a.isNumber,p=a.isObject,w=a.merge,k=a.pick,l=a.Point,g=a.Series,F=a.seriesTypes,r=a.setAnimation,
u=a.splat;t(a.Chart.prototype,{addSeries:function(a,b,d){var f,c=this;a&&(b=k(b,!0),q(c,"addSeries",{options:a},function(){f=c.initSeries(a);c.isDirtyLegend=!0;c.linkSeries();b&&c.redraw(d)}));return f},addAxis:function(a,b,d,e){var c=b?"xAxis":"yAxis",f=this.options;a=w(a,{index:this[c].length,isX:b});new H(this,a);f[c]=u(f[c]||{});f[c].push(a);k(d,!0)&&this.redraw(e)},showLoading:function(a){var b=this,d=b.options,f=b.loadingDiv,c=d.loading,e=function(){f&&v(f,{left:b.plotLeft+"px",top:b.plotTop+
"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};f||(b.loadingDiv=f=I("div",{className:"highcharts-loading highcharts-loading-hidden"},null,b.container),b.loadingSpan=I("span",{className:"highcharts-loading-inner"},null,f),E(b,"redraw",e));f.className="highcharts-loading";b.loadingSpan.innerHTML=a||d.lang.loading;v(f,t(c.style,{zIndex:10}));v(b.loadingSpan,c.labelStyle);b.loadingShown||(v(f,{opacity:0,display:""}),D(f,{opacity:c.style.opacity||.5},{duration:c.showDuration||0}));b.loadingShown=
!0;e()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&(b.className="highcharts-loading highcharts-loading-hidden",D(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){v(b,{display:"none"})}}));this.loadingShown=!1},propsRequireDirtyBox:"backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions".split(" "),update:function(a,g){var d,f={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle"},c=a.chart,l,r;if(c){w(!0,this.options.chart,c);"className"in c&&this.setClassName(c.className);if("inverted"in c||"polar"in c)this.propFromSeries(),l=!0;for(d in c)c.hasOwnProperty(d)&&(-1!==e("chart."+d,this.propsRequireUpdateSeries)&&(r=!0),-1!==e(d,this.propsRequireDirtyBox)&&(this.isDirtyBox=
!0));"style"in c&&this.renderer.setStyle(c.style)}for(d in a){if(this[d]&&"function"===typeof this[d].update)this[d].update(a[d],!1);else if("function"===typeof this[f[d]])this[f[d]](a[d]);"chart"!==d&&-1!==e(d,this.propsRequireUpdateSeries)&&(r=!0)}a.colors&&(this.options.colors=a.colors);a.plotOptions&&w(!0,this.options.plotOptions,a.plotOptions);m(["xAxis","yAxis","series"],function(b){a[b]&&m(u(a[b]),function(a,d){(d=n(a.id)&&this.get(a.id)||this[b][d])&&d.coll===b&&d.update(a,!1)},this)},this);
l&&m(this.axes,function(a){a.update({},!1)});r&&m(this.series,function(a){a.update({},!1)});a.loading&&w(!0,this.options.loading,a.loading);d=c&&c.width;c=c&&c.height;b(d)&&d!==this.chartWidth||b(c)&&c!==this.chartHeight?this.setSize(d,c):k(g,!0)&&this.redraw()},setSubtitle:function(a){this.setTitle(void 0,a)}});t(l.prototype,{update:function(a,b,d,e){function c(){f.applyOptions(a);null===f.y&&l&&(f.graphic=l.destroy());p(a,!0)&&(l&&l.element&&a&&a.marker&&a.marker.symbol&&(f.graphic=l.destroy()),
a&&a.dataLabels&&f.dataLabel&&(f.dataLabel=f.dataLabel.destroy()));u=f.index;g.updateParallelArrays(f,u);x.data[u]=p(x.data[u],!0)?f.options:a;g.isDirty=g.isDirtyData=!0;!g.fixedBox&&g.hasCartesianSeries&&(h.isDirtyBox=!0);"point"===x.legendType&&(h.isDirtyLegend=!0);b&&h.redraw(d)}var f=this,g=f.series,l=f.graphic,u,h=g.chart,x=g.options;b=k(b,!0);!1===e?c():f.firePointEvent("update",{options:a},c)},remove:function(a,b){this.series.removePoint(e(this,this.series.data),a,b)}});t(g.prototype,{addPoint:function(a,
b,d,e){var c=this.options,f=this.data,g=this.chart,l=this.xAxis,l=l&&l.hasNames&&l.names,u=c.data,h,x,r=this.xData,p,m;b=k(b,!0);h={series:this};this.pointClass.prototype.applyOptions.apply(h,[a]);m=h.x;p=r.length;if(this.requireSorting&&m<r[p-1])for(x=!0;p&&r[p-1]>m;)p--;this.updateParallelArrays(h,"splice",p,0,0);this.updateParallelArrays(h,p);l&&h.name&&(l[m]=h.name);u.splice(p,0,a);x&&(this.data.splice(p,0,null),this.processData());"point"===c.legendType&&this.generatePoints();d&&(f[0]&&f[0].remove?
f[0].remove(!1):(f.shift(),this.updateParallelArrays(h,"shift"),u.shift()));this.isDirtyData=this.isDirty=!0;b&&g.redraw(e)},removePoint:function(a,b,d){var f=this,c=f.data,e=c[a],g=f.points,l=f.chart,u=function(){g&&g.length===c.length&&g.splice(a,1);c.splice(a,1);f.options.data.splice(a,1);f.updateParallelArrays(e||{series:f},"splice",a,1);e&&e.destroy();f.isDirty=!0;f.isDirtyData=!0;b&&l.redraw()};r(d,l);b=k(b,!0);e?e.firePointEvent("remove",null,u):u()},remove:function(a,b,d){function f(){c.destroy();
e.isDirtyLegend=e.isDirtyBox=!0;e.linkSeries();k(a,!0)&&e.redraw(b)}var c=this,e=c.chart;!1!==d?q(c,"remove",null,f):f()},update:function(a,b){var d=this,f=this.chart,c=this.userOptions,e=this.type,g=a.type||c.type||f.options.chart.type,l=F[e].prototype,u=["group","markerGroup","dataLabelsGroup"],h;if(g&&g!==e||void 0!==a.zIndex)u.length=0;m(u,function(a){u[a]=d[a];delete d[a]});a=w(c,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1,null,!1);for(h in l)this[h]=
void 0;t(this,F[g||e].prototype);m(u,function(a){d[a]=u[a]});this.init(f,a);f.linkSeries();k(b,!0)&&f.redraw(!1)}});t(H.prototype,{update:function(a,b){var d=this.chart;a=d.options[this.coll][this.options.index]=w(this.userOptions,a);this.destroy(!0);this.init(d,t(a,{events:void 0}));d.isDirtyBox=!0;k(b,!0)&&d.redraw()},remove:function(a){for(var b=this.chart,d=this.coll,f=this.series,c=f.length;c--;)f[c]&&f[c].remove(!1);z(b.axes,this);z(b[d],this);b.options[d].splice(this.options.index,1);m(b[d],
function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;k(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}})})(K);(function(a){var E=a.color,D=a.each,H=a.map,I=a.pick,v=a.Series,n=a.seriesType;n("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(){var a=[],n=[],t=this.xAxis,q=this.yAxis,e=q.stacks[this.stackKey],b={},p=this.points,w=this.index,k=q.series,l=k.length,g,v=I(q.options.reversedStacks,
!0)?1:-1,r,u;if(this.options.stacking){for(r=0;r<p.length;r++)b[p[r].x]=p[r];for(u in e)null!==e[u].total&&n.push(u);n.sort(function(a,b){return a-b});g=H(k,function(){return this.visible});D(n,function(f,k){var d=0,u,c;if(b[f]&&!b[f].isNull)a.push(b[f]),D([-1,1],function(a){var d=1===a?"rightNull":"leftNull",x=0,p=e[n[k+a]];if(p)for(r=w;0<=r&&r<l;)u=p.points[r],u||(r===w?b[f][d]=!0:g[r]&&(c=e[f].points[r])&&(x-=c[1]-c[0])),r+=v;b[f][1===a?"rightCliff":"leftCliff"]=x});else{for(r=w;0<=r&&r<l;){if(u=
e[f].points[r]){d=u[1];break}r+=v}d=q.toPixels(d,!0);a.push({isNull:!0,plotX:t.toPixels(f,!0),plotY:d,yBottom:d})}})}return a},getGraphPath:function(a){var m=v.prototype.getGraphPath,n=this.options,q=n.stacking,e=this.yAxis,b,p,w=[],k=[],l=this.index,g,F=e.stacks[this.stackKey],r=n.threshold,u=e.getThreshold(n.threshold),f,n=n.connectNulls||"percent"===q,B=function(b,f,c){var d=a[b];b=q&&F[d.x].points[l];var p=d[c+"Null"]||0;c=d[c+"Cliff"]||0;var x,m,d=!0;c||p?(x=(p?b[0]:b[1])+c,m=b[0]+c,d=!!p):!q&&
a[f]&&a[f].isNull&&(x=m=r);void 0!==x&&(k.push({plotX:g,plotY:null===x?u:e.getThreshold(x),isNull:d}),w.push({plotX:g,plotY:null===m?u:e.getThreshold(m),doCurve:!1}))};a=a||this.points;q&&(a=this.getStackPoints());for(b=0;b<a.length;b++)if(p=a[b].isNull,g=I(a[b].rectPlotX,a[b].plotX),f=I(a[b].yBottom,u),!p||n)n||B(b,b-1,"left"),p&&!q&&n||(k.push(a[b]),w.push({x:b,plotX:g,plotY:f})),n||B(b,b+1,"right");b=m.call(this,k,!0,!0);w.reversed=!0;p=m.call(this,w,!0,!0);p.length&&(p[0]="L");p=b.concat(p);m=
m.call(this,k,!1,n);p.xMap=b.xMap;this.areaPath=p;return m},drawGraph:function(){this.areaPath=[];v.prototype.drawGraph.apply(this);var a=this,n=this.areaPath,t=this.options,q=[["area","highcharts-area",this.color,t.fillColor]];D(this.zones,function(e,b){q.push(["zone-area-"+b,"highcharts-area highcharts-zone-area-"+b+" "+e.className,e.color||a.color,e.fillColor||t.fillColor])});D(q,function(e){var b=e[0],p=a[b];p?(p.endX=n.xMap,p.animate({d:n})):(p=a[b]=a.chart.renderer.path(n).addClass(e[1]).attr({fill:I(e[3],
E(e[2]).setOpacity(I(t.fillOpacity,.75)).get()),zIndex:0}).add(a.group),p.isArea=!0);p.startX=n.xMap;p.shiftUnit=t.step?2:1})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(K);(function(a){var E=a.pick;a=a.seriesType;a("spline","line",{},{getPointSpline:function(a,H,I){var v=H.plotX,n=H.plotY,m=a[I-1];I=a[I+1];var z,t,q,e;if(m&&!m.isNull&&!1!==m.doCurve&&I&&!I.isNull&&!1!==I.doCurve){a=m.plotY;q=I.plotX;I=I.plotY;var b=0;z=(1.5*v+m.plotX)/2.5;t=(1.5*n+a)/2.5;q=(1.5*v+q)/2.5;e=(1.5*n+I)/2.5;
q!==z&&(b=(e-t)*(q-v)/(q-z)+n-e);t+=b;e+=b;t>a&&t>n?(t=Math.max(a,n),e=2*n-t):t<a&&t<n&&(t=Math.min(a,n),e=2*n-t);e>I&&e>n?(e=Math.max(I,n),t=2*n-e):e<I&&e<n&&(e=Math.min(I,n),t=2*n-e);H.rightContX=q;H.rightContY=e}H=["C",E(m.rightContX,m.plotX),E(m.rightContY,m.plotY),E(z,v),E(t,n),v,n];m.rightContX=m.rightContY=null;return H}})})(K);(function(a){var E=a.seriesTypes.area.prototype,D=a.seriesType;D("areaspline","spline",a.defaultPlotOptions.area,{getStackPoints:E.getStackPoints,getGraphPath:E.getGraphPath,
setStackCliffs:E.setStackCliffs,drawGraph:E.drawGraph,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(K);(function(a){var E=a.animObject,D=a.color,H=a.each,I=a.extend,v=a.isNumber,n=a.merge,m=a.pick,z=a.Series,t=a.seriesType,q=a.svg;t("column","line",{borderRadius:0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1,shadow:!1},select:{color:"#cccccc",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,
y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){z.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&H(b.series,function(b){b.type===a.type&&(b.isDirty=!0)})},getColumnMetrics:function(){var a=this,b=a.options,p=a.xAxis,w=a.yAxis,k=p.reversed,l,g={},n=0;!1===b.grouping?n=1:H(a.chart.series,function(b){var d=
b.options,f=b.yAxis,c;b.type===a.type&&b.visible&&w.len===f.len&&w.pos===f.pos&&(d.stacking?(l=b.stackKey,void 0===g[l]&&(g[l]=n++),c=g[l]):!1!==d.grouping&&(c=n++),b.columnIndex=c)});var r=Math.min(Math.abs(p.transA)*(p.ordinalSlope||b.pointRange||p.closestPointRange||p.tickInterval||1),p.len),u=r*b.groupPadding,f=(r-2*u)/(n||1),b=Math.min(b.maxPointWidth||p.len,m(b.pointWidth,f*(1-2*b.pointPadding)));a.columnMetrics={width:b,offset:(f-b)/2+(u+((a.columnIndex||0)+(k?1:0))*f-r/2)*(k?-1:1)};return a.columnMetrics},
crispCol:function(a,b,p,m){var e=this.chart,l=this.borderWidth,g=-(l%2?.5:0),l=l%2?.5:1;e.inverted&&e.renderer.isVML&&(l+=1);p=Math.round(a+p)+g;a=Math.round(a)+g;m=Math.round(b+m)+l;g=.5>=Math.abs(b)&&.5<m;b=Math.round(b)+l;m-=b;g&&m&&(--b,m+=1);return{x:a,y:b,width:p-a,height:m}},translate:function(){var a=this,b=a.chart,p=a.options,w=a.dense=2>a.closestPointRange*a.xAxis.transA,w=a.borderWidth=m(p.borderWidth,w?0:1),k=a.yAxis,l=a.translatedThreshold=k.getThreshold(p.threshold),g=m(p.minPointLength,
5),n=a.getColumnMetrics(),r=n.width,u=a.barW=Math.max(r,1+2*w),f=a.pointXOffset=n.offset;b.inverted&&(l-=.5);p.pointPadding&&(u=Math.ceil(u));z.prototype.translate.apply(a);H(a.points,function(e){var d=m(e.yBottom,l),x=999+Math.abs(d),x=Math.min(Math.max(-x,e.plotY),k.len+x),c=e.plotX+f,p=u,w=Math.min(x,d),A,n=Math.max(x,d)-w;Math.abs(n)<g&&g&&(n=g,A=!k.reversed&&!e.negative||k.reversed&&e.negative,w=Math.abs(w-l)>g?d-g:l-(A?g:0));e.barX=c;e.pointWidth=r;e.tooltipPos=b.inverted?[k.len+k.pos-b.plotLeft-
x,a.xAxis.len-c-p/2,n]:[c+p/2,x+k.pos-b.plotTop,n];e.shapeType="rect";e.shapeArgs=a.crispCol.apply(a,e.isNull?[e.plotX,k.len/2,0,0]:[c,w,p,n])})},getSymbol:a.noop,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")},pointAttribs:function(a,b){var e=this.options,m,k=this.pointAttrToOptions||{};m=k.stroke||"borderColor";var l=k["stroke-width"]||"borderWidth",g=a&&a.color||this.color,n=a[m]||e[m]||this.color||
g,r=a[l]||e[l]||this[l]||0,k=e.dashStyle;a&&this.zones.length&&(g=(g=a.getZone())&&g.color||a.options.color||this.color);b&&(a=e.states[b],b=a.brightness,g=a.color||void 0!==b&&D(g).brighten(a.brightness).get()||g,n=a[m]||n,r=a[l]||r,k=a.dashStyle||k);m={fill:g,stroke:n,"stroke-width":r};e.borderRadius&&(m.r=e.borderRadius);k&&(m.dashstyle=k);return m},drawPoints:function(){var a=this,b=this.chart,p=a.options,m=b.renderer,k=p.animationLimit||250,l;H(a.points,function(e){var g=e.graphic;if(v(e.plotY)&&
null!==e.y){l=e.shapeArgs;if(g)g[b.pointCount<k?"animate":"attr"](n(l));else e.graphic=g=m[e.shapeType](l).attr({"class":e.getClassName()}).add(e.group||a.group);g.attr(a.pointAttribs(e,e.selected&&"select")).shadow(p.shadow,null,p.stacking&&!p.borderRadius)}else g&&(e.graphic=g.destroy())})},animate:function(a){var b=this,e=this.yAxis,m=b.options,k=this.chart.inverted,l={};q&&(a?(l.scaleY=.001,a=Math.min(e.pos+e.len,Math.max(e.pos,e.toPixels(m.threshold))),k?l.translateX=a-e.len:l.translateY=a,b.group.attr(l)):
(l[k?"translateX":"translateY"]=e.pos,b.group.animate(l,I(E(b.options.animation),{step:function(a,e){b.group.attr({scaleY:Math.max(.001,e.pos)})}})),b.animate=null))},remove:function(){var a=this,b=a.chart;b.hasRendered&&H(b.series,function(b){b.type===a.type&&(b.isDirty=!0)});z.prototype.remove.apply(a,arguments)}})})(K);(function(a){a=a.seriesType;a("bar","column",null,{inverted:!0})})(K);(function(a){var E=a.Series;a=a.seriesType;a("scatter","line",{lineWidth:0,marker:{enabled:!0},tooltip:{headerFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 0.85em"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
pointFormat:"x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"}},{sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,kdDimensions:2,drawGraph:function(){this.options.lineWidth&&E.prototype.drawGraph.call(this)}})})(K);(function(a){var E=a.pick,D=a.relativeLength;a.CenteredSeriesMixin={getCenter:function(){var a=this.options,I=this.chart,v=2*(a.slicedOffset||0),n=I.plotWidth-2*v,I=I.plotHeight-
2*v,m=a.center,m=[E(m[0],"50%"),E(m[1],"50%"),a.size||"100%",a.innerSize||0],z=Math.min(n,I),t,q;for(t=0;4>t;++t)q=m[t],a=2>t||2===t&&/%$/.test(q),m[t]=D(q,[n,I,z,m[2]][t])+(a?v:0);m[3]>m[2]&&(m[3]=m[2]);return m}}})(K);(function(a){var E=a.addEvent,D=a.defined,H=a.each,I=a.extend,v=a.inArray,n=a.noop,m=a.pick,z=a.Point,t=a.Series,q=a.seriesType,e=a.setAnimation;q("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return null===this.y?
void 0:this.point.name},x:0},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,states:{hover:{brightness:.1,shadow:!1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:a.seriesTypes.column.prototype.pointAttribs,animate:function(a){var b=this,e=b.points,k=b.startAngleRad;a||(H(e,function(a){var e=
a.graphic,l=a.shapeArgs;e&&(e.attr({r:a.startR||b.center[3]/2,start:k,end:k}),e.animate({r:l.r,start:l.start,end:l.end},b.options.animation))}),b.animate=null)},updateTotals:function(){var a,e=0,m=this.points,k=m.length,l,g=this.options.ignoreHiddenPoint;for(a=0;a<k;a++)l=m[a],0>l.y&&(l.y=null),e+=g&&!l.visible?0:l.y;this.total=e;for(a=0;a<k;a++)l=m[a],l.percentage=0<e&&(l.visible||!g)?l.y/e*100:0,l.total=e},generatePoints:function(){t.prototype.generatePoints.call(this);this.updateTotals()},translate:function(a){this.generatePoints();
var b=0,e=this.options,k=e.slicedOffset,l=k+(e.borderWidth||0),g,n,r,u=e.startAngle||0,f=this.startAngleRad=Math.PI/180*(u-90),u=(this.endAngleRad=Math.PI/180*(m(e.endAngle,u+360)-90))-f,q=this.points,d=e.dataLabels.distance,e=e.ignoreHiddenPoint,x,c=q.length,y;a||(this.center=a=this.getCenter());this.getX=function(b,c){r=Math.asin(Math.min((b-a[1])/(a[2]/2+d),1));return a[0]+(c?-1:1)*Math.cos(r)*(a[2]/2+d)};for(x=0;x<c;x++){y=q[x];g=f+b*u;if(!e||y.visible)b+=y.percentage/100;n=f+b*u;y.shapeType=
"arc";y.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:Math.round(1E3*g)/1E3,end:Math.round(1E3*n)/1E3};r=(n+g)/2;r>1.5*Math.PI?r-=2*Math.PI:r<-Math.PI/2&&(r+=2*Math.PI);y.slicedTranslation={translateX:Math.round(Math.cos(r)*k),translateY:Math.round(Math.sin(r)*k)};g=Math.cos(r)*a[2]/2;n=Math.sin(r)*a[2]/2;y.tooltipPos=[a[0]+.7*g,a[1]+.7*n];y.half=r<-Math.PI/2||r>Math.PI/2?1:0;y.angle=r;l=Math.min(l,d/5);y.labelPos=[a[0]+g+Math.cos(r)*d,a[1]+n+Math.sin(r)*d,a[0]+g+Math.cos(r)*l,a[1]+n+Math.sin(r)*
l,a[0]+g,a[1]+n,0>d?"center":y.half?"right":"left",r]}},drawGraph:null,drawPoints:function(){var a=this,e=a.chart.renderer,m,k,l,g,n=a.options.shadow;n&&!a.shadowGroup&&(a.shadowGroup=e.g("shadow").add(a.group));H(a.points,function(b){if(null!==b.y){k=b.graphic;g=b.shapeArgs;m=b.sliced?b.slicedTranslation:{};var u=b.shadowGroup;n&&!u&&(u=b.shadowGroup=e.g("shadow").add(a.shadowGroup));u&&u.attr(m);l=a.pointAttribs(b,b.selected&&"select");k?k.setRadialReference(a.center).attr(l).animate(I(g,m)):(b.graphic=
k=e[b.shapeType](g).addClass(b.getClassName()).setRadialReference(a.center).attr(m).add(a.group),b.visible||k.attr({visibility:"hidden"}),k.attr(l).attr({"stroke-linejoin":"round"}).shadow(n,u))}})},searchPoint:n,sortByAngle:function(a,e){a.sort(function(a,b){return void 0!==a.angle&&(b.angle-a.angle)*e})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,getCenter:a.CenteredSeriesMixin.getCenter,getSymbol:n},{init:function(){z.prototype.init.apply(this,arguments);var a=this,e;a.name=m(a.name,"Slice");
e=function(b){a.slice("select"===b.type)};E(a,"select",e);E(a,"unselect",e);return a},setVisible:function(a,e){var b=this,k=b.series,l=k.chart,g=k.options.ignoreHiddenPoint;e=m(e,g);a!==b.visible&&(b.visible=b.options.visible=a=void 0===a?!b.visible:a,k.options.data[v(b,k.data)]=b.options,H(["graphic","dataLabel","connector","shadowGroup"],function(e){if(b[e])b[e][a?"show":"hide"](!0)}),b.legendItem&&l.legend.colorizeItem(b,a),a||"hover"!==b.state||b.setState(""),g&&(k.isDirty=!0),e&&l.redraw())},
slice:function(a,p,n){var b=this.series;e(n,b.chart);m(p,!0);this.sliced=this.options.sliced=a=D(a)?a:!this.sliced;b.options.data[v(this,b.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(b.x,b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}})})(K);(function(a){var E=
a.addEvent,D=a.arrayMax,H=a.defined,I=a.each,v=a.extend,n=a.format,m=a.map,z=a.merge,t=a.noop,q=a.pick,e=a.relativeLength,b=a.Series,p=a.seriesTypes,w=a.stableSort;a.distribute=function(a,b){function e(a,b){return a.target-b.target}var k,l=!0,u=a,f=[],p;p=0;for(k=a.length;k--;)p+=a[k].size;if(p>b){w(a,function(a,b){return(b.rank||0)-(a.rank||0)});for(p=k=0;p<=b;)p+=a[k].size,k++;f=a.splice(k-1,a.length)}w(a,e);for(a=m(a,function(a){return{size:a.size,targets:[a.target]}});l;){for(k=a.length;k--;)l=
a[k],p=(Math.min.apply(0,l.targets)+Math.max.apply(0,l.targets))/2,l.pos=Math.min(Math.max(0,p-l.size/2),b-l.size);k=a.length;for(l=!1;k--;)0<k&&a[k-1].pos+a[k-1].size>a[k].pos&&(a[k-1].size+=a[k].size,a[k-1].targets=a[k-1].targets.concat(a[k].targets),a[k-1].pos+a[k-1].size>b&&(a[k-1].pos=b-a[k-1].size),a.splice(k,1),l=!0)}k=0;I(a,function(a){var b=0;I(a.targets,function(){u[k].pos=a.pos+b;b+=u[k].size;k++})});u.push.apply(u,f);w(u,e)};b.prototype.drawDataLabels=function(){var a=this,b=a.options,
e=b.dataLabels,p=a.points,r,u,f=a.hasRendered||0,m,d,x=q(e.defer,!0),c=a.chart.renderer;if(e.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(e),d=a.plotGroup("dataLabelsGroup","data-labels",x&&!f?"hidden":"visible",e.zIndex||6),x&&(d.attr({opacity:+f}),f||E(a,"afterAnimate",function(){a.visible&&d.show(!0);d[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),u=e,I(p,function(f){var g,k=f.dataLabel,l,h,x,p=f.connector,y=!k,w;r=f.dlOptions||f.options&&f.options.dataLabels;
if(g=q(r&&r.enabled,u.enabled)&&null!==f.y)for(h in e=z(u,r),l=f.getLabelConfig(),m=e.format?n(e.format,l):e.formatter.call(l,e),w=e.style,x=e.rotation,w.color=q(e.color,w.color,a.color,"#000000"),"contrast"===w.color&&(w.color=e.inside||0>e.distance||b.stacking?c.getContrast(f.color||a.color):"#000000"),b.cursor&&(w.cursor=b.cursor),l={fill:e.backgroundColor,stroke:e.borderColor,"stroke-width":e.borderWidth,r:e.borderRadius||0,rotation:x,padding:e.padding,zIndex:1},l)void 0===l[h]&&delete l[h];!k||
g&&H(m)?g&&H(m)&&(k?l.text=m:(k=f.dataLabel=c[x?"text":"label"](m,0,-9999,e.shape,null,null,e.useHTML,null,"data-label"),k.addClass("highcharts-data-label-color-"+f.colorIndex+" "+(e.className||"")+(e.useHTML?"highcharts-tracker":""))),k.attr(l),k.css(w).shadow(e.shadow),k.added||k.add(d),a.alignDataLabel(f,k,e,null,y)):(f.dataLabel=k.destroy(),p&&(f.connector=p.destroy()))})};b.prototype.alignDataLabel=function(a,b,e,p,r){var g=this.chart,f=g.inverted,k=q(a.plotX,-9999),d=q(a.plotY,-9999),l=b.getBBox(),
c,y=e.rotation,m=e.align,A=this.visible&&(a.series.forceDL||g.isInsidePlot(k,Math.round(d),f)||p&&g.isInsidePlot(k,f?p.x+1:p.y+p.height-1,f)),n="justify"===q(e.overflow,"justify");A&&(c=e.style.fontSize,c=g.renderer.fontMetrics(c,b).b,p=v({x:f?g.plotWidth-d:k,y:Math.round(f?g.plotHeight-k:d),width:0,height:0},p),v(e,{width:l.width,height:l.height}),y?(n=!1,f=g.renderer.rotCorr(c,y),f={x:p.x+e.x+p.width/2+f.x,y:p.y+e.y+{top:0,middle:.5,bottom:1}[e.verticalAlign]*p.height},b[r?"attr":"animate"](f).attr({align:m}),
k=(y+720)%360,k=180<k&&360>k,"left"===m?f.y-=k?l.height:0:"center"===m?(f.x-=l.width/2,f.y-=l.height/2):"right"===m&&(f.x-=l.width,f.y-=k?0:l.height)):(b.align(e,null,p),f=b.alignAttr),n?this.justifyDataLabel(b,e,f,l,p,r):q(e.crop,!0)&&(A=g.isInsidePlot(f.x,f.y)&&g.isInsidePlot(f.x+l.width,f.y+l.height)),e.shape&&!y&&b.attr({anchorX:a.plotX,anchorY:a.plotY}));A||(b.attr({y:-9999}),b.placed=!1)};b.prototype.justifyDataLabel=function(a,b,e,p,r,u){var f=this.chart,g=b.align,d=b.verticalAlign,k,c,l=a.box?
0:a.padding||0;k=e.x+l;0>k&&("right"===g?b.align="left":b.x=-k,c=!0);k=e.x+p.width-l;k>f.plotWidth&&("left"===g?b.align="right":b.x=f.plotWidth-k,c=!0);k=e.y+l;0>k&&("bottom"===d?b.verticalAlign="top":b.y=-k,c=!0);k=e.y+p.height-l;k>f.plotHeight&&("top"===d?b.verticalAlign="bottom":b.y=f.plotHeight-k,c=!0);c&&(a.placed=!u,a.align(b,null,r))};p.pie&&(p.pie.prototype.drawDataLabels=function(){var e=this,l=e.data,g,p=e.chart,r=e.options.dataLabels,u=q(r.connectorPadding,10),f=q(r.connectorWidth,1),n=
p.plotWidth,d=p.plotHeight,x,c=r.distance,y=e.center,w=y[2]/2,A=y[1],t=0<c,h,v,z,E,N=[[],[]],H,C,M,R,O=[0,0,0,0];e.visible&&(r.enabled||e._hasPointLabels)&&(b.prototype.drawDataLabels.apply(e),I(l,function(a){a.dataLabel&&a.visible&&(N[a.half].push(a),a.dataLabel._pos=null)}),I(N,function(b,f){var k,l,x=b.length,q,t,B;if(x)for(e.sortByAngle(b,f-.5),0<c&&(k=Math.max(0,A-w-c),l=Math.min(A+w+c,p.plotHeight),q=m(b,function(a){if(a.dataLabel)return B=a.dataLabel.getBBox().height||21,{target:a.labelPos[1]-
k+B/2,size:B,rank:a.y}}),a.distribute(q,l+B-k)),R=0;R<x;R++)g=b[R],z=g.labelPos,h=g.dataLabel,M=!1===g.visible?"hidden":"inherit",t=z[1],q?void 0===q[R].pos?M="hidden":(E=q[R].size,C=k+q[R].pos):C=t,H=r.justify?y[0]+(f?-1:1)*(w+c):e.getX(C<k+2||C>l-2?t:C,f),h._attr={visibility:M,align:z[6]},h._pos={x:H+r.x+({left:u,right:-u}[z[6]]||0),y:C+r.y-10},z.x=H,z.y=C,null===e.options.size&&(v=h.width,H-v<u?O[3]=Math.max(Math.round(v-H+u),O[3]):H+v>n-u&&(O[1]=Math.max(Math.round(H+v-n+u),O[1])),0>C-E/2?O[0]=
Math.max(Math.round(-C+E/2),O[0]):C+E/2>d&&(O[2]=Math.max(Math.round(C+E/2-d),O[2])))}),0===D(O)||this.verifyDataLabelOverflow(O))&&(this.placeDataLabels(),t&&f&&I(this.points,function(a){var b;x=a.connector;if((h=a.dataLabel)&&h._pos&&a.visible){M=h._attr.visibility;if(b=!x)a.connector=x=p.renderer.path().addClass("highcharts-data-label-connector highcharts-color-"+a.colorIndex).add(e.dataLabelsGroup),x.attr({"stroke-width":f,stroke:r.connectorColor||a.color||"#666666"});x[b?"attr":"animate"]({d:e.connectorPath(a.labelPos)});
x.attr("visibility",M)}else x&&(a.connector=x.destroy())}))},p.pie.prototype.connectorPath=function(a){var b=a.x,e=a.y;return q(this.options.dataLabels.softConnector,!0)?["M",b+("left"===a[6]?5:-5),e,"C",b,e,2*a[2]-a[4],2*a[3]-a[5],a[2],a[3],"L",a[4],a[5]]:["M",b+("left"===a[6]?5:-5),e,"L",a[2],a[3],"L",a[4],a[5]]},p.pie.prototype.placeDataLabels=function(){I(this.points,function(a){var b=a.dataLabel;b&&a.visible&&((a=b._pos)?(b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-9999}))})},
p.pie.prototype.alignDataLabel=t,p.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,g=this.options,k=g.center,r=g.minSize||80,u,f;null!==k[0]?u=Math.max(b[2]-Math.max(a[1],a[3]),r):(u=Math.max(b[2]-a[1]-a[3],r),b[0]+=(a[3]-a[1])/2);null!==k[1]?u=Math.max(Math.min(u,b[2]-Math.max(a[0],a[2])),r):(u=Math.max(Math.min(u,b[2]-a[0]-a[2]),r),b[1]+=(a[0]-a[2])/2);u<b[2]?(b[2]=u,b[3]=Math.min(e(g.innerSize||0,u),u),this.translate(b),this.drawDataLabels&&this.drawDataLabels()):f=!0;return f});
p.column&&(p.column.prototype.alignDataLabel=function(a,e,g,p,r){var k=this.chart.inverted,f=a.series,l=a.dlBox||a.shapeArgs,d=q(a.below,a.plotY>q(this.translatedThreshold,f.yAxis.len)),x=q(g.inside,!!this.options.stacking);l&&(p=z(l),0>p.y&&(p.height+=p.y,p.y=0),l=p.y+p.height-f.yAxis.len,0<l&&(p.height-=l),k&&(p={x:f.yAxis.len-p.y-p.height,y:f.xAxis.len-p.x-p.width,width:p.height,height:p.width}),x||(k?(p.x+=d?0:p.width,p.width=0):(p.y+=d?p.height:0,p.height=0)));g.align=q(g.align,!k||x?"center":
d?"right":"left");g.verticalAlign=q(g.verticalAlign,k||x?"middle":d?"top":"bottom");b.prototype.alignDataLabel.call(this,a,e,g,p,r)})})(K);(function(a){var E=a.Chart,D=a.each,H=a.pick,I=a.addEvent;E.prototype.callbacks.push(function(a){function n(){var m=[];D(a.series,function(a){var n=a.options.dataLabels,q=a.dataLabelCollections||["dataLabel"];(n.enabled||a._hasPointLabels)&&!n.allowOverlap&&a.visible&&D(q,function(e){D(a.points,function(a){a[e]&&(a[e].labelrank=H(a.labelrank,a.shapeArgs&&a.shapeArgs.height),
m.push(a[e]))})})});a.hideOverlappingLabels(m)}n();I(a,"redraw",n)});E.prototype.hideOverlappingLabels=function(a){var n=a.length,m,v,t,q,e,b,p,w,k,l=function(a,b,e,k,f,l,d,p){return!(f>a+e||f+d<a||l>b+k||l+p<b)};for(v=0;v<n;v++)if(m=a[v])m.oldOpacity=m.opacity,m.newOpacity=1;a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(v=0;v<n;v++)for(t=a[v],m=v+1;m<n;++m)if(q=a[m],t&&q&&t.placed&&q.placed&&0!==t.newOpacity&&0!==q.newOpacity&&(e=t.alignAttr,b=q.alignAttr,p=t.parentGroup,w=q.parentGroup,
k=2*(t.box?0:t.padding),e=l(e.x+p.translateX,e.y+p.translateY,t.width-k,t.height-k,b.x+w.translateX,b.y+w.translateY,q.width-k,q.height-k)))(t.labelrank<q.labelrank?t:q).newOpacity=0;D(a,function(a){var b,e;a&&(e=a.newOpacity,a.oldOpacity!==e&&a.placed&&(e?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=e,a[a.isOld?"animate":"attr"](a.alignAttr,null,b)),a.isOld=!0)})}})(K);(function(a){var E=a.addEvent,D=a.Chart,H=a.createElement,I=a.css,v=a.defaultOptions,n=a.defaultPlotOptions,m=a.each,z=
a.extend,t=a.fireEvent,q=a.hasTouch,e=a.inArray,b=a.isObject,p=a.Legend,w=a.merge,k=a.pick,l=a.Point,g=a.Series,F=a.seriesTypes,r=a.svg;a=a.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,e=b.pointer,d=function(a){for(var d=a.target,f;d&&!f;)f=d.point,d=d.parentNode;if(void 0!==f&&f!==b.hoverPoint)f.onMouseOver(a)};m(a.points,function(a){a.graphic&&(a.graphic.element.point=a);a.dataLabel&&(a.dataLabel.div?a.dataLabel.div.point=a:a.dataLabel.element.point=a)});a._hasTracking||(m(a.trackerGroups,
function(b){if(a[b]){a[b].addClass("highcharts-tracker").on("mouseover",d).on("mouseout",function(a){e.onTrackerMouseOut(a)});if(q)a[b].on("touchstart",d);a.options.cursor&&a[b].css(I).css({cursor:a.options.cursor})}}),a._hasTracking=!0)},drawTrackerGraph:function(){var a=this,b=a.options,e=b.trackByArea,d=[].concat(e?a.areaPath:a.graphPath),g=d.length,c=a.chart,k=c.pointer,l=c.renderer,p=c.options.tooltip.snap,n=a.tracker,h,w=function(){if(c.hoverSeries!==a)a.onMouseOver()},t="rgba(192,192,192,"+
(r?.0001:.002)+")";if(g&&!e)for(h=g+1;h--;)"M"===d[h]&&d.splice(h+1,0,d[h+1]-p,d[h+2],"L"),(h&&"M"===d[h]||h===g)&&d.splice(h,0,"L",d[h-2]+p,d[h-1]);n?n.attr({d:d}):a.graph&&(a.tracker=l.path(d).attr({"stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:t,fill:e?t:"none","stroke-width":a.graph.strokeWidth()+(e?0:2*p),zIndex:2}).add(a.group),m([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",w).on("mouseout",function(a){k.onTrackerMouseOut(a)});
b.cursor&&a.css({cursor:b.cursor});if(q)a.on("touchstart",w)}))}};F.column&&(F.column.prototype.drawTracker=a.drawTrackerPoint);F.pie&&(F.pie.prototype.drawTracker=a.drawTrackerPoint);F.scatter&&(F.scatter.prototype.drawTracker=a.drawTrackerPoint);z(p.prototype,{setItemEvents:function(a,b,e){var d=this,f=d.chart,c="highcharts-legend-"+(a.series?"point":"series")+"-active";(e?b:a.legendGroup).on("mouseover",function(){a.setState("hover");f.seriesGroup.addClass(c);b.css(d.options.itemHoverStyle)}).on("mouseout",
function(){b.css(a.visible?d.itemStyle:d.itemHiddenStyle);f.seriesGroup.removeClass(c);a.setState()}).on("click",function(b){var d=function(){a.setVisible&&a.setVisible()};b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,d):t(a,"legendItemClick",b,d)})},createCheckboxForItem:function(a){a.checkbox=H("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);E(a.checkbox,"click",function(b){t(a.series||a,"checkboxClick",
{checked:b.target.checked,item:a},function(){a.select()})})}});v.legend.itemStyle.cursor="pointer";z(D.prototype,{showResetZoom:function(){var a=this,b=v.lang,e=a.options.chart.resetZoomButton,d=e.theme,g=d.states,c="chart"===e.relativeTo?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,g&&g.hover).attr({align:e.position.align,title:b.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(e.position,!1,c)},zoomOut:function(){var a=this;
t(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var f,e=this.pointer,d=!1,g;!a||a.resetSelection?m(this.axes,function(a){f=a.zoom()}):m(a.xAxis.concat(a.yAxis),function(a){var b=a.axis;e[b.isXAxis?"zoomX":"zoomY"]&&(f=b.zoom(a.min,a.max),b.displayBtn&&(d=!0))});g=this.resetZoomButton;d&&!g?this.showResetZoom():!d&&b(g)&&(this.resetZoomButton=g.destroy());f&&this.redraw(k(this.options.chart.animation,a&&a.animation,100>this.pointCount))},pan:function(a,b){var f=this,d=f.hoverPoints,
e;d&&m(d,function(a){a.setState()});m("xy"===b?[1,0]:[1],function(b){b=f[b?"xAxis":"yAxis"][0];var d=b.horiz,c=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",g=f[d],k=(b.pointRange||0)/2,h=b.getExtremes(),l=b.toValue(g-c,!0)+k,k=b.toValue(g+b.len-c,!0)-k,p=k<l,g=p?k:l,l=p?l:k,k=Math.min(h.dataMin,h.min)-g,h=l-Math.max(h.dataMax,h.max);b.series.length&&0>k&&0>h&&(b.setExtremes(g,l,!1,!1,{trigger:"pan"}),e=!0);f[d]=c});e&&f.redraw(!1);I(f.container,{cursor:"move"})}});z(l.prototype,{select:function(a,
b){var f=this,d=f.series,g=d.chart;a=k(a,!f.selected);f.firePointEvent(a?"select":"unselect",{accumulate:b},function(){f.selected=f.options.selected=a;d.options.data[e(f,d.data)]=f.options;f.setState(a&&"select");b||m(g.getSelectedPoints(),function(a){a.selected&&a!==f&&(a.selected=a.options.selected=!1,d.options.data[e(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect"))})})},onMouseOver:function(a,b){var f=this.series,d=f.chart,e=d.tooltip,c=d.hoverPoint;if(this.series){if(!b){if(c&&
c!==this)c.onMouseOut();if(d.hoverSeries!==f)f.onMouseOver();d.hoverPoint=this}!e||e.shared&&!f.noSharedTooltip?e||this.setState("hover"):(this.setState("hover"),e.refresh(this,a));this.firePointEvent("mouseOver")}},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;this.firePointEvent("mouseOut");b&&-1!==e(this,b)||(this.setState(),a.hoverPoint=null)},importEvents:function(){if(!this.hasImportedEvents){var a=w(this.series.options.point,this.options).events,b;this.events=a;for(b in a)E(this,
b,a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var f=Math.floor(this.plotX),d=this.plotY,e=this.series,c=e.options.states[a]||{},g=n[e.type].marker&&e.options.marker,l=g&&!1===g.enabled,p=g&&g.states&&g.states[a]||{},r=!1===p.enabled,h=e.stateMarkerGraphic,u=this.marker||{},m=e.chart,q=e.halo,w,t=g&&e.markerAttribs;a=a||"";if(!(a===this.state&&!b||this.selected&&"select"!==a||!1===c.enabled||a&&(r||l&&!1===p.enabled)||a&&u.states&&u.states[a]&&!1===u.states[a].enabled)){t&&(w=e.markerAttribs(this,
a));if(this.graphic)this.state&&this.graphic.removeClass("highcharts-point-"+this.state),a&&this.graphic.addClass("highcharts-point-"+a),this.graphic.attr(e.pointAttribs(this,a)),w&&this.graphic.animate(w,k(m.options.chart.animation,p.animation,g.animation)),h&&h.hide();else{if(a&&p){g=u.symbol||e.symbol;h&&h.currentSymbol!==g&&(h=h.destroy());if(h)h[b?"animate":"attr"]({x:w.x,y:w.y});else g&&(e.stateMarkerGraphic=h=m.renderer.symbol(g,w.x,w.y,w.width,w.height).add(e.markerGroup),h.currentSymbol=
g);h&&h.attr(e.pointAttribs(this,a))}h&&(h[a&&m.isInsidePlot(f,d,m.inverted)?"show":"hide"](),h.element.point=this)}(f=c.halo)&&f.size?(q||(e.halo=q=m.renderer.path().add(t?e.markerGroup:e.group)),q[b?"animate":"attr"]({d:this.haloPath(f.size)}),q.attr({"class":"highcharts-halo highcharts-color-"+k(this.colorIndex,e.colorIndex)}),q.point=this,q.attr(z({fill:this.color||e.color,"fill-opacity":f.opacity,zIndex:-1},f.attributes))):q&&q.point&&q.point.haloPath&&q.animate({d:q.point.haloPath(0)});this.state=
a}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-a,this.plotY-a,2*a,2*a)}});z(g.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&t(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,e=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&t(this,"mouseOut");!e||a.stickyTracking||
e.shared&&!this.noSharedTooltip||e.hide();this.setState()},setState:function(a){var b=this,e=b.options,d=b.graph,g=e.states,c=e.lineWidth,e=0;a=a||"";if(b.state!==a&&(m([b.group,b.markerGroup],function(d){d&&(b.state&&d.removeClass("highcharts-series-"+b.state),a&&d.addClass("highcharts-series-"+a))}),b.state=a,!g[a]||!1!==g[a].enabled)&&(a&&(c=g[a].lineWidth||c+(g[a].lineWidthPlus||0)),d&&!d.dashstyle))for(g={"stroke-width":c},d.attr(g);b["zone-graph-"+e];)b["zone-graph-"+e].attr(g),e+=1},setVisible:function(a,
b){var f=this,d=f.chart,e=f.legendItem,c,g=d.options.chart.ignoreHiddenSeries,k=f.visible;c=(f.visible=a=f.options.visible=f.userOptions.visible=void 0===a?!k:a)?"show":"hide";m(["group","dataLabelsGroup","markerGroup","tracker","tt"],function(a){if(f[a])f[a][c]()});if(d.hoverSeries===f||(d.hoverPoint&&d.hoverPoint.series)===f)f.onMouseOut();e&&d.legend.colorizeItem(f,a);f.isDirty=!0;f.options.stacking&&m(d.series,function(a){a.options.stacking&&a.visible&&(a.isDirty=!0)});m(f.linkedSeries,function(b){b.setVisible(a,
!1)});g&&(d.isDirtyBox=!0);!1!==b&&d.redraw();t(f,c)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=void 0===a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);t(this,a?"select":"unselect")},drawTracker:a.drawTrackerGraph})})(K);(function(a){var E=a.Chart,D=a.each,H=a.inArray,I=a.isObject,v=a.pick,n=a.splat;E.prototype.setResponsive=function(a){var m=this.options.responsive;m&&m.rules&&D(m.rules,function(m){this.matchResponsiveRule(m,
a)},this)};E.prototype.matchResponsiveRule=function(m,n){var t=this.respRules,q=m.condition,e;e=q.callback||function(){return this.chartWidth<=v(q.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=v(q.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=v(q.minWidth,0)&&this.chartHeight>=v(q.minHeight,0)};void 0===m._id&&(m._id=a.uniqueKey());e=e.call(this);!t[m._id]&&e?m.chartOptions&&(t[m._id]=this.currentOptions(m.chartOptions),this.update(m.chartOptions,n)):t[m._id]&&!e&&(this.update(t[m._id],n),delete t[m._id])};
E.prototype.currentOptions=function(a){function m(a,e,b,p){var w,k;for(w in a)if(!p&&-1<H(w,["series","xAxis","yAxis"]))for(a[w]=n(a[w]),b[w]=[],k=0;k<a[w].length;k++)b[w][k]={},m(a[w][k],e[w][k],b[w][k],p+1);else I(a[w])?(b[w]={},m(a[w],e[w]||{},b[w],p+1)):b[w]=e[w]||null}var t={};m(a,this.options,t,0);return t}})(K);(function(a){var E=a.addEvent,D=a.Axis,H=a.Chart,I=a.css,v=a.dateFormat,n=a.defined,m=a.each,z=a.extend,t=a.noop,q=a.Series,e=a.timeUnits;a=a.wrap;a(q.prototype,"init",function(a){var b;
a.apply(this,Array.prototype.slice.call(arguments,1));(b=this.xAxis)&&b.options.ordinal&&E(this,"updatedData",function(){delete b.ordinalIndex})});a(D.prototype,"getTimeTicks",function(a,p,m,k,l,g,q,r){var b=0,f,w,d={},x,c,y,t=[],A=-Number.MAX_VALUE,J=this.options.tickPixelInterval;if(!this.options.ordinal&&!this.options.breaks||!g||3>g.length||void 0===m)return a.call(this,p,m,k,l);c=g.length;for(f=0;f<c;f++){y=f&&g[f-1]>k;g[f]<m&&(b=f);if(f===c-1||g[f+1]-g[f]>5*q||y){if(g[f]>A){for(w=a.call(this,
p,g[b],g[f],l);w.length&&w[0]<=A;)w.shift();w.length&&(A=w[w.length-1]);t=t.concat(w)}b=f+1}if(y)break}a=w.info;if(r&&a.unitRange<=e.hour){f=t.length-1;for(b=1;b<f;b++)v("%d",t[b])!==v("%d",t[b-1])&&(d[t[b]]="day",x=!0);x&&(d[t[0]]="day");a.higherRanks=d}t.info=a;if(r&&n(J)){r=a=t.length;f=[];var h;for(x=[];r--;)b=this.translate(t[r]),h&&(x[r]=h-b),f[r]=h=b;x.sort();x=x[Math.floor(x.length/2)];x<.6*J&&(x=null);r=t[a-1]>k?a-1:a;for(h=void 0;r--;)b=f[r],k=Math.abs(h-b),h&&k<.8*J&&(null===x||k<.8*x)?
(d[t[r]]&&!d[t[r+1]]?(k=r+1,h=b):k=r,t.splice(k,1)):h=b}return t});z(D.prototype,{beforeSetTickPositions:function(){var a,e=[],n=!1,k,l=this.getExtremes(),g=l.min,q=l.max,r,u=this.isXAxis&&!!this.options.breaks,l=this.options.ordinal,f=this.chart.options.chart.ignoreHiddenSeries;if(l||u){m(this.series,function(b,d){if(!(f&&!1===b.visible||!1===b.takeOrdinalPosition&&!u)&&(e=e.concat(b.processedXData),a=e.length,e.sort(function(a,b){return a-b}),a))for(d=a-1;d--;)e[d]===e[d+1]&&e.splice(d,1)});a=e.length;
if(2<a){k=e[1]-e[0];for(r=a-1;r--&&!n;)e[r+1]-e[r]!==k&&(n=!0);!this.options.keepOrdinalPadding&&(e[0]-g>k||q-e[e.length-1]>k)&&(n=!0)}n?(this.ordinalPositions=e,k=this.ordinal2lin(Math.max(g,e[0]),!0),r=Math.max(this.ordinal2lin(Math.min(q,e[e.length-1]),!0),1),this.ordinalSlope=q=(q-g)/(r-k),this.ordinalOffset=g-k*q):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=void 0}this.isOrdinal=l&&n;this.groupIntervalFactor=null},val2lin:function(a,e){var b=this.ordinalPositions;if(b){var k=b.length,
l,g;for(l=k;l--;)if(b[l]===a){g=l;break}for(l=k-1;l--;)if(a>b[l]||0===l){a=(a-b[l])/(b[l+1]-b[l]);g=l+a;break}e=e?g:this.ordinalSlope*(g||0)+this.ordinalOffset}else e=a;return e},lin2val:function(a,e){var b=this.ordinalPositions;if(b){var k=this.ordinalSlope,l=this.ordinalOffset,g=b.length-1,p;if(e)0>a?a=b[0]:a>g?a=b[g]:(g=Math.floor(a),p=a-g);else for(;g--;)if(e=k*g+l,a>=e){k=k*(g+1)+l;p=(a-e)/(k-e);break}return void 0!==p&&void 0!==b[g]?b[g]+(p?p*(b[g+1]-b[g]):0):a}return a},getExtendedPositions:function(){var a=
this.chart,e=this.series[0].currentDataGrouping,n=this.ordinalIndex,k=e?e.count+e.unitName:"raw",l=this.getExtremes(),g,q;n||(n=this.ordinalIndex={});n[k]||(g={series:[],chart:a,getExtremes:function(){return{min:l.dataMin,max:l.dataMax}},options:{ordinal:!0},val2lin:D.prototype.val2lin},m(this.series,function(b){q={xAxis:g,xData:b.xData,chart:a,destroyGroupedData:t};q.options={dataGrouping:e?{enabled:!0,forced:!0,approximation:"open",units:[[e.unitName,[e.count]]]}:{enabled:!1}};b.processData.apply(q);
g.series.push(q)}),this.beforeSetTickPositions.apply(g),n[k]=g.ordinalPositions);return n[k]},getGroupIntervalFactor:function(a,e,m){var b;m=m.processedXData;var l=m.length,g=[];b=this.groupIntervalFactor;if(!b){for(b=0;b<l-1;b++)g[b]=m[b+1]-m[b];g.sort(function(a,b){return a-b});g=g[Math.floor(l/2)];a=Math.max(a,m[0]);e=Math.min(e,m[l-1]);this.groupIntervalFactor=b=l*g/(e-a)}return b},postProcessTickInterval:function(a){var b=this.ordinalSlope;return b?this.options.breaks?this.closestPointRange:
a/(b/this.closestPointRange):a}});D.prototype.ordinal2lin=D.prototype.val2lin;a(H.prototype,"pan",function(a,e){var b=this.xAxis[0],k=e.chartX,l=!1;if(b.options.ordinal&&b.series.length){var g=this.mouseDownX,p=b.getExtremes(),r=p.dataMax,n=p.min,f=p.max,q=this.hoverPoints,d=b.closestPointRange,g=(g-k)/(b.translationSlope*(b.ordinalSlope||d)),x={ordinalPositions:b.getExtendedPositions()},d=b.lin2val,c=b.val2lin,y;x.ordinalPositions?1<Math.abs(g)&&(q&&m(q,function(a){a.setState()}),0>g?(q=x,y=b.ordinalPositions?
b:x):(q=b.ordinalPositions?b:x,y=x),x=y.ordinalPositions,r>x[x.length-1]&&x.push(r),this.fixedRange=f-n,g=b.toFixedRange(null,null,d.apply(q,[c.apply(q,[n,!0])+g,!0]),d.apply(y,[c.apply(y,[f,!0])+g,!0])),g.min>=Math.min(p.dataMin,n)&&g.max<=Math.max(r,f)&&b.setExtremes(g.min,g.max,!0,!1,{trigger:"pan"}),this.mouseDownX=k,I(this.container,{cursor:"move"})):l=!0}else l=!0;l&&a.apply(this,Array.prototype.slice.call(arguments,1))});q.prototype.gappedPath=function(){var a=this.options.gapSize,e=this.points.slice(),
m=e.length-1;if(a&&0<m)for(;m--;)e[m+1].x-e[m].x>this.closestPointRange*a&&e.splice(m+1,0,{isNull:!0});return this.getGraphPath(e)}})(K);(function(a){function E(){return Array.prototype.slice.call(arguments,1)}function D(a){a.apply(this);this.drawBreaks(this.xAxis,["x"]);this.drawBreaks(this.yAxis,H(this.pointArrayMap,["y"]))}var H=a.pick,I=a.wrap,v=a.each,n=a.extend,m=a.isArray,z=a.fireEvent,t=a.Axis,q=a.Series;n(t.prototype,{isInBreak:function(a,b){var e=a.repeat||Infinity,m=a.from,k=a.to-a.from;
b=b>=m?(b-m)%e:e-(m-b)%e;return a.inclusive?b<=k:b<k&&0!==b},isInAnyBreak:function(a,b){var e=this.options.breaks,m=e&&e.length,k,l,g;if(m){for(;m--;)this.isInBreak(e[m],a)&&(k=!0,l||(l=H(e[m].showPoints,this.isXAxis?!1:!0)));g=k&&b?k&&!l:k}return g}});I(t.prototype,"setTickPositions",function(a){a.apply(this,Array.prototype.slice.call(arguments,1));if(this.options.breaks){var b=this.tickPositions,e=this.tickPositions.info,m=[],k;for(k=0;k<b.length;k++)this.isInAnyBreak(b[k])||m.push(b[k]);this.tickPositions=
m;this.tickPositions.info=e}});I(t.prototype,"init",function(a,b,p){var e=this;p.breaks&&p.breaks.length&&(p.ordinal=!1);a.call(this,b,p);a=this.options.breaks;e.isBroken=m(a)&&!!a.length;e.isBroken&&(e.val2lin=function(a){var b=a,g,k;for(k=0;k<e.breakArray.length;k++)if(g=e.breakArray[k],g.to<=a)b-=g.len;else if(g.from>=a)break;else if(e.isInBreak(g,a)){b-=a-g.from;break}return b},e.lin2val=function(a){var b,g;for(g=0;g<e.breakArray.length&&!(b=e.breakArray[g],b.from>=a);g++)b.to<a?a+=b.len:e.isInBreak(b,
a)&&(a+=b.len);return a},e.setExtremes=function(a,b,e,m,r){for(;this.isInAnyBreak(a);)a-=this.closestPointRange;for(;this.isInAnyBreak(b);)b-=this.closestPointRange;t.prototype.setExtremes.call(this,a,b,e,m,r)},e.setAxisTranslation=function(a){t.prototype.setAxisTranslation.call(this,a);var b=e.options.breaks;a=[];var g=[],k=0,m,p,f=e.userMin||e.min,n=e.userMax||e.max,d,x;for(x in b)p=b[x],m=p.repeat||Infinity,e.isInBreak(p,f)&&(f+=p.to%m-f%m),e.isInBreak(p,n)&&(n-=n%m-p.from%m);for(x in b){p=b[x];
d=p.from;for(m=p.repeat||Infinity;d-m>f;)d-=m;for(;d<f;)d+=m;for(;d<n;d+=m)a.push({value:d,move:"in"}),a.push({value:d+(p.to-p.from),move:"out",size:p.breakSize})}a.sort(function(a,b){return a.value===b.value?("in"===a.move?0:1)-("in"===b.move?0:1):a.value-b.value});b=0;d=f;for(x in a)p=a[x],b+="in"===p.move?1:-1,1===b&&"in"===p.move&&(d=p.value),0===b&&(g.push({from:d,to:p.value,len:p.value-d-(p.size||0)}),k+=p.value-d-(p.size||0));e.breakArray=g;z(e,"afterBreaks");e.transA*=(n-e.min)/(n-f-k);e.min=
f;e.max=n})});I(q.prototype,"generatePoints",function(a){a.apply(this,E(arguments));var b=this.xAxis,e=this.yAxis,m=this.points,k,l=m.length,g=this.options.connectNulls,n;if(b&&e&&(b.options.breaks||e.options.breaks))for(;l--;)k=m[l],n=null===k.y&&!1===g,n||!b.isInAnyBreak(k.x,!0)&&!e.isInAnyBreak(k.y,!0)||(m.splice(l,1),this.data[l]&&this.data[l].destroyElements())});a.Series.prototype.drawBreaks=function(a,b){var e=this,m=e.points,k,l,g,n;a&&v(b,function(b){k=a.breakArray||[];l=a.isXAxis?a.min:
H(e.options.threshold,a.min);v(m,function(e){n=H(e["stack"+b.toUpperCase()],e[b]);v(k,function(b){g=!1;if(l<b.from&&n>b.to||l>b.from&&n<b.from)g="pointBreak";else if(l<b.from&&n>b.from&&n<b.to||l>b.from&&n>b.to&&n<b.from)g="pointInBreak";g&&z(a,g,{point:e,brk:b})})})})};I(a.seriesTypes.column.prototype,"drawPoints",D);I(a.Series.prototype,"drawPoints",D)})(K);(function(a){var E=a.arrayMax,D=a.arrayMin,H=a.Axis,I=a.defaultPlotOptions,v=a.defined,n=a.each,m=a.extend,z=a.format,t=a.isNumber,q=a.merge,
e=a.pick,b=a.Point,p=a.Tooltip,w=a.wrap,k=a.Series.prototype,l=k.processData,g=k.generatePoints,F=k.destroy,r={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:{millisecond:["%A, %b %e, %H:%M:%S.%L","%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],second:["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],minute:["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],hour:["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],day:["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],week:["Week from %A, %b %e, %Y",
"%A, %b %e","-%A, %b %e, %Y"],month:["%B %Y","%B","-%B %Y"],year:["%Y","%Y","-%Y"]}},u={line:{},spline:{},area:{},areaspline:{},column:{approximation:"sum",groupPixelWidth:10},arearange:{approximation:"range"},areasplinerange:{approximation:"range"},columnrange:{approximation:"range",groupPixelWidth:10},candlestick:{approximation:"ohlc",groupPixelWidth:10},ohlc:{approximation:"ohlc",groupPixelWidth:5}},f=a.defaultDataGroupingUnits=[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,
10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1]],["week",[1]],["month",[1,3,6]],["year",null]],B={sum:function(a){var b=a.length,d;if(!b&&a.hasNulls)d=null;else if(b)for(d=0;b--;)d+=a[b];return d},average:function(a){var b=a.length;a=B.sum(a);t(a)&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:void 0},high:function(a){return a.length?E(a):a.hasNulls?null:void 0},low:function(a){return a.length?D(a):a.hasNulls?null:void 0},close:function(a){return a.length?
a[a.length-1]:a.hasNulls?null:void 0},ohlc:function(a,b,c,e){a=B.open(a);b=B.high(b);c=B.low(c);e=B.close(e);if(t(a)||t(b)||t(c)||t(e))return[a,b,c,e]},range:function(a,b){a=B.low(a);b=B.high(b);if(t(a)||t(b))return[a,b]}};k.groupData=function(a,b,c,e){var d=this.data,f=this.options.data,g=[],h=[],k=[],l=a.length,m,p,n=!!b,r=[[],[],[],[]];e="function"===typeof e?e:B[e];var q=this.pointArrayMap,y=q&&q.length,u,x=0;for(u=p=0;u<=l&&!(a[u]>=c[0]);u++);for(u;u<=l;u++){for(;(void 0!==c[x+1]&&a[u]>=c[x+
1]||u===l)&&(m=c[x],this.dataGroupInfo={start:p,length:r[0].length},p=e.apply(this,r),void 0!==p&&(g.push(m),h.push(p),k.push(this.dataGroupInfo)),p=u,r[0]=[],r[1]=[],r[2]=[],r[3]=[],x+=1,u!==l););if(u===l)break;if(q){m=this.cropStart+u;m=d&&d[m]||this.pointClass.prototype.applyOptions.apply({series:this},[f[m]]);var w,v;for(w=0;w<y;w++)v=m[q[w]],t(v)?r[w].push(v):null===v&&(r[w].hasNulls=!0)}else m=n?b[u]:null,t(m)?r[0].push(m):null===m&&(r[0].hasNulls=!0)}return[g,h,k]};k.processData=function(){var a=
this.chart,b=this.options.dataGrouping,c=!1!==this.allowDG&&b&&e(b.enabled,a.options.isStock),g=this.visible||!a.options.chart.ignoreHiddenSeries,m;this.forceCrop=c;this.groupPixelWidth=null;this.hasProcessed=!0;if(!1!==l.apply(this,arguments)&&c&&g){this.destroyGroupedData();var p=this.processedXData,r=this.processedYData,h=a.plotSizeX,a=this.xAxis,n=a.options.ordinal,u=this.groupPixelWidth=a.getGroupPixelWidth&&a.getGroupPixelWidth();if(u){this.isDirty=m=!0;g=a.getExtremes();c=g.min;g=g.max;n=n&&
a.getGroupIntervalFactor(c,g,this)||1;h=u*(g-c)/h*n;u=a.getTimeTicks(a.normalizeTimeTickInterval(h,b.units||f),Math.min(c,p[0]),Math.max(g,p[p.length-1]),a.options.startOfWeek,p,this.closestPointRange);p=k.groupData.apply(this,[p,r,u,b.approximation]);r=p[0];n=p[1];if(b.smoothed){b=r.length-1;for(r[b]=Math.min(r[b],g);b--&&0<b;)r[b]+=h/2;r[0]=Math.max(r[0],c)}this.currentDataGrouping=u.info;this.closestPointRange=u.info.totalRange;this.groupMap=p[2];v(r[0])&&r[0]<a.dataMin&&(a.min===a.dataMin&&(a.min=
r[0]),a.dataMin=r[0]);this.processedXData=r;this.processedYData=n}else this.currentDataGrouping=this.groupMap=null;this.hasGroupedData=m}};k.destroyGroupedData=function(){var a=this.groupedData;n(a||[],function(b,d){b&&(a[d]=b.destroy?b.destroy():null)});this.groupedData=null};k.generatePoints=function(){g.apply(this);this.destroyGroupedData();this.groupedData=this.hasGroupedData?this.points:null};w(b.prototype,"update",function(b){this.dataGroup?a.error(24):b.apply(this,[].slice.call(arguments,1))});
w(p.prototype,"tooltipFooterHeaderFormatter",function(b,e,c){var d=e.series,f=d.tooltipOptions,g=d.options.dataGrouping,k=f.xDateFormat,h,l=d.xAxis,p=a.dateFormat;return l&&"datetime"===l.options.type&&g&&t(e.key)?(b=d.currentDataGrouping,g=g.dateTimeLabelFormats,b?(l=g[b.unitName],1===b.count?k=l[0]:(k=l[1],h=l[2])):!k&&g&&(k=this.getXDateFormat(e,f,l)),k=p(k,e.key),h&&(k+=p(h,e.key+b.totalRange-1)),z(f[(c?"footer":"header")+"Format"],{point:m(e.point,{key:k}),series:d})):b.call(this,e,c)});k.destroy=
function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();F.apply(this)};w(k,"setOptions",function(a,b){a=a.call(this,b);var d=this.type,e=this.chart.options.plotOptions,f=I[d].dataGrouping;u[d]&&(f||(f=q(r,u[d])),a.dataGrouping=q(f,e.series&&e.series.dataGrouping,e[d].dataGrouping,b.dataGrouping));this.chart.options.isStock&&(this.requireSorting=!0);return a});w(H.prototype,"setScale",function(a){a.call(this);n(this.series,function(a){a.hasProcessed=!1})});H.prototype.getGroupPixelWidth=
function(){var a=this.series,b=a.length,c,e=0,f=!1,g;for(c=b;c--;)(g=a[c].options.dataGrouping)&&(e=Math.max(e,g.groupPixelWidth));for(c=b;c--;)(g=a[c].options.dataGrouping)&&a[c].hasProcessed&&(b=(a[c].processedXData||a[c].data).length,a[c].groupPixelWidth||b>this.chart.plotSizeX/e||b&&g.forced)&&(f=!0);return f?e:0};H.prototype.setDataGrouping=function(a,b){var c;b=e(b,!0);a||(a={forced:!1,units:null});if(this instanceof H)for(c=this.series.length;c--;)this.series[c].update({dataGrouping:a},!1);
else n(this.chart.options.series,function(b){b.dataGrouping=a},!1);b&&this.chart.redraw()}})(K);(function(a){var E=a.each,D=a.Point,H=a.seriesType,I=a.seriesTypes;H("ohlc","column",{lineWidth:1,tooltip:{pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eOpen: {point.open}\x3cbr/\x3eHigh: {point.high}\x3cbr/\x3eLow: {point.low}\x3cbr/\x3eClose: {point.close}\x3cbr/\x3e'},threshold:null,states:{hover:{lineWidth:3}}},{pointArrayMap:["open",
"high","low","close"],toYData:function(a){return[a.open,a.high,a.low,a.close]},pointValKey:"high",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},pointAttribs:function(a,n){n=I.column.prototype.pointAttribs.call(this,a,n);var m=this.options;delete n.fill;!a.options.color&&m.upColor&&a.open<a.close&&(n.stroke=m.upColor);return n},translate:function(){var a=this,n=a.yAxis,m=!!a.modifyValue,z=["plotOpen","yBottom","plotClose"];I.column.prototype.translate.apply(a);E(a.points,function(t){E([t.open,
t.low,t.close],function(q,e){null!==q&&(m&&(q=a.modifyValue(q)),t[z[e]]=n.toPixels(q,!0))})})},drawPoints:function(){var a=this,n=a.chart;E(a.points,function(m){var v,t,q,e,b=m.graphic,p,w=!b;void 0!==m.plotY&&(b||(m.graphic=b=n.renderer.path().add(a.group)),b.attr(a.pointAttribs(m,m.selected&&"select")),t=b.strokeWidth()%2/2,p=Math.round(m.plotX)-t,q=Math.round(m.shapeArgs.width/2),e=["M",p,Math.round(m.yBottom),"L",p,Math.round(m.plotY)],null!==m.open&&(v=Math.round(m.plotOpen)+t,e.push("M",p,v,
"L",p-q,v)),null!==m.close&&(v=Math.round(m.plotClose)+t,e.push("M",p,v,"L",p+q,v)),b[w?"attr":"animate"]({d:e}).addClass(m.getClassName(),!0))})},animate:null},{getClassName:function(){return D.prototype.getClassName.call(this)+(this.open<this.close?" highcharts-point-up":" highcharts-point-down")}})})(K);(function(a){var E=a.defaultPlotOptions,D=a.each,H=a.merge,I=a.seriesType,v=a.seriesTypes;I("candlestick","ohlc",H(E.column,{states:{hover:{lineWidth:2}},tooltip:E.ohlc.tooltip,threshold:null,lineColor:"#000000",
lineWidth:1,upColor:"#ffffff"}),{pointAttribs:function(a,m){var n=v.column.prototype.pointAttribs.call(this,a,m),t=this.options,q=a.open<a.close,e=t.lineColor||this.color;n["stroke-width"]=t.lineWidth;n.fill=a.options.color||(q?t.upColor||this.color:this.color);n.stroke=a.lineColor||(q?t.upLineColor||e:e);m&&(a=t.states[m],n.fill=a.color||n.fill,n.stroke=a.lineColor||n.stroke,n["stroke-width"]=a.lineWidth||n["stroke-width"]);return n},drawPoints:function(){var a=this,m=a.chart;D(a.points,function(n){var t=
n.graphic,q,e,b,p,w,k,l,g=!t;void 0!==n.plotY&&(t||(n.graphic=t=m.renderer.path().add(a.group)),t.attr(a.pointAttribs(n,n.selected&&"select")).shadow(a.options.shadow),w=t.strokeWidth()%2/2,k=Math.round(n.plotX)-w,q=n.plotOpen,e=n.plotClose,b=Math.min(q,e),q=Math.max(q,e),l=Math.round(n.shapeArgs.width/2),e=Math.round(b)!==Math.round(n.plotY),p=q!==n.yBottom,b=Math.round(b)+w,q=Math.round(q)+w,w=[],w.push("M",k-l,q,"L",k-l,b,"L",k+l,b,"L",k+l,q,"Z","M",k,b,"L",k,e?Math.round(n.plotY):b,"M",k,q,"L",
k,p?Math.round(n.yBottom):q),t[g?"attr":"animate"]({d:w}).addClass(n.getClassName(),!0))})}})})(K);(function(a){var E=a.addEvent,D=a.each,H=a.merge,I=a.noop,v=a.Renderer,n=a.seriesType,m=a.seriesTypes,z=a.TrackerMixin,t=a.VMLRenderer,q=a.SVGRenderer.prototype.symbols;n("flags","column",{pointRange:0,shape:"flag",stackDistance:12,textAlign:"center",tooltip:{pointFormat:"{point.text}\x3cbr/\x3e"},threshold:null,y:-30,fillColor:"#ffffff",lineWidth:1,states:{hover:{lineColor:"#000000",fillColor:"#ccd6eb"}},
style:{fontSize:"11px",fontWeight:"bold"}},{sorted:!1,noSharedTooltip:!0,allowDG:!1,takeOrdinalPosition:!1,trackerGroups:["markerGroup"],forceCrop:!0,init:a.Series.prototype.init,pointAttribs:function(a,b){var e=this.options,m=a&&a.color||this.color,k=e.lineColor,l=a&&a.lineWidth;a=a&&a.fillColor||e.fillColor;b&&(a=e.states[b].fillColor,k=e.states[b].lineColor,l=e.states[b].lineWidth);return{fill:a||m,stroke:k||m,"stroke-width":l||e.lineWidth||0}},translate:function(){m.column.prototype.translate.apply(this);
var a=this.options,b=this.chart,p=this.points,n=p.length-1,k,l,g=a.onSeries;k=g&&b.get(g);var a=a.onKey||"y",g=k&&k.options.step,q=k&&k.points,r=q&&q.length,u=this.xAxis,f=u.getExtremes(),t=0,d,x,c;if(k&&k.visible&&r)for(t=(k.pointXOffset||0)+(k.barW||0)/2,k=k.currentDataGrouping,x=q[r-1].x+(k?k.totalRange:0),p.sort(function(a,b){return a.x-b.x}),a="plot"+a[0].toUpperCase()+a.substr(1);r--&&p[n]&&!(k=p[n],d=q[r],d.x<=k.x&&void 0!==d[a]&&(k.x<=x&&(k.plotY=d[a],d.x<k.x&&!g&&(c=q[r+1])&&void 0!==c[a]&&
(k.plotY+=(k.x-d.x)/(c.x-d.x)*(c[a]-d[a]))),n--,r++,0>n)););D(p,function(a,c){var d;void 0===a.plotY&&(a.x>=f.min&&a.x<=f.max?a.plotY=b.chartHeight-u.bottom-(u.opposite?u.height:0)+u.offset-b.plotTop:a.shapeArgs={});a.plotX+=t;(l=p[c-1])&&l.plotX===a.plotX&&(void 0===l.stackIndex&&(l.stackIndex=0),d=l.stackIndex+1);a.stackIndex=d})},drawPoints:function(){var a=this.points,b=this.chart,m=b.renderer,n,k,l=this.options,g=l.y,q,r,u,f,t,d,x,c=this.yAxis;for(r=a.length;r--;)u=a[r],x=u.plotX>this.xAxis.len,
n=u.plotX,f=u.stackIndex,q=u.options.shape||l.shape,k=u.plotY,void 0!==k&&(k=u.plotY+g-(void 0!==f&&f*l.stackDistance)),t=f?void 0:u.plotX,d=f?void 0:u.plotY,f=u.graphic,void 0!==k&&0<=n&&!x?(f||(f=u.graphic=m.label("",null,null,q,null,null,l.useHTML).attr(this.pointAttribs(u)).css(H(l.style,u.style)).attr({align:"flag"===q?"left":"center",width:l.width,height:l.height,"text-align":l.textAlign}).addClass("highcharts-point").add(this.markerGroup),f.shadow(l.shadow)),0<n&&(n-=f.strokeWidth()%2),f.attr({text:u.options.title||
l.title||"A",x:n,y:k,anchorX:t,anchorY:d}),u.tooltipPos=b.inverted?[c.len+c.pos-b.plotLeft-k,this.xAxis.len-n]:[n,k]):f&&(u.graphic=f.destroy())},drawTracker:function(){var a=this.points;z.drawTrackerPoint.apply(this);D(a,function(b){var e=b.graphic;e&&E(e.element,"mouseover",function(){0<b.stackIndex&&!b.raised&&(b._y=e.y,e.attr({y:b._y-8}),b.raised=!0);D(a,function(a){a!==b&&a.raised&&a.graphic&&(a.graphic.attr({y:a._y}),a.raised=!1)})})})},animate:I,buildKDTree:I,setClip:I});q.flag=function(a,
b,m,n,k){return["M",k&&k.anchorX||a,k&&k.anchorY||b,"L",a,b+n,a,b,a+m,b,a+m,b+n,a,b+n,"Z"]};D(["circle","square"],function(a){q[a+"pin"]=function(b,e,m,k,l){var g=l&&l.anchorX;l=l&&l.anchorY;"circle"===a&&k>m&&(b-=Math.round((k-m)/2),m=k);b=q[a](b,e,m,k);g&&l&&b.push("M",g,e>l?e:e+k,"L",g,l);return b}});v===t&&D(["flag","circlepin","squarepin"],function(a){t.prototype.symbols[a]=q[a]})})(K);(function(a){function E(a,b,e){this.init(a,b,e)}var D=a.addEvent,H=a.Axis,I=a.correctFloat,v=a.defaultOptions,
n=a.defined,m=a.destroyObjectProperties,z=a.doc,t=a.each,q=a.fireEvent,e=a.hasTouch,b=a.isTouchDevice,p=a.merge,w=a.pick,k=a.removeEvent,l=a.wrap,g,F={height:b?20:14,barBorderRadius:0,buttonBorderRadius:0,liveRedraw:a.svg&&!b,margin:10,minWidth:6,step:.2,zIndex:3,barBackgroundColor:"#cccccc",barBorderWidth:1,barBorderColor:"#cccccc",buttonArrowColor:"#333333",buttonBackgroundColor:"#e6e6e6",buttonBorderColor:"#cccccc",buttonBorderWidth:1,rifleColor:"#333333",trackBackgroundColor:"#f2f2f2",trackBorderColor:"#f2f2f2",
trackBorderWidth:1};v.scrollbar=p(!0,F,v.scrollbar);a.swapXY=g=function(a,b){var e=a.length,g;if(b)for(b=0;b<e;b+=3)g=a[b+1],a[b+1]=a[b+2],a[b+2]=g;return a};E.prototype={init:function(a,b,e){this.scrollbarButtons=[];this.renderer=a;this.userOptions=b;this.options=p(F,b);this.chart=e;this.size=w(this.options.size,this.options.height);b.enabled&&(this.render(),this.initEvents(),this.addEvents())},render:function(){var a=this.renderer,b=this.options,e=this.size,k;this.group=k=a.g("scrollbar").attr({zIndex:b.zIndex,
translateY:-99999}).add();this.track=a.rect().addClass("highcharts-scrollbar-track").attr({x:0,r:b.trackBorderRadius||0,height:e,width:e}).add(k);this.track.attr({fill:b.trackBackgroundColor,stroke:b.trackBorderColor,"stroke-width":b.trackBorderWidth});this.trackBorderWidth=this.track.strokeWidth();this.track.attr({y:-this.trackBorderWidth%2/2});this.scrollbarGroup=a.g().add(k);this.scrollbar=a.rect().addClass("highcharts-scrollbar-thumb").attr({height:e,width:e,r:b.barBorderRadius||0}).add(this.scrollbarGroup);
this.scrollbarRifles=a.path(g(["M",-3,e/4,"L",-3,2*e/3,"M",0,e/4,"L",0,2*e/3,"M",3,e/4,"L",3,2*e/3],b.vertical)).addClass("highcharts-scrollbar-rifles").add(this.scrollbarGroup);this.scrollbar.attr({fill:b.barBackgroundColor,stroke:b.barBorderColor,"stroke-width":b.barBorderWidth});this.scrollbarRifles.attr({stroke:b.rifleColor,"stroke-width":1});this.scrollbarStrokeWidth=this.scrollbar.strokeWidth();this.scrollbarGroup.translate(-this.scrollbarStrokeWidth%2/2,-this.scrollbarStrokeWidth%2/2);this.drawScrollbarButton(0);
this.drawScrollbarButton(1)},position:function(a,b,e,g){var d=this.options.vertical,f=0,c=this.rendered?"animate":"attr";this.x=a;this.y=b+this.trackBorderWidth;this.width=e;this.xOffset=this.height=g;this.yOffset=f;d?(this.width=this.yOffset=e=f=this.size,this.xOffset=b=0,this.barWidth=g-2*e,this.x=a+=this.options.margin):(this.height=this.xOffset=g=b=this.size,this.barWidth=e-2*g,this.y+=this.options.margin);this.group[c]({translateX:a,translateY:this.y});this.track[c]({width:e,height:g});this.scrollbarButtons[1][c]({translateX:d?
0:e-b,translateY:d?g-f:0})},drawScrollbarButton:function(a){var b=this.renderer,e=this.scrollbarButtons,k=this.options,d=this.size,l;l=b.g().add(this.group);e.push(l);l=b.rect().addClass("highcharts-scrollbar-button").add(l);l.attr({stroke:k.buttonBorderColor,"stroke-width":k.buttonBorderWidth,fill:k.buttonBackgroundColor});l.attr(l.crisp({x:-.5,y:-.5,width:d+1,height:d+1,r:k.buttonBorderRadius},l.strokeWidth()));l=b.path(g(["M",d/2+(a?-1:1),d/2-3,"L",d/2+(a?-1:1),d/2+3,"L",d/2+(a?2:-2),d/2],k.vertical)).addClass("highcharts-scrollbar-arrow").add(e[a]);
l.attr({fill:k.buttonArrowColor})},setRange:function(a,b){var e=this.options,g=e.vertical,d=e.minWidth,k=this.barWidth,c,l,m=this.rendered&&!this.hasDragged?"animate":"attr";n(k)&&(a=Math.max(a,0),c=k*a,this.calculatedWidth=l=I(k*Math.min(b,1)-c),l<d&&(c=(k-d+l)*a,l=d),d=Math.floor(c+this.xOffset+this.yOffset),k=l/2-.5,this.from=a,this.to=b,g?(this.scrollbarGroup[m]({translateY:d}),this.scrollbar[m]({height:l}),this.scrollbarRifles[m]({translateY:k}),this.scrollbarTop=d,this.scrollbarLeft=0):(this.scrollbarGroup[m]({translateX:d}),
this.scrollbar[m]({width:l}),this.scrollbarRifles[m]({translateX:k}),this.scrollbarLeft=d,this.scrollbarTop=0),12>=l?this.scrollbarRifles.hide():this.scrollbarRifles.show(!0),!1===e.showFull&&(0>=a&&1<=b?this.group.hide():this.group.show()),this.rendered=!0)},initEvents:function(){var a=this;a.mouseMoveHandler=function(b){var e=a.chart.pointer.normalize(b),g=a.options.vertical?"chartY":"chartX",d=a.initPositions;!a.grabbedCenter||b.touches&&0===b.touches[0][g]||(e=a.cursorToScrollbarPosition(e)[g],
g=a[g],g=e-g,a.hasDragged=!0,a.updatePosition(d[0]+g,d[1]+g),a.hasDragged&&q(a,"changed",{from:a.from,to:a.to,trigger:"scrollbar",DOMType:b.type,DOMEvent:b}))};a.mouseUpHandler=function(b){a.hasDragged&&q(a,"changed",{from:a.from,to:a.to,trigger:"scrollbar",DOMType:b.type,DOMEvent:b});a.grabbedCenter=a.hasDragged=a.chartX=a.chartY=null};a.mouseDownHandler=function(b){b=a.chart.pointer.normalize(b);b=a.cursorToScrollbarPosition(b);a.chartX=b.chartX;a.chartY=b.chartY;a.initPositions=[a.from,a.to];a.grabbedCenter=
!0};a.buttonToMinClick=function(b){var e=I(a.to-a.from)*a.options.step;a.updatePosition(I(a.from-e),I(a.to-e));q(a,"changed",{from:a.from,to:a.to,trigger:"scrollbar",DOMEvent:b})};a.buttonToMaxClick=function(b){var e=(a.to-a.from)*a.options.step;a.updatePosition(a.from+e,a.to+e);q(a,"changed",{from:a.from,to:a.to,trigger:"scrollbar",DOMEvent:b})};a.trackClick=function(b){var e=a.chart.pointer.normalize(b),g=a.to-a.from,d=a.y+a.scrollbarTop,k=a.x+a.scrollbarLeft;a.options.vertical&&e.chartY>d||!a.options.vertical&&
e.chartX>k?a.updatePosition(a.from+g,a.to+g):a.updatePosition(a.from-g,a.to-g);q(a,"changed",{from:a.from,to:a.to,trigger:"scrollbar",DOMEvent:b})}},cursorToScrollbarPosition:function(a){var b=this.options,b=b.minWidth>this.calculatedWidth?b.minWidth:0;return{chartX:(a.chartX-this.x-this.xOffset)/(this.barWidth-b),chartY:(a.chartY-this.y-this.yOffset)/(this.barWidth-b)}},updatePosition:function(a,b){1<b&&(a=I(1-I(b-a)),b=1);0>a&&(b=I(b-a),a=0);this.from=a;this.to=b},update:function(a){this.destroy();
this.init(this.chart.renderer,p(!0,this.options,a),this.chart)},addEvents:function(){var a=this.options.inverted?[1,0]:[0,1],b=this.scrollbarButtons,f=this.scrollbarGroup.element,g=this.mouseDownHandler,d=this.mouseMoveHandler,k=this.mouseUpHandler,a=[[b[a[0]].element,"click",this.buttonToMinClick],[b[a[1]].element,"click",this.buttonToMaxClick],[this.track.element,"click",this.trackClick],[f,"mousedown",g],[z,"mousemove",d],[z,"mouseup",k]];e&&a.push([f,"touchstart",g],[z,"touchmove",d],[z,"touchend",
k]);t(a,function(a){D.apply(null,a)});this._events=a},removeEvents:function(){t(this._events,function(a){k.apply(null,a)});this._events=void 0},destroy:function(){var a=this.chart.scroller;this.removeEvents();t(["track","scrollbarRifles","scrollbar","scrollbarGroup","group"],function(a){this[a]&&this[a].destroy&&(this[a]=this[a].destroy())},this);a&&(a.scrollbar=null,m(a.scrollbarButtons))}};l(H.prototype,"init",function(a){var b=this;a.apply(b,[].slice.call(arguments,1));b.options.scrollbar&&b.options.scrollbar.enabled&&
(b.options.scrollbar.vertical=!b.horiz,b.options.startOnTick=b.options.endOnTick=!1,b.scrollbar=new E(b.chart.renderer,b.options.scrollbar,b.chart),D(b.scrollbar,"changed",function(a){var e=Math.min(w(b.options.min,b.min),b.min,b.dataMin),d=Math.max(w(b.options.max,b.max),b.max,b.dataMax)-e,f;b.horiz&&!b.reversed||!b.horiz&&b.reversed?(f=e+d*this.to,e+=d*this.from):(f=e+d*(1-this.from),e+=d*(1-this.to));b.setExtremes(e,f,!0,!1,a)}))});l(H.prototype,"render",function(a){var b=Math.min(w(this.options.min,
this.min),this.min,this.dataMin),e=Math.max(w(this.options.max,this.max),this.max,this.dataMax),g=this.scrollbar,d;a.apply(this,[].slice.call(arguments,1));g&&(this.horiz?g.position(this.left,this.top+this.height+this.offset+2+(this.opposite?0:this.axisTitleMargin),this.width,this.height):g.position(this.left+this.width+2+this.offset+(this.opposite?this.axisTitleMargin:0),this.top,this.width,this.height),isNaN(b)||isNaN(e)||!n(this.min)||!n(this.max)?g.setRange(0,0):(d=(this.min-b)/(e-b),b=(this.max-
b)/(e-b),this.horiz&&!this.reversed||!this.horiz&&this.reversed?g.setRange(d,b):g.setRange(1-b,1-d)))});l(H.prototype,"getOffset",function(a){var b=this.horiz?2:1,e=this.scrollbar;a.apply(this,[].slice.call(arguments,1));e&&(this.chart.axisOffset[b]+=e.size+e.options.margin)});l(H.prototype,"destroy",function(a){this.scrollbar&&(this.scrollbar=this.scrollbar.destroy());a.apply(this,[].slice.call(arguments,1))});a.Scrollbar=E})(K);(function(a){function E(a){this.init(a)}var D=a.addEvent,H=a.Axis,I=
a.Chart,v=a.color,n=a.defaultOptions,m=a.defined,z=a.destroyObjectProperties,t=a.doc,q=a.each,e=a.erase,b=a.error,p=a.extend,w=a.grep,k=a.hasTouch,l=a.isNumber,g=a.isObject,F=a.merge,r=a.pick,u=a.removeEvent,f=a.Scrollbar,B=a.Series,d=a.seriesTypes,x=a.wrap,c=a.swapXY,y=[].concat(a.defaultDataGroupingUnits),L=function(a){var b=w(arguments,l);if(b.length)return Math[a].apply(0,b)};y[4]=["day",[1,2,3,4]];y[5]=["week",[1,2,3]];d=void 0===d.areaspline?"line":"areaspline";p(n,{navigator:{height:40,margin:25,
maskInside:!0,handles:{backgroundColor:"#f2f2f2",borderColor:"#999999"},maskFill:v("#6685c2").setOpacity(.3).get(),outlineColor:"#cccccc",outlineWidth:1,series:{type:d,color:"#335cad",fillOpacity:.05,lineWidth:1,compare:null,dataGrouping:{approximation:"average",enabled:!0,groupPixelWidth:2,smoothed:!0,units:y},dataLabels:{enabled:!1,zIndex:2},id:"highcharts-navigator-series",className:"highcharts-navigator-series",lineColor:null,marker:{enabled:!1},pointRange:0,shadow:!1,threshold:null},xAxis:{className:"highcharts-navigator-xaxis",
tickLength:0,lineWidth:0,gridLineColor:"#e6e6e6",gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",style:{color:"#999999"},x:3,y:-4},crosshair:!1},yAxis:{className:"highcharts-navigator-yaxis",gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:.1,maxPadding:.1,labels:{enabled:!1},crosshair:!1,title:{text:null},tickLength:0,tickWidth:0}}});E.prototype={drawHandle:function(a,b,c,d){this.handles[b][d](c?{translateX:Math.round(this.left+this.height/2-8),translateY:Math.round(this.top+parseInt(a,
10)+.5)}:{translateX:Math.round(this.left+parseInt(a,10)),translateY:Math.round(this.top+this.height/2-8)})},getHandlePath:function(a){return c(["M",-4.5,.5,"L",3.5,.5,"L",3.5,15.5,"L",-4.5,15.5,"L",-4.5,.5,"M",-1.5,4,"L",-1.5,12,"M",.5,4,"L",.5,12],a)},drawOutline:function(a,b,c,d){var e=this.navigatorOptions.maskInside,f=this.outline.strokeWidth()/2,h=this.outlineHeight,g=this.scrollbarHeight,k=this.size,l=this.left-g,m=this.top;c?(l-=f,c=m+b+f,b=m+a+f,a=["M",l+h,m-g-f,"L",l+h,c,"L",l,c,"L",l,b,
"L",l+h,b,"L",l+h,m+k+g].concat(e?["M",l+h,c-f,"L",l+h,b+f]:[])):(a+=l+g-f,b+=l+g-f,m+=f,a=["M",l,m,"L",a,m,"L",a,m+h,"L",b,m+h,"L",b,m,"L",l+k+2*g,m].concat(e?["M",a-f,m,"L",b+f,m]:[]));this.outline[d]({d:a})},drawMasks:function(a,b,c,d){var e=this.left,f=this.top,h=this.height,g,k,l,m;c?(l=[e,e,e],m=[f,f+a,f+b],k=[h,h,h],g=[a,b-a,this.size-b]):(l=[e,e+a,e+b],m=[f,f,f],k=[a,b-a,this.size-b],g=[h,h,h]);q(this.shades,function(a,b){a[d]({x:l[b],y:m[b],width:k[b],height:g[b]})})},renderElements:function(){var a=
this,b=a.navigatorOptions,c=b.maskInside,d=a.chart,e=d.inverted,f=d.renderer,g;a.navigatorGroup=g=f.g("navigator").attr({zIndex:8,visibility:"hidden"}).add();var k={cursor:e?"ns-resize":"ew-resize"};q([!c,c,!c],function(c,d){a.shades[d]=f.rect().addClass("highcharts-navigator-mask"+(1===d?"-inside":"-outside")).attr({fill:c?b.maskFill:"transparent"}).css(1===d&&k).add(g)});a.outline=f.path().addClass("highcharts-navigator-outline").attr({"stroke-width":b.outlineWidth,stroke:b.outlineColor}).add(g);
q([0,1],function(c){a.handles[c]=f.path(a.getHandlePath(e)).attr({zIndex:7-c}).addClass("highcharts-navigator-handle highcharts-navigator-handle-"+["left","right"][c]).add(g);var d=b.handles;a.handles[c].attr({fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":1}).css(k)})},update:function(a){this.destroy();F(!0,this.chart.options.navigator,this.options,a);this.init(this.chart)},render:function(a,b,c,d){var e=this.chart,f,h,g=this.scrollbarHeight,k,n=this.xAxis;f=this.navigatorEnabled;var p,
q=this.rendered;h=e.inverted;var A=e.xAxis[0].minRange;if(!this.hasDragged||m(c)){if(!l(a)||!l(b))if(q)c=0,d=n.width;else return;this.left=r(n.left,e.plotLeft+g);h?(this.size=p=k=r(n.len,e.plotHeight-2*g),e=g):(this.size=p=k=r(n.len,e.plotWidth-2*g),e=k+2*g);c=r(c,n.toPixels(a,!0));d=r(d,n.toPixels(b,!0));l(c)&&Infinity!==Math.abs(c)||(c=0,d=e);a=n.toValue(c,!0);b=n.toValue(d,!0);if(Math.abs(b-a)<A)if(this.grabbedLeft)c=n.toPixels(b-A,!0);else if(this.grabbedRight)d=n.toPixels(a+A,!0);else return;
this.zoomedMax=Math.min(Math.max(c,d,0),p);this.zoomedMin=Math.min(Math.max(this.fixedWidth?this.zoomedMax-this.fixedWidth:Math.min(c,d),0),p);this.range=this.zoomedMax-this.zoomedMin;p=Math.round(this.zoomedMax);c=Math.round(this.zoomedMin);f&&(this.navigatorGroup.attr({visibility:"visible"}),q=q&&!this.hasDragged?"animate":"attr",this.drawMasks(c,p,h,q),this.drawOutline(c,p,h,q),this.drawHandle(c,0,h,q),this.drawHandle(p,1,h,q));this.scrollbar&&(h?(h=this.top-g,f=this.left-g+(f?0:this.height),g=
k+2*g):(h=this.top+(f?this.height:-g),f=this.left-g),this.scrollbar.position(f,h,e,g),this.scrollbar.setRange(c/k,p/k));this.rendered=!0}},addMouseEvents:function(){var a=this,b=a.chart,c=b.container,d=[],e,f;a.mouseMoveHandler=e=function(b){a.onMouseMove(b)};a.mouseUpHandler=f=function(b){a.onMouseUp(b)};d=a.getPartsEvents("mousedown");d.push(D(c,"mousemove",e),D(t,"mouseup",f));k&&(d.push(D(c,"touchmove",e),D(t,"touchend",f)),d.concat(a.getPartsEvents("touchstart")));a.eventsToUnbind=d;a.series&&
a.series[0]&&d.push(D(a.series[0].xAxis,"foundExtremes",function(){b.navigator.modifyNavigatorAxisExtremes()}))},getPartsEvents:function(a){var b=this,c=[];q(["shades","handles"],function(d){q(b[d],function(e,f){c.push(D(e.element,a,function(a){b[d+"Mousedown"](a,f)}))})});return c},shadesMousedown:function(a,b){a=this.chart.pointer.normalize(a);var c=this.chart,d=this.xAxis,e=this.zoomedMin,f=this.left,g=this.size,k=this.range,l=a.chartX,m;c.inverted&&(l=a.chartY,f=this.top);1===b?(this.grabbedCenter=
l,this.fixedWidth=k,this.dragOffset=l-e):(a=l-f-k/2,0===b?a=Math.max(0,a):2===b&&a+k>=g&&(a=g-k,m=this.getUnionExtremes().dataMax),a!==e&&(this.fixedWidth=k,b=d.toFixedRange(a,a+k,null,m),c.xAxis[0].setExtremes(Math.min(b.min,b.max),Math.max(b.min,b.max),!0,null,{trigger:"navigator"})))},handlesMousedown:function(a,b){this.chart.pointer.normalize(a);a=this.chart;var c=a.xAxis[0],d=a.inverted&&!c.reversed||!a.inverted&&c.reversed;0===b?(this.grabbedLeft=!0,this.otherHandlePos=this.zoomedMax,this.fixedExtreme=
d?c.min:c.max):(this.grabbedRight=!0,this.otherHandlePos=this.zoomedMin,this.fixedExtreme=d?c.max:c.min);a.fixedRange=null},onMouseMove:function(a){var b=this,c=b.chart,d=b.left,e=b.navigatorSize,f=b.range,g=b.dragOffset,k=c.inverted;a.touches&&0===a.touches[0].pageX||(a=c.pointer.normalize(a),c=a.chartX,k&&(d=b.top,c=a.chartY),b.grabbedLeft?(b.hasDragged=!0,b.render(0,0,c-d,b.otherHandlePos)):b.grabbedRight?(b.hasDragged=!0,b.render(0,0,b.otherHandlePos,c-d)):b.grabbedCenter&&(b.hasDragged=!0,c<
g?c=g:c>e+g-f&&(c=e+g-f),b.render(0,0,c-g,c-g+f)),b.hasDragged&&b.scrollbar&&b.scrollbar.options.liveRedraw&&(a.DOMType=a.type,setTimeout(function(){b.onMouseUp(a)},0)))},onMouseUp:function(a){var b=this.chart,c=this.xAxis,d,e,f=a.DOMEvent||a;if(this.hasDragged||"scrollbar"===a.trigger)this.zoomedMin===this.otherHandlePos?d=this.fixedExtreme:this.zoomedMax===this.otherHandlePos&&(e=this.fixedExtreme),this.zoomedMax===this.navigatorSize&&(e=this.getUnionExtremes().dataMax),c=c.toFixedRange(this.zoomedMin,
this.zoomedMax,d,e),m(c.min)&&b.xAxis[0].setExtremes(Math.min(c.min,c.max),Math.max(c.min,c.max),!0,this.hasDragged?!1:null,{trigger:"navigator",triggerOp:"navigator-drag",DOMEvent:f});"mousemove"!==a.DOMType&&(this.grabbedLeft=this.grabbedRight=this.grabbedCenter=this.fixedWidth=this.fixedExtreme=this.otherHandlePos=this.hasDragged=this.dragOffset=null)},removeEvents:function(){this.eventsToUnbind&&(q(this.eventsToUnbind,function(a){a()}),this.eventsToUnbind=void 0);this.removeBaseSeriesEvents()},
removeBaseSeriesEvents:function(){var a=this.baseSeries||[];this.navigatorEnabled&&a[0]&&!1!==this.navigatorOptions.adaptToUpdatedData&&(q(a,function(a){u(a,"updatedData",this.updatedDataHandler)},this),a[0].xAxis&&u(a[0].xAxis,"foundExtremes",this.modifyBaseAxisExtremes))},init:function(a){var b=a.options,c=b.navigator,d=c.enabled,e=b.scrollbar,g=e.enabled,b=d?c.height:0,k=g?e.height:0;this.handles=[];this.shades=[];this.chart=a;this.setBaseSeries();this.height=b;this.scrollbarHeight=k;this.scrollbarEnabled=
g;this.navigatorEnabled=d;this.navigatorOptions=c;this.scrollbarOptions=e;this.outlineHeight=b+k;var l=this,d=l.baseSeries,e=a.xAxis.length,g=a.yAxis.length,m=d&&d[0]&&d[0].xAxis||a.xAxis[0];a.extraMargin={type:c.opposite?"plotTop":"marginBottom",value:l.outlineHeight+c.margin};a.inverted&&(a.extraMargin.type=c.opposite?"marginRight":"plotLeft");a.isDirtyBox=!0;l.navigatorEnabled?(l.xAxis=new H(a,F({breaks:m.options.breaks,ordinal:m.options.ordinal},c.xAxis,{id:"navigator-x-axis",yAxis:"navigator-y-axis",
isX:!0,type:"datetime",index:e,offset:0,keepOrdinalPadding:!0,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1},a.inverted?{offsets:[k,0,-k,0],width:b}:{offsets:[0,-k,0,k],height:b})),l.yAxis=new H(a,F(c.yAxis,{id:"navigator-y-axis",alignTicks:!1,offset:0,index:g,zoomEnabled:!1},a.inverted?{width:b}:{height:b})),d||c.series.data?l.addBaseSeries():0===a.series.length&&x(a,"redraw",function(b,c){0<a.series.length&&!l.series&&(l.setBaseSeries(),a.redraw=b);b.call(a,c)}),l.renderElements(),
l.addMouseEvents()):l.xAxis={translate:function(b,c){var d=a.xAxis[0],e=d.getExtremes(),f=a.plotWidth-2*k,h=L("min",d.options.min,e.dataMin),d=L("max",d.options.max,e.dataMax)-h;return c?b*d/f+h:f*(b-h)/d},toPixels:function(a){return this.translate(a)},toValue:function(a){return this.translate(a,!0)},toFixedRange:H.prototype.toFixedRange,fake:!0};a.options.scrollbar.enabled&&(a.scrollbar=l.scrollbar=new f(a.renderer,F(a.options.scrollbar,{margin:l.navigatorEnabled?0:10,vertical:a.inverted}),a),D(l.scrollbar,
"changed",function(b){var c=l.size,d=c*this.to,c=c*this.from;l.hasDragged=l.scrollbar.hasDragged;l.render(0,0,c,d);(a.options.scrollbar.liveRedraw||"mousemove"!==b.DOMType)&&setTimeout(function(){l.onMouseUp(b)})}));l.addBaseSeriesEvents();l.addChartEvents()},getUnionExtremes:function(a){var b=this.chart.xAxis[0],c=this.xAxis,d=c.options,e=b.options,f;a&&null===b.dataMin||(f={dataMin:r(d&&d.min,L("min",e.min,b.dataMin,c.dataMin,c.min)),dataMax:r(d&&d.max,L("max",e.max,b.dataMax,c.dataMax,c.max))});
return f},setBaseSeries:function(a){var b=this.chart,c=this.baseSeries=[];a=a||b.options&&b.options.navigator.baseSeries||0;this.series&&(this.removeBaseSeriesEvents(),q(this.series,function(a){a.destroy()}));q(b.series||[],function(b,d){(b.options.showInNavigator||(d===a||b.options.id===a)&&!1!==b.options.showInNavigator)&&c.push(b)});this.xAxis&&!this.xAxis.fake&&this.addBaseSeries()},addBaseSeries:function(){var a=this,b=a.chart,c=a.series=[],d=a.baseSeries,e,f,g=a.navigatorOptions.series,k,l=
{enableMouseTracking:!1,index:null,group:"nav",padXAxis:!1,xAxis:"navigator-x-axis",yAxis:"navigator-y-axis",showInLegend:!1,stacking:!1,isInternal:!0,visible:!0};d?q(d,function(d,h){l.name="Navigator "+(h+1);e=d.options||{};k=e.navigatorOptions||{};f=F(e,l,g,k);h=k.data||g.data;a.hasNavigatorData=a.hasNavigatorData||!!h;f.data=h||e.data&&e.data.slice(0);d.navigatorSeries=b.initSeries(f);c.push(d.navigatorSeries)}):(f=F(g,l),f.data=g.data,a.hasNavigatorData=!!f.data,c.push(b.initSeries(f)));this.addBaseSeriesEvents()},
addBaseSeriesEvents:function(){var a=this,b=a.baseSeries||[];b[0]&&b[0].xAxis&&D(b[0].xAxis,"foundExtremes",this.modifyBaseAxisExtremes);!1!==this.navigatorOptions.adaptToUpdatedData&&q(b,function(b){b.xAxis&&(D(b,"updatedData",this.updatedDataHandler),b.userOptions.events=p(b.userOptions.event,{updatedData:this.updatedDataHandler}));D(b,"remove",function(){this.navigatorSeries&&(e(a.series,this.navigatorSeries),this.navigatorSeries.remove(),delete this.navigatorSeries)})},this)},modifyNavigatorAxisExtremes:function(){var a=
this.xAxis,b;a.getExtremes&&(!(b=this.getUnionExtremes(!0))||b.dataMin===a.min&&b.dataMax===a.max||(a.min=b.dataMin,a.max=b.dataMax))},modifyBaseAxisExtremes:function(){var a=this.chart.navigator,b=this.getExtremes(),c=b.dataMin,d=b.dataMax,b=b.max-b.min,e=a.stickToMin,f=a.stickToMax,g,k,m=a.series&&a.series[0],n=!!this.setExtremes;this.eventArgs&&"rangeSelectorButton"===this.eventArgs.trigger||(e&&(k=c,g=k+b),f&&(g=d,e||(k=Math.max(g-b,m&&m.xData?m.xData[0]:-Number.MAX_VALUE))),n&&(e||f)&&l(k)&&
(this.min=this.userMin=k,this.max=this.userMax=g));a.stickToMin=a.stickToMax=null},updatedDataHandler:function(){var a=this.chart.navigator,b=this.navigatorSeries;a.stickToMin=l(this.xAxis.min)&&this.xAxis.min<=this.xData[0];a.stickToMax=Math.round(a.zoomedMax)>=Math.round(a.size);b&&!a.hasNavigatorData&&(b.options.pointStart=this.xData[0],b.setData(this.options.data,!1,null,!1))},addChartEvents:function(){D(this.chart,"redraw",function(){var a=this.navigator,b=a&&(a.baseSeries&&a.baseSeries[0]&&
a.baseSeries[0].xAxis||a.scrollbar&&this.xAxis[0]);b&&a.render(b.min,b.max)})},destroy:function(){this.removeEvents();this.xAxis&&(e(this.chart.xAxis,this.xAxis),e(this.chart.axes,this.xAxis));this.yAxis&&(e(this.chart.yAxis,this.yAxis),e(this.chart.axes,this.yAxis));q(this.series||[],function(a){a.destroy&&a.destroy()});q("series xAxis yAxis shades outline scrollbarTrack scrollbarRifles scrollbarGroup scrollbar navigatorGroup rendered".split(" "),function(a){this[a]&&this[a].destroy&&this[a].destroy();
this[a]=null},this);q([this.handles],function(a){z(a)},this)}};a.Navigator=E;x(H.prototype,"zoom",function(a,b,c){var d=this.chart,e=d.options,f=e.chart.zoomType,h=e.navigator,e=e.rangeSelector,g;this.isXAxis&&(h&&h.enabled||e&&e.enabled)&&("x"===f?d.resetZoomButton="blocked":"y"===f?g=!1:"xy"===f&&(d=this.previousZoom,m(b)?this.previousZoom=[this.min,this.max]:d&&(b=d[0],c=d[1],delete this.previousZoom)));return void 0!==g?g:a.call(this,b,c)});x(I.prototype,"init",function(a,b,c){D(this,"beforeRender",
function(){var a=this.options;if(a.navigator.enabled||a.scrollbar.enabled)this.scroller=this.navigator=new E(this)});a.call(this,b,c)});x(I.prototype,"setChartSize",function(a){var b=this.legend,c=this.navigator,d,e,f,g;a.apply(this,[].slice.call(arguments,1));c&&(e=b.options,f=c.xAxis,g=c.yAxis,d=c.scrollbarHeight,this.inverted?(c.left=c.navigatorOptions.opposite?this.chartWidth-d-c.height:this.spacing[3]+d,c.top=this.plotTop+d):(c.left=this.plotLeft+d,c.top=c.navigatorOptions.top||this.chartHeight-
c.height-d-this.spacing[2]-("bottom"===e.verticalAlign&&e.enabled&&!e.floating?b.legendHeight+r(e.margin,10):0)),f&&g&&(this.inverted?f.options.left=g.options.left=c.left:f.options.top=g.options.top=c.top,f.setAxisSize(),g.setAxisSize()))});x(B.prototype,"addPoint",function(a,c,d,e,f){var h=this.options.turboThreshold;h&&this.xData.length>h&&g(c,!0)&&this.chart.navigator&&b(20,!0);a.call(this,c,d,e,f)});x(I.prototype,"addSeries",function(a,b,c,d){a=a.call(this,b,!1,d);this.navigator&&this.navigator.setBaseSeries();
r(c,!0)&&this.redraw();return a});x(B.prototype,"update",function(a,b,c){a.call(this,b,!1);this.chart.navigator&&this.chart.navigator.setBaseSeries();r(c,!0)&&this.chart.redraw()});I.prototype.callbacks.push(function(a){var b=a.navigator;b&&(a=a.xAxis[0].getExtremes(),b.render(a.min,a.max))})})(K);(function(a){function E(a){this.init(a)}var D=a.addEvent,H=a.Axis,I=a.Chart,v=a.css,n=a.createElement,m=a.dateFormat,z=a.defaultOptions,t=z.global.useUTC,q=a.defined,e=a.destroyObjectProperties,b=a.discardElement,
p=a.each,w=a.extend,k=a.fireEvent,l=a.Date,g=a.isNumber,F=a.merge,r=a.pick,u=a.pInt,f=a.splat,B=a.wrap;w(z,{rangeSelector:{buttonTheme:{"stroke-width":0,width:28,height:18,padding:2,zIndex:7},height:35,inputPosition:{align:"right"},labelStyle:{color:"#666666"}}});z.lang=F(z.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From",rangeSelectorTo:"To"});E.prototype={clickButton:function(a,b){var c=this,d=c.chart,e=c.buttonOptions[a],k=d.xAxis[0],l=d.scroller&&d.scroller.getUnionExtremes()||k||{},h=
l.dataMin,m=l.dataMax,n,q=k&&Math.round(Math.min(k.max,r(m,k.max))),x=e.type,u,l=e._range,v,w,z,B=e.dataGrouping;if(null!==h&&null!==m){d.fixedRange=l;B&&(this.forcedDataGrouping=!0,H.prototype.setDataGrouping.call(k||{chart:this.chart},B,!1));if("month"===x||"year"===x)k?(x={range:e,max:q,dataMin:h,dataMax:m},n=k.minFromRange.call(x),g(x.newMax)&&(q=x.newMax)):l=e;else if(l)n=Math.max(q-l,h),q=Math.min(n+l,m);else if("ytd"===x)if(k)void 0===m&&(h=Number.MAX_VALUE,m=Number.MIN_VALUE,p(d.series,function(a){a=
a.xData;h=Math.min(a[0],h);m=Math.max(a[a.length-1],m)}),b=!1),q=c.getYTDExtremes(m,h,t),n=v=q.min,q=q.max;else{D(d,"beforeRender",function(){c.clickButton(a)});return}else"all"===x&&k&&(n=h,q=m);c.setSelected(a);k?k.setExtremes(n,q,r(b,1),null,{trigger:"rangeSelectorButton",rangeSelectorButton:e}):(u=f(d.options.xAxis)[0],z=u.range,u.range=l,w=u.min,u.min=v,D(d,"load",function(){u.range=z;u.min=w}))}},setSelected:function(a){this.selected=this.options.selected=a},defaultButtons:[{type:"month",count:1,
text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}],init:function(a){var b=this,c=a.options.rangeSelector,d=c.buttons||[].concat(b.defaultButtons),e=c.selected,f=function(){var a=b.minInput,c=b.maxInput;a&&a.blur&&k(a,"blur");c&&c.blur&&k(c,"blur")};b.chart=a;b.options=c;b.buttons=[];a.extraTopMargin=c.height;b.buttonOptions=d;this.unMouseDown=D(a.container,"mousedown",f);this.unResize=D(a,"resize",
f);p(d,b.computeButtonRange);void 0!==e&&d[e]&&this.clickButton(e,!1);D(a,"load",function(){D(a.xAxis[0],"setExtremes",function(c){this.max-this.min!==a.fixedRange&&"rangeSelectorButton"!==c.trigger&&"updatedData"!==c.trigger&&b.forcedDataGrouping&&this.setDataGrouping(!1,!1)})})},updateButtonStates:function(){var a=this.chart,b=a.xAxis[0],c=Math.round(b.max-b.min),e=!b.hasVisibleSeries,a=a.scroller&&a.scroller.getUnionExtremes()||b,f=a.dataMin,k=a.dataMax,a=this.getYTDExtremes(k,f,t),l=a.min,h=a.max,
m=this.selected,n=g(m),q=this.options.allButtonsEnabled,r=this.buttons;p(this.buttonOptions,function(a,d){var g=a._range,p=a.type,t=a.count||1;a=r[d];var y=0;d=d===m;var u=g>k-f,x=g<b.minRange,v=!1,w=!1,g=g===c;("month"===p||"year"===p)&&c>=864E5*{month:28,year:365}[p]*t&&c<=864E5*{month:31,year:366}[p]*t?g=!0:"ytd"===p?(g=h-l===c,v=!d):"all"===p&&(g=b.max-b.min>=k-f,w=!d&&n&&g);p=!q&&(u||x||w||e);g=d&&g||g&&!n&&!v;p?y=3:g&&(n=!0,y=2);a.state!==y&&a.setState(y)})},computeButtonRange:function(a){var b=
a.type,c=a.count||1,d={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(d[b])a._range=d[b]*c;else if("month"===b||"year"===b)a._range=864E5*{month:30,year:365}[b]*c},setInputValue:function(a,b){var c=this.chart.options.rangeSelector,d=this[a+"Input"];q(b)&&(d.previousValue=d.HCTime,d.HCTime=b);d.value=m(c.inputEditDateFormat||"%Y-%m-%d",d.HCTime);this[a+"DateBox"].attr({text:m(c.inputDateFormat||"%b %e, %Y",d.HCTime)})},showInput:function(a){var b=this.inputGroup,c=this[a+"DateBox"];
v(this[a+"Input"],{left:b.translateX+c.x+"px",top:b.translateY+"px",width:c.width-2+"px",height:c.height-2+"px",border:"2px solid silver"})},hideInput:function(a){v(this[a+"Input"],{border:0,width:"1px",height:"1px"});this.setInputValue(a)},drawInput:function(a){function b(){var a=m.value,b=(k.inputDateParser||Date.parse)(a),e=d.xAxis[0],f=d.scroller&&d.scroller.xAxis?d.scroller.xAxis:e,h=f.dataMin,f=f.dataMax;b!==m.previousValue&&(m.previousValue=b,g(b)||(b=a.split("-"),b=Date.UTC(u(b[0]),u(b[1])-
1,u(b[2]))),g(b)&&(t||(b+=6E4*(new Date).getTimezoneOffset()),l?b>c.maxInput.HCTime?b=void 0:b<h&&(b=h):b<c.minInput.HCTime?b=void 0:b>f&&(b=f),void 0!==b&&e.setExtremes(l?b:e.min,l?e.max:b,void 0,void 0,{trigger:"rangeSelectorInput"})))}var c=this,d=c.chart,e=d.renderer.style||{},f=d.renderer,k=d.options.rangeSelector,h=c.div,l="min"===a,m,p,q=this.inputGroup;this[a+"Label"]=p=f.label(z.lang[l?"rangeSelectorFrom":"rangeSelectorTo"],this.inputGroup.offset).addClass("highcharts-range-label").attr({padding:2}).add(q);
q.offset+=p.width+5;this[a+"DateBox"]=f=f.label("",q.offset).addClass("highcharts-range-input").attr({padding:2,width:k.inputBoxWidth||90,height:k.inputBoxHeight||17,stroke:k.inputBoxBorderColor||"#cccccc","stroke-width":1,"text-align":"center"}).on("click",function(){c.showInput(a);c[a+"Input"].focus()}).add(q);q.offset+=f.width+(l?10:0);this[a+"Input"]=m=n("input",{name:a,className:"highcharts-range-selector",type:"text"},{top:d.plotTop+"px"},h);p.css(F(e,k.labelStyle));f.css(F({color:"#333333"},
e,k.inputStyle));v(m,w({position:"absolute",border:0,width:"1px",height:"1px",padding:0,textAlign:"center",fontSize:e.fontSize,fontFamily:e.fontFamily,left:"-9em"},k.inputStyle));m.onfocus=function(){c.showInput(a)};m.onblur=function(){c.hideInput(a)};m.onchange=b;m.onkeypress=function(a){13===a.keyCode&&b()}},getPosition:function(){var a=this.chart,b=a.options.rangeSelector,a=r((b.buttonPosition||{}).y,a.plotTop-a.axisOffset[0]-b.height);return{buttonTop:a,inputTop:a-10}},getYTDExtremes:function(a,
b,c){var d=new l(a),e=d[l.hcGetFullYear]();c=c?l.UTC(e,0,1):+new l(e,0,1);b=Math.max(b||0,c);d=d.getTime();return{max:Math.min(a||d,d),min:b}},render:function(a,b){var c=this,d=c.chart,e=d.renderer,f=d.container,g=d.options,h=g.exporting&&!1!==g.exporting.enabled&&g.navigation&&g.navigation.buttonOptions,k=g.rangeSelector,l=c.buttons,g=z.lang,m=c.div,m=c.inputGroup,t=k.buttonTheme,u=k.buttonPosition||{},x=k.inputEnabled,v=t&&t.states,B=d.plotLeft,D,E=this.getPosition(),F=c.group,H=c.rendered;!1!==
k.enabled&&(H||(c.group=F=e.g("range-selector-buttons").add(),c.zoomText=e.text(g.rangeSelectorZoom,r(u.x,B),15).css(k.labelStyle).add(F),D=r(u.x,B)+c.zoomText.getBBox().width+5,p(c.buttonOptions,function(a,b){l[b]=e.button(a.text,D,0,function(){c.clickButton(b);c.isActive=!0},t,v&&v.hover,v&&v.select,v&&v.disabled).attr({"text-align":"center"}).add(F);D+=l[b].width+r(k.buttonSpacing,5)}),!1!==x&&(c.div=m=n("div",null,{position:"relative",height:0,zIndex:1}),f.parentNode.insertBefore(m,f),c.inputGroup=
m=e.g("input-group").add(),m.offset=0,c.drawInput("min"),c.drawInput("max"))),c.updateButtonStates(),F[H?"animate":"attr"]({translateY:E.buttonTop}),!1!==x&&(m.align(w({y:E.inputTop,width:m.offset,x:h&&E.inputTop<(h.y||0)+h.height-d.spacing[0]?-40:0},k.inputPosition),!0,d.spacingBox),q(x)||(d=F.getBBox(),m[m.alignAttr.translateX<d.x+d.width+10?"hide":"show"]()),c.setInputValue("min",a),c.setInputValue("max",b)),c.rendered=!0)},update:function(a){var b=this.chart;F(!0,b.options.rangeSelector,a);this.destroy();
this.init(b)},destroy:function(){var a=this.minInput,f=this.maxInput,c;this.unMouseDown();this.unResize();e(this.buttons);a&&(a.onfocus=a.onblur=a.onchange=null);f&&(f.onfocus=f.onblur=f.onchange=null);for(c in this)this[c]&&"chart"!==c&&(this[c].destroy?this[c].destroy():this[c].nodeType&&b(this[c])),this[c]!==E.prototype[c]&&(this[c]=null)}};H.prototype.toFixedRange=function(a,b,c,e){var d=this.chart&&this.chart.fixedRange;a=r(c,this.translate(a,!0,!this.horiz));b=r(e,this.translate(b,!0,!this.horiz));
c=d&&(b-a)/d;.7<c&&1.3>c&&(e?a=b-d:b=a+d);g(a)||(a=b=void 0);return{min:a,max:b}};H.prototype.minFromRange=function(){var a=this.range,b={month:"Month",year:"FullYear"}[a.type],c,e=this.max,f,k,l=function(a,c){var d=new Date(a);d["set"+b](d["get"+b]()+c);return d.getTime()-a};g(a)?(c=e-a,k=a):(c=e+l(e,-a.count),this.chart&&(this.chart.fixedRange=e-c));f=r(this.dataMin,Number.MIN_VALUE);g(c)||(c=f);c<=f&&(c=f,void 0===k&&(k=l(c,a.count)),this.newMax=Math.min(c+k,this.dataMax));g(e)||(c=void 0);return c};
B(I.prototype,"init",function(a,b,c){D(this,"init",function(){this.options.rangeSelector.enabled&&(this.rangeSelector=new E(this))});a.call(this,b,c)});I.prototype.callbacks.push(function(a){function b(){c=a.xAxis[0].getExtremes();g(c.min)&&d.render(c.min,c.max)}var c,d=a.rangeSelector,e,f;d&&(f=D(a.xAxis[0],"afterSetExtremes",function(a){d.render(a.min,a.max)}),e=D(a,"redraw",b),b());D(a,"destroy",function(){d&&(e(),f())})});a.RangeSelector=E})(K);(function(a){var E=a.arrayMax,D=a.arrayMin,H=a.Axis,
I=a.Chart,v=a.defined,n=a.each,m=a.extend,z=a.format,t=a.inArray,q=a.isNumber,e=a.isString,b=a.map,p=a.merge,w=a.pick,k=a.Point,l=a.Renderer,g=a.Series,F=a.splat,r=a.SVGRenderer,u=a.VMLRenderer,f=a.wrap,B=g.prototype,d=B.init,x=B.processData,c=k.prototype.tooltipFormatter;a.StockChart=a.stockChart=function(c,d,f){var g=e(c)||c.nodeName,h=arguments[g?1:0],k=h.series,l=a.getOptions(),m,n=w(h.navigator&&h.navigator.enabled,l.navigator.enabled,!0),q=n?{startOnTick:!1,endOnTick:!1}:null,r={marker:{enabled:!1,
radius:2}},t={shadow:!1,borderWidth:0};h.xAxis=b(F(h.xAxis||{}),function(a){return p({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},labels:{overflow:"justify"},showLastLabel:!0},l.xAxis,a,{type:"datetime",categories:null},q)});h.yAxis=b(F(h.yAxis||{}),function(a){m=w(a.opposite,!0);return p({labels:{y:-2},opposite:m,showLastLabel:!1,title:{text:null}},l.yAxis,a)});h.series=null;h=p({chart:{panning:!0,pinchType:"x"},navigator:{enabled:n},scrollbar:{enabled:w(l.scrollbar.enabled,!0)},rangeSelector:{enabled:w(l.rangeSelector.enabled,
!0)},title:{text:null},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:r,spline:r,area:r,areaspline:r,arearange:r,areasplinerange:r,column:t,columnrange:t,candlestick:t,ohlc:t}},h,{isStock:!0});h.series=k;return g?new I(c,h,f):new I(h,d)};f(H.prototype,"autoLabelAlign",function(a){var b=this.chart,c=this.options,b=b._labelPanes=b._labelPanes||{},d=this.options.labels;return this.chart.options.isStock&&"yAxis"===this.coll&&(c=c.top+","+c.height,!b[c]&&d.enabled)?(15===d.x&&
(d.x=0),void 0===d.align&&(d.align="right"),b[c]=1,"right"):a.call(this,[].slice.call(arguments,1))});f(H.prototype,"getPlotLinePath",function(a,c,d,f,g,k){var h=this,l=this.isLinked&&!this.series?this.linkedParent.series:this.series,m=h.chart,p=m.renderer,r=h.left,u=h.top,y,x,z,A,B=[],D=[],E,G;if("colorAxis"===h.coll)return a.apply(this,[].slice.call(arguments,1));D=function(a){var c="xAxis"===a?"yAxis":"xAxis";a=h.options[c];return q(a)?[m[c][a]]:e(a)?[m.get(a)]:b(l,function(a){return a[c]})}(h.coll);
n(h.isXAxis?m.yAxis:m.xAxis,function(a){if(v(a.options.id)?-1===a.options.id.indexOf("navigator"):1){var b=a.isXAxis?"yAxis":"xAxis",b=v(a.options[b])?m[b][a.options[b]]:m[b][0];h===b&&D.push(a)}});E=D.length?[]:[h.isXAxis?m.yAxis[0]:m.xAxis[0]];n(D,function(a){-1===t(a,E)&&E.push(a)});G=w(k,h.translate(c,null,null,f));q(G)&&(h.horiz?n(E,function(a){var b;x=a.pos;A=x+a.len;y=z=Math.round(G+h.transB);if(y<r||y>r+h.width)g?y=z=Math.min(Math.max(r,y),r+h.width):b=!0;b||B.push("M",y,x,"L",z,A)}):n(E,
function(a){var b;y=a.pos;z=y+a.len;x=A=Math.round(u+h.height-G);if(x<u||x>u+h.height)g?x=A=Math.min(Math.max(u,x),h.top+h.height):b=!0;b||B.push("M",y,x,"L",z,A)}));return 0<B.length?p.crispPolyLine(B,d||1):null});H.prototype.getPlotBandPath=function(a,b){b=this.getPlotLinePath(b,null,null,!0);a=this.getPlotLinePath(a,null,null,!0);var c=[],d;if(a&&b)if(a.toString()===b.toString())c=a,c.flat=!0;else for(d=0;d<a.length;d+=6)c.push("M",a[d+1],a[d+2],"L",a[d+4],a[d+5],b[d+4],b[d+5],b[d+1],b[d+2],"z");
else c=null;return c};r.prototype.crispPolyLine=function(a,b){var c;for(c=0;c<a.length;c+=6)a[c+1]===a[c+4]&&(a[c+1]=a[c+4]=Math.round(a[c+1])-b%2/2),a[c+2]===a[c+5]&&(a[c+2]=a[c+5]=Math.round(a[c+2])+b%2/2);return a};l===u&&(u.prototype.crispPolyLine=r.prototype.crispPolyLine);f(H.prototype,"hideCrosshair",function(a,b){a.call(this,b);this.crossLabel&&(this.crossLabel=this.crossLabel.hide())});f(H.prototype,"drawCrosshair",function(a,b,c){var d,e;a.call(this,b,c);if(v(this.crosshair.label)&&this.crosshair.label.enabled&&
this.cross){a=this.chart;var f=this.options.crosshair.label,g=this.horiz;d=this.opposite;e=this.left;var k=this.top,l=this.crossLabel,n,p=f.format,q="",r="inside"===this.options.tickPosition,t=!1!==this.crosshair.snap,u=0;b||(b=this.cross&&this.cross.e);n=g?"center":d?"right"===this.labelAlign?"right":"left":"left"===this.labelAlign?"left":"center";l||(l=this.crossLabel=a.renderer.label(null,null,null,f.shape||"callout").addClass("highcharts-crosshair-label"+(this.series[0]&&" highcharts-color-"+
this.series[0].colorIndex)).attr({align:f.align||n,padding:w(f.padding,8),r:w(f.borderRadius,3),zIndex:2}).add(this.labelGroup),l.attr({fill:f.backgroundColor||this.series[0]&&this.series[0].color||"#666666",stroke:f.borderColor||"","stroke-width":f.borderWidth||0}).css(m({color:"#ffffff",fontWeight:"normal",fontSize:"11px",textAlign:"center"},f.style)));g?(n=t?c.plotX+e:b.chartX,k+=d?0:this.height):(n=d?this.width+e:0,k=t?c.plotY+k:b.chartY);p||f.formatter||(this.isDatetimeAxis&&(q="%b %d, %Y"),
p="{value"+(q?":"+q:"")+"}");b=t?c[this.isXAxis?"x":"y"]:this.toValue(g?b.chartX:b.chartY);l.attr({text:p?z(p,{value:b}):f.formatter.call(this,b),x:n,y:k,visibility:"visible"});b=l.getBBox();if(g){if(r&&!d||!r&&d)k=l.y-b.height}else k=l.y-b.height/2;g?(d=e-b.x,e=e+this.width-b.x):(d="left"===this.labelAlign?e:0,e="right"===this.labelAlign?e+this.width:a.chartWidth);l.translateX<d&&(u=d-l.translateX);l.translateX+b.width>=e&&(u=-(l.translateX+b.width-e));l.attr({x:n+u,y:k,anchorX:g?n:this.opposite?
0:a.chartWidth,anchorY:g?this.opposite?a.chartHeight:0:k+b.height/2})}});B.init=function(){d.apply(this,arguments);this.setCompare(this.options.compare)};B.setCompare=function(a){this.modifyValue="value"===a||"percent"===a?function(b,c){var d=this.compareValue;if(void 0!==b&&void 0!==d)return b="value"===a?b-d:b/d*100-(100===this.options.compareBase?0:100),c&&(c.change=b),b}:null;this.userOptions.compare=a;this.chart.hasRendered&&(this.isDirty=!0)};B.processData=function(){var a,b=-1,c,d,e,f;x.apply(this,
arguments);if(this.xAxis&&this.processedYData)for(c=this.processedXData,d=this.processedYData,e=d.length,this.pointArrayMap&&(b=t("close",this.pointArrayMap),-1===b&&(b=t(this.pointValKey||"y",this.pointArrayMap))),a=0;a<e-1;a++)if(f=-1<b?d[a][b]:d[a],q(f)&&c[a+1]>=this.xAxis.min&&0!==f){this.compareValue=f;break}};f(B,"getExtremes",function(a){var b;a.apply(this,[].slice.call(arguments,1));this.modifyValue&&(b=[this.modifyValue(this.dataMin),this.modifyValue(this.dataMax)],this.dataMin=D(b),this.dataMax=
E(b))});H.prototype.setCompare=function(a,b){this.isXAxis||(n(this.series,function(b){b.setCompare(a)}),w(b,!0)&&this.chart.redraw())};k.prototype.tooltipFormatter=function(b){b=b.replace("{point.change}",(0<this.change?"+":"")+a.numberFormat(this.change,w(this.series.tooltipOptions.changeDecimals,2)));return c.apply(this,[b])};f(g.prototype,"render",function(a){this.chart.is3d&&this.chart.is3d()||this.chart.polar||!this.xAxis||this.xAxis.isRadial||(!this.clipBox&&this.animate?(this.clipBox=p(this.chart.clipBox),
this.clipBox.width=this.xAxis.len,this.clipBox.height=this.yAxis.len):this.chart[this.sharedClipKey]?this.chart[this.sharedClipKey].attr({width:this.xAxis.len,height:this.yAxis.len}):this.clipBox&&(this.clipBox.width=this.xAxis.len,this.clipBox.height=this.yAxis.len));a.call(this)})})(K);return K});

},{}],28:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],29:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":28,"ieee754":30,"isarray":31}],30:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],31:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],32:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],33:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],34:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],35:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":34,"_process":32,"inherits":33}]},{},[1]);
