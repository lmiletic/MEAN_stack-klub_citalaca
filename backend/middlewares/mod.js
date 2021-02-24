const handleError = (res) => {
  res.status(403);
  res.send({ message: "Moderator Failed" });
};

module.exports = (req, res, next) => {
  const tip = req.korisnik.tip;
  console.log("pozvan mod");

  if (tip == 'admin' || tip == 'moderator') {
    next();
  } else {
    handleError(res);
  }
}
