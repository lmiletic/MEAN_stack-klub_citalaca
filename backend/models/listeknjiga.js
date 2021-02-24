const mongoose = require('mongoose');

const listeknjigaSchema = mongoose.Schema({
  korisnickoIme: {type: String},
  listaProcitane: {type: [String]},
  listaTrenutno: {type: [String]},
  listaKasnije: {type: [String]},
  trenutnoPozicija: {type:[String]}
});

module.exports = mongoose.model('ListeKnjiga', listeknjigaSchema);
