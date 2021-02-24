const mongoose = require('mongoose');

const zanrSchema = mongoose.Schema({
  zanrovi: {type: [String]}
});

module.exports = mongoose.model('Zanr', zanrSchema);
