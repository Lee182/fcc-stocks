function sizeof(o){
  var size = 0
  switch (typeof o){
    case 'boolean': size += 4; break;
    case 'number': size += 8; break;
    case 'string': size += 2 * o.length; break;
    case 'object':
      // if the object is not an array, add the sizes of the keys
      if (Array.isArray(o) === true) {
        o.forEach(function(item){
          size += sizeof(item)
        })
      }
      if (Array.isArray(o) !== true){
        Object.keys(o).forEach(function(prop){
          size += 2 * prop.length
          size += sizeof(o[prop])
        })
      }
  }
  return size
}
module.exports = sizeof
