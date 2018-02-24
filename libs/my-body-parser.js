const querystring = require('querystring');

/*
 * 自定义中间件，模仿body-parser中间件操作
 */
module.exports = function() {
  return function(req, res, next) { // next参数：可选的下一步,从而实现链式操作
    var str = '';
    req.on('data', function(data) {
      str += data;
    })
    req.on('end', function() {
      req.body = querystring.parse(str);
      next(); // 由于监听为异步操作，所以需要等待数据传输完成在跳到下一步
    })

  }
}