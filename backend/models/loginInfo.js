const mongoose = require('mongoose');

const loginInfoSchema = mongoose.Schema({
  korisnickoIme: {type: String},
  lastLogin: {type: Date},
  lastLogout: {type: Date}
});

module.exports = mongoose.model('LoginInfo', loginInfoSchema);
