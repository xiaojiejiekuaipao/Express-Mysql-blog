const crypto = require('crypto')

module.exports = {
  // 为了防止MD5解密，添加一段复杂的后缀
  MD5_SUFFIX: 'FSFSFAAsfdsgadsfdsgt%&%&…………*……*()52ur2fkwf',
  md5: function (str) { // md5加密算法
  	var obj = crypto.createHash('md5');
  	
  	obj.update(str)
  	return obj.digest('hex')
  },
  formateDateTime: function (timeStamp) {
    var date = new Date();
    date.setTime(timeStamp*1000)
  	var year = date.getFullYear();
  	var month = date.getMonth()+1;
  	var day = date.getDate();
  	
  	month = month < 10 ? ('0'+month) : month;
  	day = day < 10 ? ('0'+day) : day;
  	
  	var hour = date.getHours();
  	var second = date.getSeconds();
  	var minute = date.getMinutes();
  	
  	hour = hour < 10 ? ('0'+hour) : hour;
  	second = second < 10 ? ('0'+second) : second;
  	minute = minute < 10 ? ('0'+minute) : minute;
  	
  	return year + '-' + month + '-' + day + ' ' + hour + ':' + second + ':' + minute;
  	
  	
  }
}