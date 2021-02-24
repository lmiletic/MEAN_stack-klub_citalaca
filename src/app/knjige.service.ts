import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Knjiga } from './models/knjiga';
import { Komentar } from './models/komentar';

@Injectable({
  providedIn: 'root'
})
export class KnjigeService {

  uri='http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  dohvatiKnjige(){
    return this.http.get<Knjiga[]>(`${this.uri}/knjiga/`);
  }

  dohvatiZanrove(){
    return this.http.get<string[]>(`${this.uri}/knjiga/zanrovi`);
  }

  izmeniZanrove(zanrovi:string[]){
    return this.http.post(`${this.uri}/knjiga/izmenizanrove`,{zanrovi},{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  knjigaPrikaz(id:string){
    const data = {"id": id};
    return this.http.post<Knjiga>(`${this.uri}/knjiga/id`,data);
  }

  sviKomentariNaKnjigu(idKnjige:string){
    const data = {
      knjigaId: idKnjige
    };
    return this.http.post<Komentar[]>(`${this.uri}/komentar/svinaknjigu`,data);
  }

  sviKomentariKorisnika(){
    return this.http.get<Komentar[]>(`${this.uri}/komentar/korisnik`,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  neodobreneKnjige(){
    return this.http.get<Knjiga[]>(`${this.uri}/knjiga/odobravanje`,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  odobriKnjigu(knjigaId:string){
    return this.http.post(`${this.uri}/knjiga/prihvati`,{id:knjigaId},{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  izbrisiKnjigu(knjigaId:string){
    return this.http.post(`${this.uri}/knjiga/izbrisi`,{id:knjigaId},{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  dohvatiKomentarKnjige(idKnjige:string){
    const data = {
      knjigaId: idKnjige
    };
    return this.http.post(`${this.uri}/komentar/komentarnaknjigu`, data,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  sacuvajKomentar(form: FormGroup,knjigaId:string){
    const komentar = {
      ocena: form.value.ocena,
      komentar: form.value.komentar,
      knjigaId: knjigaId
    }
    return this.http.post(`${this.uri}/komentar/sacuvajkomentar`, komentar,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  dodajKnjigu(form: FormGroup){

    if(form.value.slika==null){
      const knjiga = {
        naziv: form.value.naziv,
        autori: form.value.autori,
        datumIzdavanja: form.value.datumIzdavanja,
        opis: form.value.opis,
        zanrovi: form.value.zanrovi,
        ocena: 0
      };
      return this.http.post(`${this.uri}/knjiga/dodajknjigu`, knjiga,{
        headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
      });
    }
    else{
      const postData = new FormData();
      postData.append("naziv", form.value.naziv);
      postData.append("autori", form.value.autori);
      postData.append("datumIzdavanja", form.value.datumIzdavanja);
      postData.append("opis", form.value.opis);
      postData.append("zanrovi", form.value.zanrovi);
      postData.append("ocena", "0");
      postData.append("slika", form.value.slika, form.value.naziv.replace(/\s/g, '')+Date.now()+"Slika");

      return this.http.post(`${this.uri}/knjiga/dodajknjigu/slika`, postData,{
        headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
      });
    }
  }

  izmeniKnjigu(idKnjige:string, form: FormGroup, izmenaSlike: boolean){

    if(izmenaSlike == false){
      const knjiga = {
        _id: idKnjige,
        naziv: form.value.naziv,
        autori: form.value.autori,
        datumIzdavanja: form.value.datumIzdavanja,
        opis: form.value.opis,
        zanrovi: form.value.zanrovi
      };
      return this.http.post(`${this.uri}/knjiga/izmeniknjigu`, knjiga,{
        headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
      });
    }
    else{
      const postData = new FormData();
      postData.append("_id", idKnjige);
      postData.append("naziv", form.value.naziv);
      postData.append("autori", form.value.autori);
      postData.append("datumIzdavanja", form.value.datumIzdavanja);
      postData.append("opis", form.value.opis);
      postData.append("zanrovi", form.value.zanrovi);
      postData.append("slika", form.value.slika, form.value.naziv.replace(/\s/g, '')+Date.now()+"Slika");

      return this.http.post(`${this.uri}/knjiga/izmeniknjigu/slika`, postData,{
        headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
      });
    }
  }
}
