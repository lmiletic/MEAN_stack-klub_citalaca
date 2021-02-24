const handleError = (res) => {
  res.status(403);
  res.send({ message: "Admin Failed" });
};

module.exports = (req, res, next) => {
  const tip = req.korisnik.tip;
  console.log("pozvan admin");

  if (tip == 'admin') {
    next();
  } else {
    handleError(res);
  }
}
