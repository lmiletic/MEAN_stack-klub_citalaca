const Router = require("express").Router;
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const formatter = require('../models/formatter');
const Korisnik = require('../models/korisnik');
const ListeKnjiga = require('../models/listeknjiga');
const Komentar = require('../models/komentar');
const multer = require('multer');
const bcrypt = require("bcrypt");
const LoginInfo = require('../models/loginInfo');
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

  router.use(auth);

  router.route("/promenisliku").post(multer({storage : storageKorisnik}).single("slika"), async(req,res)=> {
    try{
      console.log("pozvan promeni sliku");
      const url = req.protocol + '://' + req.get("host");
      console.log(req.body.korisnickoIme);
      const korisnik = await Korisnik.findOne({"korisnickoIme": req.body.korisnickoIme});
      korisnik.slika = url + "/images/korisniciSlike/" + req.file.filename;
      await korisnik.save();
      res.json({"slika":"Uspesno"});
    }catch{
      res.json({"slika":"Greska"});
    }
  });

  router.route("/promenilozinku").post(async (req,res)=>{
    try{
      const korisnik = await Korisnik.findOne({"korisnickoIme": req.korisnik.korisnickoIme});
      bcrypt.compare(req.body.lozinka,korisnik.lozinka).then(result =>{
        if(!result){
          return res.json({"korisnik": "NisuIste"});
        }
        bcrypt.hash(req.body.novaLozinka,saltValue).then(hash =>{
          korisnik.lozinka = hash;
          korisnik.save().then(korisink =>{
            res.json({"korisnik":"ok"});
          }).catch(err =>{
            res.json({"korisink":"no"});
          });
        });
      });
    }catch{
      res.json({"korisink":"no"});
    }
  });

  router.route("/promenipodatke").post(async(req,res)=> {
    try{
      console.log("pozvan promeni podatke");
      const korisnik = await Korisnik.findOne({"korisnickoIme": req.korisnik.korisnickoIme});
      let promenaKor = false;
      let staroKor = '';
      if(korisnik.korisnickoIme != req.body.korisnickoIme){
        promenaKor = true;
        staroKor = korisnik.korisnickoIme;
      }
      korisnik.ime = req.body.ime;
      korisnik.prezime = req.body.prezime;
      korisnik.korisnickoIme = req.body.korisnickoIme;
      korisnik.email = req.body.email;
      korisnik.datumRodjenja = req.body.datumRodjenja;
      korisnik.drzava = req.body.drzava;
      korisnik.grad = req.body.grad;
      korisnik.save().then(korisnik => {
        if(promenaKor){
          console.log("promeni korisnicko");
          ListeKnjiga.findOne({"korisnickoIme": staroKor}).then(liste=>{
            liste.korisnickoIme = req.body.korisnickoIme;
            liste.save();
          });
          LoginInfo.findOne({"korisnickoIme": staroKor}).then(login=>{
            login.korisnickoIme = req.body.korisnickoIme;
            login.save();
          });
          Komentar.find({"korisnickoIme": staroKor}).then(komentari=>{
            for(let komentar of komentari){
              komentar.korisnickoIme = req.body.korisnickoIme;
              komentar.save();
            }
          });
        }
        res.status(200).json({ 'korisnik': 'ok' });
      }).catch(err => {
        console.log(err.message);
        console.log("korisnickoIme " + err.message.includes("korisnickoIme"));
        console.log("email " + err.message.includes("email"));
        res.json({ 'korisnik': 'no',
        'korisnickoIme': err.message.includes("korisnickoIme"),
        'email': err.message.includes("email")});
      });
    }catch{
      res.json({"korisink":"no"});
    }
  });

  router.post("/promenitip",admin,(req,res)=>{
    Korisnik.findOne({"korisnickoIme":req.body.korisnickoIme}).then(korisnik=>{
      if(korisnik){
        korisnik.tip = req.body.tip;
        korisnik.save();
        res.json({"message":"ok"});
      }else{
        res.json({"message":"not ok"});
      }
    });
  });

  router.post("/pregled",(req,res)=>{
    console.log("pozvan pregled");
    if(req.korisnik.korisnickoIme == req.body.korisnickoIme){
      return res.json({"message":"Greska"});
    }
    Korisnik.findOne({"korisnickoIme":req.body.korisnickoIme}).then(korisnik=>{
      if(korisnik!=null){
        res.send(formatter(korisnik, [
          'ime',
          'prezime',
          'korisnickoIme',
          'datumRodjenja',
          'drzava',
          'grad',
          'email',
          'slika',
          'tip',
          'odobren'
        ]));
      }else{
        res.json({"message":"Nije pronadjen korisnik"});
      }
    }).catch(err=>{
      res.json({"message":"Greska"});
    })
  });


  router.get("/", ({ korisnik }, res) => {
    res.send(formatter(korisnik, [
      'ime',
      'prezime',
      'korisnickoIme',
      'datumRodjenja',
      'drzava',
      'grad',
      'email',
      'slika',
      'tip',
      'odobren'
    ]));
  });

  router.post("/logininfo",(req,res)=>{
    let k;
    if(req.body.korisnickoIme == "" || req.body.korisnickoIme == null){
      k = req.korisnik.korisnickoIme;
    }else{
      k = req.body.korisnickoIme;
    }
    LoginInfo.findOne({"korisnickoIme": k}).then(loginInfo=>{
      if(loginInfo){
        res.send(formatter(loginInfo,[
          'korisnickoIme',
          'lastLogin',
          'lastLogout'
        ]));
      }else{
        res.json({"message":"Nikad nije bio aktivan"});
      }
    });
  });

  router.get("/odobravanje",admin,(req,res)=>{
    Korisnik.find({"odobren": false}).then(korisnici=>{
      res.send(formatter(korisnici,[
        'ime',
        'prezime',
        'korisnickoIme',
        'datumRodjenja',
        'drzava',
        'grad',
        'email',
        'slika',
        'tip',
        'odobren'
      ]));
    });
  });

  router.post('/prihvati',admin,(req,res)=>{
    Korisnik.findOne({korisnickoIme: req.body.korisnickoIme}).then(korisnik=>{
      korisnik.odobren = true;
      korisnik.save();
      res.json({"message":"ok"});
    })
    .catch(err=>{
      res.json({"message":"not ok"});
    });
  });

  router.post('/izbrisi',admin,async(req,res)=>{
    const result = await Korisnik.deleteOne({korisnickoIme: req.body.korisnickoIme});
    res.json({"message": result.deletedCount});
  });

  router.get("/dohvatikorisnike",(req,res)=>{
    Korisnik.find({}).then(korisnici=>{
      res.send(formatter(korisnici,[
        'ime',
        'prezime',
        'korisnickoIme',
        'datumRodjenja',
        'drzava',
        'grad',
        'email',
        'slika',
        'tip',
        'odobren'
      ]));
    });
  });

  router.post("/promenilisteknjiga",async(req,res)=>{
    const korisnickoIme = req.korisnik.korisnickoIme;
    console.log("promeniliste");
    try{
      const liste = await ListeKnjiga.findOne({"korisnickoIme": korisnickoIme});
      liste.listaKasnije = req.body.listaKasnije;
      liste.listaProcitane = req.body.listaProcitane;
      liste.listaTrenutno = req.body.listaTrenutno;
      liste.trenutnoPozicija = req.body.trenutnoPozicija;
      liste.save().then(liste=>{
        res.json({'liste':'ok'});
      }).catch(err=>{
        res.json({'liste':'no'});
      });
    }catch{
      res.json({'liste':'no'});
    }
  });


  router.get("/listeknjiga",({ korisnik }, res) => {
    const korisnickoIme = korisnik.korisnickoIme;
    ListeKnjiga.findOne({"korisnickoIme":korisnickoIme}).then(lista=>{
      if(lista!=null){
        res.send(formatter(lista,[
          'korisnickoIme',
          'listaProcitane',
          'listaTrenutno',
          'listaKasnije',
          'trenutnoPozicija'
        ]));
      }else{
        const lista = new ListeKnjiga({
          korisnickoIme: korisnickoIme,
          listaProcitane: [],
          listaTrenutno: [],
          listaKasnije: [],
          trenutnoPozicija: []
        });
        lista.save().then(lista=>{
          res.send(formatter(lista,[
            'korisnickoIme',
            'listaProcitane',
            'listaTrenutno',
            'listaKasnije',
            'trenutnoPozicija'
          ]));
        });
      }
    }).catch(err=>{
      res.status(403).json({"message":"Greska"});
    })
  });

  return router;
};
