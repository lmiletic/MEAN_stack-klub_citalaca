const Router = require("express").Router;
const auth = require('../middlewares/auth');
const formatter = require('../models/formatter');
const Desavanje = require("../models/desavanje");

module.exports = () =>{
  const router = Router();


  router.get('/',(req,res)=>{
    Desavanje.find({}).then(desavanja =>{
      res.send(formatter(desavanja,[
        'naziv',
        'tip',
        'datumPocetka',
        'datumKraja',
        'opis',
        'korisnickoIme'
      ]));
    });
  });

  router.post('/dodaj',auth,(req,res)=>{
    const desavanje = new Desavanje({
      naziv: req.body.naziv,
      tip: req.body.tip,
      datumPocetka: req.body.datumPocetka,
      datumKraja: req.body.datumKraja,
      opis: req.body.opis,
      korisnickoIme: req.korisnik.korisnickoIme
    });
    desavanje.save().then(desavanje=>{
      console.log(desavanje);
      res.json({"message": "ok"});
    }).catch(err=>{
      res.json({"message": "not ok"});
    });
  });

  return router;
};
