const express = require('express')
const pg = require('pg')
const router = express.Router()

// middleware that is specific to this router
//router.use((req, res, next) => {
//console.log('Time: ', Date.now())
//next()
//})
// define the home page route
router.get('/query', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/checkDB', async (req, res) => { 
  const db_name = process.env.CONNECTION_PG_DATABASE
  const host = process.env.CONNECTION_PG_SERVER
  const user = process.env.CONNECTION_PG_USERNAME
  const password = process.env.CONNECTION_PG_PASSWORD
  const pg_port = process.env.CONNECTION_PG_PORT
  let pg_dbConfig
    pg_dbConfig = {
            user: user,
            host: host,
            database: db_name,
            password: password,
            port: pg_port
    }
    console.log(pg_dbConfig)
  const client = new pg.Client(pg_dbConfig)
  await client.connect()
  //const result = await client.query('SELECT * from test_db'))
  let result = await client.query('SELECT * from test_db')
  res.send(result.rows)
  await client.end()
})
module.exports = router