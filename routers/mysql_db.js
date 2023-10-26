const express = require('express')
const router = express.Router()
const mysql = require('mysql')
// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/query', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/checkDB', (req, res) => {
  const charset = process.env.CONNECTION_MYSQL_CHARSET  
  const db_name = process.env.CONNECTION_MYSQL_DATABASE
  const host = process.env.CONNECTION_MYSQL_SERVER
  const user = process.env.CONNECTION_MYSQL_USERNAME
  const password = process.env.CONNECTION_MYSQL_PASSWORD
  let mysql_dbConfig
    mysql_dbConfig = {
      host: host,
      user: user,
      password: password,
      database: db_name,
      charset: charset
    }
    console.log(mysql_dbConfig)
  let pool = mysql.createPool(mysql_dbConfig)
  pool.query('select * from test_db', function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
})
module.exports = router