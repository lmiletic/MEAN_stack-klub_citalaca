const mongoose = require('mongoose');

const komentarSchema = mongoose.Schema({
  korisnickoIme: {type: String},
  knjigaId: {type: String},
  komentar: {type: String},
  ocena: {type: Number}
});

module.exports =  mongoose.model('Komentar', komentarSchema);
