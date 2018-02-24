module.exports = {
  config: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learn',
    connectionLimit: 60 // 立即创建的最大连接数
  },
  connection: function(db, sql, params) {
    return new Promise(function(resolve, reject) {
      db.getConnection(function(err, connection) {
        if(err) {
          console.log('DB-获取数据库连接异常！', err); 
          reject(err)
        } else {
          params = params || '';
          connection.query(sql, params, function(err, data) {
            if(err) {
              console.log('DB-SQL语句执行异常！', err)
              reject(err)
            }else {
              resolve(data)
            }
          })
        }
        // 释放数据库连接 
        connection.release(function (err) {
        	if (err) {
        		console.log('DB-关闭数据库连接异常！', err);
        		reject(err)
        	}
        })
      })
    })
  }

}