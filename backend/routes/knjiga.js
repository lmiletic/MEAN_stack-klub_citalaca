const Router = require("express").Router;
const auth = require('../middlewares/auth');
const mod = require('../middlewares/mod');
const admin = require('../middlewares/admin');
const Knjiga = require('../models/knjiga');
const Zanr = require('../models/zanr');
const multer = require("multer");
const formatter = require('../models/formatter');


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storageKnjiga = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Pogrešan tip fajla!");
    if(isValid){
      error = null;
    }
    cb(error, "./backend/images/knjigeSlike");
  },
  filename:(req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, file.originalname + '.' + ext);
  }
});

module.exports = () =>{
  const router = Router();

  router.route('/id').post((req,res)=>{
    const id = req.body.id;
    Knjiga.findById(id).then(knjiga=>{
      res.send(formatter(knjiga,[
        '_id',
        'naziv',
        'autori',
        'datumIzdavanja',
        'opis',
        'zanrovi',
        'ocena',
        'slika',
        'odobrena'
      ]));
    }).catch(err=>{
      res.status(403).json({message: "Nije pronadjena knjiga"});
    })
  });

  router.route('/').get((req, res)=>{
    Knjiga.find({}).then(knjige=>{
      res.send(formatter(knjige,[
        '_id',
        'naziv',
        'autori',
        'datumIzdavanja',
        'opis',
        'zanrovi',
        'ocena',
        'slika',
        'odobrena'
      ]));
    }).catch(err=>{
      res.status(403).json({message: "Nisu ucitane knjige"});
    })
  });

  router.route('/zanrovi').get((req, res)=>{
    Zanr.findOne({}).then(zanrovi=>{
      if(zanrovi==null){
        const zanrovi = new Zanr({
          zanrovi: []
        });
        zanrovi.save();
        return res.send(zanrovi['zanrovi']);
      }
      res.send(zanrovi['zanrovi']);
    }).catch(err=>{
      res.status(403).json({message: "Nisu ucitani zanrovi"});
    })
  });

  router.post('/izmenizanrove',auth,admin,(req,res)=>{
    Zanr.findOne({}).then(zanrovi=>{
      if(zanrovi==null){
        const zanrovi = new Zanr({
          zanrovi: req.body.zanrovi
        });
        zanrovi.save();
      }else{
        zanrovi.zanrovi = req.body.zanrovi;
        zanrovi.save();
      }
      res.json({"message":"ok"});
    })
    .catch(err=>{
      res.json({"message":"not ok"});
    });
  });

  router.get('/odobravanje',auth,mod,(req,res)=>{
    console.log("odobrvanje");
    Knjiga.find({"odobrena":false}).then(knjige=>{
      res.send(formatter(knjige,[
        '_id',
        'naziv',
        'autori',
        'datumIzdavanja',
        'opis',
        'zanrovi',
        'ocena',
        'slika',
        'odobrena'
      ]));
    });
  });

  router.post('/prihvati',auth,mod,(req,res)=>{
    Knjiga.findById(req.body.id).then(knjiga=>{
      knjiga.odobrena = true;
      knjiga.save();
      res.json({"message":"ok"});
    })
    .catch(err=>{
      res.json({"message":"not ok"});
    });
  });

  router.post('/izbrisi',auth,mod,async(req,res)=>{
    const result = await Knjiga.deleteOne({_id: req.body.id});
    res.json({"message": result.deletedCount});
  });

  router.route('/dodajknjigu').post(auth,(req, res) => {
    console.log("pozvan dodajknjigu");
    let odobri = false;
    if(req.korisnik.tip == "admin" || req.korisnik.tip == "moderator"){
      odobri = true;
    }
    const url = req.protocol + '://' + req.get("host");
    const knjiga = new Knjiga({
      naziv: req.body.naziv,
      autori: req.body.autori,
      datumIzdavanja: req.body.datumIzdavanja,
      opis: req.body.opis,
      zanrovi: req.body.zanrovi,
      ocena: req.body.ocena,
      slika: url + "/images/knjigeSlike/Knjiga.png",
      odobrena: odobri
    });
    console.log(knjiga);
    console.log("zavrseno dodavanje knjige");
    knjiga.save().
    then(knjiga => {
      res.status(200).json({ 'knjiga': 'ok' });
    }).catch(err => {
      res.json({ 'knjiga': 'no'});
    });
  });

  router.route('/dodajknjigu/slika').post(auth,multer({storage : storageKnjiga}).single("slika"),(req, res) => {
    console.log("pozvan dodajknjigu sa slikom");
    let odobri = false;
    if(req.korisnik.tip == "admin" || req.korisnik.tip == "moderator"){
      odobri = true;
    }
    const url = req.protocol + '://' + req.get("host");
    const knjiga = new Knjiga({
      naziv: req.body.naziv,
      autori: req.body.autori.split(','),
      datumIzdavanja: req.body.datumIzdavanja,
      opis: req.body.opis,
      zanrovi: req.body.zanrovi.split(','),
      ocena: req.body.ocena,
      slika: url + "/images/knjigeSlike/" + req.file.filename,
      odobrena: odobri
    });
    console.log(knjiga);
    knjiga.save().
    then(knjiga => {
      res.status(200).json({ 'knjiga': 'ok' });
    }).catch(err => {
      //obrisatiSliku
      res.json({ 'knjiga': 'no'});
    });
  });

  router.route('/izmeniknjigu').post(auth,admin,(req, res) => {
    console.log("pozvan izmeni knjigu");
    Knjiga.findOne({_id: req.body._id}).then(knjiga=>{
      knjiga.naziv = req.body.naziv;
      knjiga.autori = req.body.autori;
      knjiga.datumIzdavanja = req.body.datumIzdavanja;
      knjiga.opis = req.body.opis;
      knjiga.zanrovi = req.body.zanrovi;
      knjiga.save();
      res.status(200).json({ 'knjiga': 'ok' });
    }).catch(err=>{
      console.log(err);
      res.json({ 'knjiga': 'no'});
    });
  });

  router.route('/izmeniknjigu/slika').post(auth,admin,multer({storage : storageKnjiga}).single("slika"),(req, res) => {
    console.log("pozvan izmeni knjigu sa slikom");
    const url = req.protocol + '://' + req.get("host");
    Knjiga.findOne({_id: req.body._id}).then(knjiga=>{
      knjiga.naziv = req.body.naziv;
      knjiga.autori = req.body.autori.split(',');
      knjiga.datumIzdavanja = req.body.datumIzdavanja;
      knjiga.opis = req.body.opis;
      knjiga.zanrovi = req.body.zanrovi.split(',');
      knjiga.slika = url + "/images/knjigeSlike/" + req.file.filename;
      knjiga.save();
      res.status(200).json({ 'knjiga': 'ok' });
    }).catch(err=>{
      res.json({ 'knjiga': 'no'});
    });
  });

  return router;
};
