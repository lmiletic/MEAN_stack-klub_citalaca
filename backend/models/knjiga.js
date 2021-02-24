const mongoose = require('mongoose');

const knjigaSchema = mongoose.Schema({
  naziv: {type: String, required: true},
  autori: {type: [String], required: true},
  datumIzdavanja: {type: Date},
  opis: {type: String},
  zanrovi: {type: [String]},
  ocena: {type: String},
  slika: {type: String},
  odobrena: {type: Boolean}
});

module.exports = mongoose.model('Knjiga', knjigaSchema);
