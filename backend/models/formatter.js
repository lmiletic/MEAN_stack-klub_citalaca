function formatSingle(objekat, kljuceviZaPrikaz) {
  return Object.keys(objekat._doc).reduce((prikazKorisniku, key) => {
    if (kljuceviZaPrikaz.includes(key)) {
      prikazKorisniku[key] = objekat[key];
    }
    return prikazKorisniku;
  }, {});
}

module.exports = (objekat, kljuceviZaPrikaz = []) => {
  //console.log(objekat);
  if (Array.isArray(objekat)) {
    return objekat.map((obj) => formatSingle(obj, kljuceviZaPrikaz));
  }

  return formatSingle(objekat, kljuceviZaPrikaz);
}
