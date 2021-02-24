import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { KorisnickiService } from '../korisnicki.service';
import { Desavanje } from '../models/desavanje';

@Component({
  selector: 'app-pregleddesavanja',
  templateUrl: './pregleddesavanja.component.html',
  styleUrls: ['./pregleddesavanja.component.css']
})
export class PregleddesavanjaComponent implements OnInit {

  constructor(private korisnikServis: KorisnickiService, private auth: AuthService) { }

  userLogged: boolean;
  desavanja: Desavanje[] = [];
  isLoading: boolean;
  kolonaNaziv: string[] = ['Naziv', 'Aktivno/Počinje', 'Tip'];

  ngOnInit(): void {
    this.isLoading = true;
    this.userLogged = this.auth.isLogged();
    this.korisnikServis.dohvatiDesavanja().subscribe(desavanja=>{
      this.desavanja = desavanja;
      if(!this.userLogged){
        this.desavanja = this.desavanja.filter(desavanje => desavanje.tip != "javno");
      }
      this.isLoading = false;
    });
  }

  aktivno(pocetak: string, kraj: string){
    if(pocetak== '' || pocetak == null){
      if(kraj == '' || kraj == null){
        return "Trenutno aktivno"
      }else{
        let datumK = new Date(kraj);
        if(Date.now()<= datumK.getTime()){
          return "Trenutno aktivno"
        }else{
          return "Zavšeno";
        }
      }
    }
    if(kraj =='' || kraj == null){
      let datumP = new Date(pocetak);
      if(Date.now()>= datumP.getTime()){
        return "Trenutno aktivno";
      }else{
        return datumP.getDate() + '/' + datumP.getMonth() + '/' + datumP.getFullYear();
      }
    }else{
      let datumP = new Date(pocetak);
      let datumK = new Date(kraj);
      if(datumP.getTime()<= Date.now()){
        if(Date.now()<= datumK.getTime()){
          return "Trenutno traje";
        }else{
          return "Zavšeno";
        }
      }else{
        return datumP.getDate() + '/' + datumP.getMonth() + '/' + datumP.getFullYear();
      }
    }
  }

}
