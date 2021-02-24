const Router = require('express').Router;
const bcrypt = require("bcrypt");
const request = require("request");
const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth');
const saltValue = 13;

const Korisnik = require('../models/korisnik');
const LoginInfo = require('../models/loginInfo');


module.exports = () => {
  const router = Router();

  router.route('/captcha').post((req, res) => {
    let token = req.body.recaptcha;
    const secretKey = "6Lelqr8ZAAAAAPdlx9RjIGUGA1rvigKS5AFlLRz2";
    const url =  `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`

    if(token === null || token === undefined){
      res.status(201).send({success: false, message: "Token is empty or invalid"})
      return console.log("token empty");
    }

    request(url, function(err, response, body){
      body = JSON.parse(body);

      if(body.success == false){
           res.send({success: false, 'message': "recaptcha failed"});
           return console.log("failed");
       }
       res.send({"success": true, 'message': "recaptcha passed"});

    });
  });

  router.route('/resetpass').post(async (req, res)=>{
    try{
      const { korisnickoIme } = jwt.verify(req.body.token, "veoma_dugacak_privatan_kljuc");
      const user = await Korisnik.findOne({ korisnickoIme});
      if(user==null){
        return res.json({"success":"no"});
      }
      bcrypt.hash(req.body.novaLozinka,saltValue).then(hash =>{
        user.lozinka = hash;
        user.save().then(user=>{
          LoginInfo.findOne({"korisnickoIme": user.korisnickoIme}).then(loginInfo =>{
            if(loginInfo!=null){
              loginInfo.lastLogin = Date.now();
              loginInfo.save();
            }else{
              const loginInfo = new LoginInfo({
                korisnickoIme: user.korisnickoIme,
                lastLogin: Date.now(),
                lastLogout: null
              });
              loginInfo.save();
            }
          });
          return res.json({"token":req.body.token, "expiresIn": 3600, "tip":user.tip});
        });
      });
    } catch {
      res.json({"success":"no"});
    }
  });

  router.post("/checktoken",async(req,res) =>{
    try {
      const { korisnickoIme } = jwt.verify(req.body.token, "veoma_dugacak_privatan_kljuc");
      const user = await Korisnik.findOne({ korisnickoIme });
      if(user==null){
        res.json({"logged":false});
      }else{
        res.json({"logged":true,"tip":user.tip});
      }
    } catch {
      res.json({"logged":false});
    }
  });

  router.route('/login').post((req, res) => {
    let pronadjeniKorisnik;
    Korisnik.findOne({"korisnickoIme": req.body.korisnickoIme}).then(korisnik =>{
      if(!korisnik){
        return res.json({"message": "Auth failed"});
      }
      pronadjeniKorisnik = korisnik;
      bcrypt.compare(req.body.lozinka,korisnik.lozinka).then(result =>{
        if(!result){
          return res.json({"message": "Auth failed"});
        }
        if(pronadjeniKorisnik.odobren == false){
          return res.json({"message": "Not approved"});
        }
        LoginInfo.findOne({"korisnickoIme": req.body.korisnickoIme}).then(loginInfo =>{
          if(loginInfo!=null){
            loginInfo.lastLogin = Date.now();
            loginInfo.save();
          }else{
            const loginInfo = new LoginInfo({
              korisnickoIme: req.body.korisnickoIme,
              lastLogin: Date.now(),
              lastLogout: null
            });
            loginInfo.save();
          }
        });
        const token = jwt.sign({"korisnickoIme": pronadjeniKorisnik.korisnickoIme}
        ,"veoma_dugacak_privatan_kljuc", {expiresIn: "1h"});
        return res.json({"token":token, "expiresIn": 3600, "tip":pronadjeniKorisnik.tip});
      })
      .catch(err =>{
        return res.json({"message": "Auth failed"});
      });
    })
    .catch(err=>{
      return res.json({"message": "Auth failed"});
    });
  });

  router.route('/logout').post(auth,(req,res)=>{
    console.log("logout");
    LoginInfo.findOne({"korisnickoIme":req.korisnik.korisnickoIme}).then(loginInfo=>{
      loginInfo.lastLogout = Date.now();
      loginInfo.save().then(logiInfo=>{
        res.json({"message": "Saved"});
      });
    }).catch(err=>{
      res.json({"message": "Not saved"});
    });
  });

  return router;
};
