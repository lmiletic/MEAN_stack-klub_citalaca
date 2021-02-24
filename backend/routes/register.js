const Router = require("express").Router;
const Korisnik = require('../models/korisnik');
const multer = require("multer");
const bcrypt = require("bcrypt");
const saltValue = 13;

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storageKorisnik = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Pogrešan tip fajla!");
    if(isValid){
      error = null;
    }
    cb(error, "./backend/images/korisniciSlike");
  },
  filename:(req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, file.originalname + '.' + ext);
  }
});

module.exports = () => {
  const router = Router();

  router.route('/').post((req, res) => {
    console.log("pozvan register");
    const url = req.protocol + '://' + req.get("host");
    bcrypt.hash(req.body.lozinka,saltValue)
    .then(hash =>{
      const korisnik = new Korisnik({
        ime: req.body.ime,
        prezime: req.body.prezime,
        korisnickoIme: req.body.korisnickoIme,
        lozinka: hash,
        datumRodjenja: req.body.datumRodjenja,
        drzava: req.body.drzava,
        grad: req.body.grad,
        email: req.body.email,
        tip: req.body.tip,
        slika: url + "/images/korisniciSlike/Slika.png",
        odobren: req.body.odobren
      });
      console.log(korisnik);
      console.log("zavrsio register");
      korisnik.save().
      then(korisnik => {
        res.status(200).json({ 'korisnik': 'ok' });
      }).catch(err => {
        res.json({ 'korisnik': 'no',
        'korisnickoIme': err.message.includes("korisnickoIme"),
        'email': err.message.includes("email")});
      });
    });
  });

  router.route('/slika').post(multer({storage : storageKorisnik}).single("slika"),(req, res) => {
    console.log("pozvan register sa slikom");
    const url = req.protocol + '://' + req.get("host");
    bcrypt.hash(req.body.lozinka,saltValue)
    .then(hash =>{
      let odobren = false;
      if(req.body.odobren == "true"){
        odobren = true;
      }
      const korisnik = new Korisnik({
        ime: req.body.ime,
        prezime: req.body.prezime,
        korisnickoIme: req.body.korisnickoIme,
        lozinka: hash,
        datumRodjenja: req.body.datumRodjenja,
        drzava: req.body.drzava,
        grad: req.body.grad,
        email: req.body.email,
        tip: req.body.tip,
        slika: url + "/images/korisniciSlike/" + req.file.filename,
        odobren: odobren
      });
      console.log(korisnik);
      korisnik.save().
      then(korisnik => {
        res.status(200).json({ 'korisnik': 'ok' });
      }).catch(err => {
        //obrisatiSliku
        res.json({ 'korisnik': 'no',
        'korisnickoIme': err.message.includes("korisnickoIme"),
        'email': err.message.includes("email")});
      });
    });
  });

  return router;
};
