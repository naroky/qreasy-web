const express = require('express')
const bp = require("body-parser")
const qr = require('qrcode')
require('dotenv').config()

const app = express()
const port = 3000//process.env.LISTEN_PORT
app.set('view engine', 'ejs')
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use('/db/mysql', require("./router/mysql_db"))
/*
app.use('/db/pg', require("./router/pg_db"))
*/

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})