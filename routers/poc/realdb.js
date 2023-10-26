const express = require("express");
const CryptoJs= require("crypto-js")
const  SHA256   = require("crypto-js/sha256");
//const { createHash } = require("crypto")
const router = express.Router(); 

const { initializeApp } = require("@firebase/app");
const { getDatabase, ref, set, onValue,query } = require('@firebase/database');
let db
// Home page route.
router.get("/connectRealDB",  (req, res) => {
    const firebaseConfig = {
        databaseURL: "https://qreasy-3e34f-default-rtdb.asia-southeast1.firebasedatabase.app/",
    }
    const app = initializeApp(firebaseConfig)
    db = getDatabase(app)
    res.send("Connected")
  })

router.post("/create-userAdmin",(req,res) => {
  let email = "narupol.b@gmail.com";
  let username = "admin";
  let password = "CyoiydgTv@2521";
  let password_hash = SHA256(password).toString(CryptoJs.enc.Hex);
  let userId_hash = SHA256(email).toString(CryptoJs.enc.Hex);
  //let userId_hash = createHash('sha256').update(userId).digest('hex')
  console.log("UserID:",userId_hash)
  let userInfo = {
    "userID" : userId_hash,
    "username" : username,
    "password" : password_hash,
    "email" : email
  }
  set(ref(db, 'users/' + userId_hash), userInfo);
  res.send("Writed")
})

router.get("/lists",(req,res) => {
  // Create a new post reference with an auto-generated id
  let userlists = []
  const userRef = ref(db, 'users/')
  onValue(userRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      userlists.push(childSnapshot)
    });
    res.send(userlists)
  }, {
    onlyOnce: true
  })
})

router.post("/query",(req,res) => {
  let email = req.body.email;
  let userID = req.body.userID;
  let username = req.body.username;

  // Create a new post reference with an auto-generated id
  let userlists = []
  //const userRef = ref(db, 'users/')
  const recentPostsRef = query(ref(db, 'users/'), limitToLast(100));
  onValue(userRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      userlists.push(childSnapshot)
    });
    res.send(userlists)
  }, {
    onlyOnce: true
  })
})

router.post("/findbyuserid",(req,res) => {
  let email = req.body.email;
  let userId_hash = SHA256(email).toString(CryptoJs.enc.Hex);

  // Create a new post reference with an auto-generated id
  let userlists = []
  //const userRef = ref(db, 'users/')
  const recentPostsRef = query(ref(db, 'users/'+userId_hash), limitToLast(100));
  onValue(userRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      userlists.push(childSnapshot)
    });
    res.send(userlists)
  }, {
    onlyOnce: true
  })
})

router.post("/query",(req,res) => {
  let username = 'admin';
  const db = getDatabase();
  const starCountRef = ref(db, 'users/' + postId + '/starCount');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });


})
router.post("/update",(req,res) => {})
router.post("/delete",(req,res) => {})
module.exports = router;