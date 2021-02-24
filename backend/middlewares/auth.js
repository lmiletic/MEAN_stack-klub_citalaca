const jwt = require("jsonwebtoken");
const Korisnik = require('../models/korisnik');

const handleError = (res) => {
  res.status(403);
  res.send({ message: "Auth Failed" });
};

module.exports = async (req, res, next) => {
  const headerValue = req.header("Authorization");
  console.log("pozvan auth");

  if (headerValue) {
    const raw = headerValue.split(" ");
    if (raw.length === 2) {
      const token = raw[1];

      try {
        const { korisnickoIme } = jwt.verify(token, "veoma_dugacak_privatan_kljuc");
        const user = await Korisnik.findOne({ korisnickoIme });
        req.korisnik = user;
        if(user==null){
          handleError(res);
        }else{
          next();
        }
      } catch {
        handleError(res);
      }


    } else {
      handleError(res);
    }
  } else {
    handleError(res);
  }
}
