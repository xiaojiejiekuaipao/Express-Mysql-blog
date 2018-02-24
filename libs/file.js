const fs = require('fs');
module.exports = {
  deleteFile: function (src) {
  	return new Promise(function (resolve, reject) {
  		fs.unlink('static/upload/'+ src, function (err) {
        if (err) reject(err)
        resolve()
      })
  	})
  },
  renameFile: function (oldPath, newPath) {
  	return new Promise(function (resolve, reject) {
  		fs.rename(oldPath, newPath, function (err) {
  			if (err) reject(err)
  			resolve()
  		})
  	})
  }
}
