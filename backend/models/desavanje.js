const mongoose = require('mongoose');

const desavanjeSchema = mongoose.Schema({
  naziv: {type: String},
  tip: {type: String},
  datumPocetka: {type: Date},
  datumKraja: {type: Date},
  opis: {type: String},
  korisnickoIme: {type: String}
});

module.exports = mongoose.model('Desavanje', desavanjeSchema);
