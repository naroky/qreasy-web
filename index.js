const express = require('express')
const mysql = require('mysql')
const bp = require("body-parser")
const qr = require('qrcode')
const app = express()
const port = 3000
require('dotenv').config()

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  
  res.render('index', 
  { 
    title: 'QR Easy: สร้าง QR Code อย่างง่าย ๆ', 
    head_line_1 : 'ใส่ URL ของคุณ',
    content : '', 
    user_url : 'Hello',
    status : "Ready!!!"
  })
  //res.send('Hello World!')
})
app.post('/createqr', (req, res) => {
  const user_url = req.body.user_url;
  let qrsrc = ''
  let status = ''
 
  if (user_url.length === 0) 
  {status = 'Url is empty';}
  res.render('index', 
    { 
      title: 'QR Easy: สร้าง QR Code อย่างง่าย ๆ', 
      head_line_1 : 'ใส่ URL ของคุณ',
      content : '', 
      user_url : user_url,
      status : status
    })
    //res.send('Hello World!')
})

app.get('/genqr/', (req, res) => {
  const user_url = req.query.user_url
  qr.toDataURL(user_url, (err, src) => {
    if (err) res.send("Error occured")
    //console.log(src)
    let base64Image = src.split(",");
    let img = Buffer.from(base64Image[1], 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img); 
  });
})

app.get('/checkDB/', (req, res) => {
  const charset = process.env.CONNECTION_MYSQL_CHARSET  
  const db_name = process.env.CONNECTION_MYSQL_DATABASE
  const host = process.env.CONNECTION_MYSQL_SERVER
  const user = process.env.CONNECTION_MYSQL_USERNAME
  const password = process.env.CONNECTION_MYSQL_PASSWORD
  let dbConfig
    dbConfig = {
      host: host,
      user: user,
      password: password,
      database: db_name,
      charset: charset
    }
    console.log(dbConfig)
  let pool = mysql.createPool(dbConfig)

  pool.query('select * from test_db', function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})