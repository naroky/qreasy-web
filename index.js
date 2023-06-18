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
app.use('/db/pg', require("./router/pg_db"))


app.get('/', (req, res) => {
  res.render('index', 
  { 
    user_url : "Hello World",
    status : "Ready!!!"
  })
})

app.get('/createqr',(req,res) => {
  res.writeHead(302, {
    'Location': '/'
  });
  res.end()
})

app.post('/createqr', (req, res) => {
  let user_url = req.body.user_url;

  let status = 'Generate "'+user_url+'" is Success'
  if (user_url.length === 0) 
  {
    status ='Url is empty'
    user_url = status
  }
  res.render('index', 
    { 
      user_url : user_url,
      status : status
    })
})

app.get('/genqr/', (req, res) => {
  const user_url = req.query.user_url
  const opt = {
    scale:4,
    width:300
  }
  qr.toDataURL(user_url,opt, (err, src) => {
    if (err) res.send("Error occured")
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