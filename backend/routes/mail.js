const nodemailer = require("nodemailer");
const Router = require('express').Router;
const jwt = require("jsonwebtoken");
const Korisnik = require('../models/korisnik');

module.exports = () =>{
  const router = Router();
  router.post('/send',async(req,res)=>{
    try{
      const korisnik = await Korisnik.findOne({"email":req.body.email});
      if(!korisnik){
        return res.json({"success" : false});
      }

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ljubiteljknjiga2020@gmail.com',
          pass: 'Ljubitelj@12'
        }
      });

      console.log(korisnik.korisnickoIme);
      const token = jwt.sign({"korisnickoIme": korisnik.korisnickoIme}
        ,"veoma_dugacak_privatan_kljuc", {expiresIn: "1h"});

      // send mail with defined transport object
      let mailOptions = {
        from: "ljubiteljiknjiga2020@gmail.com",
        to: ""+req.body.email, // list of receivers
        subject: "Resetovanje zaboravljene lozinke", // Subject line
        text: "http://localhost:4200/resetpass/" + token, // plain text body
      };

      transporter.sendMail(mailOptions, function(err, data){
        if(err){
          console.log(err);
          res.json({"success" : false});
        }else{
          res.json({"success" : true});
          console.log("Email sent");
        }
      });
    }
    catch(err){
      res.json({"success" : true});
      console.log(err);
    }
  });

  return router;
}

