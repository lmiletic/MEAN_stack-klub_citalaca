import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { FormGroup} from '@angular/forms';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { Korisnik } from './models/korisnik';
import { ListaKnjiga } from './models/listaknjiga';
import { Desavanje } from './models/desavanje';

interface TokenResponse {
  token: string;
  expiresIn: number;
  tip: string;
}

@Injectable({
  providedIn: 'root'
})
export class KorisnickiService {

  uri='http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  dohvatiKorisnike(){
    return this.http.get<Korisnik[]>(`${this.uri}/korisnik/dohvatikorisnike`, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  dodajDesavanje(desavanje: Desavanje){
    return this.http.post(`${this.uri}/desavanje/dodaj`, desavanje, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  dohvatiDesavanja(){
    return this.http.get<Desavanje[]>(`${this.uri}/desavanje`);
  }

  korisnickiPodaci() {
    return this.http.get<Korisnik>(`${this.uri}/korisnik`, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  korisnikPregled(korisnickoIme:string){
    const data = {
      korisnickoIme: korisnickoIme
    };
    return this.http.post(`${this.uri}/korisnik/pregled`,data,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  neodobreniKorisnici(){
    return this.http.get<Korisnik[]>(`${this.uri}/korisnik/odobravanje`,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  odobriKorisnika(korisnickoIme:string){
    return this.http.post(`${this.uri}/korisnik/prihvati`,{korisnickoIme},{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  izbrisiKorisnika(korisnickoIme:string){
    return this.http.post(`${this.uri}/korisnik/izbrisi`,{korisnickoIme},{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  loginInfo(korisnickoIme:string){
    const data = {
      korisnickoIme: korisnickoIme
    };
    return this.http.post(`${this.uri}/korisnik/logininfo`,data,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  promeniSliku(slika: File, korisnickoIme: string) {
    const postData = new FormData();
    postData.append("korisnickoIme",korisnickoIme);
    postData.append("slika", slika, korisnickoIme+ Date.now()+ "Slika");
    return this.http.post(`${this.uri}/korisnik/promenisliku`, postData,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  promeniLozinku(form: FormGroup){
    const kredencijali = {
      lozinka: form.value.lozinka,
      novaLozinka: form.value.novaLozinka
    }
    return this.http.post(`${this.uri}/korisnik/promenilozinku`, kredencijali ,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  promeniPodatke(form: FormGroup){
    const korisnik = {
      ime: form.value.ime,
      prezime: form.value.prezime,
      korisnickoIme: form.value.korisnickoIme,
      datumRodjenja: form.value.datumRodjenja,
      drzava: form.value.drzava,
      grad: form.value.grad,
      email: form.value.email
    };
    return this.http.post(`${this.uri}/korisnik/promenipodatke`, korisnik, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  promeniTip(korisnickoIme:string, tip:string){
    const data = {
      korisnickoIme: korisnickoIme,
      tip: tip
    }
    return this.http.post(`${this.uri}/korisnik/promenitip`, data, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  listeKnjiga(){
    return this.http.get<ListaKnjiga>(`${this.uri}/korisnik/listeknjiga`, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  promeniListeKnjiga(lista:ListaKnjiga){
    const postData = {
      korisnickoIme: lista.korisnickoIme,
      listaKasnije: lista.listaKasnije,
      listaProcitane: lista.listaProcitane,
      listaTrenutno: lista.listaTrenutno,
      trenutnoPozicija: lista.trenutnoPozicija
    };
    return this.http.post(`${this.uri}/korisnik/promenilisteknjiga`, postData,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.auth.getToken()}`})
    });
  }

  login(korisnickoIme, lozinka){
    const kredencijali = {
      korisnickoIme: korisnickoIme,
      lozinka : lozinka
    };
    return this.http.post<TokenResponse>(`${this.uri}/login`, kredencijali)
    .pipe(
      tap((r) => {
        if (r && r.hasOwnProperty('token') && r.hasOwnProperty('expiresIn') && r.hasOwnProperty('tip')) {
          this.auth.remember(r.token);
          this.auth.setTimeOut(r.expiresIn*1000);
          this.auth.setTip(r.tip);
        }
      })
    );
  }

  captcha(token: string){
    return this.http.post(`${this.uri}/captcha`,{recaptcha: token});
  }

  forgotPass(email: string){
    return this.http.post(`${this.uri}/mail/send`,{email: email});
  }

  resetPass(novalozinka:string, token:string){
    const data = {
      novaLozinka: novalozinka,
      token: token
    }
    return this.http.post(`${this.uri}/resetpass`,data);
  }

  register(form: FormGroup, od:boolean){
      if(form.value.slika==null){
        const korisnik = {
          ime: form.value.ime,
          prezime: form.value.prezime,
          korisnickoIme: form.value.korisnickoIme,
          lozinka: form.value.lozinka,
          datumRodjenja: form.value.datumRodjenja,
          drzava: form.value.drzava,
          grad: form.value.grad,
          email: form.value.email,
          tip: "korisnik",
          odobren: od
        };
        return this.http.post(`${this.uri}/register`, korisnik);
      }
      else{
        const postData = new FormData();
        postData.append("ime", form.value.ime);
        postData.append("prezime", form.value.prezime);
        postData.append("korisnickoIme", form.value.korisnickoIme);
        postData.append("lozinka", form.value.lozinka);
        postData.append("datumRodjenja", form.value.datumRodjenja ? form.value.datumRodjenja.toString() : "");
        postData.append("drzava", form.value.drzava);
        postData.append("grad", form.value.grad);
        postData.append("email", form.value.email);
        postData.append("tip", "korisnik");
        postData.append("slika", form.value.slika, form.value.korisnickoIme+Date.now()+"Slika");
        postData.append("odobren", od.toString());

        return this.http.post(`${this.uri}/register/slika`, postData);
      }

  }

}
