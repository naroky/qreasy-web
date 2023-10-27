const express = require('express')
const path = require('path')
const bp = require("body-parser")
const qr = require('qrcode')
const axios = require('axios').default;
require('dotenv').config()

const app = express()
const port = 3000//process.env.LISTEN_PORT
app.set('view engine', 'ejs')
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get('/', (req, res) => {
  res.render('index', 
  { 
    user_url : "Hello World",
    status : "Ready!!!"
  })
})

app.get('/Ads.txt', function(req,res){
  res.sendFile(path.join(__dirname,'/Ads.txt'))
})

app.get('/ads.txt', function (req, res) {
  res.sendFile(path.join(__dirname,'/Ads.txt'))
});

app.get('/createqr',(req,res) => {
  res.writeHead(302, {
    'Location': '/'
  });
  res.end()
})

app.post('/createqr', (req, res) => {
  const user_url = req.body.user_url
  const captcha = req.body["g-recaptcha-response"]
  const secret_key = "6Lepa9MoAAAAACvgHqCh3i88y_ThcsZAF2_zmMfU"
  let status = 'Generate "'+user_url+'" is Success'
  
  if (captcha.length === 0) 
  {
    status = "Please check the the captcha form."
  }
  // verify recapcha
  const recapcha_url = 'https://www.google.com/recaptcha/api/siteverify?secret='+secret_key+'&response='+captcha
  axios.get(recapcha_url).then((response) => {
    // handle success
    let resObj = JSON.stringify(response)
    console.log(resObj);
    if (resObj.success)
    {
      if (user_url.length === 0) 
      {
        status ='Url is empty'
      }
    }
    else
    {
      status = resObj["error-codes"]
    }
  })
  .catch((error) => {
    status ='error'
  });
  res.render('result', 
  { 
    status : status,
    user_url : user_url
  })
})

app.get('/genqr/', (req, res) => {
  const user_url = req.query.user_url
  const opt = {
    scale:6,
    width:350
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

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

// ############## Routers ##############
app.use("/poc/realdb/", require('./routers/poc/realdb.js'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})