const Router = require("express").Router;
const auth = require('../middlewares/auth');
const Komentar = require('../models/komentar');
const Knjiga = require('../models/knjiga');
const formatter = require('../models/formatter');



module.exports = () =>{
  const router = Router();

  router.route('/svinaknjigu').post((req,res)=>{
    Komentar.find({"knjigaId":req.body.knjigaId}).then(komentari=>{
      res.send(formatter(komentari,[
        'korisnickoIme',
        'knjigaId',
        'komentar',
        'ocena'
      ]));
    }).catch(err=>{
      res.json({message:"Greska"});
    });
  });

  router.route('/korisnik').get(auth,(req,res)=>{
    Komentar.find({"korisnickoIme":req.korisnik.korisnickoIme}).then(komentari=>{
      res.send(formatter(komentari,[
        'korisnickoIme',
        'knjigaId',
        'komentar',
        'ocena'
      ]));
    }).catch(err=>{
      res.json({message:"Greska"});
    });
  });

  router.route('/komentarnaknjigu').post(auth,(req,res)=>{
    Komentar.findOne({"korisnickoIme":req.korisnik.korisnickoIme,"knjigaId":req.body.knjigaId}).then(komentar=>{
      res.send(formatter(komentar,[
        'korisnickoIme',
        'knjigaId',
        'komentar',
        'ocena'
      ]));
    }).catch(err=>{
      res.json({message:"Greska"});
    });
  });

  router.route('/sacuvajkomentar').post(auth,(req,res,next)=>{
    console.log("pozvan sacuvaj komentar");
    Komentar.findOne({"korisnickoIme": req.korisnik.korisnickoIme,"knjigaId":req.body.knjigaId}).then(komentar=>{
      if(komentar!=null){
        console.log("menja se komentar");
        komentar.komentar = req.body.komentar;
        komentar.ocena = req.body.ocena;
        komentar.save().then(komentar=>{
          next();
        });
      }else{
        console.log("novi komentar");
        const komentar = new Komentar({
          korisnickoIme: req.korisnik.korisnickoIme,
          knjigaId: req.body.knjigaId,
          komentar: req.body.komentar,
          ocena: req.body.ocena
        });
        komentar.save().then(komentar=>{
          next();
        });
      }
    }).catch(err=>{
      res.json({"success":false});
    });
  });

  router.route('/sacuvajkomentar').post(auth,(req,res)=>{
    console.log("pozvan next");
    Komentar.find({"knjigaId":req.body.knjigaId}).then(komentari =>{
      console.log("racuna se ocena knjige");
      let brOcena = 0;
      let zbirOcena = 0;
      if(komentari!=null){
        komentari.forEach(komentar=>{
          brOcena++;
          zbirOcena+=komentar.ocena;
        });
        console.log("zbir ocena "+ zbirOcena);
        if(brOcena!=0){
          let ocena = zbirOcena/brOcena;
          Knjiga.findOne({"_id":req.body.knjigaId}).then(knjiga=>{
            console.log("menja se ocena knjige");
            knjiga.ocena = ocena.toString();
            knjiga.save().then(knjiga=>{
              res.json({"success":true});
            });
          });
        }else{
          res.json({"success":false});
        }
      }else{
        res.json({"success":false});
      }
    });
  });


  return router;
};
