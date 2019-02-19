if(process.env.NODE_ENV === 'test'){
  module.exports = require('./testing');
}else{
  module.exports = require('./dev');
}