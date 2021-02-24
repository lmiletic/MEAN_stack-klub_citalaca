export interface Knjiga {
  _id: string,
  naziv: string,
  autori: string[],
  datumIzdavanja: Date,
  opis: string,
  zanrovi: string[],
  ocena: string,
  slika: string,
  odobrena: boolean
}
