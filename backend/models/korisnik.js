const mongoose = require('mongoose');
const korisnikValidator = require('mongoose-unique-validator');

const korisnikSchema = mongoose.Schema({
  ime: {type: String, required: true},
  prezime: {type: String, required: true},
  korisnickoIme: {type: String, required: true, unique: true},
  lozinka: {type: String, required: true},
  datumRodjenja: {type: Date},
  drzava: {type: String},
  grad: {type: String},
  email: {type: String, required: true, unique: true},
  tip: {type: String},
  slika: {type: String},
  odobren: {type: Boolean}
});

korisnikSchema.plugin(korisnikValidator);

module.exports =  mongoose.model('Korisnik', korisnikSchema);

