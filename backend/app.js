const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const korisnik = require('./routes/korisnik');
const knjiga = require('./routes/knjiga');
const register = require('./routes/register');
const login = require('./routes/login');
const komentar = require('./routes/komentar');
const desavanje = require('./routes/desavanja');
const mail = require('./routes/mail');

const app = express();
app.use(body_parser.json());
app.use(cors());
app.use("/images", express.static(path.join("backend/images")));

const router = express.Router();

router.use('/register', register());
router.use('/korisnik', korisnik());
router.use('/knjiga',knjiga());
router.use('/komentar',komentar());
router.use('/',login());
router.use('/desavanje',desavanje());
router.use('/mail',mail());

mongoose.connect(`mongodb://localhost:27017/ljubiteljiknjiga`);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongo open');
});


app.use('/', router);

module.exports = app;
